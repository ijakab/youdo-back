'use strict'
const fs = require('fs');

class Templater {
    constructor(content) {
        this._content = content
    }

    bind(data) {
        this._bindData = data
    }

    run() {
        if(!this._bindData || !this._content) throw new Error('Error while running templater, instance does not have content or bind Data')
        for(let property in this._bindData) {
            if(this._bindData.hasOwnProperty(property)) {
                this._content = this._content.split(`{{${property}}}`).join(this._bindData[property])
            }
        }
        return this._content
    }

    directReplace() {
        if(!this._bindData || !this._content) throw new Error('Error while running templater, instance does not have content or bind Data')
        for(let property in this._bindData) {
            if(this._bindData.hasOwnProperty(property)) {
                this._content = this._content.split(property).join(this._bindData[property])
            }
        }
        return this._content
    }
}

module.exports = Templater