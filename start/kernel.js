'use strict'

const Server = use('Server')

/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
|
| Global middleware are executed on each http request only when the routes
| match.
|
*/
const globalMiddleware = [
    'App/Middleware/Global/HandleResponse', // keep this guy at the top!
    'Adonis/Middleware/BodyParser',
    'App/Middleware/Global/ContextData',
    'App/Middleware/Global/GetLang',
]

/*
|--------------------------------------------------------------------------
| Named Middleware
|--------------------------------------------------------------------------
|
| Named middleware is key/value object to conditionally add middleware on
| specific routes or group of routes.
|
| // define
| {
|   auth: 'Adonis/Middleware/Auth'
| }
|
| // use
| Route.get().middleware('auth')
|
*/
const namedMiddleware = {
    throttle: 'Adonis/Middleware/ThrottleRequests',
    checkToken: 'App/Middleware/Named/CheckToken',
    getUser: 'App/Middleware/Named/GetUser',
    isAdmin: 'App/Middleware/Named/IsAdmin',
    globalValidator: 'App/Middleware/Named/GlobalValidator',
    modelValidator: 'App/Middleware/Named/ModelValidator',
    serviceCreator: 'App/Middleware/Named/ServiceCreator',
    instanceExists: 'App/Middleware/Named/InstanceExists',
    hasPost: 'App/Middleware/Named/HasPost',
    tokenOrGuest: 'App/Middleware/Named/TokenOrGuest'
}

/*
|--------------------------------------------------------------------------
| Server Middleware
|--------------------------------------------------------------------------
|
| Server levl middleware are executed even when route for a given URL is
| not registered. Features like `static assets` and `cors` needs better
| control over request lifecycle.
|
*/
const serverMiddleware = [
    'App/Middleware/Server/StaticAuth', // keep this middleware BEFORE static middleware
    'Adonis/Middleware/Static',
    'Adonis/Middleware/Cors'
]

Server
    .registerGlobal(globalMiddleware)
    .registerNamed(namedMiddleware)
    .use(serverMiddleware)
