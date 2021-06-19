'use strict'

class ContextData {

    async handle(ctx, next) {
        ctx.queryParams = ctx.request.get()

        //make prettier GET arrays
        for(let key in ctx.queryParams) {
            if(ctx.queryParams.hasOwnProperty(key)) {
                if(ctx.queryParams[key].length && typeof ctx.queryParams[key] !== 'string') {
                    if(!ctx.queryParams[key][0]) {
                        delete ctx.queryParams[key]
                        continue
                    }
                    ctx.queryParams[key] = ctx.queryParams[key][0].split(',')
                }
            }
        }

        if(!ctx.queryParams.page) ctx.queryParams.page = 1
        if(!ctx.queryParams.limit || ctx.queryParams.limit > 20) ctx.queryParams.perPage = 10
        await next()
    }
}

module.exports = ContextData