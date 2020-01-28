//информации о последних новостях

const request = require('request')
const cheerio = require('cheerio')
const chalk = require('chalk')
const url = 'https://yandex.ru/news/rubric/business?from=rubric'
request(url, (err, response, body) => {
    if (!err && response.statusCode === 200) {
        const $ = cheerio.load(body)
        const news = $('.link.link_theme_black.i-bem')
        let newsList = ''
        for (i = 0; i < (news.length > 10 ? 10 : news.length); i++) {
            let newsItem = news.eq(i).text()
            newsList += ` - ${newsItem}\n`
        }
        console.log(`\n${chalk.cyan('Новости экономики:')}\n\n${newsList}`)
    } else console.log(err)
})