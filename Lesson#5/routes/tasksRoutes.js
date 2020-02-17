const Task = require('../models/task.js')
module.exports = function (app, db) {
   app.post('/tasks', async (req, res) => {
      const task = new Task(req.body)
      const savedTask = await task.save(err => {
         if (err) {
            res.send(err)
         } else console.log('New task successfully added')
      })
      res.json(savedTask)
   })

   app.get('/tasks', async (req, res) => {
      const tasks = await Task.find()
      res.json(tasks)
   })

   app.get('/tasks/:id', async (req, res) => {
      const task = await Task.findById(req.params.id, (err, task) => {
         if (err) {
            res.send('The task is not found')
         }
         res.json(task)
      })
   })

   app.put('/tasks/:id', async (req, res) => {
      const task = await Task.findByIdAndUpdate(req.params.id, req.body, (err) => {
         if (err) {
            res.send('The task is not found')
         }
      })
      res.json(task)
   })

   app.delete('/tasks/:id', async (req, res) => {
      const task = await Task.findByIdAndDelete(req.params.id, (err, task) => {
         if (err) {
            res.send('The task is not found')
         }
         res.send(`This task - "${task.taskBody}" - successfully deleted.`)
      })
   })
}