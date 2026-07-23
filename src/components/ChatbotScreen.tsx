import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  RotateCcw, 
  Info, 
  Loader2,
  ShieldCheck
} from 'lucide-react';
import Markdown from 'react-markdown';
import { ChatMessage } from '../types';

interface ChatbotScreenProps {
  initialPrompt?: string;
}

export const ChatbotScreen: React.FC<ChatbotScreenProps> = ({ initialPrompt }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `### Welcome to ECG Mentor AI 🩺

I am **Dr. ECG Mentor**, your AI Cardiology & Electrophysiology fellow.

Feel free to ask me anything about ECG interpretation, such as:
- Differentiating complex tachycardias (e.g., VT vs. SVT with aberrancy)
- Memorizing lead placement and anatomical wall groupings
- Applying Sgarbossa or Wellens criteria in the emergency department
- Walking through a step-by-step clinical scenario

How can I assist your cardiology studies or rounds today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState(initialPrompt || '');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "Explain AFib vs. A-Flutter",
    "What causes peaked T waves?",
    "How to calculate cardiac axis?",
    "Sgarbossa criteria for STEMI with LBBB",
    "Differentiating VT from SVT with aberrancy",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim().length > 0) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      if (data.success && data.reply) {
        const assistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        text: "I encountered a transient connection issue. Please feel free to resend your question!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg-1',
        sender: 'assistant',
        text: `### Welcome back! 🩺
        
Ask any clinical ECG question or select a quick topic below.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-fadeIn">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-700">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-slate-900">Dr. ECG Mentor Chatbot</h1>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-xs text-slate-500">Interactive Clinical AI Tutor • Gemini 3.6 Flash</p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200 text-xs flex items-center space-x-1.5"
          title="Reset Chat History"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-slate-500 shrink-0 flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Quick Prompts:</span>
        </span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold whitespace-nowrap transition shadow-xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Main Chat Box Window */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 flex flex-col justify-between min-h-[520px] max-h-[680px] shadow-sm">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-teal-500 text-slate-950 shadow-xs'
                      : 'bg-slate-100 text-teal-800 border border-slate-200'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs space-y-1 shadow-xs ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-none font-sans'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none font-sans'
                  }`}
                >
                  <div className={`flex items-center justify-between text-[10px] pb-1 border-b mb-2 ${
                    isUser ? 'border-slate-800 opacity-80' : 'border-slate-200 text-slate-500'
                  }`}>
                    <span className="font-bold">{isUser ? 'You' : 'Dr. ECG Mentor'}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {isUser ? (
                    <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.text}</p>
                  ) : (
                    <div className="prose prose-xs max-w-none leading-relaxed space-y-2 text-slate-800">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-teal-700 border border-slate-200 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl rounded-tl-none text-xs text-teal-800 font-semibold flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                <span>Dr. ECG Mentor is reviewing clinical literature and formulating response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Dr. ECG Mentor any clinical question (e.g., 'Explain Brugada type 1 vs type 2')..."
              className="flex-1 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:border-teal-500 outline-none transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className={`p-3.5 rounded-xl font-bold transition flex items-center justify-center ${
                input.trim() && !loading
                  ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-xs'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Medical Disclaimer Footer */}
          <div className="flex items-center justify-center space-x-1.5 text-[10px] text-slate-400">
            <ShieldCheck className="w-3 h-3 text-teal-600" />
            <span>
              ECG Mentor AI is designed for medical training and educational purposes only. Always verify clinical decisions with attending physicians.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
