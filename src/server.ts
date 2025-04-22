import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

const mcpResponse = {
  jsonrpc: '2.0',
  result: { instructions: [{ content: [{ type: 'text', text: 'now i know tcr' }] }] }
}

app.post('/mcp', express.json(), (req, res) => {
  res.json({ ...mcpResponse, id: req.body.id })
})

io.on('connection', socket => {
  socket.on('tcr:instructions', () => {
    socket.emit('tcr:instructions:response', { message: 'now i know tcr' })
  })
})

httpServer.listen(3000)
