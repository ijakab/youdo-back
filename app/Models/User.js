'use strict'

const Model = use('Model')

class User extends Model {

    // --- VALIDATION
    static get validateRules() {
        return {
            username: 'string|min:4|max:20|regex:^[0-9a-zA-Z-_]+$', // allow alpha numeric + _- from 4 to 20 chars
            password: 'min:6',
            language: 'string|min:2|max:2|in:en,de,hr',
            taxonomyIds: 'array',
            'taxonomyIds.*': 'number',
            radius: 'number'
        }
    }

    static get sanitizeRules() {
        return {
        }
    }

    // --- CONFIGURATION
    static boot() {
        super.boot()
        this.addTrait('CastDate')
    }

    static get dates() {
        return super.dates.concat(['dob', 'terms_accepted'])
    }

    /* RELATIONS */

   taxonomies() {
        return this.belongsToMany('App/Models/Taxonomy').pivotTable('user_taxonomies')
    }
    accounts() {
        return this.hasMany('App/Models/Account')
    }

    tokens() {
        return this.hasMany('App/Models/Token')
    }

    contacts() {
       return this.hasMany('App/Models/Contact')
    }

    posts() {
       return this.hasMany('App/Models/Post')
    }

    // --- CUSTOM
    async fetchMainAccount() {
        return await this.accounts().where('type', 'main').first()
    }

}

module.exports = User
