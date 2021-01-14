const server = require('./server')
const socketIO = require('socket.io')
const http = require('http')
const servidor = http.createServer(server)

const io = socketIO(servidor,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST","PUT","DELETE"],
        // allowedHeaders: ["content-type","application"],
        credentials: true
    }
})

io.on('connection', (socket) => {
    console.log('new connection', socket.id)
    socket.on('refresh', _ => {
        socket.broadcast.emit('tags')
    })
})

servidor.listen(3001, () => {
    console.log('Server on Port 3001')
})