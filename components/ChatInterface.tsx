import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, LoadingState } from '../types';
import { generateAnswer } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';
import SourceList from './SourceList';
import { Send,  Loader2, Bot, User,  Mic, MicOff, Trash2, HelpCircle, Sparkles } from 'lucide-react';

const LOADING_MESSAGES = [
  "Analyzing your code structure...",
  "Searching for best practices...",
  "Generating optimal solution...",
  "Refining the explanation...",
];

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const savedMessages = localStorage.getItem('codebuddy_chat_history');
      return savedMessages ? JSON.parse(savedMessages) : [];
    } catch (error) {
      return [];
    }
  });
  const [inputValue, setInputValue] = useState('');
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loadingState, loadingStep]); 

  useEffect(() => {
    localStorage.setItem('codebuddy_chat_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    let interval: any;
    if (loadingState === LoadingState.LOADING) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loadingState]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loadingState === LoadingState.LOADING) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoadingState(LoadingState.LOADING);

    if (inputRef.current) {
        inputRef.current.style.height = 'auto';
    }

    try {
      const response = await generateAnswer(userMessage.content);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response.text,
        sources: response.sources,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setLoadingState(LoadingState.IDLE);
    } catch (error: any) {
      console.error(error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: error.message || "I'm having trouble connecting right now.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setLoadingState(LoadingState.ERROR);
    }
  };

  const handleClearChat = () => {
    if (messages.length === 0) return;
    if (window.confirm("Start a new conversation?")) {
      setMessages([]);
      setLoadingState(LoadingState.IDLE);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(e.target.value);
      e.target.style.height = 'auto';
      e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  const toggleListening = async () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Voice input isn't supported in this browser.");
      return;
    }

    try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
        alert("Please allow microphone access to use voice input.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue((prev) => {
          const newValue = prev ? `${prev} ${transcript}` : transcript;
           setTimeout(() => {
              if(inputRef.current) {
                 inputRef.current.style.height = 'auto';
                 inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
              }
           }, 0);
           return newValue;
      });
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div className="flex flex-col h-full w-full relative bg-slate-50">
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 animate-[fadeIn_0.5s_ease-out_forwards]">
            <div className="w-16 h-16 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-6 ring-4 ring-brand-50">
              <Sparkles className="w-8 h-8 text-brand-500" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">How can I help you code?</h2>
            <p className="text-slate-500 max-w-lg mb-10 text-lg">
              Ask me to debug errors, explain concepts, or write code snippets.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
              {[
                { title: "Debug React", query: "Why is my useEffect running twice?" },
                { title: "Python Help", query: "Write a script to scrape a website" },
                { title: "CSS Tricks", query: "How do I center a div using Grid?" },
                { title: "Database", query: "Explain SQL JOIN types with examples" }
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                      setInputValue(item.query);
                      setTimeout(() => inputRef.current?.focus(), 0);
                  }}
                  className="text-left px-5 py-4 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-white bg-slate-50/50 text-slate-600 transition-all group"
                >
                  <div className="font-semibold text-slate-800 mb-1 group-hover:text-brand-600 transition-colors flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-brand-400" />
                    {item.title}
                  </div>
                  <div className="text-sm text-slate-400 truncate">{item.query}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8 max-w-4xl mx-auto pb-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-[slideIn_0.2s_ease-out]`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${
                  msg.role === 'user' ? 'bg-brand-600' : 'bg-white border border-slate-200'
                }`}>
                  {msg.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-brand-600" />
                  )}
                </div>
                
                <div className={`flex flex-col max-w-[90%] md:max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {msg.role === 'user' ? (
                      <div className="bg-brand-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm shadow-md">
                         <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      </div>
                  ) : (
                      <div className="bg-white border border-slate-200 text-slate-800 px-6 py-5 rounded-2xl rounded-tl-sm w-full shadow-sm">
                         <MarkdownRenderer content={msg.content} />
                         {msg.sources && msg.sources.length > 0 && <SourceList sources={msg.sources} />}
                      </div>
                  )}
                </div>
              </div>
            ))}
            
            {loadingState === LoadingState.LOADING && (
              <div className="flex gap-4 max-w-4xl mx-auto">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                   <Bot className="w-5 h-5 text-brand-600" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-6 py-4 shadow-sm flex items-center gap-4">
                   <Loader2 className="w-5 h-5 text-brand-500 animate-spin" />
                   <div className="flex flex-col">
                       <span className="text-sm font-medium text-slate-700 animate-pulse">{LOADING_MESSAGES[loadingStep]}</span>
                       <span className="text-xs text-slate-400 mt-0.5">Powered by Gemini 3 Pro</span>
                   </div>
                </div>
              </div>
            )}
            
             {loadingState === LoadingState.ERROR && (
              <div className="flex justify-center my-4">
                 <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-100 shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    {messages[messages.length - 1].content}
                 </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="relative max-w-4xl mx-auto">
             {messages.length > 0 && (
                <div className="absolute -top-12 right-0">
                    <button 
                        onClick={handleClearChat}
                        className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear Chat
                    </button>
                </div>
             )}
          
          <div className="relative shadow-sm rounded-xl bg-slate-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:shadow-lg transition-all duration-300 border border-slate-200">
              <textarea
                ref={inputRef}
                rows={1}
                value={inputValue}
                onChange={handleInputResize}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about programming..."
                className="w-full bg-transparent text-slate-800 placeholder-slate-400 rounded-xl pl-4 pr-24 py-4 focus:outline-none resize-none max-h-[200px]"
                style={{ minHeight: '56px' }}
              />
              <div className="absolute right-2 bottom-2.5 flex gap-1">
                <button
                  onClick={toggleListening}
                  className={`p-2 rounded-lg transition-all ${
                    isListening 
                      ? 'bg-red-50 text-red-500 animate-pulse' 
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Voice Input"
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || loadingState === LoadingState.LOADING}
                  className={`p-2 rounded-lg transition-all ${
                    inputValue.trim() && loadingState !== LoadingState.LOADING
                      ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-md'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {loadingState === LoadingState.LOADING ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-2">
            AI can make mistakes. Please review generated code before using in production.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;