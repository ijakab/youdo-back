'use strict'

const Route = use('Route')

_requireRoutes('Auth').prefix('api/Auth').middleware(['throttle:12']) // allow 12 requests per minute for all routes in Auth controller
_requireRoutes('User').prefix('api/User')
_requireRoutes('Taxonomy').prefix('api/Taxonomy')
_requireRoutes('Post').prefix('api/Post')
_requireRoutes('Translate').prefix('api/Translate')
/* ROUTES GO HERE */
// DO NOT REMOVE COMMENT ON THE LINE ABOVE (ROUTES GO HERE) IF YOU ARE USING make:api COMMAND!!!!!


Route.get('/', function ({response}) {
    return response.ok()
})

// --- PRIVATE
function _requireRoutes(group) {
    return require(`../app/Routes/${group}`)
}
