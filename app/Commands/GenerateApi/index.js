'use strict'
const ace = require('@adonisjs/ace')
const exec = use('App/Commands/Exec-promise')
const Templater = use('App/Commands/Templater')
const path = require('path')
const Helpers = use('Adonis/Src/Helpers')

class GeneratorCommand extends ace.Command {
    static get signature() {
        return 'make:api { name: name of api }'
    }

    static get description() {
        return 'Generates model, migration, service, controller, route and transformer'
    }

    async handle(args, options) {
        args.name = args.name.charAt(0).toUpperCase() + args.name.slice(1) //Make first letter uppercase
        await exec(`adonis make:migration ${args.name} --action=create`)
        await this.registerRoutes(args.name)
        await this.generateModel(args.name)
        await this.generateService(args.name)
        await this.generateTransformer(args.name)
        await this.generateController(args.name)
        await this.generateRoute(args.name)
        await this.generateTestSuite(args.name)
        process.exit(0)
    }

    async generateService(modelName) {
        const templateFile = path.join(__dirname, './templates', 'Service.mustache')
        const fileName = `${modelName}Service`
        const filePath = `${Helpers.appRoot()}/app/Services/${fileName}.js`

        await this._generateFile(templateFile, filePath, {Model: modelName})
    }

    async generateTransformer(modelName) {
        const templateFile = path.join(__dirname, './templates', 'Transformer.mustache')
        const fileName = `${modelName}Transformer`
        const filePath = `${Helpers.appRoot()}/app/Transformers/${fileName}.js`

        await this._generateFile(templateFile, filePath, {Model: modelName})
    }

    async generateController(modelName) {
        const templateFile = path.join(__dirname, './templates', 'Controller.mustache')
        const fileName = `${modelName}Controller`
        const filePath = `${Helpers.appRoot()}/app/Controllers/Http/${fileName}.js`

        await this._generateFile(templateFile, filePath, {Model: modelName})
    }

    async generateRoute(modelName) {
        const templateFile = path.join(__dirname, './templates', 'Route.mustache')
        const fileName = `${modelName}`
        const filePath = `${Helpers.appRoot()}/app/Routes/${fileName}.js`

        await this._generateFile(templateFile, filePath, {Model: modelName})
    }

    async generateTestSuite(modelName) {
        const templateFile = path.join(__dirname, './templates', 'Test.mustache')
        const fileName = `01_${modelName}.spec`
        const filePath = `${Helpers.appRoot()}/test/functional/${fileName}.js`

        await this._generateFile(templateFile, filePath, {Model: modelName})
    }

    async generateModel(modelName) {
        const templateFile = path.join(__dirname, './templates', 'Model.mustache')
        const filePath = `${Helpers.appRoot()}/app/Models/${modelName}.js`

        await this._generateFile(templateFile, filePath, {Model: modelName})
    }

    async _generateFile(templateFile, filePath, bindings) {
        let templateContent = await this.readFile(templateFile, 'utf-8')
        let templater = new Templater(templateContent)
        templater.bind(bindings)
        let fileContent = templater.run()

        await this.generateFile(filePath, fileContent)
    }

    async registerRoutes(modelName) {
        const to_replace = `/* ROUTES GO HERE */`
        const replace_with = `_requireRoutes('${modelName}').prefix('api/${modelName}')
/* ROUTES GO HERE */`
        const filePath = `${Helpers.appRoot()}/start/routes.js`
        const content = await this.readFile(filePath, 'utf-8')

        let templater = new Templater(content)
        const bindigs = {}
        bindigs[to_replace] = replace_with
        templater.bind(bindigs)
        const new_content = templater.directReplace()

        await this.removeFile(filePath)
        await this.generateFile(filePath, new_content)
    }
}

module.exports = GeneratorCommand