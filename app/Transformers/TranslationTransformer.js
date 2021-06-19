'use strict'
const BaseTransformer = use('App/Transformers/BaseTransformer')
const {omit} = use('lodash')

class TranslationTransformer extends BaseTransformer {

    async transform(model) {
        let serialized = model.toJSON()
        return omit(serialized, ['id', 'created_at', 'updated_at'])
    }
}

module.exports = TranslationTransformer

// Cyclic dependencies go here