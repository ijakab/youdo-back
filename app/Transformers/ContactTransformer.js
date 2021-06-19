const TransformerAbstract = use('App/Transformers/BaseTransformer')

class UserTransformer extends TransformerAbstract {

    transform(model, ctx) {
        return {
            type: model.type,
            value: model.value
        }
    }
}

module.exports = UserTransformer