import express from 'express'
import { Server } from "socket.io";
import path from 'path'
import ejs from "ejs"

const app = express()
const server = require('http').createServer(app)
const io = new Server(server)

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', ejs.renderFile)

app.use('/', (req, res) => {
    res.render('index.html')
})

let messages = []

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`)

    socket.emit('previousMessages', messages)

    socket.on('sendMessage', data => {
        messages.push(data)
        socket.broadcast.emit('receivedMessage', data)
    })
})

server.listen(3000)