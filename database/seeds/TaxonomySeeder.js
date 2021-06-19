const Taxonomy = use('App/Models/Taxonomy')
const TaxonomyTranslation = use('App/Models/TaxonomyTranslation')

class TaxonomySeeder {
    async run() {
        let categories = ['Physical work', 'Other']
        let categoryTranslations = {
            de:['German 1', 'German 2'],
            hr:['Fizički rad', 'Ostalo']
        }

        for(let i = 0; i < categories.length; i++) {
            let category = await Taxonomy.findOrCreate({
                title: categories[i],
                type: 'category'
            }, {
                title: categories[i],
                type: 'category'
            })

            for(let language_code of Object.keys(categoryTranslations)) {
                await TaxonomyTranslation.findOrCreate({
                    parent_id: category.id,
                    language_code,
                    title: categoryTranslations[language_code][i]
                }, {
                    parent_id: category.id,
                    language_code,
                    title: categoryTranslations[language_code][i]
                })
            }

        }
    }
}

module.exports = TaxonomySeeder
