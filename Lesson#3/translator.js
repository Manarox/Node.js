// Переводчик

const request = require('request')
const url = require('url')
const chalk = require('chalk')
const readLine = require('readline')
const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
})
const params = url.parse('https://translate.yandex.net/api/v1.5/tr.json/translate', true)
params.query = {
    key: 'trnsl.1.1.20200116T132712Z.f36d180e461d8183.1ff00af52d3035984cf7c44f5a6c96d589db2d06', 
    text: '',
    lang: 'ru',
    format: 'plain',
    options: 1
}
function getText () {
    rl.question(`\nВведите текст:\n\n- `, (line) => {
        if (line === '') {
            getText()
        } else if (line.toLowerCase() === 'q') {
            rl.close()
        } else {
            params.query.text = line
            request(url.format(params), (err, response, body) => {
                if (!err && response.statusCode === 200) {
                    console.log('-', chalk.cyan(JSON.parse(body).text[0]))
                    getText()
                } else throw err
            })
        }
    })
}
const legal = 'Перевод представлен сервисом «Яндекс.Переводчик» http://translate.yandex.ru/'
console.log(chalk.grey(legal))
getText() 