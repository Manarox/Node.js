const User = require('../models/user')
const Task = require('../models/task')
module.exports = function (app, db) {
   app.post('/users', async (req, res) => {
      const user = new User(req.body)
      const savedUser = await user.save(err => {
         if (err) {
            res.send(err)
         } else console.log('New user added')
      })
      res.json(savedUser)
   })
   app.get('/users', async (req, res) => {
      const users = await User.find()
      const tasks = await Task.find()
      users.forEach(user => {
         let userTasks = []
         tasks.forEach(task => {
            if (user._id.toString() === task.contractor.toString()) {
               userTasks.push(task)
            }
         })
         if(userTasks.length != 0) {
            user.tasks.push({$each: userTasks})
         } else {
            user.tasks = undefined
            user.save()
         }
      })
      res.json(users)
   })
   app.get('/users/:id', async (req, res) => {
      const user = await User.findById(req.params.id, (err) => {
         if (err) {
            res.send('The user is not found')
         } 
      })
      const userTasks = await Task.find({contractor: user._id})
      if(userTasks.length != 0) {
         user.tasks.push({$each: userTasks})
      } else {
         user.tasks = undefined
         user.save()
      }
      res.json(user)
   })

   app.put('/users/:id', async (req, res) => {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, (err) => {
         if (err) {
            res.send('The user is not found')
         }
      })
      res.json(user)
   })

   app.delete('/users', async (req, res) => {
      const user = await User.findOneAndDelete(req.body, (err, user) => {
         if (err) {
            res.send('The user is not found')
         }
         res.send(`The user - "${user.name.firstName} ${user.name.lastName}" - successfully deleted.`)
      })
   })

   app.delete('/users/:id', async (req, res) => {
      const user = await User.findByIdAndDelete(req.params.id, (err, user) => {
         if (err) {
            res.send('The user is not found')
         }
         res.send(`This user - "${user.name.firstName} ${user.name.lastName}" - successfully deleted.`)
      })
   })
}