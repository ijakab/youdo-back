'use strict'

class ServiceCreator {
  async handle (ctx, next, props) {
      const Class = use(`App/Services/${props[0]}`)
      ctx.service = new Class(ctx)
      await next()
  }
}

module.exports = ServiceCreator
