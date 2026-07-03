import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, AlertCircle, Link as LinkIcon, RefreshCw } from "lucide-react";
import { ChatMessage } from "../types";
import { motion, AnimatePresence } from "motion/react";

// Simple markdown formatter to display bullets, bolding and links safely
const formatResponseText = (text: string) => {
  if (!text) return "";
  
  // Format bold
  let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold text-slate-800'>$1</strong>");
  
  // Format bullet items
  formatted = formatted.replace(/^\*\s(.*)$/gm, "<li class='list-disc ml-4 my-1 text-slate-600'>$1</li>");
  
  // Format numbered lists if any
  formatted = formatted.replace(/^\d\.\s(.*)$/gm, "<li class='list-decimal ml-4 my-1 text-slate-600'>$1</li>");
  
  // Parse simple markdown links [title](url)
  formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2' target='_blank' rel='noopener noreferrer' class='text-amber-600 font-semibold hover:underline inline-flex items-center'>$1 <span class='text-[10px] ml-0.5'>↗</span></a>");

  // Format line breaks
  formatted = formatted.replace(/\n/g, "<br />");
  
  return formatted;
};

export const SrivariAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Namaste! I am your **Srivari TTD Darshan Assistant**. Ask me anything about TTD ticket releases, traditional dress codes, pedestrian footpaths, luggage lockers, senior-citizen benefits, or accommodation guidelines. I have Google Search enabled to give you up-to-date dates and rules! How can I help you plan your pilgrimage today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickChips = [
    "What is the traditional dress code?",
    "Can I carry my mobile phone?",
    "Senior citizen special darshan rules?",
    "How to book ₹300 tickets?"
  ];

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      content: text,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Package payload history
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/darshan-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: historyPayload })
      });

      if (!res.ok) throw new Error("Failed to get response");
      const data = await res.json();

      const botMessage: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        content: data.text,
        timestamp: new Date(),
        sources: data.sources || []
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        content: "I apologize, but I encountered a connection issue while communicating with my Srivari server. Please try asking again in a few moments.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-150 shadow-xs flex flex-col h-[550px] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-5 py-4 flex items-center justify-between text-white shadow-xs">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-amber-500/20 rounded-lg">
            <Sparkles className="h-5 w-5 text-amber-200 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wide">Srivari AI Darshan Assistant</h3>
            <p className="text-[10px] text-amber-100 flex items-center mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-ping"></span>
              Live Google Search Grounding Enabled
            </p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([messages[0]])}
          title="Reset chat"
          className="text-amber-100 hover:text-white p-1 hover:bg-amber-600/50 rounded transition-all"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-xs leading-relaxed ${
                  m.role === "user"
                    ? "bg-slate-900 text-white rounded-tr-none"
                    : "bg-white text-slate-800 border border-slate-150 rounded-tl-none"
                }`}
              >
                {/* Message Content formatted safely */}
                <div 
                  className="prose prose-sm max-w-none text-xs break-words"
                  dangerouslySetInnerHTML={{ __html: formatResponseText(m.content) }}
                />

                {/* Grounding Citations */}
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-100 flex flex-col space-y-1">
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center uppercase tracking-wider">
                      <LinkIcon className="h-3 w-3 mr-1 text-slate-400" />
                      Verified Web Sources:
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {m.sources.map((s, idx) => (
                        <a
                          key={idx}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded border border-slate-200 inline-flex items-center max-w-[150px] truncate transition-all"
                        >
                          {s.title || "Official Guideline"}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Timestamp */}
                <div className="text-[9px] text-slate-400 text-right mt-1.5 font-mono">
                  {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-slate-800 border border-slate-150 rounded-2xl rounded-tl-none p-3.5 shadow-xs max-w-[80%] flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Srivari Assistant is searching live TTD records...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Chips */}
      {messages.length === 1 && (
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-1.5">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="text-[10px] font-medium bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/50 rounded-full px-2.5 py-1 transition-all"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
          placeholder="Ask Srivari Assistant about guidelines or releases..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-slate-800 placeholder-slate-400"
          disabled={isLoading}
        />
        <button
          onClick={() => handleSend(input)}
          disabled={isLoading || !input.trim()}
          className="bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 text-white p-2 rounded-lg transition-all shadow-xs flex items-center justify-center"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
