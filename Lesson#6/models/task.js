const mongoose = require('mongoose')
const Schema = mongoose.Schema
const taskSchema = new Schema({
   created: { type: Date, default: Date.now() },
   taskBody: String,
   priority: { 
      type: String, 
      enum: ['low', 'normal', 'high', 'first'], 
      lowercase: true
   },
   deadline: Date,
   author: { 
      type: Schema.Types.ObjectId, 
      ref: 'User'
   }, 
   completed: { type: Boolean, default: false}
})
module.exports = mongoose.model('Task', taskSchema, 'tasks')