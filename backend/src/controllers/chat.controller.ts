import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Chat history storage (replace with database)
const chatHistory: Map<string, any[]> = new Map();

// Supportive responses for the wellness chatbot
const responses: Record<string, string[]> = {
  gym: [
    "That's completely normal to feel nervous about going to a gym. Would you like me to show you anxiety-friendly gyms near you? They're beginner-safe and have staff trained to support first-timers.",
    "Finding the right gym can make all the difference. Let's look for places with quiet hours and beginner-friendly environments.",
  ],
  anxiety: [
    "It's okay to feel anxious. Many people share this feeling. Would you like to start with something small, like getting a coffee at a supportive café?",
    "Taking small steps is perfectly fine. What matters is that you're here, thinking about your wellbeing.",
  ],
  start: [
    "Starting is the hardest part, and you're already here. How about we find a coffee spot nearby? Sometimes a small step is the perfect first step.",
    "You don't need to have it all figured out. Would you like to explore some gentle first steps together?",
  ],
  mentor: [
    "Connecting with someone who understands can be really helpful. Would you like me to show you mentors in your area who specialize in supporting people on their wellness journey?",
    "Mentors can provide guidance without pressure. Let me find some people who can help.",
  ],
  default: [
    "I'm here to help you find your path. What would you like to explore? We have coffee support spots, anxiety-friendly gyms, mentors, and nutrition guidance.",
    "No pressure, no rush. I'm here whenever you need guidance. Would you like to see what's available near you?",
  ],
};

export class ChatController {
  /**
   * Send a message to the chat bot
   */
  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { message } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Message is required' } });
        return;
      }

      // Get or create chat history
      if (!chatHistory.has(userId!)) {
        chatHistory.set(userId!, []);
      }
      const history = chatHistory.get(userId!)!;

      // Store user message
      const userMessage = {
        id: uuidv4(),
        role: 'user',
        content: message,
        createdAt: new Date().toISOString(),
      };
      history.push(userMessage);

      // Generate response based on keywords
      const response = this.generateResponse(message.toLowerCase());

      // Store assistant message
      const assistantMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: response.text,
        createdAt: new Date().toISOString(),
      };
      history.push(assistantMessage);

      chatHistory.set(userId!, history);

      res.status(200).json({
        response: response.text,
        suggestions: response.suggestions,
        resources: response.resources,
      });
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to process message' } });
    }
  }

  /**
   * Get chat history
   */
  async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { limit = '50' } = req.query;

      const history = chatHistory.get(userId!) || [];
      const limitNum = parseInt(limit as string);

      res.status(200).json({
        messages: history.slice(-limitNum),
      });
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to get chat history' } });
    }
  }

  /**
   * Clear chat history
   */
  async clearHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      chatHistory.delete(userId!);

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to clear chat history' } });
    }
  }

  private generateResponse(message: string): { text: string; suggestions: string[]; resources: any[] } {
    let category = 'default';
    
    if (message.includes('gym') || message.includes('exercise') || message.includes('workout')) {
      category = 'gym';
    } else if (message.includes('anxious') || message.includes('anxiety') || message.includes('nervous') || message.includes('scared')) {
      category = 'anxiety';
    } else if (message.includes('start') || message.includes('begin') || message.includes('first') || message.includes("don't know")) {
      category = 'start';
    } else if (message.includes('mentor') || message.includes('help') || message.includes('talk') || message.includes('someone')) {
      category = 'mentor';
    }

    const categoryResponses = responses[category];
    const text = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];

    const suggestions = [
      'Show me nearby gyms',
      'Find coffee support',
      'Connect with a mentor',
      'Tell me about the journey levels',
    ];

    return {
      text,
      suggestions,
      resources: [],
    };
  }
}
