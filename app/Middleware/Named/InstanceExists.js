'use strict'
const throw400 = use('App/Helpers/Throw400')

class InstanceExists {
    async handle (ctx, next, props) {
        for(let prop of props) {
            let data = prop.split(' ')
            let Service = use(`App/Services/${data[0]}Service`)
            let param = data[1]
            let paramValue = ctx.params[param] || ctx.request.all()[param]

            let service = new Service(ctx)
            ctx[data[0]] = await service.getSingle(paramValue).first()
            if(!ctx[data[0]]) throw400('error.notFound')
        }
        await next()
    }
}

module.exports = InstanceExists
