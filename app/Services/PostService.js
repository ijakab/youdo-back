'use strict'
const PostModel = use('App/Models/Post')
const validateAndSave = use('App/Helpers/ValidateAndSave')
const TaxonomyService = use('App/Services/TaxonomyService')

class PostService {
    constructor(ctx) {
        this._user = ctx.user
    }

    getAll() {
        return PostModel.query()
    }

    getSingle(id) {
        return PostModel
            .query()
            .where('id', id)
    }

    async create(data) {
        return await PostModel.create({
            ...data,
            user_id: this._user.id,
        })
    }

    async update(Post, data) {
        return await validateAndSave(Post, data, 'title', 'priceAmount', 'priceCurrency', 'priceMode')
    }

    async assignTaxonomies(Post, taxonomyIds) {
        await TaxonomyService.validateTaxonomyIds(taxonomyIds)
        await Post.taxonomies().sync(taxonomyIds)
    }

    async delete(Post) {
        return await Post.delete()
    }
}

module.exports = PostService