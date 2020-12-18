import io from 'socket.io-client'

const socket = io("//localhost:3001",{
    withCredentials: true
})

export default socket