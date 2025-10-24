import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function AIAssistant() {
  const { chatMessages, sendMessage } = useApp();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    setSending(true);
    await sendMessage(input.trim());
    setInput('');
    setSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    'What maintenance is needed?',
    'Show me production metrics',
    'How can we improve energy efficiency?',
    'Generate sustainability report',
    'What optimizations are available?'
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">AI Orchestrator</h1>
        <p className="text-gray-600 mt-1">Your intelligent factory assistant powered by AI</p>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {chatMessages.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Bot className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to SmartOrchestrator AI</h2>
              <p className="text-gray-600 mb-6">I can help you with maintenance, production optimization, and sustainability tracking.</p>
              <div className="max-w-2xl mx-auto">
                <p className="text-sm text-gray-500 mb-3">Try asking:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(question)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {chatMessages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your factory operations..."
              disabled={sending}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: any }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-blue-600' : 'bg-gray-200'
      }`}>
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-gray-700" />
        )}
      </div>
      <div className={`flex-1 max-w-2xl ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block px-4 py-3 rounded-lg ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}>
          <p className="whitespace-pre-wrap">{message.message}</p>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(message.created_at).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
