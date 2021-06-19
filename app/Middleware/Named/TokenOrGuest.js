'use strict'

class TokenOrGuest {
    async handle(ctx, next, props) {
        try {
            ctx.token = await ctx.auth._verifyToken(ctx.auth.getAuthHeader())
            ctx.user = {id: ctx.token.uid, type: ctx.token.data.type}
        } catch (e) {
        }

        await next()
    }
}

module.exports = TokenOrGuest
