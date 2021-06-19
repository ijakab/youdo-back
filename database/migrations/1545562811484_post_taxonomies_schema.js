'use strict'

const Schema = use('Schema')

class PostTaxonomiesSchema extends Schema {
  up () {
    this.create('post_taxonomies', (table) => {
        table.increments()
        table.integer('post_id').unsigned().notNullable().references('posts.id').onDelete('cascade')
        table.integer('taxonomy_id').unsigned().notNullable().references('taxonomies.id').onDelete('cascade')
        table.timestamps()

        table.collate('utf8_general_ci')
    })
  }

  down () {
    this.drop('post_taxonomies')
  }
}

module.exports = PostTaxonomiesSchema
