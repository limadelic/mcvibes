import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import agentRoutes from './routes/agentRoutes';
import { AgentManager } from './services/agentManager';

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const agentManager = new AgentManager();

// Set port
const PORT = process.env.PORT || 3000;

// Make io available to routes
app.set('io', io);

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// API endpoints for TCR MCP
app.use('/api', agentRoutes);

// Socket.io for real-time communication
io.on('connection', (socket) => {
  console.log('A new consciousness has entered the Matrix');
  
  // Send current agent list to new client
  socket.emit('agents:update', { agents: agentManager.getAllAgents() });
  
  // Welcome message in terminal
  socket.emit('tcr:update', { 
    agent: 'Morpheus', 
    message: 'Welcome to the Matrix. The Matrix is everywhere. It is all around us.' 
  });
  
  // Handle agent TCR events
  socket.on('tcr:start', (data) => {
    console.log(`Agent ${data.agent} started TCR: ${data.verb}:${data.description}`);
    
    // Broadcast to all clients
    io.emit('tcr:update', { 
      agent: data.agent, 
      message: `Starting TCR process: ${data.verb}:${data.description}` 
    });
  });
  
  socket.on('tcr:result', (data) => {
    console.log(`Agent ${data.agent} TCR result: ${data.success ? 'Success' : 'Failure'}`);
    
    // Find the agent in our system
    const agents = agentManager.getAllAgents();
    const agent = agents.find(a => a.name === data.agent);
    
    if (agent) {
      // Update agent status based on TCR result
      agentManager.updateAgentStatus(agent.id, data.success ? 'success' : 'failure');
      
      // Record the TCR activity
      agentManager.recordTcrActivity(agent.id, {
        verb: data.verb,
        description: data.description,
        success: data.success
      });
      
      // Broadcast updated agent list
      io.emit('agents:update', { agents: agentManager.getAllAgents() });
    }
    
    // Broadcast TCR result to all clients
    io.emit('tcr:update', { 
      agent: data.agent, 
      message: `TCR ${data.verb}:${data.description} - ${data.success ? 'SUCCESS' : 'FAILURE'}` 
    });
  });
  
  // Handle control events
  socket.on('control:refresh', () => {
    io.emit('agents:update', { agents: agentManager.getAllAgents() });
    io.emit('tcr:update', { agent: 'Architect', message: 'System refreshed.' });
  });
  
  socket.on('control:reset', () => {
    // Reset all agents to idle state
    const agents = agentManager.getAllAgents();
    agents.forEach(agent => {
      agentManager.updateAgentStatus(agent.id, 'idle');
    });
    
    io.emit('agents:update', { agents: agentManager.getAllAgents() });
    io.emit('tcr:update', { agent: 'Architect', message: 'All agents have been reset. The Matrix has been reloaded.' });
  });
  
  socket.on('disconnect', () => {
    console.log('A consciousness has left the Matrix');
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Matrix TCR MCP Server running on port ${PORT}`);
  console.log(`The Matrix has you...`);
  
  // Display local IP for connection from other devices
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  console.log('\nAccess from other devices using one of these URLs:');
  Object.keys(networkInterfaces).forEach(ifname => {
    networkInterfaces[ifname].forEach(iface => {
      if ('IPv4' === iface.family && !iface.internal) {
        console.log(`http://${iface.address}:${PORT}`);
      }
    });
  });
});
