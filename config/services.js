'use strict'

const Env = use('Env')


module.exports = {
    ally: {

        facebook: {
            clientId: Env.get('FB_CLIENT_ID'),
            clientSecret: Env.get('FB_CLIENT_SECRET'),
            redirectUri: Env.get('FB_REDIRECT_URL') // put your frontend route here which will handle login with returned token from oauth process
        },


        google: {
            clientId: Env.get('GOOGLE_CLIENT_ID'),
            clientSecret: Env.get('GOOGLE_CLIENT_SECRET'),
            redirectUri: Env.get('GOOGLE_REDIRECT_URL') // put your frontend route here which will handle login with returned token from oauth process
        }
    }
}
