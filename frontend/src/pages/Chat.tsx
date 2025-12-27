import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Chat = () => {
  const { isAuthenticated } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Welcome to NightChill chat. I'm here to help you find support, gyms, mentors, or just talk through your next step. No pressure, no rush. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const suggestions = [
    'Show me nearby gyms',
    'Find coffee support',
    'Connect with a mentor',
    "I'm feeling anxious",
  ];

  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate API response
    setTimeout(() => {
      const responses: Record<string, string> = {
        gym: "That's completely normal to feel nervous about going to a gym. Would you like me to show you anxiety-friendly gyms near you? They're beginner-safe and have staff trained to support first-timers.",
        coffee: "Coffee support spots are wonderful for a gentle first step. Let me find some calm cafés near you where you can get a free coffee, no questions asked.",
        mentor: "Connecting with someone who understands can be really helpful. Would you like me to show you mentors in your area?",
        anxious: "It's okay to feel anxious. Many people share this feeling. Would you like to start with something small, like getting a coffee at a supportive café?",
        default: "I'm here to help you find your path. What would you like to explore? We have coffee support spots, anxiety-friendly gyms, mentors, and nutrition guidance.",
      };

      let responseText = responses.default;
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('gym')) responseText = responses.gym;
      else if (lowerMessage.includes('coffee')) responseText = responses.coffee;
      else if (lowerMessage.includes('mentor')) responseText = responses.mentor;
      else if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety')) responseText = responses.anxious;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="animate-fade-in h-[calc(100vh-280px)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Chat Support
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Calm guidance for your wellness journey
        </p>
      </div>

      {/* Messages */}
      <div 
        className="flex-1 overflow-y-auto mb-4 p-4 rounded-xl"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-xl ${
                message.role === 'user' ? '' : 'neon-glow'
              }`}
              style={{
                backgroundColor:
                  message.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: message.role === 'user' ? 'white' : 'var(--text-primary)',
              }}
            >
              <p>{message.content}</p>
              <p 
                className="text-xs mt-2 opacity-70"
                style={{ color: message.role === 'user' ? 'white' : 'var(--text-tertiary)' }}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div 
              className="p-4 rounded-xl animate-pulse"
              style={{ backgroundColor: 'var(--bg-tertiary)' }}
            >
              <span style={{ color: 'var(--text-tertiary)' }}>Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => handleSend(suggestion)}
            className="px-3 py-2 rounded-full text-sm transition-all hover:opacity-80"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--bg-tertiary)',
            }}
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
          placeholder="Type your message..."
          className="input flex-1"
          disabled={isLoading}
        />
        <button
          onClick={() => handleSend(input)}
          disabled={isLoading || !input.trim()}
          className="btn-primary px-6"
          style={{ opacity: isLoading || !input.trim() ? 0.5 : 1 }}
        >
          Send
        </button>
      </div>

      <p className="text-xs text-center mt-4" style={{ color: 'var(--text-tertiary)' }}>
        This is a guidance bot, not a replacement for professional therapy or crisis support.
      </p>
    </div>
  );
};

export default Chat;
