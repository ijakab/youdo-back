'use strict'

class PostData {
  register (Model) {
      Model.queryMacro('withBulkData', function () {
          this.select('id', 'user_id', 'title', 'description', 'locationString', 'noLocation', 'priceAmount', 'priceCurrency', 'priceMode', 'created_at')
          this.with('user', q => {
              q.with('contacts', q => {
                  q.select('type', 'value', 'user_id')
              })
          })
          return this
      })
  }

}

module.exports = PostData
