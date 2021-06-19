'use strict'

const Schema = use('Schema')

class UserTaxonomiesSchema extends Schema {
  up () {
    this.create('user_taxonomies', (table) => {
        table.increments()
        table.integer('user_id').unsigned().notNullable().references('users.id').onDelete('cascade')
        table.integer('taxonomy_id').unsigned().notNullable().references('taxonomies.id').onDelete('cascade')
        table.timestamps()

        table.collate('utf8_general_ci')
    })
  }

  down () {
    this.drop('user_taxonomies')
  }
}

module.exports = UserTaxonomiesSchema
