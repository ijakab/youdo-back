'use strict'

const User = use('App/Models/User')
const Token = use('App/Models/Token')
const UserTransformer = use('App/Transformers/User')
const Account = use('App/Models/Account')
const AccountTransformer = use('App/Transformers/Account')
const Encryption = use('Encryption')

const {validate, sanitize, sanitizor} = use('Validator')
const Hash = use('Hash')
const Event = use('Event')

const Helper = use('App/Helpers/Common')

class AuthController {

    async checkUsername({request, response}) {

        const existingUsername = await User.query().where('username', request.input('username')).getCount()

        if (!existingUsername) return response.ok()

        response.badRequest('auth.usernameExists')
    }

    async checkEmail({request, response}) {

        const existingMainAccount = await Account.query().where({
            email: sanitizor.normalizeEmail(request.input('email')),
            type: 'main'
        }).getCount()

        if (!existingMainAccount) return response.ok()

        response.badRequest('auth.emailExists')
    }

    async register({request, response, auth, locale, transform}) {

        const allParams = sanitize(request.post(), {
            email: 'normalize_email'
        })

        // email and username are not under unique:users rule because of auto merge account rule
        const validation = await validate(allParams, {
            username: `${User.validateRules.username}|required`,
            email: 'required|email',
            password: `${User.validateRules.password}|required|confirmed`,
            language: User.validateRules.language,
            terms_accepted: 'required|boolean'
        })

        if (!allParams.terms_accepted) return response.badRequest('auth.acceptTerms')
        if (validation.fails()) return response.badRequest(validation.messages())

        // first we check if this email already has MAIN account type
        const existingMainAccount = await Account.query().where({email: allParams.email}).getCount()

        if (existingMainAccount) return response.badRequest('auth.emailExists')

        // then... let's try to find any account for this email (user can have fb, google, etc. before main)
        const existingAccount = await Account.findBy('email', allParams.email)

        // fetch user profile of found account if there is any accounts
        let user = existingAccount && await existingAccount.user().fetch()

        // if user is not existing, check username and create new user
        if (!user) {

            const existingUsername = await User.query().where('username', allParams.username).getCount()

            if (existingUsername) return response.badRequest('auth.usernameExists')

            user = await User.create({
                username: allParams.username,
                email: allParams.email,
                language: allParams.language || locale,
                terms_accepted: new Date(),
                terms_ip: Helper.getIp(request)
            })
        }

        // now create account
        const mainAccount = await Account.create({
            user_id: user.id,
            type: 'main',
            email: allParams.email,
            password: allParams.password,
            validated: true // set validated to false, email needs to be checked for main account...
        })

        Event.fire('user::validated', {user})

        response.ok({
            user: await transform.item(user, UserTransformer),
            _message: 'auth.userRegistered'
        })
    }

    async login({request, response, auth, transform}) {

        const allParams = request.only(['username', 'password'])

        const validation = await validate(allParams, {
            username: 'string|min:4|required', // username can be email or username
            password: `${User.validateRules.password}|required`
        })

        if (validation.fails()) return response.badRequest()

        const {user, mainAccount} = await this._findLoginUser(allParams.username) // we are passing username which can be both username or email

        // if we don't have user in db, respond with badRequest invalid username or password instead of 404
        if (!mainAccount || !user) return response.badRequest('auth.invalidPasswordOrUsername')

        if (!mainAccount.validated) return response.forbidden('auth.mailNotValidated')

        // check pass
        const validPass = await Hash.verify(allParams.password, mainAccount.password)

        if (!validPass) return response.badRequest('auth.invalidPasswordOrUsername')

        // generate tokens
        const token = await this._generateUserTokens(auth, user, {type: user.type})  // you can add token payload if needed as third parameter

        response.ok({
            user: await transform.item(user, UserTransformer),
            token: token.token,
            refreshToken: token.refreshToken
        })
    }

    async socialRedirect({request, response, params, ally}) {

        if (request.input('linkOnly')) return response.ok({
            url: await ally.driver(params.network).getRedirectUrl()
        })

        await ally.driver(params.network).redirect()
    }

