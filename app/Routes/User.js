'use strict'
const Route = use('Route')

module.exports = Route.group(() => {

    /**
     * @api {get} /api/User/me Me
     * @apiGroup User
     *
     * @apiPermission JWT
     *
     * @apiSuccessExample {json} Success
{
    "data": {
        "taxonomies": [
            {
                "title": "Physical work",
                "type": "category"
            },
            {
                "title": "Other",
                "type": "category"
            }
        ],
        "contacts": [
            {
                "type": "phone",
                "value": "0989277218"
            }
        ],
        "id": 2,
        "username": "dummy",
        "email": "zidstol.komp@gmail.com",
        "language": "de",
        "radius": 300
    },
    "message": "",
    "code": "",
    "debug": {
        "untranslatedMsg": ""
    }
}
     *
     * @apiDescription Get information about user who is bearing token
     *
     */
    Route.get('/me', 'UserController.me').middleware([
        'getUser',
        'serviceCreator:UserService'
    ])

    /**
     * @api {patch} /api/User/me Update user
     * @apiGroup User
     *
     * @apiPermission JWT
     *
     * @apiParam {array} [taxonomyIds] Send all ids as old ones will be overwriten
     * @apiParam {number} [radius]
     * @apiParam {string} [language] in:en,de,hr
     *
     * @apiParamExample {json} Sample
{
	"taxonomyIds": [1,2],
	"radius": 300,
	"contacts": {
		"phone": "0989277218"
	}
}
     * @apiSuccessExample {json} Success
{
    "data": {
        "taxonomies": [
            {
                "title": "Physical work",
                "type": "category"
            },
            {
                "title": "Other",
                "type": "category"
            }
        ],
        "contacts": [
            {
                "type": "phone",
                "value": "0989277218"
            }
        ],
        "id": 2,
        "username": "dummy",
        "email": "zidstol.komp@gmail.com",
        "language": "de",
        "radius": 300
    },
    "message": "",
    "code": "",
    "debug": {
        "untranslatedMsg": ""
    }
}
     *
     * @apiDescription Update user profile
     *
     */
    Route.patch('/me', 'UserController.update').middleware([
        'getUser',
        'modelValidator:User',
        'serviceCreator:UserService',
    ])

    /**
     * @api {delete} /api/User/gdprDelete GDPR delete user
     * @apiGroup User
     *
     * @apiPermission JWT
     *
     * @apiDescription Make sure to ask user if he is absolutely sure before calling this route
     *
     */
    Route.delete('/gdprDelete', 'UserController.gdprDelete').middleware([
        'getUser'
    ])

    Route.get('/adminData', 'UserController.adminData').middleware([
        'serviceCreator:AdminService',
        'checkToken',
        'isAdmin'
    ])

    /**
     * @api {get} /api/User/all Me
     * @apiGroup User
     *
     * @apiPermission JWT
     *
     * @apiDescription Get information about all users
     *
     */
    Route.get('/all', 'UserController.all').middleware([
        'serviceCreator:UserCollectionService',
        'checkToken',
        'isAdmin'
    ])
})

