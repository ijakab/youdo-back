'use strict'
const {intersection} = use('lodash')
//
class StandardFiltering {
    register (Model, customOptions = {}) {
        const defaultOptions = {
            hasSlugs: false,
            paramFilters: [],
            searchBy: []
        }
        this._options = Object.assign(defaultOptions, customOptions)
        let self = this
        Model.queryMacro('standardFilters', function (filters) {
            self.handleTimeFilters(this, filters)
            self.handleDirectFilters(this, filters)
            self.handleParamFilters(this, filters)
            self.handleSearchString(this, filters)
            return this
        })
    }

    handleTimeFilters(q, {createdFrom, createdTill, updatedFrom, updatedTill}) {
        createdFrom = Number(createdFrom)
        createdTill = Number(createdTill)
        updatedFrom = Number(updatedFrom)
        updatedTill = Number(updatedTill)
        if(createdFrom) {
            q.where('created_at', '>', createdFrom)
        }
        if(createdTill) {
            q.where('created_at', '<', createdTill)
        }
        if(updatedFrom) {
            q.where('updated_at', '>', updatedFrom)
        }
        if(updatedTill) {
            q.where('updated_at', '<', updatedTill)
        }
    }

    handleDirectFilters(q, {ids, slugs}) {
        if(ids && ids.length) {
            q.whereIn('id', ids)
            q.orderByRaw(`field (id, ${ids.join(',')})`)
        }
        if(slugs && slugs.length && this._options.hasSlugs) {
            q.whereIn('slug', slugs)
            q.orderByRaw(`field (slug, ${slugs.join(',')})`)
        }
    }

    handleParamFilters(q, {paramKeys, paramValues}) {
        if(paramKeys && paramKeys.length && paramValues.length && paramValues && paramKeys.length === paramValues.length) {
            for(let i = 0; i < paramKeys.length; i++) {
                if(this._options.paramFilters.includes(paramKeys[i])) {
                    q.where(paramKeys[i], paramValues[i])
                }
            }
        }
    }

    handleSearchString(q, {searchString}) {
        if(this._options.searchBy && this._options.searchBy.length && searchString) {
            q.where(sub => {
                for(let searchField of this._options.searchBy) {
                    sub.orWhere(searchField, 'like', `%${searchString}%`)
                }
            })
        }
    }
}

module.exports = StandardFiltering
