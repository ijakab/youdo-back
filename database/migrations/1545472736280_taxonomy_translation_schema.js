'use strict'

const Schema = use('Schema')

class TaxonomyTranslationSchema extends Schema {
  up () {
    this.create('taxonomy_translations', (table) => {
        table.increments()
        table.integer('parent_id').unsigned().references('taxonomies.id').notNullable().onDelete('cascade')
        table.string('language_code', 3).notNullable()
        table.string('title')
        table.timestamps()
        table.collate('utf8_general_ci')
    })
  }

  down () {
    this.drop('taxonomy_translations')
  }
}

module.exports = TaxonomyTranslationSchema
