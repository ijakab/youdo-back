'use strict'

const Schema = use('Schema')

class PostSchema extends Schema {
  up () {
    this.create('posts', (table) => {
        table.increments()
        table.string('title').notNullable()
        table.text('description')
        table.integer('user_id').notNullable().references('users.id').unsigned().onDelete('cascade')

        table.string('locationString')
        table.float('latitude')
        table.float('longitude')
        table.boolean('noLocation').notNullable().defaultsTo(false)

        table.float('priceAmount')
        table.string('priceCurrency')
        table.enu('priceMode', ['full', 'perHour']).notNullable().defaultsTo('full')
        table.timestamps()

        table.collate('utf8_general_ci')
    })
  }

  down () {
    this.drop('posts')
  }
}

module.exports = PostSchema
