'use strict'
const Route = use('Route')

module.exports = Route.group(() => {

    /**
    * @api {get} /api/Taxonomy/ Show Taxonomy collection
    * @apiGroup Taxonomy
     *
     * @apiSuccessExample {json} Success
{
    "data": {
        "pagination": {
            "total": 2,
            "perPage": 10,
            "page": 1,
            "lastPage": 1
        },
        "data": [
            {
                "title": "Physical work",
                "type": "category"
            },
            {
                "title": "Other",
                "type": "category"
            }
        ]
    },
    "message": "",
    "code": "",
    "debug": {
        "untranslatedMsg": ""
    }
}
    *
    * @apiPermission JWT {admin}
    *
    * @apiDescription Show and filter Taxonomy instances
    *
    */

    Route.get('/', 'TaxonomyController.show').middleware([
        'serviceCreator:TaxonomyService'
    ])

    /**
     * @api {get} /api/Taxonomy/allTranslations Show Taxonomy with all translations
     * @apiGroup Taxonomy
     *
     * @apiSuccessExample {json} Success
{
    "data": {
        "pagination": {
            "total": 2,
            "perPage": 10,
            "page": 1,
            "lastPage": 1
        },
        "data": [
            {
                "alltranslations": [
                    {
                        "parent_id": 1,
                        "language_code": "de",
                        "title": "Hate speech 1"
                    },
                    {
                        "parent_id": 1,
                        "language_code": "hr",
                        "title": "Fizički rad"
                    }
                ],
                "title": "Physical work",
                "type": "category"
            },
            {
                "alltranslations": [
                    {
                        "parent_id": 2,
                        "language_code": "de",
                        "title": "Hate speech 2"
                    },
                    {
                        "parent_id": 2,
                        "language_code": "hr",
                        "title": "Ostalo"
                    }
                ],
                "title": "Other",
                "type": "category"
            }
        ]
    },
    "message": "",
    "code": "",
    "debug": {
        "untranslatedMsg": ""
    }
}
     *
     * @apiPermission JWT {admin}
     *
     * @apiDescription Show and filter Taxonomy instances
     *
     */

    Route.get('/allTranslations', 'TaxonomyController.showWithTranslations').middleware([
        'serviceCreator:TaxonomyService'
    ])


    /**
    * @api {post} /api/Taxonomy/ Add new Taxonomy
    * @apiGroup Taxonomy
    *
    * @apiPermission JWT {admin}
    *
    * @apiParam {string} [title] Taxonomy title
    * @apiParam {string} [type] Taxonomy type in:category,tag
     *
     * @apiParamExample {json} Sample
{
	"title": "Programiranje",
	"type": "category"
}
    *
     * @apiSuccessExample {json} Success
{
    "data": {
        "title": "Programiranje",
        "type": "category"
    },
    "message": "",
    "code": "",
    "debug": {
        "untranslatedMsg": ""
    }
}

    * @apiDescription Add new Taxonomy instance
    *
    */

    Route.post('/', 'TaxonomyController.add').middleware([
        'checkToken:admin',
        'modelValidator:Taxonomy,title type',
        'serviceCreator:TaxonomyService'
    ])

    /**
    * @api {patch} /api/Taxonomy/:id Update instance of Taxonomy
    * @apiGroup Taxonomy
    *
    * @apiPermission JWT {admin}
    *
    * @apiParam {string} [id] Id of Taxonomy instance to update
    * @apiParam {string} [title] Taxonomy title
    * @apiParam {string} [type] Taxonomy type in:category,tag
     *
     * @apiSuccessExample {json} Success
{
    "data": {
        "title": "tralal",
        "type": "category"
    },
    "message": "",
    "code": "",
    "debug": {
        "untranslatedMsg": ""
    }
}
    *
    * @apiDescription Update existing Taxonomy instance
    *
    */

    Route.patch('/:id', 'TaxonomyController.update').middleware([
        'checkToken:admin',
        'instanceExists:Taxonomy id',
        'serviceCreator:TaxonomyService'
    ])

    /**
    * @api {delete} /api/Taxonomy/:id Delete instance of Taxonomy
    * @apiGroup Taxonomy
    *
    * @apiPermission JWT {admin}
    *
    * @apiParam {string} [slug] Slug of Taxonomy instance to delete
    *
    * @apiDescription Delete existing Taxonomy instance
    *
    */

    Route.delete('/:id', 'TaxonomyController.delete').middleware([
        'checkToken:admin',
        'serviceCreator:TaxonomyService',
        'instanceExists:Taxonomy id'
    ])

})
