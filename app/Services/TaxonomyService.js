'use strict'
const TaxonomyModel = use('App/Models/Taxonomy')
const validateAndSave = use('App/Helpers/ValidateAndSave')
const throw400 = use('App/Helpers/Throw400')

class TaxonomyService {
    constructor(ctx) {
        this._user = ctx.user
    }

    getAll(filters) {
        let query = TaxonomyModel.query()
            .standardFilters(filters)
        return query
    }

    getSingle(slug) {
        return TaxonomyModel
            .query()
            .where('id', slug)
    }

    async create(data) {
        return await TaxonomyModel.create({
            ...data
        })
    }

    async update(Taxonomy, data) {
        return await validateAndSave(Taxonomy, data, 'title', 'type')
    }

    async delete(Taxonomy) {
        return await Taxonomy.delete()
    }

    static async validateTaxonomyIds(ids) {
        let count = await TaxonomyModel
            .query()
            .whereIn('id', ids)
            .getCount()
        if(ids.length !== count) throw400('error.badTaxonomyArray')
    }

    async translate(record, language_code, {title}) {
        await record.translations().create({
            language_code,
            title
        })
    }
}

module.exports = TaxonomyService