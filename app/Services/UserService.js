const TaxonomyService = use('App/Services/TaxonomyService')
const throw400 = use('App/Helpers/Throw400')
const UserModel = use('App/Models/User')

class UserService {
    constructor(ctx) {
        this._user = ctx.user
        this._lang = ctx.lang
    }

    async loadAll() {
        await this._user.loadMany({
            'taxonomies': builder => {
                builder.withTrans(this._lang)
            },
            'contacts': null
        })
        return this._user
    }

    async checkAndSyncTaxonomies(taxonomyIds) {
        await TaxonomyService.validateTaxonomyIds(taxonomyIds)
        await this._user.taxonomies().sync(taxonomyIds)
    }

    async checkAndSaveContacts(contacts) {
        let prettyContactObject = {}
        for(let contact of contacts) {
            prettyContactObject[contact.type] = contact.value
        }
        contacts = prettyContactObject

        let allowedContactTypes = ['phone', 'email']
        for(let key of Object.keys(contacts)) {
            if(!allowedContactTypes.includes(key)) throw400('error.badContactsObject')
        }
        if(contacts.phone && !contacts.phone.match(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)) throw400('error.badContactsObject')
        if(contacts.email && !contacts.email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)) throw400('error.badContactsObject')

        await this._user.contacts().delete()
        let newContacts = Object.keys(contacts).map(key => {
            return {
                type: key,
                value: contacts[key]
            }
        })
        await this._user.contacts().createMany(newContacts)
    }

    async update({taxonomyIds, language, radius, contacts}) {
        let promises = []
        if(taxonomyIds) promises.push(this.checkAndSyncTaxonomies(taxonomyIds))
        if(contacts && Array.isArray(contacts)) promises.push(this.checkAndSaveContacts(contacts))
        if(language) this._user.language = language
        if(radius) this._user.radius = radius
        promises.push(this._user.save())
        await Promise.all(promises)
    }

    static async getUserFilters(id) {
        let result = await UserModel
            .query()
            .where('id', id)
            .select('radius')
            .with('taxonomies', q => {
                q.select('id')
            })
            .first()
        result = result.toJSON()
        let taxonomyIds = result.taxonomies.map(taxonomy => taxonomy.id)
        return {
            radius: result.radius,
            taxonomyIds
        }
    }
}

module.exports = UserService