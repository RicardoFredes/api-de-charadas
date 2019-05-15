require('universal-fetch')
const express = require('express')
const cors = require('cors')
const app = express()

const number = getRandomNumber(132)
const api = `https://www.osvigaristas.com.br/charadas/pagina${number}.html`

function fetchQuestion() {
    return fetch(api)
        .then(r => r.text())
        .then(r => {
            const text = r.replace(/[\n]/g ,'')
            const matches = text.match(/<div class="riddle">.+?(?:<\/footer>)/g)
            const index = getRandomNumber(matches.length)
            return splitQuestion(matches[index - 1])
        })
}

function getRandomNumber(numberMax) {
    return Math.ceil(numberMax * Math.random())
}

function splitQuestion(text){
    const [,question,answer] = text.match(/class="question">(.+?)(?:<\/).*class="toggleable">(.+?)(?:<\/)/)
    return {question,answer}
}

app.use(cors())

app.get('/', (req, res) => fetchQuestion().then(r => res.send(r)))
app.get('/charada', (req, res) => res.send('Charada'))

module.exports = app