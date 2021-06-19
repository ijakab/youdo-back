const User = use('App/Models/User')

class UserCollectionService {
    static getAll() {
        return User.query()
    }

    bulkData() {
        return UserCollectionService.getAll()
            .withCount('posts')
    }
}

module.exports = UserCollectionService