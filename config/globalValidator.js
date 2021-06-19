'use strict'
//These rules will be applied wherever you use global validator middleware.
//regex rules - if property matches regex rules will be applied

//IMPORTANT!!! DON NOT ADD required rule here, instead pass required field through middleware prop or service extender
module.exports = function () {
    return {
        rules_validate: {
            language: 'string|min:2|max:2',
            page: 'number',
            perPage: 'number',
            title: 'string',
            slug: 'string'
        },
        rules_validate_regex: [
            {
                regex: /.+Slug/,
                rule: 'string'
            },
            {
                regex: /.+Id/,
                rule: 'number'
            },
            {
                regex: /.+(Slugs|Ids)/,
                rule: 'array'
            }
        ],
        rules_sanitize: {
            page: 'to_int',
            perPage: 'to_int'
        },
        rules_sanitize_regex: [

        ]
    }
}