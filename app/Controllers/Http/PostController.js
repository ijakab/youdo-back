'use strict'
const PostTransformer = use('App/Transformers/PostTransformer')
const PostModel = use('App/Models/Post')
const {pick} = use('lodash')
const {sanitize} = use('Validator')

class PostController {
    async showAll({service, transform, queryParams}) {
        let params = pick(queryParams, ['taxonomyIds', 'radius', 'afterId', 'beforeId', 'limit', 'longitude', 'latitude', 'userId'])
        params = sanitize(params, {
            'taxonomyIds.*': 'to_int',
            'radius': 'to_int',
            afterId: 'to_int',
            beforeId: 'to_int',
            limit: 'to_int',
            longitude: 'to_int',
            latitude: 'to_int',
            userId: 'to_int'
        })
        await service.init(params)
        let posts = await service.getAllPosts(params)
        return await transform.include('user.contacts').collection(posts, PostTransformer)
    }

    async add({transform, service, request}) {
        const subset = request.only(Object.keys(PostModel.validateRules))
        let record = await service.create(subset)
        return transform.item(record, PostTransformer)
    }

    async update({request, service, Post, transform}) {
        const subset = request.only(Object.keys(PostModel.validateRules))
        let record = await service.update(Post, subset)
        return await transform.item(record, PostTransformer)
    }

    async assignTaxonomies({request, service, Post, response}) {
        let taxonomyIds = request.input('taxonomyIds')
        await service.assignTaxonomies(Post, taxonomyIds)
        return response.ok()
    }

    async delete({service, Post }) {
        return await service.delete(Post)
    }

    async adminData({service}) {
        return await service.adminPostData()
    }
}

module.exports = PostController