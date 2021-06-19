'use strict'
const {validate, sanitize} = use('Validator')
const throw400 = use('App/Helpers/Throw400')
const Config = use('Config')

class GlobalValidator {
    constructor(inputs) {
        this.config = Config.get('globalValidator')()
        this.inputs = inputs
        this._initSanitizeRules()
        this._initValidateRule()
    }

    addRequired(...fields) {
        for(let field of fields) {
            this._prependValidateRule('required', field)
        }
    }

    addValidationRules(rules) { //for adding custom rules
        for(let field in rules) {
            if(rules.hasOwnProperty(field)) {
                this._prependValidateRule(rules[field], field)
            }
        }
    }

    resetValidationRules(validateRules = {}, sanitizeRules = {}) { //for complete overwrite of global rules
        this._validateRules = validateRules
        this._sanitizeRules = sanitizeRules
    }

    sanitize() {
        this.inputs = sanitize(this.inputs, this._sanitizeRules)
    }

    async validate() {
        const validation = await validate(this.inputs, this._validateRules)
        if(validation.fails()) {
            throw400(validation.messages())
        }
    }

    async run() {
        this.sanitize()
        await this.validate()
    }

    _initSanitizeRules() {
        this._sanitizeRules = this.config.rules_sanitize
        for(let property in this.inputs) {
            if(this.inputs.hasOwnProperty(property) && !this._sanitizeRules[property]) { //we don't want to override existing rule
                for(let regexRule of this.config.rules_sanitize_regex) {
                    if(property.match(regexRule.regex)) {
                        this._sanitizeRules[property] = regexRule.rule
                    }
                }
            }
        }
    }

    _initValidateRule() {
        this._validateRules = this.config.rules_validate
        for(let property in this.inputs) {
            if(this.inputs.hasOwnProperty(property) && !this._validateRules[property]) { //we don't want to override existing rule
                for(let regexRule of this.config.rules_validate_regex) {
                    if(property.match(regexRule.regex)) {
                        this._validateRules[property] = regexRule.rule
                    }
                }
            }
        }

    }

    _prependValidateRule(rule, field) {
        if(!this._validateRules[field]) {
            this._validateRules[field] = rule
        } else {
            this._validateRules[field] = `${rule}|${this._validateRules[field]}`
        }

    }
}

module.exports = GlobalValidator