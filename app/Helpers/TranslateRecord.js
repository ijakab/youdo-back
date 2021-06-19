const throw400 = use('App/Helpers/Throw400')

module.exports = async function(ctx, config) {
    const Service = use(`App/Services/${config.type}Service`)
    const service = new Service(ctx)
    if(!service.translate) return throw400('error.notFound')
    let record = await service.getSingle(config.identifier).first()
    if(!record) return throw400('error.notFound')

    //if translation exists we want to remove old one
    let existing = await record.translations().where('language_code', config.lang).first()
    if(!existing)
        return await service.translate(record, config.lang, config.data)
    else {
        await existing.delete()
        return await service.translate(record, config.lang, config.data)
    }

}