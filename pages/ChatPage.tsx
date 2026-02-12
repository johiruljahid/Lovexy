
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../services/firebase';
import { CHAT_SUGGESTIONS } from '../constants';
import { getModelResponse } from '../services/geminiService';
import { User, ChatMessage, ModelProfile } from '../types';

interface ChatPageProps {
  user: User;
  models: ModelProfile[];
}

const ChatPage: React.FC<ChatPageProps> = ({ user, models }) => {
  const { id } = useParams();
  const model = models.find(m => m.id === id);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (model) {
      const initialMessage: ChatMessage = {
        id: '1',
        sender: 'model',
        text: `হাই জান! আমি ${model.name}। আজ তোমার কথা শুনতে আর তোমাকে দেখতে বড্ড ইচ্ছে করছে... ❤️`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([initialMessage]);
    }
  }, [model]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Helper to highlight words in Bengali
  const renderHighlightedText = (text: string) => {
    if (!text) return null;
    
    const keywords = [
      'জানু', 'জান', 'সোনা', 'আদর', 'ভালোবাসা', 'ভালোবাসি', 'মিষ্টি', 'আগুন', 
      'রাত', 'গরম', 'শরীর', 'ইচ্ছে', 'পাগল', 'চুমু', 'অপেক্ষা', 'সুইটি', 'জান', 'জানু'
    ];
    
    const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => {
      if (keywords.includes(part.toLowerCase())) {
        return <span key={i} className="highlight-word">{part}</span>;
      }
      return part;
    });
  };

  const handleSend = async (text?: string, media?: { data: string; mimeType: string; type: 'image' | 'audio' }) => {
    const finalMsg = text || inputText;
    if (!finalMsg && !media) return;
    if (!model) return;
    
    let deduction = 1; 
    if (media?.type === 'image') {
      deduction = 5;
    } else if (media?.type === 'audio') {
      deduction = 3;
    }

    if (user.credits < deduction) {
      alert(`জানু, তোমার তো ক্রেডিট শেষ! এই মেসেজটির জন্য ${deduction} ক্রেডিট লাগবে। আগে ক্রেডিট নিয়ে নাও। ❤️`);
      return;
    }

    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: finalMsg,
      mediaType: media?.type,
      mediaData: media?.data,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setShowEmojis(false);
    
    const userRef = doc(db, 'users', user.id);
    await updateDoc(userRef, { credits: increment(-deduction) });

    setIsTyping(true);
    const aiResponseText = await getModelResponse(model.name, finalMsg, model.bio, media ? { data: media.data, mimeType: media.mimeType } : undefined);
    setIsTyping(false);

    const newAiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'model',
      text: aiResponseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newAiMsg]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        handleSend(undefined, { data: base64String, mimeType: file.type, type: 'image' });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      const dummyAudioBase64 = "UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA="; 
      handleSend("ভয়েসটা শোনো জানু... 😘", { data: dummyAudioBase64, mimeType: 'audio/wav', type: 'audio' });
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setTimeout(() => { if (isRecording) setIsRecording(false); }, 5000);
    }
  };

  if (!model) return <div className="p-10 text-center font-bold italic text-gray-400">জানু, মডেল লোড হচ্ছে না...</div>;

  return (
    <div className="flex flex-col h-[88vh] -mx-4 -mt-6 bg-pink-50/10 overflow-hidden relative">
      <div className="glass-3d px-6 py-4 flex items-center justify-between shadow-2xl z-30 rounded-b-[2.5rem] border-b border-white/40">
        <div className="flex items-center space-x-3">
           <Link to="/" className="w-10 h-10 glass-3d rounded-2xl flex items-center justify-center text-pink-500 active:scale-90 transition-all border-white/50">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
           </Link>
           <div className="flex items-center space-x-3">
              <div className="relative glossy-container rounded-[1.2rem] overflow-hidden">
                <img src={model.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop'} className="w-12 h-12 object-cover border-2 border-white shadow-lg" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm animate-pulse z-20"></div>
              </div>
              <div>
                <h3 className="font-black text-gray-800 text-base leading-tight">{model.name}</h3>
                <div className="flex items-center space-x-2"><span className="text-green-500 text-[9px] font-black uppercase tracking-widest">Active Now</span></div>
              </div>
           </div>
        </div>
        <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-pink-100 shadow-inner flex items-center space-x-2">
          <span className="text-xs">💎</span>
          <span className="text-[10px] font-black text-gray-700">{user.credits}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
            <div className={`max-w-[85%] flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
               <div className={`p-4 rounded-[2rem] shadow-2xl border border-white/40 transition-all ${
                 msg.sender === 'user' 
                  ? 'bg-gradient-to-tr from-pink-500 to-purple-600 text-white rounded-tr-none text-sm font-bold' 
                  : 'bg-white text-gray-800 rounded-tl-none shadow-pink-100/50 seductive-font text-xl leading-snug'
               }`} style={{ wordBreak: 'break-word' }}>
                 {msg.mediaType === 'image' && msg.mediaData && (
                   <div className="glossy-container rounded-2xl mb-3 shadow-lg">
                     <img src={`data:image/jpeg;base64,${msg.mediaData}`} className="max-h-52 w-full object-cover border border-white/20" />
                   </div>
                 )}
                 {msg.mediaType === 'audio' && <div className="flex items-center space-x-3 bg-black/10 p-3 rounded-2xl mb-2"><div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">🔊</div><div className="flex space-x-1">{[1,2,3,4,5].map(i => <div key={i} className="w-1 bg-white h-4 rounded-full animate-grow" style={{animationDelay: `${i*0.1}s`}}></div>)}</div></div>}
                 {msg.text && (
                    <div className={msg.sender === 'model' ? 'pt-1' : ''}>
                      {msg.sender === 'model' ? renderHighlightedText(msg.text) : <p className="leading-snug">{msg.text}</p>}
                    </div>
                 )}
               </div>
               <p className="text-[8px] font-black text-gray-400 mt-2 px-2 tracking-widest uppercase">{msg.timestamp}</p>
            </div>
          </div>
        ))}
        {isTyping && <div className="flex justify-start"><div className="bg-white/80 p-4 rounded-[1.5rem] rounded-tl-none shadow-xl flex items-center space-x-2 border border-white"><div className="flex space-x-1"><div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce [animation-delay:0.2s]"></div></div></div></div>}
        <div ref={scrollRef} />
      </div>

      <div className="p-6 bg-white/90 backdrop-blur-3xl border-t border-pink-100 rounded-t-[3.5rem] shadow-[0_-30px_70px_rgba(236,72,153,0.2)] z-30 transition-all relative">
        <div className="flex overflow-x-auto space-x-2 pb-4 scrollbar-hide mb-2 border-b border-pink-50">
           {CHAT_SUGGESTIONS.map((txt, idx) => <button key={idx} onClick={() => handleSend(txt)} className="whitespace-nowrap bg-gradient-to-r from-pink-50 to-white text-pink-600 px-4 py-2 rounded-full text-[10px] font-black border border-pink-100 shadow-sm active:scale-90 transition-all hover:border-pink-300">{txt}</button>)}
        </div>
        {showEmojis && <div className="grid grid-cols-6 gap-3 mb-6 p-6 glass-3d rounded-[2.5rem] animate-in slide-in-from-bottom-6 duration-300 border-4 border-pink-50 shadow-2xl">{['❤️', '🔥', '💋', '😘', '💎', '🌹', '🍭', '🦋', '🥰', '🍒', '🌟', '🍫', '🧸', '🍓', '🍷', '🌈', '💝', '👠'].map(emoji => <button key={emoji} onClick={() => setInputText(prev => prev + emoji)} className="text-3xl hover:scale-125 transition-transform active:scale-75 drop-shadow-md">{emoji}</button>)}</div>}
        <div className="flex items-center space-x-2 mt-2">
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          <button onClick={() => fileInputRef.current?.click()} className="w-12 h-12 glass-3d rounded-2xl flex items-center justify-center text-xl shadow-lg border-white transition-all active:scale-75 hover:bg-pink-50">🖼️</button>
          <div className="flex-1 relative">
            <input value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder={isRecording ? "জানুর জন্য রেকর্ড হচ্ছে..." : "জানুকে কিছু বলো..."} className={`w-full glass-3d rounded-[2rem] py-4 pl-12 pr-4 text-sm font-bold border-pink-100 focus:outline-none focus:ring-4 focus:ring-pink-400/20 shadow-inner transition-all ${isRecording ? 'bg-red-50 text-red-500 border-red-200' : 'bg-white/50'}`} />
            <button onClick={() => setShowEmojis(!showEmojis)} className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl active:scale-75 transition-transform">{showEmojis ? '⌨️' : '🥰'}</button>
          </div>
          <button onClick={toggleRecording} className={`w-12 h-12 glass-3d rounded-2xl flex items-center justify-center text-xl shadow-lg transition-all active:scale-75 ${isRecording ? 'bg-red-500 text-white animate-pulse border-red-400' : 'hover:bg-pink-50'}`}>{isRecording ? '⏹️' : '🎙️'}</button>
          <button onClick={() => handleSend()} className="w-14 h-14 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center text-white shadow-2xl transition-all active:scale-90 btn-3d hover:brightness-110"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></button>
        </div>
      </div>
      <style>{`
        @keyframes grow { 0%, 100% { height: 8px; } 50% { height: 20px; } }
        .animate-grow { animation: grow 0.8s ease-in-out infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default ChatPage;
