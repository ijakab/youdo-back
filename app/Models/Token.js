'use strict'

const Model = use('Model')

class Token extends Model {

    // --- CONFIGURATION
    static boot() {
        super.boot()
        this.addTrait('CastDate')
    }

    /* RELATIONS */

}

module.exports = Token
