'use strict'
const ace = require('@adonisjs/ace')
const Templater = use('App/Commands/Templater')
const Helpers = use('Helpers')
const _ = use('lodash')

class GeneratorCommand extends ace.Command {
    static get signature() {
        return 'make:relation { models: models to relate wih - in between }'
    }

    static get description() {
        return 'relate two models'
    }

    async handle(args) {

        const choice = await this.choice('What type of relation',
            [
                {
                    name: 'First model has one second model',
                    value: '1'
                },
                {
                    name: 'First model has many second models',
                    value: '2'
                },
                {
                    name: 'Many to many relation with pivot table first_seconds',
                    value: '3'
                }
            ])
        const split = args.models.split('-')
        const modelOne = split[0], modelTwo = split[1]

        //make sure models exist
        use('App/Models/'+modelOne)
        use('App/Models/'+modelTwo)

        let content = this['getContentFor'+choice](modelOne, modelTwo) //what to be written

        //next, write to files
        await this.buildRelation(modelOne, content.first)
        await this.buildRelation(modelTwo, content.second)

        process.exit(0)
    }

    getContentFor2(modelOne, modelTwo) {
        const camel1 = _.camelCase(modelOne)
        const camel2 = _.camelCase(modelTwo)
        return {
            first:
`   ${camel2}s() {
        return this.hasMany('App/Models/${modelTwo}')
    }`,
            second:
`   ${camel1}() {
        return this.belongsTo('App/Models/${modelOne}')
    }`
        }
    }

    getContentFor3(modelOne, modelTwo) {
        const camel1 = _.camelCase(modelOne)
        const camel2 = _.camelCase(modelTwo)
        return {
            first:
`   ${camel2}s() {
        return this.belongsToMany('App/Models/${modelTwo}').pivotTable('cms_${camel1}_${camel2}s')
    }`,
            second:
`   ${camel1}s() {
        return this.belongsToMany('App/Models/${modelOne}').pivotTable('cms_${camel1}_${camel2}s')
    }`
        }
    }

    getContentFor1(modelOne, modelTwo) {
        const camel1 = _.camelCase(modelOne)
        const camel2 = _.camelCase(modelTwo)
        return {
            first:
`   ${camel2}() {
        return this.hasOne('App/Models/${modelTwo}')
    }`,
            second:
`   ${camel1}() {
        return this.belongsTo('App/Models/${modelOne}')
    }`
        }
    }

    async buildRelation(model, content) {
        const filePath = `${Helpers.appRoot()}/app/Models/${model}.js`
        const old_file_content = await this.readFile(filePath, 'utf-8')

        const to_replace = `/* RELATIONS */`
        const replace_with =
`/* RELATIONS */

${content}`
        
        const templater = new Templater(old_file_content)
        const bindings = {}
        bindings[to_replace] = replace_with
        templater.bind(bindings)
        const new_content = templater.directReplace()

        await this.removeFile(filePath)
        await this.generateFile(filePath, new_content)
    }
}

module.exports = GeneratorCommand