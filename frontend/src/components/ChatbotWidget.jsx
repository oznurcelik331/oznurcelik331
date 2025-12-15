import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      text: 'Merhaba! Kozsağ Group İnşaat\'a hoş geldiniz. Size nasıl yardımcı olabilirim?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/chat`, {
        message: input,
        session_id: sessionId,
      });

      if (!sessionId) {
        setSessionId(response.data.session_id);
      }

      const assistantMessage = { type: 'assistant', text: response.data.response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chatbot-widget" data-testid="chatbot-widget">
      {isOpen && (
        <div className="chatbot-window" data-testid="chatbot-window">
          <div className="bg-primary text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle size={22} strokeWidth={1.5} />
              <span className="font-sans text-sm uppercase tracking-widest font-medium">KOZSAĞ Concierge</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:opacity-80 transition-hover"
              data-testid="close-chat-button"
            >
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="chat-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                data-testid={`chat-message-${message.type}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded ${
                    message.type === 'user'
                      ? 'bg-accent text-white'
                      : 'bg-secondary text-primary'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start" data-testid="chat-loading">
                <div className="bg-secondary text-primary p-3 rounded">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t" data-testid="chat-input-container">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Mesajınızı yazın..."
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-accent"
                data-testid="chat-input"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="btn-accent px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="send-message-button"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chatbot-button"
        data-testid="open-chat-button"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

export default ChatbotWidget;