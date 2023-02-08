import { io } from 'socket.io-client'

let socket = null

export async function initSocket() {
  socket = io('wss://192.168.0.108:9000')
  socket.on('connection', (socket) => {
    console.log(socket.id) // x8WIv7-mJelg7on_ALbx
    return Promise.resolve(socket)
  })

  return Promise.reject(null)
}

export default socket
