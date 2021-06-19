'use strict'

class CastDate {
    register(Model) {
        Model.queryMacro('withTrans', function (locale) {
            if(locale) {
                this.with('translations', q => {
                    q.where('language_code', locale)
                })
            }
            return this
        })
    }
}

module.exports = CastDate
