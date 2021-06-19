const User = use('App/Models/User')
const Account = use('App/Models/Account')
const Contact = use('App/Models/Contact')
const Env = use('Env')

class UserSeeder {
    async run() {
        const admin = await User.findOrCreate({
            username: 'admin',
        }, {
            username: 'admin',
            type: 'admin',
            email: Env.get('ADMIN_EMAIL'),
            language: 'en'
        })

        await Account.findOrCreate({
            type: 'main',
            email: admin.email,
        }, {
            user_id: admin.id,
            type: 'main',
            email: admin.email,
            validated: true,
            password: Env.get('ADMIN_PASS')
        })

        const admin2 = await User.findOrCreate({
            username: 'adminLuka',
        }, {
            username: 'adminLuka',
            type: 'admin',
            email: 'lperisic@etfos.hr',
            language: 'en'
        })

        await Account.findOrCreate({
            type: 'main',
            email: admin2.email,
        }, {
            user_id: admin2.id,
            type: 'main',
            email: admin2.email,
            validated: true,
            password: Env.get('ADMIN2_PASS')
        })

        const dummy = await User.findOrCreate({
            username: 'dummy',
        }, {
            username: 'dummy',
            type: 'user',
            email: 'zidstol.komp@gmail.com',
            language: 'hr',
            radius: 300
        })

        await Account.findOrCreate({
            type: 'main',
            email: 'zidstol.komp@gmail.com',
        }, {
            user_id: dummy.id,
            type: 'main',
            email: 'zidstol.komp@gmail.com',
            validated: true,
            password: 'dummy123',
        })
    
        await Contact.findOrCreate({
            type: 'email',
            value: 'email@mail.com'
        }, {
            user_id: dummy.id,
            type: 'email',
            value: 'email@mail.com'
        })
    
        await Contact.findOrCreate({
            type: 'phone',
            value: '0989122112'
        }, {
            user_id: dummy.id,
            type: 'phone',
            value: '0989122112'
        })
    }
}

module.exports = UserSeeder
