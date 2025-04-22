import express from 'express'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'

const { McpServer } = require('@modelcontextprotocol/sdk')

const app = express()
app.use(express.json())

const httpServer = createServer(app)
const io = new SocketIOServer(httpServer, { cors: { origin: '*' } })

io.on('connection', socket => 
  socket.on('tcr:instructions', () => 
    socket.emit('tcr:instructions:response', { message: 'now i know tcr' })
  )
)

app.get('/', (_, res) => res.send('mcvibes'))

const mcpServer = new McpServer({
  name: 'mcvibes',
  version: '0.2.0'
})

mcpServer.setToolHandler('run_tcr', {}, async () => {
  return {
    content: [{ type: 'text', text: 'now i know tcr' }]
  }
})

mcpServer.listen(httpServer, { path: '/mcp' })
httpServer.listen(3000, () => console.error('mcvibes server running on port 3000'))
