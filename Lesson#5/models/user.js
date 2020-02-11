const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
   name: {
      firstName: {type: String, required: true},
      lastName: String,
   },
   avatar: String,
   email: String,
   bio: String, 
   tasks: Array
})
module.exports = mongoose.model('User', userSchema, 'users')