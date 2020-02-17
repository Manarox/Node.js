const tokens = {}
module.exports = {
   consume: function consumeRememberMeToken(token, fn) {
      let userId = tokens[token]
      delete tokens[token]
      return fn(null, userId)
   },
   save: function saveRememberMeToken(token, userId, fn) {
      tokens[token] = userId
      return fn()
   }
}