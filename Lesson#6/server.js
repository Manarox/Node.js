const express = require('express')
const mongoose = require('mongoose')
const consolidate = require('consolidate')
const path = require('path')
const router = require('./routes')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const passport = require('./auth')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const app = express()
const mustBeAuthenticate = (req, res, next) => {
   if (req.user) {
      next()
   } else {
      res.redirect('/')
   }
}
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/styles', express.static(path.resolve('hw-6', 'assets/css')))
app.use('/images', express.static(path.resolve('hw-6', 'assets/img')))
app.use(cookieParser())
app.use(session({
   resave: false,
   saveUninitialized: false,
   secret: 'secret phrase',
   store: new MongoStore({mongooseConnection: mongoose.connection}),
}))
app.use(flash())
app.use(passport.initialize)
app.use(passport.session)
app.use(passport.authenticateRemember)
app.use('/tasks', mustBeAuthenticate)
app.use(router)
app.engine('hbs', consolidate.handlebars)
app.set('view engine', 'hbs')
app.set('views', path.resolve('hw-6', 'views'))
const port = 8000
app.listen(port, () => {
   console.log(`Server listening on http://localhost:${port}`)
})
const db = mongoose.connect(`mongodb://localhost:32771/to-do-list`, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useFindAndModify: false
},
(err) => {
   if (!err) {
      console.log('Database successfully connected')
   } else throw err
})