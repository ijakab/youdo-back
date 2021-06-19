const TransformerAbstract = use('App/Transformers/BaseTransformer')

class UserTransformer extends TransformerAbstract {
    availableInclude() {
        return [
            'accounts',
            'taxonomies',
            'contacts',
            'postcount'
        ]
    }

    defaultInclude() {
        return []
    }

    transform(model, ctx) {

        return {
            id: model.id,
            username: model.username,
            email: model.email,
            language: model.language,
            radius: model.radius
        }
    }

    includeAccounts(model) {
        return this.collection(model.getRelated('accounts'), AccountTransformer)
    }

    includeTaxonomies(model) {
        return this.collection(model.getRelated('taxonomies'), TaxonomyTransformer)
    }

    includeContacts(model) {
        return this.collection(model.getRelated('contacts'), ContactTransformer)
    }

    includePostcount(model) {
        let serialized = model.toJSON()
        return serialized.__meta__.posts_count
    }

}

module.exports = UserTransformer

const AccountTransformer = use('App/Transformers/Account')
const TaxonomyTransformer = use('App/Transformers/TaxonomyTransformer')
const ContactTransformer = use('App/Transformers/ContactTransformer')
