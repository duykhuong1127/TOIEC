import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  HelpCircle,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { api } from '../../services/api';

interface AiTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
  context?: any;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AiTutorModal: React.FC<AiTutorModalProps> = ({
  isOpen,
  onClose,
  initialMessage,
  context,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Xin chào! Tôi là Trợ lý AI Giảng dạy TOEIC (TOEIC MASTER AI Tutor). Bạn có thắc mắc gì về ngữ pháp Part 5, bẫy nghe Part 1-4, hay từ vựng đồng nghĩa - paraphrasing không?',
      timestamp: 'Vừa xong',
    },
  ]);
  const [inputText, setInputText] = useState(initialMessage || '');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'Phân biệt Invoice, Bill và Receipt',
    'Khi nào dùng Although vs Despite trong Part 5?',
    'Cách nhận diện câu trả lời gián tiếp trong Part 2',
    'Mẹo tránh bẫy "is being + V3" trong Part 1',
    'Các dạng Paraphrasing phổ biến nhất Part 7',
  ];

  const handleSendMessage = async (msgToSend = inputText) => {
    if (!msgToSend.trim() || isLoading) return;

    const userMsg: Message = {
      sender: 'user',
      text: msgToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const replyText = await api.askAiTutor(msgToSend, context);
      const aiMsg: Message = {
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Rất tiếc, đã có lỗi kết nối với máy chủ AI. Vui lòng thử lại sau ít giây.',
          timestamp: 'Vừa xong',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 md:p-6 overflow-hidden">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>TOEIC MASTER AI Tutor</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                  Gemini 3.8 Flash
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Giải đáp ngữ pháp, bẫy thi & paraphrasing 24/7
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat message stream */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((m, idx) => {
            const isAi = m.sender === 'ai';
            return (
              <div
                key={idx}
                className={`flex gap-3 max-w-[85%] ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                    isAi
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-800 dark:bg-slate-700 text-white'
                  }`}
                >
                  {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div>
                  <div
                    className={`p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed whitespace-pre-line ${
                      isAi
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-xs'
                        : 'bg-sky-600 text-white rounded-tr-xs shadow-xs'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-slate-400 px-1 mt-1 block">
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 mr-auto max-w-[85%]">
              <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl rounded-tl-xs bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 flex items-center gap-2">
                <span className="animate-spin text-sky-600">●</span>
                <span>AI Tutor đang phân tích dữ liệu ETS...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick prompt chips */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 overflow-x-auto flex items-center gap-1.5 text-[11px]">
          <span className="text-slate-400 shrink-0 font-medium">Gợi ý:</span>
          {quickPrompts.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-sky-400 whitespace-nowrap transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="p-3 md:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Nhập câu hỏi về đề thi, từ vựng hoặc ngữ pháp TOEIC..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs md:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 dark:text-white"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
