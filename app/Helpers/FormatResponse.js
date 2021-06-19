'use strict'

const Env = use('Env')
const debug = Env.get('DEBUG', false)
const node_env = Env.get('NODE_ENV', 'development')


module.exports = async function (existingResponse, locale) {

    // format it to json if needed
    let data = (existingResponse && existingResponse.toJSON) ? existingResponse.toJSON() : (existingResponse || '')
    let message

    // add custom response message option
    if (typeof data === 'object' && data._message) {
        message = data._message
        delete data._message
    }

    // fetch message as a string always
    message = message || ((data && typeof data === 'string') ? data : (typeof data === 'object' ? (data.message || data[0] && data[0].message || '') : ''))

    // translate message if needed and store old reference...
    const untranslatedMsg = message

    data = (typeof data === 'string' || data instanceof Error) ? {} : (Array.isArray(data) ? data : (Object.keys(data).length ? data : {}))

    // create payload
    let payload = {data, message, code: untranslatedMsg}

    // show errors and useful info when developing
    if (node_env !== 'production' || debug) {

        payload.debug = {untranslatedMsg}

        if (existingResponse instanceof Error) {
            payload.debug = {}
            payload.debug.error = {details: existingResponse, stack: existingResponse.stack}
        }
    }

    // finally return formatted payload
    return payload
}
