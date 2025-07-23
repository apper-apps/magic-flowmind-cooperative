import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ModelSelector from "@/components/molecules/ModelSelector";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import conversationService from "@/services/api/conversationService";
import { toast } from "react-toastify";

const ChatInterface = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-3.5-turbo");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await conversationService.getAll();
      setConversations(data);
      if (data.length > 0) {
        setActiveConversation(data[0]);
        setMessages(data[0].messages || []);
      }
    } catch (err) {
      setError("Failed to load conversations");
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const createNewConversation = async () => {
    try {
      const newConversation = {
        title: "New Conversation",
        model: selectedModel,
        messages: []
      };
      
      const created = await conversationService.create(newConversation);
      setConversations(prev => [created, ...prev]);
      setActiveConversation(created);
      setMessages([]);
      toast.success("New conversation started");
    } catch (err) {
      toast.error("Failed to create new conversation");
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || sending) return;

    try {
      setSending(true);
      
      const userMessage = {
        Id: Date.now(),
        role: "user",
        content: inputMessage,
        timestamp: new Date().toISOString()
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInputMessage("");

      // Simulate AI response
      setTimeout(async () => {
        const aiMessage = {
          Id: Date.now() + 1,
          role: "assistant",
          content: `I understand you're asking about: "${inputMessage}". This is a simulated AI response. In a real implementation, this would connect to your chosen AI model (${selectedModel}) to provide intelligent responses.`,
          timestamp: new Date().toISOString()
        };

        const updatedMessages = [...newMessages, aiMessage];
        setMessages(updatedMessages);

        // Update conversation
        if (activeConversation) {
          const updatedConversation = {
            ...activeConversation,
            messages: updatedMessages,
            updatedAt: new Date().toISOString()
          };
          
          await conversationService.update(activeConversation.Id, updatedConversation);
          setActiveConversation(updatedConversation);
          
          setConversations(prev => 
            prev.map(conv => 
              conv.Id === activeConversation.Id ? updatedConversation : conv
            )
          );
        }
        
        setSending(false);
      }, 2000);

    } catch (err) {
      toast.error("Failed to send message");
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) return <Loading variant="chat" />;
  if (error) return <Error message={error} onRetry={loadConversations} />;

  return (
    <div className="flex h-full">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r border-slate-800 bg-slate-900/50">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Conversations</h2>
            <Button size="sm" onClick={createNewConversation}>
              <ApperIcon name="Plus" size={16} />
            </Button>
          </div>
          <ModelSelector 
            value={selectedModel} 
            onChange={setSelectedModel}
          />
        </div>

        <div className="p-4 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
          {conversations.length === 0 ? (
            <Empty 
              variant="chat"
              actionLabel="Start Chat"
              onAction={createNewConversation}
            />
          ) : (
            conversations.map((conversation) => (
              <motion.div
                key={conversation.Id}
                whileHover={{ scale: 1.02 }}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  activeConversation?.Id === conversation.Id
                    ? "bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30"
                    : "hover:bg-slate-800/50"
                }`}
                onClick={() => {
                  setActiveConversation(conversation);
                  setMessages(conversation.messages || []);
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                    <ApperIcon name="MessageSquare" size={14} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {conversation.title}
                    </div>
                    <div className="text-xs text-slate-400">
                      {conversation.messages?.length || 0} messages • {conversation.model}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <Empty 
                  variant="chat"
                  actionLabel="Send Message"
                  onAction={() => document.getElementById("message-input")?.focus()}
                />
              ) : (
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex space-x-3 ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                          <ApperIcon name="Bot" size={16} className="text-white" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-2xl px-4 py-3 rounded-2xl ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
                            : "glass text-slate-200"
                        }`}
                      >
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </div>
                        <div className="text-xs opacity-70 mt-2">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>

                      {message.role === "user" && (
                        <div className="w-8 h-8 bg-gradient-to-r from-accent-500 to-emerald-500 rounded-full flex items-center justify-center">
                          <ApperIcon name="User" size={16} className="text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
              
              {sending && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex space-x-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <ApperIcon name="Bot" size={16} className="text-white" />
                  </div>
                  <div className="glass px-4 py-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-800 p-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input
                    id="message-input"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Message ${activeConversation.model}...`}
                    className="text-base"
                    disabled={sending}
                  />
                </div>
                <Button 
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || sending}
                  className="px-6"
                >
                  {sending ? (
                    <ApperIcon name="Loader" size={18} className="animate-spin" />
                  ) : (
                    <ApperIcon name="Send" size={18} />
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Empty 
              variant="chat"
              actionLabel="Start New Chat"
              onAction={createNewConversation}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;