const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Token = require('../tokens')
const passport = require('../auth')
router.get('/', (req, res) => {
   res.render('sign_in', { message: req.flash('error')
   })
})
router.get('/sign_up', (req, res) => {
   res.render('sign_up')
})
router.post('/sign_up', async (req, res) => {
   const user = new User(req.body)
   await user.save()
   res.redirect('/')
})
router.post('/sign_in', passport.authenticateLocal,
   (req, res, next) => {
      if (!req.body.remember_me) { 
         return next()
      }
      const token = 'the-most-secure-secret-phrase'
      Token.save(token, { userId: req.user._id }, (err) => {
         if (err) { 
           return done(err)
         }
         res.cookie('remember_me', token, { maxAge: 3600 * 24 * 7 * 1000 })
         return next()
      })
    },
    (req, res) => {
      res.redirect('/tasks')
    }
)
router.get('/logout', (req, res) => {
   res.clearCookie('remember_me')
   req.logout()
   res.redirect('/')
})
module.exports = router