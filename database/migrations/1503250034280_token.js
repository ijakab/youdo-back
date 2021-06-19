'use strict'

const Schema = use('Schema')

class TokensSchema extends Schema {
    up() {
        this.create('tokens', table => {
            table.increments()
            table.integer('user_id').unsigned().references('users.id').onDelete('cascade')
            table.string('token', 40).notNullable().unique().index()
            table.string('type', 80).notNullable()
            table.boolean('is_revoked').defaultTo(false)
            table.timestamps()

            table.collate('utf8_general_ci')
        })
    }

    down() {
        this.drop('tokens')
    }
}

module.exports = TokensSchema
