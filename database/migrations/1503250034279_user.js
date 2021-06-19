'use strict'

const Schema = use('Schema')

const Env = use('Env')


class UserSchema extends Schema {
    up() {
        this.create('users', table => {
            table.increments()
            table.string('username', 20).notNullable().unique()
            table.string('email', 254).notNullable().unique()
            table.string('language', 2).defaultTo(Env.get('APP_LOCALE', 'en')).notNullable()
            table.dateTime('terms_accepted')
            table.string('terms_ip', 45)
            table.enu('type', ['admin', 'user']).notNullable().defaultsTo('user')
            table.float('radius')
            table.timestamps()

            table.collate('utf8_general_ci')
        })
    }

    down() {
        this.drop('users')
    }
}

module.exports = UserSchema
