const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const RememberMeStrategy = require('passport-remember-me').Strategy
const User = require('./models/user')
const Token = require('./tokens')
passport.use( new LocalStrategy ( async (username, password, done) => {
   const user = await User.findOne({username})
   if (!user) {
      return done(null, false, { message: 'Incorrect username' })
   } 
   if (!user.comparePassword(password)) {
      return done(null, false, { message: 'Incorrect password' })
   }
   const plainUser = JSON.parse(JSON.stringify(user))
   delete plainUser.password
   done(null, plainUser)
} ))
passport.use( new RememberMeStrategy ( 
   (token, done) => {
      Token.consume(token, (err, user) => {
         if (err) {
            return done(err)
         }
         if (!user) {
            return done(null, false, { message: 'Incorrect username' })
         }
         return done(null, user)
      })
   },
   (user, done) => {
      let token = 'the-most-secure-secret-phrase'
      Token.save(token, { userId: user._id }, (err) => {
         if (err) { 
            return done(err)
         }
         return done(null, token)
      })
   }
))
passport.serializeUser( (user, done) => {
   return done(null, user._id)
})
passport.deserializeUser( async (id, done) => {
   const user = await User.findById(id)
   const plainUser = JSON.parse(JSON.stringify(user))
   delete plainUser.password
   done(null, plainUser)   //req.user
})
module.exports = {
   initialize: passport.initialize(),
   session: passport.session(),
   authenticateLocal: passport.authenticate( 'local', {
      failureRedirect: './',
      failureFlash: true
   }),
   authenticateRemember: passport.authenticate( 'remember-me', {
      successRedirect: './tasks',
      failureRedirect: './',
      failureFlash: true
   })
}