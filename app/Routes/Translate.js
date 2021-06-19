'use strict'
const Route = use('Route')

module.exports = Route.group(() => {


    Route.put('/', 'TranslateController.translate').middleware([
        'checkToken',
        'isAdmin'
    ])

})
