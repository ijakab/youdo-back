const TranslateRecord = use('App/Helpers/TranslateRecord')
const TranslationTransformer = use('App/Transformers/TranslationTransformer')

class TranslateController {
    async translate(ctx) {
        let body = ctx.request.post()
        const translation = await TranslateRecord(ctx, {
            type: body.translateType,
            identifier: body.identifier,
            lang: body.lang,
            data: body.data
        })
        return await ctx.transform.item(translation, TranslationTransformer)
    }
}

module.exports = TranslateController