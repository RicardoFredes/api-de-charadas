require('universal-fetch')
const express = require('express')
const cors = require('cors')
const app = express()

function fetchQuestion() {
    const number = getRandomNumber(132)
    const url = `https://www.osvigaristas.com.br/charadas/pagina${number}.html`
    return fetch(url)
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

function fetchApi(isJson) {
    const api = 'https://us-central1-kivson.cloudfunctions.net/charada-aleatoria'
    const x = { headers: { "Accept": "application/json" } }
    if (isJson) return fetch(api, x).then(r => r.json())
    return fetch(api).then(r => r.text())
}

app.use(cors())

app.get('/', (req, res) => fetchQuestion().then(r => res.send(r)))
app.get('/charada', (req, res) => fetchApi().then(r => res.send(r)))
app.get('/charada/json', (req, res) => fetchApi(true).then(r => res.send(r)))

module.exports = app