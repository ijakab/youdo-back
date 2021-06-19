'use strict'

class CheckToken {
    async handle(ctx, next, props) {
        if(ctx.Post.user_id !== ctx.user.id) {
            if(ctx.user.type !== 'admin') {
                return ctx.response.unauthorized()
            }
        }
        await next()
    }
}

module.exports = CheckToken
