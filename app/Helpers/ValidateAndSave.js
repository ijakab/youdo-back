const GlobalValidator = use('App/Services/GlobalValidator')

module.exports = async function (instance, data, ...required) {
    instance.merge(data)
    const validator = new GlobalValidator(instance.toJSON())
    validator.addRequired(...required)
    await validator.run()
    await instance.save()
    return instance
}