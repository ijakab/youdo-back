'use strict'

const UserTransformer = use('App/Transformers/User')

class UserController {

    async me({service, transform}) {
        transform.additional = {translate: true}
        return transform.include('taxonomies,contacts').item(service.loadAll(), UserTransformer)
    }

    async all({service, transform, queryParams}) {
        let users = await service.bulkData().paginate(queryParams.page, queryParams.limit)
        return await transform.include('postcount').paginate(users, UserTransformer)
    }

    async update({request, response, service, transform}) {
        let allParams = request.only(['taxonomyIds', 'language', 'radius', 'contacts'])
        await service.update(allParams)
        transform.additional = {translate: true}
        return transform.include('taxonomies,contacts').item(service.loadAll(), UserTransformer)
    }

    async gdprDelete({user}) {
        await user.delete()
    }

    async adminData({service}) {
        return await service.adminUserData()
    }

}

module.exports = UserController
