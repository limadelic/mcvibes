// Agent Manager service
// Handles registration and management of AI agents in the TCR system

export class AgentManager {
  private agents = [];

  registerAgent(name, type) {
    if (!name || !type) {
      throw new Error('Agent name and type are required');
    }
    
    const agent = {
      id: Date.now().toString(),
      name,
      type,
      status: 'idle',
      lastActivity: new Date().toISOString(),
      tcrHistory: []
    };
    
    this.agents.push(agent);
    return agent;
  }

  getAllAgents() {
    return this.agents;
  }

  getAgentById(id) {
    return this.agents.find(agent => agent.id === id);
  }

  updateAgentStatus(id, status) {
    const agent = this.getAgentById(id);
    if (!agent) return null;
    
    agent.status = status;
    agent.lastActivity = new Date().toISOString();
    return agent;
  }

  recordTcrActivity(id, activity) {
    const agent = this.getAgentById(id);
    if (!agent) return null;
    
    agent.tcrHistory.push({
      ...activity,
      timestamp: new Date().toISOString()
    });
    
    return agent;
  }
}
