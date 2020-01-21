const chalk = require('chalk')
const fs = require('fs')
const readLine = require('readline')
const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
})

class Coin {
    constructor () {
        this.currentCoin = {value: 0, side: ''}
    }
    _sideName(number) {
        if (number === 1) {
            return 'орёл'
        } else return 'решка'
    }
    tossCoin() {
        this.currentCoin.value = Math.round(Math.random() + 1)
        this.currentCoin.side = this._sideName(this.currentCoin.value)
        return this.currentCoin
    }
} 

class Game {
    constructor () {
        this.newGame()
    }
    newGame() {
        rl.question(`На что ставите? ${chalk.grey('[1 - орёл; 2 - решка]')}\n> `, (line) => {
            if (+line === 1 || +line === 2) {
                this.newPartGame(line)
            } else {
                console.log('Необходимо ввести цифру 1 или 2')
                this.newGame()
            }
        }) 
    }
    async newPartGame (userAnswer) {
        console.log(chalk.grey('\nМонетка брошена'))
        let answer = coin.tossCoin()
        await this._checkResult(answer, userAnswer)
        rl.question('Хотите начать новую игру? [y/n]', (line) => {
            if (line.toLowerCase() === 'y') {
                this.newGame()
            } else rl.close()
        })
    }
    _checkResult (answer, userAnswer) {
        return new Promise((resolve, reject) => {
            setTimeout (() => {
                console.log (`Результат: ${answer.value} - ${answer.side} \n`)
                if (answer.value === +userAnswer) {
                    console.log (chalk.green('> Вы выиграли!\n'))
                    addLog(true)
                } else {
                    console.log (chalk.red('> Вы проиграли\n'))
                    addLog(false)
                }
                resolve();
            }, 2000)
        })
    }
}

function addLog (gameResult) {
    const logger = JSON.parse(fs.readFileSync('./log_headsTails.json'))
    if (gameResult) {
        logger.userWins++      
    } else {
        logger.userLoses++
    }
    logger.winLog.push(gameResult)
    fs.writeFileSync('./log_headsTails.json', JSON.stringify(logger, null, 2))
}

console.log(chalk.magenta('\n~ Игра "Орёл или решка" ~\n\n'))

const coin = new Coin()
const game = new Game() 