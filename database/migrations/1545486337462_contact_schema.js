'use strict'

const Schema = use('Schema')

class ContactSchema extends Schema {
  up () {
    this.create('contacts', (table) => {
        table.increments()
        table.integer('user_id').unsigned().references('users.id').notNullable().onDelete('cascade')
        table.string('type').notNullable()
        table.string('value')
        table.timestamps()

        table.collate('utf8_general_ci')
    })
  }

  down () {
    this.drop('contacts')
  }
}

module.exports = ContactSchema
