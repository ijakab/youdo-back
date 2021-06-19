'use strict'
const GlobalValidatorService = use('App/Services/GlobalValidator')

class GlobalValidator {
  async handle ({ request }, next, props) {
      const validator = new GlobalValidatorService(request.all())
      if(props[0] && props[0].length) {
          const requiredFields = props[0].split(' ')
          validator.addRequired(...requiredFields)
      }
      await validator.run()
      await next()
  }
}

module.exports = GlobalValidator
