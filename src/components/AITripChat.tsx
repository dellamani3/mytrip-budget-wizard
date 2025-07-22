import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  dayModified?: number;
}

interface AITripChatProps {
  tripData: any;
  onItineraryUpdate: (updatedActivities: any[], dayNumber: number) => void;
  className?: string;
}

export const AITripChat: React.FC<AITripChatProps> = ({ 
  tripData, 
  onItineraryUpdate, 
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm your AI trip assistant. I can help you customize your daily itinerary. For example, you can say: 'Make day 2 more cultural' or 'Add more outdoor activities to day 3' or 'Replace shopping in day 1 with food experiences'.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/trips/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          message: inputValue,
          tripData: tripData,
          conversationHistory: messages.slice(-5) // Send last 5 messages for context
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response,
        timestamp: new Date(),
        dayModified: data.dayModified
      };

      setMessages(prev => [...prev, aiMessage]);

      // If the AI modified a day, update the itinerary
      if (data.dayModified && data.updatedActivities) {
        onItineraryUpdate(data.updatedActivities, data.dayModified);
      }

    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again or rephrase your request.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const exampleQuestions = [
    "Make day 2 more cultural",
    "Add food experiences to day 1",
    "Replace shopping with nature activities",
    "Make day 3 more adventurous"
  ];

  return (
    <div className={`${className}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full mb-4">
            <Sparkles className="mr-2 h-4 w-4" />
            AI Trip Customizer
            <MessageCircle className="ml-2 h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <Card className="w-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Bot className="mr-2 h-5 w-5 text-blue-600" />
                AI Trip Assistant
              </CardTitle>
              <CardDescription>
                Chat with AI to customize your daily activities based on your interests
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Example Questions */}
              <div className="flex flex-wrap gap-2">
                {exampleQuestions.map((question, index) => (
                  <Badge 
                    key={index}
                    variant="secondary" 
                    className="cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => setInputValue(question)}
                  >
                    {question}
                  </Badge>
                ))}
              </div>

              {/* Messages */}
              <ScrollArea className="h-80 w-full pr-4" ref={scrollAreaRef}>
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`flex max-w-[80%] ${
                          message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                        } items-start space-x-2`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.type === 'user'
                              ? 'bg-blue-600 text-white ml-2'
                              : 'bg-gray-200 text-gray-700 mr-2'
                          }`}
                        >
                          {message.type === 'user' ? (
                            <User size={16} />
                          ) : (
                            <Bot size={16} />
                          )}
                        </div>
                        <div
                          className={`px-3 py-2 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          {message.dayModified && (
                            <Badge className="mt-1 text-xs" variant="secondary">
                              Modified Day {message.dayModified}
                            </Badge>
                          )}
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <RefreshCw size={16} className="animate-spin" />
                        </div>
                        <div className="px-3 py-2 rounded-lg bg-gray-100">
                          <p className="text-sm text-gray-600">AI is thinking...</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me to modify your itinerary... (e.g., 'Make day 2 more cultural')"
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!inputValue.trim() || isLoading}
                  size="icon"
                >
                  <Send size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}; 