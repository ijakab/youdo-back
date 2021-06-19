'use strict'
const Env = use('Env')

class ParseGBox {
    async handle (ctx, next) {
        const {request} = ctx
        //todo add internal token validation

        let lang = request.header('Accept-Language')
        if(!lang) lang = 'en'
        else lang = lang.substring(0,2) //sometimes browsers will send e.g. en-US but we don't care about that

        ctx.lang = lang
        await next()

    }
}

module.exports = ParseGBox
