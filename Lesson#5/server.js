const express = require ('express')
const mongoose = require('mongoose')
const app = express()
app.use(express.json())
const port = 8000
app.listen(port, () => {
   console.log(`Server listens http://localhost:${port}`)
})
const db = mongoose.connect('mongodb://localhost:32769/insta', {
   useNewUrlParser: true, 
   useUnifiedTopology: true,
   useFindAndModify: false
},
(err) => {
   if (!err) {
      console.log('Database successfully connected')
   } else throw err
})

require('./routes/')(app, db)