import { AgentManager } from '../agentManager';

describe('AgentManager', () => {
  let agentManager;

  beforeEach(() => {
    agentManager = new AgentManager();
  });

  test('should register a new agent', () => {
    const agent = agentManager.registerAgent('TestBot', 'ai');
    
    expect(agent).toBeDefined();
    expect(agent.name).toBe('TestBot');
    expect(agent.type).toBe('ai');
    expect(agent.status).toBe('idle');
  });

  test('should get all agents', () => {
    agentManager.registerAgent('Bot1', 'ai');
    agentManager.registerAgent('Bot2', 'ml');
    
    const agents = agentManager.getAllAgents();
    
    expect(agents.length).toBe(2);
    expect(agents[0].name).toBe('Bot1');
    expect(agents[1].name).toBe('Bot2');
  });

  test('should update agent status', () => {
    const agent = agentManager.registerAgent('StatusBot', 'ai');
    const updatedAgent = agentManager.updateAgentStatus(agent.id, 'running');
    
    expect(updatedAgent.status).toBe('running');
  });

  test('should record TCR activity', () => {
    const agent = agentManager.registerAgent('TcrBot', 'ai');
    const activity = {
      verb: 'add',
      description: 'new feature',
      success: true
    };
    
    const updatedAgent = agentManager.recordTcrActivity(agent.id, activity);
    
    expect(updatedAgent.tcrHistory.length).toBe(1);
    expect(updatedAgent.tcrHistory[0].verb).toBe('add');
    expect(updatedAgent.tcrHistory[0].success).toBe(true);
  });
});
