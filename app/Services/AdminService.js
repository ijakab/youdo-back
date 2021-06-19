const PostService = use('App/Services/PostService')
const UserCollectionService = use('App/Services/UserCollectionService')
const moment = use('moment')

class AdminService {
    constructor(ctx) {
        this._postService = new PostService(ctx)
        this.weekBefore = moment(new Date()).subtract(7, 'days')
        this.monthBefore = moment(new Date()).subtract(30, 'days')
    }

    async adminUserData() {
        let promises = [
            UserCollectionService.getAll().getCount(),
            UserCollectionService.getAll().where('created_at', '>', this.weekBefore.toDate()).getCount(),
            UserCollectionService.getAll().where('created_at', '>', this.monthBefore.toDate()).getCount()
        ]
        let [full, week, month] = await Promise.all(promises)
        return {full, week, month}
    }

    async adminPostData() {
        let promises = [
            this._postService.getAll().getCount(),
            this._postService.getAll().where('created_at', '>', this.weekBefore.toDate()).getCount(),
            this._postService.getAll().where('created_at', '>', this.monthBefore.toDate()).getCount()
        ]
        let [full, week, month] = await Promise.all(promises)
        return {full, week, month}
    }
}

module.exports = AdminService