'use strict'
const GlobalValidatorService = use('App/Services/GlobalValidator')

class GlobalValidator {
    async handle ({ request }, next, props) {
        const validator = new GlobalValidatorService(request.all())
        let Model = use(`App/Models/${props[0]}`)
        validator.resetValidationRules(Model.validateRules, Model.sanitizeRules)

        if(props[1] && props[1].length) {
            const requiredFields = props[1].split(' ')
            validator.addRequired(...requiredFields)
        }
        await validator.run()
        await next()
    }
}

module.exports = GlobalValidator
