'use strict'

class SearchByRadius {
  register (Model) {
      Model.queryMacro('whereInRadius', function (longitude, latitude, radius) {
          this.where(q => {
              radius *= 1.1

              //i don't understand this shit at all but i hope as fuck this works
              radius *= 0.62137 //first we convert kilometers to miles.. because I found this query in miles and I don't want to mess with it at all
              q.whereRaw(`
                    acos(sin(latitude * 0.0175) * sin(${latitude} * 0.0175) 
                   + cos(latitude * 0.0175) * cos(${latitude} * 0.0175) *    
                     cos((${longitude} * 0.0175) - (longitude * 0.0175))
                  ) * 3959 <= ${radius}

              `)
              q.orWhere('noLocation', true)
          })
          return this
      })
  }
}

module.exports = SearchByRadius
