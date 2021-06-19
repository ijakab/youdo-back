'use strict'
const Route = use('Route')

module.exports = Route.group(() => {

    /**
    * @api {get} /api/Post/showAll Show Post collection
    * @apiGroup Post
    *
    * @apiPermission JWT {admin}
     *
     * @apiParam {number} [afterId] Last id you have
     * @apiParam {number} [beforeId]First id you have
     * @apiParam {string} [taxonomyIds[]] comma separated ids of taxonomies
     * @apiParam {number} [radius]
     * @apiParam {number} longitude
     * @apiParam {number} latitude
     * @apiParam {number} [userId] filter by user id
     *
     * @apiSuccessExample {json} Success
{
    "data": [
        {
            "user": {
                "contacts": [],
                "id": 1,
                "username": "admin",
                "email": "ivan.jakab0@gmail.com",
                "language": "en",
                "radius": null
            },
            "id": 4,
            "title": "Treba mi neko popušit kurac",
            "description": "Tražim jednu malu",
            "locationString": "Gornji grad, Osijek",
            "noLocation": 1,
            "priceAmount": 50,
            "priceCurrency": "HRK",
            "priceMode": "full"
        },
        {
            "user": {
                "contacts": [
                    {
                        "type": "email",
                        "value": "mail@mail.com"
                    }
                ],
                "id": 2,
                "username": "dummy",
                "email": "zidstol.komp@gmail.com",
                "language": "hr",
                "radius": null
            },
            "id": 2,
            "title": "Treba mi neko popušit kurac",
            "description": "Tražim jednu malu",
            "locationString": "Gornji grad, Osijek",
            "noLocation": 1,
            "priceAmount": 50,
            "priceCurrency": "HRK",
            "priceMode": "full"
        },
        {
            "user": {
                "contacts": [
                    {
                        "type": "email",
                        "value": "mail@mail.com"
                    }
                ],
                "id": 2,
                "username": "dummy",
                "email": "zidstol.komp@gmail.com",
                "language": "hr",
                "radius": null
            },
            "id": 1,
            "title": "Treba mi neko popušit kurac",
            "description": "Tražim jednu malu",
            "locationString": "Gornji grad, Osijek",
            "noLocation": 0,
            "priceAmount": 50,
            "priceCurrency": "HRK",
            "priceMode": "full"
        }
    ],
    "message": "",
    "code": "",
    "debug": {
        "untranslatedMsg": ""
    }
}
    *
    * @apiDescription Show and filter Post instances
    *
    */

    Route.get('/showAll', 'PostController.showAll').middleware([
        'tokenOrGuest',
        'serviceCreator:UserInterestingPost'
    ])

    /**
    * @api {post} /api/Post/ Add new Post
    * @apiGroup Post
    *
    * @apiPermission JWT {admin}
    *
    * @apiParam {string} title
    * @apiParam {string} [description]
    * @apiParam {string} [locationString] Get this from google maps, e.g. Novi grad, Osijek
     * @apiParam {boolean} [noLocation] Location is not relevant. Required without longitude or latitude
     * @apiParam {boolean} [longitude] Required without noLocation
     * @apiParam {boolean} [latitude] Required without noLocation
     * @apiParam {number} priceAmount
     * @apiParam {string} priceCurrency in:HRK,USD,EUR,CHF
     * @apiParam {string} priceMode does it pay per hour or full price in:full,perHour
     *
     * @apiParamExample {json} Sample
{
	"title": "Treba mi neko popušit kurac",
	"description": "Tražim jednu malu",
	"locationString": "Gornji grad, Osijek",
	"noLocation": true,
	"priceAmount": 50,
	"priceCurrency": "HRK",
	"priceMode": "full"
}
    *
     * @apiSuccessExample {json} Success
{
    "data": {
        "title": "Treba mi neko popušit kurac",
        "description": "Tražim jednu malu",
        "locationString": "Gornji grad, Osijek",
        "noLocation": true,
        "priceAmount": 50,
        "priceCurrency": "HRK",
        "priceMode": "full"
    },
    "message": "",
    "code": "",
    "debug": {
        "untranslatedMsg": ""
    }
}
    * @apiDescription Add new Post instance
    *
    */

    Route.post('/', 'PostController.add').middleware([
        'checkToken',
        'modelValidator:Post,title priceAmount priceCurrency priceMode',
        'serviceCreator:PostService'
    ])

    /**
    * @api {patch} /api/Post/:id Update instance of Post
    * @apiGroup Post
    *
    * @apiPermission JWT {admin}
    *
    * @apiParam {number} id
    * @apiParam {string} [title] Post title
     *
     * @apiParamExample {json} Sample
{
	"title": "Trebam nekog za prstenjačenje"
}
    *
     * @apiSuccessExample {json} Success
{
    "data": {
        "id": 3,
        "title": "Trebam nekog za prstenjačenje",
        "description": "Tražim jednu malu",
        "locationString": "Gornji grad, Osijek",
        "longitude": null,
        "latitude": null,
        "noLocation": 1,
        "priceAmount": 50,
        "priceCurrency": "HRK",
        "priceMode": "full"
    },
    "message": "",
    "code": "",
    "debug": {
        "untranslatedMsg": ""
    }
}
     *
    * @apiDescription Update existing Post instance
    *
    */

    Route.patch('/:id', 'PostController.update').middleware([
        //we do not register globalValidator here, instead we merge sent data and validate it when merged
        'checkToken',
        'instanceExists:Post id',
        'hasPost',
        'serviceCreator:PostService'
    ])

    /**
     * @api {put} /api/Post/:id/taxonomies Assign taxonomies
     * @apiGroup Post
     *
     * @apiPermission JWT {admin}
     *
     * @apiParam {number} id
     * @apiParam {array} taxonomyIds Ids of taxonomies to assign. Old ones will web removed
     *
     * @apiParamExample {json} Sample
{
	"taxonomyIds": [1,2]
}
     * @apiDescription Remove old taxonomies (if any) and assign new ones
     *
     */

    Route.put('/:id/taxonomies', 'PostController.assignTaxonomies').middleware([
        'checkToken',
        'instanceExists:Post id',
        'hasPost',
        'serviceCreator:PostService',
        'modelValidator:Post,taxonomyIds'
    ])

    /**
    * @api {delete} /api/Post/:id Delete instance of Post
    * @apiGroup Post
    *
    * @apiPermission JWT {admin}
    *
    * @apiParam {string} id Id of Post instance to delete
    *
    * @apiDescription Delete existing Post instance
    *
    */

    Route.delete('/:id', 'PostController.delete').middleware([
        'serviceCreator:PostService',
        'instanceExists:Post id',
        'checkToken',
        'hasPost'
    ])

    Route.get('/adminData', 'PostController.adminData').middleware([
        'serviceCreator:AdminService',
        'checkToken',
        'isAdmin'
    ])

})
