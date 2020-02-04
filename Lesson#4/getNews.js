const express = require ('express')
const path = require ('path')
const consolidate  = require ('consolidate')
const request = require('request')
const cheerio = require('cheerio')
const cookieParser = require('cookie-parser')

const app = express()

// Middleware
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use('/styles', express.static(path.resolve(__dirname, 'assets/css')))
app.use('/img', express.static(path.resolve(__dirname, 'assets/img')))

// Handlebars
app.engine('hbs', consolidate.handlebars)
app.set('view engine', 'hbs')
app.set('views', path.resolve(__dirname, 'views'))

// Routing
app.get('/', (req, res) => {
   if (!req.cookies.params) {
      res.render('news', template)
   } else {
      newsToHbs(res, getUserChoice(req.cookies.params))
   }
})

app.post('/', (req, res) => {
   res.cookie('params', req.body)
   newsToHbs(res, getUserChoice(req.body))
})

app.listen(8000, () => {
   console.log('Server listens http://localhost:8000')
})

class Categories {
   constructor () {
      this.values = {
         politics: 'Политика', 
         society: 'Общество', 
         business: 'Экономика', 
         world: 'В мире', 
         incident: 'Происшествия', 
         culture: 'Культура', 
         computers: 'Технологии', 
         science: 'Наука', 
         auto: 'Авто'
      }
      this.list = []
      this._getCatList()
   }
   _getCatList (){
      Object.keys(this.values).forEach(val => {
         this.list.push({categoryClass: val, categoryName: this.values[val]});
      });
   }
   inRus (cat) {
      return this.values[cat]
   }
}

let category = new Categories()
let template = {category: category.list, quantity: [3, 6, 12, 24, 48]}

function getUserChoice (formParams) {
   let userChoice = []
   Object.keys(formParams).forEach(el => {
      if (el !== 'quantity') {
         userChoice.push({cat: el, quantity: formParams.quantity})
      }
   })
   return userChoice
}

function getNews (userChoice) {
   let url = `https://yandex.ru/news/rubric/${userChoice.cat}?from=rubric`
   return new Promise( (resolve, reject) => {
      request(url, (err, response, body) => {
         if (!err && response.statusCode === 200) {
               const $ = cheerio.load(body)
               const news = $('.link_theme_black')
               const newsByCat = {block: []}
               for (let i = 0; i < (news.length < userChoice.quantity ? news.length : userChoice.quantity); i++) {
                  newsByCat.block.push({
                     title: news.eq(i).text(), 
                     href: news.eq(i).attr('href'), 
                     categoryClass: userChoice.cat, 
                     categoryName: category.inRus(userChoice.cat)
                  })
               }
               resolve(newsByCat)
         } else reject(err)
      })
   })
}

function newsToHbs (res, userChoice) {
   let promises = []
   userChoice.forEach(el => {
      promises.push(getNews(el))
   })
   Promise.all(promises).then((data) => {
      res.render('news', Object.assign({}, template, {allNews: data}))
   },
   (err) => {
      res.send(err)
   })
}