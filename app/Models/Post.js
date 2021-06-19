'use strict'

const Model = use('Model')
const throw400 = use('App/Helpers/Throw400')

class Post extends Model {

    static boot() {
        super.boot()
        this.addHook('beforeSave', async instance => {
            if(!instance.noLocation) {
                if(!instance.longitude || !instance.latitude) {
                    throw400('error.badLocation')
                }
            }
        })
        this.addTrait('SearchByRadius')
        this.addTrait('PostData')
    }

    static get validateRules() {
        return {
            title: 'string',
            description: 'string',
            locationString: 'string',
            longitude: 'number',
            latitude: 'number',
            noLocation: 'boolean',
            priceAmount: 'number',
            priceCurrency: 'string|in:HRK,USD,EUR,CHF',
            priceMode: 'string|in:full,perHour',
            taxonomyIds: 'array',
            'taxonomyIds.*': 'number',
            beforeId: 'number',
            afterId: 'number',
            limit: 'number'
        }
    }

    /* RELATIONS */

    user() {
        return this.belongsTo('App/Models/User', 'user_id', 'id')
    }

    taxonomies() {
        return this.belongsToMany('App/Models/Taxonomy')
            .pivotTable('post_taxonomies')
    }
}

module.exports = Post
