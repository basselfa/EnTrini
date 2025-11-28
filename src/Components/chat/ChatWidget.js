import React, { useState, useEffect, useRef } from "react";
import { base44 } from "../../api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { MessageCircle, X, Send, User, Loader2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "../../Layout";

const translations = {
  en: {
    helpCenter: "Help Center",
    askQuestion: "Ask us anything...",
    send: "Send",
    connectingToAI: "AI Assistant",
    talkToHuman: "Talk to a Human",
    humanRequested: "Requesting human support...",
    adminJoined: "Admin joined the chat",
    typing: "typing...",
    closed: "Chat closed",
    startNewChat: "Start New Chat",
    aiHelper: "AI Assistant",
    admin: "Admin",
  },
  fr: {
    helpCenter: "Centre d'Aide",
    askQuestion: "Posez votre question...",
    send: "Envoyer",
    connectingToAI: "Assistant IA",
    talkToHuman: "Parler à un Humain",
    humanRequested: "Demande d'assistance humaine...",
    adminJoined: "Un admin a rejoint le chat",
    typing: "en train d'écrire...",
    closed: "Chat fermé",
    startNewChat: "Nouveau Chat",
    aiHelper: "Assistant IA",
    admin: "Admin",
  },
  ar: {
    helpCenter: "مركز المساعدة",
    askQuestion: "اسأل أي سؤال...",
    send: "إرسال",
    connectingToAI: "مساعد AI",
    talkToHuman: "التحدث إلى شخص",
    humanRequested: "طلب دعم بشري...",
    adminJoined: "انضم المشرف للمحادثة",
    typing: "يكتب...",
    closed: "تم إغلاق الدردشة",
    startNewChat: "دردشة جديدة",
    aiHelper: "مساعد AI",
    admin: "مشرف",
  }
};