    async socialLogin({request, response, params, ally, auth, locale, transform}) {

        const allParams = request.only(['code', 'accessToken', 'username', 'terms_accepted'])

        const validation = await validate(allParams, {
            code: 'required_without_any:accessToken',
            accessToken: 'required_without_any:code',
            username: User.validateRules.username, // not required!
            terms_accepted: 'boolean' // not required!
        })
        if (validation.fails()) return response.badRequest()

        // wire up post as get... so ally can recognize social code
        ally._request._qs = {code: allParams.code, accessToken: allParams.accessToken}

        let socialUser
        if (allParams.accessToken) {
            socialUser = await ally.driver(params.network).getUserByToken(allParams.accessToken)
        } else {
            socialUser = await ally.driver(params.network).getUser()
        }

        // first try finding this user
        let account = await Account.query().where({social_id: socialUser.getId(), type: params.network}).first()
        let user // we will fill this void by newly created user or found one...

        if (account) {
            // user is existing just log him in
            user = await account.user().fetch()
        } else {
            // social user did't exist at all... we will create new user or connect accounts for him
            const userObject = sanitize({
                social_id: socialUser.getId(),
                network: params.network,
                email: socialUser.getEmail(),
                avatar: socialUser.getAvatar()
            }, {
                email: 'normalize_email'
            })

            // first, let's try to find this user by email
            account = await Account.findBy('email', userObject.email)

            if (account) {
                // just fetch user of this account
                user = await account.user().fetch()
            } else {

                // there is no account at all... we need to create user and account!

                // ****************************************** NOTE ******************************************
                // Social media will return some information but not everything we need for main account creation.
                // We need username as required parameter and we can't get it from social media.
                // This is why we will send status 202 (Accepted) and demand client to call this route again
                // with information that we need (accessToken and username in this case).
                // ****************************************** **** ******************************************

                // first check if user already sent username, if not, demand username before continuing
                if (!allParams.username) return response.accepted({
                    accessToken: socialUser.getAccessToken(),
                    _message: 'auth.socialLoginProvideUsername'
                })

                if (!allParams.terms_accepted) return response.badRequest('auth.acceptTerms')

                // check if this username is taken
                const existingUsername = await User.query().where('username', allParams.username).getCount()
                if (existingUsername) return response.badRequest('auth.usernameExists')

                user = await User.create({
                    username: allParams.username,
                    email: userObject.email,
                    language: locale,
                    terms_accepted: new Date(),
                    terms_ip: Helper.getIp(request)
                })

                // we just created new social user, they are automatically validated (no need for email validation)
                // so... let's send that welcome email to them
                Event.fire('user::validated', {user})
            }

            // now just create account and we are ready to go
            await Account.create({
                user_id: user.id,
                type: params.network,
                social_id: userObject.social_id,
                email: userObject.email,
                validated: true // it's always validated if oAuth was success
            })
        }

        // whatever happens... new user, or existing one... generate token for him
        const token = await this._generateUserTokens(auth, user, {type: user.type})  // you can add token payload if needed as third parameter


        response.ok({
            user: await transform.item(user, UserTransformer),
            token: token.token,
            refreshToken: token.refreshToken
        })
    }

    async refreshToken({request, response, auth}) {
        const refreshToken = request.input('refreshToken')
        if (!refreshToken) return response.badRequest()

        const decryptedToken = Encryption.decrypt(refreshToken)

        const user = await User.query()
            .whereHas('tokens', (builder) => {
                builder.where({token: decryptedToken, type: 'jwt_refresh_token', is_revoked: false})
            }).first()

        // if there is no user, refresh token was invalid
        if (!user) return response.unauthorized()

        const token = await auth
            .withRefreshToken()
            .generate(user, {
                type: user.type
            })

        await Token.query().where('token', decryptedToken).delete()

        response.ok(token)

    }

    async forgotPassword({request, response}) {

        const allParams = request.only(['username'])

        const validation = await validate(allParams, {
            username: `min:4|required`
        })

        if (validation.fails()) return response.badRequest()

        // find user and his main account
        const {user, mainAccount} = await this._findLoginUser(allParams.username) // username can be both username or email

        if (!user) return response.notFound('auth.emailOrUsernameNotFound')
        if (!mainAccount) return response.notFound('auth.mainAccountNotFound')

        // also check if this user validated his account at all
        if (!mainAccount.validated) return response.forbidden('auth.mailNotValidated')

        // send forgot password email in async way
        Event.fire('user::forgotPassword', {user, mainAccount})


        response.ok('auth.forgotPasswordTokenSent')
    }

    async resetPassword({request, response, token, auth, transform}) {

        const allParams = request.post()

        // first check if this valid token has account info inside
        if (!token.passwordReset) return response.unauthorized()

        const validation = await validate(allParams, {
            password: `${User.validateRules.password}|required|confirmed`
        })

        if (validation.fails()) return response.badRequest()

        // find main account by id found inside token
        const mainAccount = await Account.find(token.passwordReset)

        if (!mainAccount) return response.notFound()

        // update password
        mainAccount.password = allParams.password
        await mainAccount.save()

        const user = await mainAccount.user().fetch()

        // generate new token and refresh token after password reset
        const newToken = await this._generateUserTokens(auth, user)

        response.ok({
            user: await transform.item(user, UserTransformer),
            token: newToken.token,
            refreshToken: newToken.refreshToken,
            _message: 'auth.passwordReseted'
        })
    }

    async accounts({response, user}) {

        const accounts = await user.accounts().fetch()

        response.ok(await transform.collection(accounts, AccountTransformer))
    }


    // --- PRIVATE

    async _findLoginUser(usernameOrEmail) {
        // find user by username or main account email
        let user, mainAccount

        // first let's try fetching user via username
        user = await User.findBy('username', usernameOrEmail)

        if (user) {
            // we got user, lets fetch his main account
            mainAccount = await user.fetchMainAccount()
        } else {
            // else let's try via main account (sanitize email before)
            usernameOrEmail = sanitizor.normalizeEmail(usernameOrEmail)

            mainAccount = await Account.query().where({email: usernameOrEmail, type: 'main'}).first()
            user = mainAccount && await mainAccount.user().fetch()
        }

        return {mainAccount, user}
    }


    async _generateUserTokens(auth, user, customPayload) {

        return await auth
            .withRefreshToken()
            .generate(user, customPayload)
    }

}


module.exports = AuthController
