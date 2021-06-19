'use strict'
const BaseTransformer = use('App/Transformers/BaseTransformer')
const TranslationTransformer = use('App/Transformers/TranslationTransformer')

class TaxonomyTransformer extends BaseTransformer {

    availableInclude() {
        return [
            'alltranslations'
        ]
    }

    async transform(model, ctx) {
        let additional = this.getAdditional(ctx)

        let translatable = {
            title: model.title
        }
        if(additional.translate) {
            let translations = model.getRelated('translations').toJSON()
            if(translations && translations.length && translations[0]) {
                let translation = translations[0]
                if(translation.title) translatable.title = translation.title
            }
        }

        return {
            id: model.id,
            ...translatable,
            type: model.type
        }
    }

    includeAlltranslations(model) {
        return this.collection(model.getRelated('translations'), TranslationTransformer)
    }
}

module.exports = TaxonomyTransformer

// Cyclic dependencies go here