export default function ChatWidget() {
  const { language, isRTL } = useLanguage();
  const t = translations[language];
  const queryClient = useQueryClient();
  
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isAITyping, setIsAITyping] = useState(false);
  const messagesEndRef = useRef(null);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: activeSession } = useQuery({
    queryKey: ['activeSession', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const sessions = await base44.entities.ChatSession.filter(
        { user_email: user.email, status: ['active_ai', 'active_human'] },
        '-last_message_time',
        1
      );
      return sessions[0] || null;
    },
    enabled: !!user?.email && isOpen,
    refetchInterval: isOpen ? 3000 : false,
  });

  const { data: messages, isLoading: loadingMessages } = useQuery({
    queryKey: ['chatMessages', activeSession?.id],
    queryFn: async () => {
      if (!activeSession?.id) return [];
      return await base44.entities.ChatMessage.filter(
        { session_id: activeSession.id },
        'timestamp'
      );
    },
    enabled: !!activeSession?.id,
    refetchInterval: isOpen ? 2000 : false,
    initialData: [],
  });

  const createSessionMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.ChatSession.create({
        user_email: user.email,
        user_name: user.full_name,
        status: 'active_ai',
        last_message_time: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeSession'] });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ sessionId, message, senderType }) => {
      await base44.entities.ChatMessage.create({
        session_id: sessionId,
        sender_type: senderType,
        sender_email: user?.email,
        message: message,
        timestamp: new Date().toISOString(),
      });

      await base44.entities.ChatSession.update(sessionId, {
        last_message_time: new Date().toISOString(),
      });

      return { sessionId, message };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
      queryClient.invalidateQueries({ queryKey: ['activeSession'] });
    },
  });

  const requestHumanMutation = useMutation({
    mutationFn: async (sessionId) => {
      await base44.entities.ChatSession.update(sessionId, {
        status: 'active_human',
        last_message_time: new Date().toISOString(),
      });

      await base44.entities.ChatMessage.create({
        session_id: sessionId,
        sender_type: 'ai',
        message: 'A human support agent will join you shortly. Please wait...',
        timestamp: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeSession'] });
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
    },
  });

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    let sessionId = activeSession?.id;

    if (!sessionId) {
      const newSession = await createSessionMutation.mutateAsync();
      sessionId = newSession.id;
    }

    const userMessage = message;
    setMessage("");

    await sendMessageMutation.mutateAsync({
      sessionId,
      message: userMessage,
      senderType: 'user',
    });

    // If AI mode, get AI response
    if (activeSession?.status === 'active_ai' || !activeSession) {
      setIsAITyping(true);
      try {
        const aiResponse = await base44.integrations.Core.InvokeLLM({
          prompt: `You are a helpful customer support assistant for TRini213, a gym membership app in Algeria. 
          
          Context about TRini213:
          - We offer 2 membership plans: Classic (10 visits for 3000 DZD) and Professional (15 visits for 3500 DZD)
          - Members can access any partner gym in Algeria with their membership
          - Plans are valid for 90 days from purchase
          - If members run out of visits, they can pay 300 DZD per single visit
          - Gym owners receive 200 DZD per single visit (100 DZD commission for TRini213)
          
          User question: ${userMessage}
          
          Provide a helpful, friendly response in ${language === 'fr' ? 'French' : language === 'ar' ? 'Arabic' : 'English'}. 
          If the user asks to speak with a human or if the question is too complex, suggest they can request human support.
          Keep responses concise and helpful.`,
          add_context_from_internet: false,
        });

        await sendMessageMutation.mutateAsync({
          sessionId,
          message: aiResponse,
          senderType: 'ai',
        });
      } catch (error) {
        console.error('AI Error:', error);
        await sendMessageMutation.mutateAsync({
          sessionId,
          message: 'Sorry, I encountered an error. Would you like to speak with a human support agent?',
          senderType: 'ai',
        });
      }
      setIsAITyping(false);
    }
  };

  const handleRequestHuman = () => {
    if (activeSession?.id) {
      requestHumanMutation.mutate(activeSession.id);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user) return null;

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div className={`fixed ${isRTL ? 'left-6' : 'right-6'} bottom-6 z-50`}>
          <Button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-red-600"
            size="icon"
          >
            <MessageCircle className="w-7 h-7 text-white" />
          </Button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed ${isRTL ? 'left-6' : 'right-6'} bottom-6 w-96 h-[600px] bg-white z-50 flex flex-col overflow-hidden border-2 border-red-200`}>
            {/* Header */}
            <div className="bg-red-600 p-4 flex items-center justify-between">
              <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} items-center gap-3`}>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{t.helpCenter}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {activeSession?.status === 'active_human' ? t.admin : t.aiHelper}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {loadingMessages ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="w-8 h-8 text-red-600" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <MessageCircle className="w-12 h-12 mb-2 text-gray-300" />
                  <p className="text-sm">{t.askQuestion}</p>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_type === 'user' ? (isRTL ? 'justify-start' : 'justify-end') : (isRTL ? 'justify-end' : 'justify-start')} gap-2`}
                    >
                      {msg.sender_type !== 'user' && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-red-600 text-white text-xs">
                            {msg.sender_type === 'ai' ? 'AI' : 'A'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[75%] p-3 rounded-2xl ${
                          msg.sender_type === 'user'
                            ? 'bg-red-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-800'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                        <p className={`text-xs mt-1 ${msg.sender_type === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                          {msg.timestamp && !isNaN(new Date(msg.timestamp).getTime())
                            ? format(new Date(msg.timestamp), 'HH:mm')
                            : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isAITyping && (
                    <div className={`flex ${isRTL ? 'justify-end' : 'justify-start'} gap-2`}>
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-red-600 text-white text-xs">
                          AI
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-white border border-gray-200 p-3 rounded-2xl">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Actions */}
            {activeSession?.status === 'active_ai' && messages.length > 0 && (
              <div className="px-4 py-2 border-t bg-white">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRequestHuman}
                  disabled={requestHumanMutation.isPending}
                  className="w-full text-xs"
                >
                  <User className="w-3 h-3 mr-2" />
                  {t.talkToHuman}
                </Button>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={t.askQuestion}
                  className="flex-1"
                  disabled={sendMessageMutation.isPending || isAITyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sendMessageMutation.isPending || isAITyping}
                  className="bg-red-600"
                >
                  {sendMessageMutation.isPending ? (
                    <Loader2 className="w-4 h-4" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
    </>
  );
}