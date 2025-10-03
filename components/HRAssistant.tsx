import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, Role } from '../types';
import { createHRAssistantChat } from '../services/geminiService';
import { Chat, GenerateContentResponse } from '@google/genai';

interface HRAssistantProps {
    userRole: Role;
}

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.role === 'user';
    return (
        <div className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : ''}`}>
            {!isUser && (
                 <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                    <span>AI</span>
                </div>
            )}
            <div className={`max-w-xl p-4 rounded-xl shadow-md ${isUser ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
            </div>
        </div>
    );
};


const HRAssistant: React.FC<HRAssistantProps> = ({ userRole }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: "Hello! I am your AI-powered HR Assistant for Global Trust Bank. How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        chatRef.current = createHRAssistantChat(userRole);
    }, [userRole]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const modelResponse: ChatMessage = { role: 'model', text: '' };
        setMessages(prev => [...prev, modelResponse]);

        try {
            if (chatRef.current) {
                const stream = await chatRef.current.sendMessageStream({ message: input });

                for await (const chunk of stream) {
                    const chunkText = chunk.text;
                    setMessages(prev => prev.map((msg, index) => {
                        if (index === prev.length - 1) {
                            return { ...msg, text: msg.text + chunkText };
                        }
                        return msg;
                    }));
                }
            }
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: ChatMessage = { role: 'model', text: "Sorry, I encountered an error. Please try again." };
            setMessages(prev => [...prev.slice(0, -2), userMessage, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading]);

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto">
            <div className="text-center mb-6">
                 <h1 className="text-3xl font-bold text-gray-900">HR Assistant</h1>
                 <p className="text-gray-600 mt-1">Your trusted partner for HR inquiries.</p>
            </div>
           
            <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-inner p-6 mb-4">
                {messages.map((msg, index) => <ChatBubble key={index} message={msg} />)}
                {isLoading && messages[messages.length-1].role === 'model' && (
                    <div className="flex items-start gap-3 my-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                            <span>AI</span>
                        </div>
                        <div className="max-w-xl p-4 rounded-xl shadow-md bg-white text-gray-800 flex items-center space-x-2">
                             <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                             <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                             <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex items-center bg-white p-3 rounded-lg shadow-md">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about leave policy, benefits, etc."
                    className="flex-1 w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading} className="ml-3 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-colors duration-200">
                    {isLoading ? 'Sending...' : 'Send'}
                </button>
            </form>
        </div>
    );
};

export default HRAssistant;