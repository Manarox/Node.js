const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(12)
const userSchema = new Schema({
   username: { type: String, required: true },
   firstName: String,
   lastName: String,
   mail: { type: String, required: true },
   password: { type: String, required: true },
})
userSchema.pre('save', function (next) {
   if (this.isModified('password')) {
      this.password = bcrypt.hashSync(this.password, salt)
   }
   next()
})
userSchema.methods.comparePassword = function (inputPass) {
   return bcrypt.compareSync(inputPass, this.password) 
}
module.exports = mongoose.model('User', userSchema, 'users')