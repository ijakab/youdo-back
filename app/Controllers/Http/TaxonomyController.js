'use strict'
const TaxonomyTransformer = use('App/Transformers/TaxonomyTransformer')

class TaxonomyController {
    async show({transform, service, lang, queryParams}) {
        const records = await service.getAll(queryParams)
            .withTrans(lang)
            .fetch()
        transform.additional = {translate: true}
        return await transform.collection(records, TaxonomyTransformer)
    }

    async showWithTranslations({transform, service, queryParams}) {
        const records = await service.getAll(queryParams)
            .with('translations')
            .fetch()
        return await transform.include('alltranslations').collection(records, TaxonomyTransformer)
    }

    async add({transform, service, request}) {
        const subset = request.only(['title', 'type'])
        let record = await service.create(subset)
        return transform.item(record, TaxonomyTransformer)
    }

    async update({request, service, Taxonomy, transform}) {
        const subset = request.only(['title', 'tag'])
        let record = await service.update(Taxonomy, subset)
        return await transform.item(record, TaxonomyTransformer)
    }

    async delete({service, Taxonomy }) {
        return await service.delete(Taxonomy)
    }
}

module.exports = TaxonomyController