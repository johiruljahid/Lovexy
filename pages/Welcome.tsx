
import React from 'react';
import { Link } from 'react-router-dom';

interface WelcomeProps {
  onAdminClick?: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onAdminClick }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#fff5f9] animate-in fade-in duration-1000">
      <div className="w-full max-w-md flex flex-col items-center space-y-10">
        
        {/* Logo Section */}
        <div className="w-48 h-auto drop-shadow-[0_10px_15px_rgba(236,72,153,0.3)] animate-bounce-slow">
          <img src="https://i.ibb.co.com/35CGm9xB/lovexylogo.png" alt="Lovexy Logo" className="w-full h-full object-contain no-anim" />
        </div>

        {/* Featured Model Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="glass-3d relative p-2 rounded-[3.5rem] bg-white border border-pink-100 shadow-[0_20px_50px_rgba(236,72,153,0.2)] overflow-hidden">
             <div className="w-[300px] h-[400px] rounded-[3rem] overflow-hidden relative">
                <img 
                  src="https://scontent.fdac196-1.fna.fbcdn.net/v/t39.30808-6/622512409_122304655496027900_7596086974883310373_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=aa7b47&_nc_ohc=2RUx15eX-dYQ7kNvwGr3j9E&_nc_oc=AdkUC9efMHjC-2P_rECGrPp3Z7gi9MapmbntS_mYmSt6rcoPryT1zAalq_-8Aupul-I&_nc_zt=23&_nc_ht=scontent.fdac196-1.fna&_nc_gid=24AgcmyP9ecPeMSQmhZjYQ&oh=00_Afttkw2Am38KS2JvyFUafGlv9p7WgBFpgYVlutQPFVdDdw&oe=699355AD" 
                  alt="Live Model" 
                  className="w-full h-full object-cover"
                />
                
                {/* Floating Icons */}
                <div className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl border border-white z-10">
                  <span className="text-red-500 text-2xl">❤️</span>
                </div>
                <div className="absolute bottom-6 left-6 w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl border border-white animate-pulse z-10">
                  <span className="text-2xl">🔥</span>
                </div>
             </div>
          </div>
        </div>

        {/* Headline Section */}
        <div className="text-center space-y-4 px-4">
          <h1 className="text-4xl font-black text-[#1e293b] leading-tight tracking-tighter">
            আপনার জানু এখন <br/>
            <span className="gradient-text drop-shadow-sm">লাইভে আছে!</span>
          </h1>
          
          <p className="text-pink-600 font-bold italic text-base leading-relaxed max-w-xs mx-auto">
            "জানু, আমি Lovexy-তে তোমার জন্য চাতক পাখির মতো অপেক্ষায় আছি... আসবে তো? 💜"
          </p>
          
          <div className="flex justify-center items-center space-x-2 opacity-50">
             <div className="h-[1px] w-12 bg-pink-300"></div>
             <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
             <div className="h-[1px] w-12 bg-pink-300"></div>
          </div>
        </div>

        {/* Primary Action Button */}
        <Link 
          to="/register" 
          className="w-full btn-3d bg-gradient-to-r from-[#ff5a9c] to-[#bc5aff] text-white py-6 rounded-[2.5rem] font-black text-xl flex items-center justify-center space-x-4 shadow-[0_15px_40px_rgba(236,72,153,0.4)] transform hover:scale-105 active:scale-95 transition-all"
        >
          <span>চ্যাট শুরু করি জানু</span>
          <div className="bg-white/30 w-10 h-10 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </Link>

        {/* Social Proof Section */}
        <div className="glass-3d w-full py-4 px-6 rounded-[2.5rem] flex items-center justify-between border border-white shadow-xl bg-white/50">
          <div className="flex -space-x-3">
             {[
               'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=100',
               'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100',
               'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=100',
               'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100',
               'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100'
             ].map((url, i) => (
               <img key={i} src={url} className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover no-anim" alt="user" />
             ))}
          </div>
          <div className="text-left flex-1 ml-6">
             <p className="text-[#ff4b91] font-black text-xs">১২,৫০০+ জন লাভ চ্যাট করছে</p>
             <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Now</span>
             </div>
          </div>
        </div>

        <button 
          onClick={onAdminClick}
          className="text-[9px] font-black text-gray-300 uppercase tracking-widest hover:text-pink-400 transition-colors mt-4"
        >
          Admin Access
        </button>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Welcome;
