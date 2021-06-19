const UserService = use('App/Services/UserService')
const PostService = use('App/Services/PostService')
const throw400 = use('App/Helpers/Throw400')

class UserInterestingPost {
    constructor(ctx) {
        if(ctx.user) {
            this._userId = ctx.user.id
        }
        this._postService = new PostService(ctx)
    }

    async init(requestFilters) {
        let defaultFilters = {}
        if(this._userId) {
            defaultFilters = await UserService.getUserFilters(this._userId)
        }
        let filters = Object.assign(defaultFilters, requestFilters)
        this._filters = filters
    }

    getPostsQuery(params) {
        const {afterId, beforeId, limit, longitude, latitude} = this._handlePaginationParams(params)
        const {taxonomyIds, radius, userId} = this._filters

        let query = this._postService.getAll()
            .orderBy('id', 'desc')
            .limit(limit)
            .withBulkData()

        if(radius && longitude && latitude) query.whereInRadius(longitude, latitude, radius)
        if(taxonomyIds && taxonomyIds.length) {
            query.whereHas('taxonomies', q => {
                q.whereIn('taxonomies.id', taxonomyIds)
            })
        }

        if(userId) query.where('user_id', userId)

        if(afterId) query.where('id', '<', afterId)
        if(beforeId) query.where('id', '>', beforeId)
        return query
    }

    async getAllPosts(params) {
        return await this.getPostsQuery(params).fetch()
    }

    _handlePaginationParams(params) {
        if(params.afterId && params.beforeId) throw400('error.badPagination')
        if(!params.limit) params.limit = 15
        if(params.limit < 0 || params.limit > 20) params.limit = 15
        return params
    }

}

module.exports = UserInterestingPost