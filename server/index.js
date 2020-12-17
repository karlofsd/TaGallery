// const server = require('./server')
// const socketIO = require('socket.io')
// const http = require('http')
// const servidor = http.createServer(server)

// const io = socketIO(servidor,{
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"],
//         allowedHeaders: ["my-custom-header"],
//         credentials: true
//     }
// })

// io.on('connection', (socket) => {
//     console.log('new connection', socket.id)
//     socket.on('tags:updated', data => {
//         console.log(data[0])
//         socket.broadcast.emit('tags:refresh',data)
//     })
// })

// servidor.listen(3001, () => {
//     console.log('Server on Port 3001')
// })

// --------- SERVIDOR NO CONECTADO!-----------