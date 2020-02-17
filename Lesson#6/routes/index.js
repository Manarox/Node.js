const express = require('express')
const router = express.Router()
const loginRoutes = require('./loginRoutes')
const taskRoutes = require('./tasksRoutes')
router.use('/', loginRoutes)
router.use('/tasks', taskRoutes)
module.exports = router