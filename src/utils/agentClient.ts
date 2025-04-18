import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Client for AI agents to connect to the TCR MCP server
 */
export class AgentClient {
  public socket: Socket;
  private serverUrl: string;
  private agent: { id?: string; name: string; type: string; };
  
  constructor(serverUrl = 'http://localhost:3000', name = 'Neo', type = 'ai') {
    this.serverUrl = serverUrl;
    this.agent = { name, type };
    this.socket = io(serverUrl);
    
    this.setupEventHandlers();
  }
  
  /**
   * Connect to the MCP server
   */
  async connect(): Promise<boolean> {
    try {
      // Register with the server
      const response = await axios.post(`${this.serverUrl}/api/agents`, this.agent);
      
      if (response.data.success) {
        this.agent.id = response.data.agent?.id;
        console.log(`Connected to the Matrix as ${this.agent.name}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to connect to the Matrix:', error);
      return false;
    }
  }
  
  /**
   * Run a TCR process
   */
  async runTcr(verb: string, description: string): Promise<boolean> {
    try {
      // Notify MCP that we're starting TCR
      this.socket.emit('tcr:start', {
        agent: this.agent.name,
        verb,
        description
      });
      
      console.log(`Running TCR: ${verb}:${description}`);
      
      // Run the actual TCR command
      try {
        await execAsync(`npm run tcr ${verb}:${description}`);
        // If we get here, TCR passed
        this.socket.emit('tcr:result', {
          agent: this.agent.name,
          success: true,
          verb,
          description
        });
        return true;
      } catch (error) {
        // TCR failed
        this.socket.emit('tcr:result', {
          agent: this.agent.name,
          success: false,
          verb,
          description,
          error: error.message
        });
        return false;
      }
    } catch (error) {
      console.error('Error during TCR process:', error);
      return false;
    }
  }
  
  /**
   * Disconnect from the MCP server
   */
  disconnect(): void {
    this.socket.disconnect();
    console.log('Disconnected from the Matrix');
  }
  
  private setupEventHandlers(): void {
    this.socket.on('connect', () => {
      console.log('Connected to the Matrix. The Matrix has you...');
    });
    
    this.socket.on('disconnect', () => {
      console.log('Disconnected from the Matrix');
    });
    
    // Handle custom events from the server
    this.socket.on('control:reset', () => {
      console.log('Reset command received from the Architect');
      // Handle reset logic here
    });
  }
}
