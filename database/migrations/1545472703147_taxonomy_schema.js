'use strict'

const Schema = use('Schema')

class TaxonomySchema extends Schema {
  up () {
    this.create('taxonomies', (table) => {
        table.increments()
        table.string('title').notNullable()
        table.string('type').notNullable()
        table.timestamps()
        table.collate('utf8_general_ci')
    })
  }

  down () {
    this.drop('taxonomies')
  }
}

module.exports = TaxonomySchema
