'use strict'

class GetUser {
    async handle(ctx, next) {

        if(ctx.user.type !== 'admin') return ctx.response.unauthorized()

        await next()
    }
}

module.exports = GetUser
