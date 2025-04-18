import { Router, Request, Response } from 'express';
import { AgentManager } from '../services/agentManager';

// Create a router and agent manager instance
const router = Router();
const agentManager = new AgentManager();

// Route to register a new agent
router.post('/agents', (req: Request, res: Response) => {
  try {
    const { name, type } = req.body;
    
    if (!name || !type) {
      return res.status(400).json({ 
        success: false, 
        message: 'Agent name and type are required. You must be The One to proceed.'
      });
    }
    
    const agent = agentManager.registerAgent(name, type);
    
    // Emit event to all connected clients that a new agent joined
    req.app.get('io').emit('agents:update', { agents: agentManager.getAllAgents() });
    
    return res.status(201).json({ 
      success: true, 
      message: `Agent ${name} has been inserted into the Matrix`, 
      agent 
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'There was a glitch in the Matrix', 
      error: error.message 
    });
  }
});

// Route to get all agents
router.get('/agents', (_req: Request, res: Response) => {
  try {
    const agents = agentManager.getAllAgents();
    return res.json({ success: true, agents });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve agent records from the Matrix', 
      error: error.message 
    });
  }
});

// Route to update agent status
router.put('/agents/:id/status', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ 
        success: false, 
        message: 'Status is required for the update' 
      });
    }
    
    const agent = agentManager.updateAgentStatus(id, status);
    
    if (!agent) {
      return res.status(404).json({ 
        success: false, 
        message: 'Agent not found in the Matrix' 
      });
    }
    
    // Emit update to all clients
    req.app.get('io').emit('agents:update', { agents: agentManager.getAllAgents() });
    
    return res.json({ success: true, agent });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Error updating agent status', 
      error: error.message 
    });
  }
});

// Route to record TCR activity for an agent
router.post('/agents/:id/tcr', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { verb, description, success } = req.body;
    
    if (!verb || !description || success === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'TCR verb, description, and success status are required' 
      });
    }
    
    const agent = agentManager.recordTcrActivity(id, { verb, description, success });
    
    if (!agent) {
      return res.status(404).json({ 
        success: false, 
        message: 'Agent not found in the Matrix' 
      });
    }
    
    // Emit TCR update event
    req.app.get('io').emit('tcr:update', { 
      agent: agent.name, 
      message: `${verb}:${description} - ${success ? 'SUCCESS' : 'FAILURE'}` 
    });
    
    // Also update the agent list
    req.app.get('io').emit('agents:update', { agents: agentManager.getAllAgents() });
    
    return res.json({ success: true, agent });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Error recording TCR activity', 
      error: error.message 
    });
  }
});

export default router;
