'use strict'
const BaseTransformer = use('App/Transformers/BaseTransformer')

class PostTransformer extends BaseTransformer {

    availableInclude() {
        return [
            'user'
        ]
    }

    defaultInclude() {
        return [

        ]
    }

    async transform(model, ctx) {
        return {
            id: model.id,
            title: model.title,
            description: model.description,
            locationString: model.locationString,
            longitude: model.longitude,
            latitude: model.latitude,
            noLocation: model.noLocation,
            priceAmount: model.priceAmount,
            priceCurrency: model.priceCurrency,
            priceMode: model.priceMode
        }
    }

    includeUser(model) {
        return this.item(model.getRelated('user'), UserTransformer)
    }
}

module.exports = PostTransformer

// Cyclic dependencies go here
const UserTransformer = use('App/Transformers/User')