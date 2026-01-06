import React, { useState, useRef, useEffect } from 'react';
import { X, MessageCircle, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '@/services/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm DairyMart Assistant 🐄, your Dairy Mart helper. I can assist you with:\n• Product information\n• Delivery questions\n• Order assistance\n• Fresh dairy guarantee\n• And much more!\n\nHow can I help you today? 🥛",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 300);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    
    // Add user message
    const userMsg = {
      id: messages.length + 1,
      text: userMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await apiService.chatbotQuery(userMessage);
      
      const botMsg = {
        id: messages.length + 2,
        text: response.response || "I apologize, but I'm having trouble processing your request.",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Chatbot error:', error);
      
      const errorMsg = {
        id: messages.length + 2,
        text: "I apologize, but I'm having trouble connecting. Please try again or contact our support team at support@dairydrop.com.",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "What are your delivery hours?",
    "Do you have organic milk?",
    "What's your freshness guarantee?",
    "How do I track my order?",
    "What payment methods do you accept?",
    "Do you deliver to apartments?"
  ];

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSuggestedQuestion = (question) => {
    setInputText(question);
    if (!isOpen) setIsOpen(true);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={toggleChat}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 transition-all duration-300 group"
        >
          <MessageCircle className="h-6 w-6" />
          {!isOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2"
            >
              <div className="h-6 w-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
            </motion.div>
          )}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] z-50"
          >
            <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-b from-white to-gray-50 h-full flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-white/20">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">DairyAI Assistant</h3>
                      <p className="text-xs opacity-90">Online • Ready to help</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleChat}
                    className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-3 ${msg.sender === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-br-none'
                            : 'bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200 rounded-bl-none'
                          }`}
                      >
                        <div className="flex items-start gap-2">
                          {msg.sender === 'bot' && (
                            <div className="p-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shrink-0 mt-1">
                              <Bot className="h-3 w-3 text-white" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          {msg.sender === 'user' && (
                            <div className="p-1 rounded-full bg-white/20 shrink-0 mt-1">
                              <User className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-2xl p-3 bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200 rounded-bl-none">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
                            <Bot className="h-3 w-3 text-white" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                            <span className="text-sm">DairyAI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Suggested Questions */}
                {messages.length <= 2 && (
                  <div className="px-4 pb-3">
                    <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedQuestions.map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs h-8 px-3 rounded-full border-blue-200 hover:bg-blue-50 hover:text-blue-600 transition-all whitespace-nowrap"
                          onClick={() => handleSuggestedQuestion(question)}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about dairy products, delivery, or anything..."
                    className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isLoading}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Ask about products, delivery, or anything else!
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;