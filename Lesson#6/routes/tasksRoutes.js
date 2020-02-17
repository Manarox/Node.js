const express = require('express')
const router = express.Router()
const Task = require('../models/task')
router.get('/', async (req, res) => {
   const tasks = await Task.find({author: req.user._id})
   res.render('tasks', {
      user: req.user, 
      priority: ['Low', 'Normal', 'High', 'First'], 
      tasks: tasks.map(task => task.toJSON())
   })
})
router.post('/', async (req, res) => {
   const task = new Task(req.body)
   await task.save()
   res.redirect('/tasks')
})
router.post('/complete', async (req, res) => {
   await Task.findOneAndUpdate({_id: req.body.complete}, {completed: true}, (err) => {
      if (err) {
         throw err
      }
      res.redirect('/tasks')
   })
})
router.post('/delete', async (req, res) => {
   await Task.findOneAndDelete({_id: req.body.delete}, (err, task) => {
      if (err) {
         throw err
      }
      res.redirect('/tasks')
   })
})
module.exports = router