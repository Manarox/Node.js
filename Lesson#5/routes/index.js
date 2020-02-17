const usersRoutes = require('./usersRoutes')
const tasksRoutes = require('./tasksRoutes')
module.exports = function(app, db) {
   usersRoutes(app, db)
   tasksRoutes(app, db)
}