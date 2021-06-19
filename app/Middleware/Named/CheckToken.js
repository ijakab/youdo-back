'use strict'

class CheckToken {
    async handle(ctx, next, props) {

        // set token extracted payload to context if it's valid and not expired
        ctx.token = await ctx.auth._verifyToken(ctx.auth.getAuthHeader())
        ctx.user = {id: ctx.token.uid, type: ctx.token.data.type}

        if(props && props[0]) {
            if(ctx.token.data.type !== props[0]) return ctx.response.unauthorized()
        }

        await next()
    }
}

module.exports = CheckToken
