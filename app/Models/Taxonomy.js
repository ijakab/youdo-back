'use strict'

const Model = use('Model')

class Taxonomy extends Model {

    static boot() {
        super.boot()
        this.addTrait('Translation')
        this.addTrait('StandardFiltering', {
            hasSlugs: false,
            paramFilters: ['type'],
            searchBy: ['title']
        })
    }

    static get validateRules() {
        return {
            title: 'string',
            type: 'string|in:category,tag'
        }
    }

    /* RELATIONS */

   translations() {
        return this.hasMany('App/Models/TaxonomyTranslation', 'id', 'parent_id')
    }
}

module.exports = Taxonomy
