const fs = require('fs')

class Statistic {
    constructor (data) {
        this.gamesCount = data.winLog.length
        this.winsCount = data.userWins
        this.losesCount = data.userLoses
        this.winsRatio = Math.round((this.winsCount / this.gamesCount) * 100)
        this.losesRatio = Math.round((this.losesCount / this.gamesCount) * 100)
        this.winsRow = 0
        this.losesRow = 0
        this._inRow(data.winLog)
    }
    _inRow (arr) {
        let winSeries = 0
        let loseSeries = 0
        arr.forEach(el => {
            if (el) {
                winSeries++
                loseSeries = 0
                this.winsRow = winSeries < this.winsRow ? this.winsRow : winSeries
            } else {
                loseSeries++
                winSeries = 0
                this.losesRow = loseSeries < this.losesRow ? this.losesRow : loseSeries
            }
        });
    }
    showStat() {
        let stat = {
            "общее количество партий": this.gamesCount,
            "выиграно партий": this.winsCount,
            "проиграно партий": this.losesCount,
            "соотношение": `${this.winsRatio}% / ${this.losesRatio}%`,
            "максимальное число побед подряд": this.winsRow,
            "максимальное число проигрышей подряд": this.losesRow
        }
        console.log(stat)
    }
}

const logFile = JSON.parse(fs.readFileSync('./log_headsTails.json'))
const headsTails = new Statistic(logFile)
headsTails.showStat() 