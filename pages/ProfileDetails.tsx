
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ModelProfile, ExclusiveItem } from '../types';

interface ProfileDetailsProps {
  models: ModelProfile[];
  unlockedContentIds: string[];
  onUnlock: (contentId: string, modelId: string) => void;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ models, unlockedContentIds, onUnlock }) => {
  const { id } = useParams();
  const model = models.find(m => m.id === id);
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  if (!model) return <div className="p-20 text-center font-black text-gray-400">মডেল পাওয়া যায়নি জানু! ❤️</div>;

  const isUnlocked = (contentId: string) => unlockedContentIds.includes(contentId);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Image Viewer Modal */}
      {viewingImage && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <button 
            onClick={() => setViewingImage(null)}
            className="fixed top-6 right-6 w-14 h-14 bg-white rounded-full flex items-center justify-center text-gray-900 text-3xl font-black shadow-[0_10px_20px_rgba(0,0,0,0.3)] z-[2001] active:scale-90 transition-all border-b-4 border-gray-300"
          >
            ✕
          </button>
          <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
            <img 
              src={viewingImage} 
              className="max-w-full max-h-full object-contain rounded-3xl shadow-[0_0_100px_rgba(236,72,153,0.3)] border-4 border-white/10" 
              alt="Full view" 
            />
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="glass-3d rounded-[3rem] p-4 flex flex-col items-center">
        <div className="w-full aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl mb-8 relative">
           <img 
            src={model.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop'} 
            alt={model.name} 
            className="w-full h-full object-cover cursor-zoom-in"
            onClick={() => setViewingImage(model.avatar)}
           />
           {model.isLive && (
              <div className="absolute top-6 left-6 z-10 bg-red-600/80 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-xl">
                • LIVE NOW
              </div>
           )}
        </div>
        
        <div className="text-center px-4 space-y-4">
          <h1 className="text-5xl font-black text-pink-600 tracking-tighter">{model.name}</h1>
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white text-xs font-bold px-6 py-2 rounded-full shadow-lg">
            <span>{model.age} YEARS OLD</span>
            <span>🔥</span>
          </div>
          <p className="text-gray-600 font-medium text-base leading-relaxed">
            "{model.bio}"
          </p>

          <Link 
            to={`/chat/${model.id}`}
            className="btn-3d w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-5 rounded-[2rem] font-black text-xl flex items-center justify-center space-x-3 shadow-[0_10px_30px_rgba(236,72,153,0.3)]"
          >
            <span>গোপন চ্যাট শুরু করি জানু</span>
            <span className="bg-pink-400/50 p-2 rounded-full text-sm">❤️</span>
          </Link>
        </div>
      </div>

      {/* Public Gallery */}
      <div className="space-y-4">
        <h3 className="text-2xl font-black text-gray-800 flex items-center space-x-2 px-4">
          <span>পাবলিক গ্যালারি</span>
          <span className="text-pink-400">✨</span>
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {model.gallery?.length > 0 ? model.gallery.map((img, idx) => (
            <div 
              key={idx} 
              onClick={() => setViewingImage(img)}
              className="glass-3d p-2 rounded-3xl cursor-zoom-in hover:scale-[1.02] transition-transform active:scale-95"
            >
              <img src={img} className="w-full h-48 object-cover rounded-2xl shadow-inner" alt={`gallery-${idx}`} />
            </div>
          )) : (
            <div className="col-span-2 glass-3d p-8 rounded-3xl text-center text-gray-400 font-bold italic">
              জানু, আমার গ্যালারি এখনও ফাঁকা! ❤️
            </div>
          )}
        </div>
      </div>

      {/* Exclusive Content */}
      <div className="bg-gray-900 rounded-[3.5rem] p-8 space-y-6 shadow-2xl border-4 border-gray-800 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <svg className="w-64 h-64 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
         </div>
         <div className="text-center space-y-2 relative z-10">
            <p className="text-[10px] text-pink-500 font-bold tracking-widest uppercase">Extreme Private Access</p>
            <h2 className="text-4xl font-black text-white flex items-center justify-center space-x-2">
              <span>গোপন ভল্ট</span>
              <span className="animate-pulse">🔒</span>
            </h2>
            <p className="text-gray-400 text-xs italic">"জানু, তোমার জন্য স্পেশাল কিছু রেখেছি... দেখবে নাকি? 😉"</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {model.exclusiveContent?.length > 0 ? model.exclusiveContent.map((item: ExclusiveItem, i) => (
              <div key={item.id} className="bg-gray-800/80 border-2 border-gray-700/50 rounded-[2.5rem] overflow-hidden flex flex-col group transition-all duration-500 hover:border-pink-500/50 shadow-xl">
                 <div className="relative aspect-video overflow-hidden">
                    {isUnlocked(item.id) ? (
                       <img 
                        src={item.url} 
                        className="w-full h-full object-cover cursor-zoom-in group-hover:scale-110 transition-transform duration-700" 
                        alt="unlocked" 
                        onClick={() => setViewingImage(item.url)}
                       />
                    ) : (
                       <div className="w-full h-full relative">
                          <img 
                            src={item.url} 
                            className="w-full h-full object-cover blur-2xl scale-125 opacity-40" 
                            alt="locked" 
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-gradient-to-b from-transparent via-black/40 to-black/80">
                             <div className="w-14 h-14 bg-pink-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center border-2 border-pink-500/40 shadow-2xl animate-bounce">
                                <span className="text-pink-500 text-2xl">🔒</span>
                             </div>
                             <p className="text-white text-sm font-black italic drop-shadow-lg leading-tight">
                                "{item.caption || 'জানু, আমার এই গোপন ভিডিওটি দেখবে নাকি? ❤️'}"
                             </p>
                          </div>
                       </div>
                    )}
                 </div>
                 
                 <div className="p-6 flex flex-col space-y-4">
                    {isUnlocked(item.id) ? (
                       <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                             <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">আনলকড ✨</span>
                          </div>
                          <p className="text-gray-400 text-[9px] font-medium italic">"{item.caption}"</p>
                       </div>
                    ) : (
                       <button 
                        onClick={() => onUnlock(item.id, model.id)}
                        className="w-full bg-white text-gray-900 py-4 rounded-2xl font-black text-sm shadow-[0_10px_20px_rgba(255,255,255,0.1)] hover:bg-pink-50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2 border-b-4 border-gray-300"
                       >
                          <span>এখনই দেখুন</span>
                          <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-[10px]">100 CR</span>
                       </button>
                    )}
                 </div>
              </div>
            )) : (
              <div className="col-span-2 text-center text-gray-500 font-bold italic py-12 glass-3d rounded-3xl">
                 জানু, ভল্টে এখনও কিছু নেই! ❤️
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
