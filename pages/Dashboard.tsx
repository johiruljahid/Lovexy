
import React, { useState } from 'react';
import { User } from '../types';
import { REFERRAL_COMMISSION } from '../constants';

interface DashboardProps {
  user: User;
  onRequestWithdrawal: (amount: number, bkash: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onRequestWithdrawal }) => {
  const [bkashNum, setBkashNum] = useState('');
  const [showWithdrawPopup, setShowWithdrawPopup] = useState(false);
  const [randomMsg, setRandomMsg] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(user.referralCode);
    alert("কুপন কোড কপি হয়েছে! জানু, বন্ধুদের শেয়ার করো আর টাকা কামাও। ❤️");
  };

  const handleWithdraw = () => {
    if (!bkashNum) {
      alert("বিকাশ নাম্বার দাও জানু! ❤️");
      return;
    }
    
    const amount = user.withdrawableAmount;
    if (amount <= 0) {
      alert("জানু, তোমার ওয়ালেটে তো ব্যালেন্স নেই! আগে কিছু রেফার করো। ❤️");
      return;
    }
    
    onRequestWithdrawal(amount, bkashNum);
    
    const msgs = [
      "জানু, তোমার রিকোয়েস্ট পেয়ে গেছি! এখন শুধু একটু সবুর করো, আমি নিজ হাতে তোমার পেমেন্ট পাঠিয়ে দেবো... উম্মম্মাহ! ❤️",
      "সোনা, তোমার টাকা উত্তোলনের রিকোয়েস্ট সাকসেসফুল! এখন আমার নজর তোমার দিকে... জলদি পেমেন্ট পাঠিয়ে চ্যাটে আসছি! 😘",
      "উফফ জানু! তোমার টাকা পাঠানোর কাজ শুরু করে দিয়েছি। পেমেন্ট গেলেই তোমাকে একটা সারপ্রাইজ দেবো চ্যাটে... 🔥",
      "তোমার পেমেন্ট রিকোয়েস্ট ডান সুইটহার্ট! আমি এখন বিকাশে গিয়ে তোমার নাম্বারে টাকা পাঠাতে ব্যস্ত... জলদি আসছি চ্যাটে! 💋"
    ];
    setRandomMsg(msgs[Math.floor(Math.random() * msgs.length)]);
    setShowWithdrawPopup(true);
    setBkashNum('');
  };

  // Commission calculation for net amount display
  const netTotalAmount = (user.totalEarnings || 0) + (user.totalPaid || 0);

  return (
    <div className="space-y-8 pb-20 animate-in slide-in-from-bottom-5 duration-700">
      {/* Seductive Withdrawal Success Popup */}
      {showWithdrawPopup && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/75 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <div className="glass-3d w-full max-w-md rounded-[3.5rem] p-10 relative border-t-8 border-pink-500 shadow-[0_35px_100px_rgba(236,72,153,0.5)] overflow-hidden text-center">
             <div className="w-24 h-24 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-[2.5rem] flex items-center justify-center text-white text-5xl mx-auto shadow-2xl animate-bounce mb-8">
               💸
             </div>
             <div className="space-y-6">
                <h2 className="text-3xl font-black text-gray-800 tracking-tighter">রিকোয়েস্ট সফল!</h2>
                <div className="bg-pink-50 p-8 rounded-[2.5rem] border border-pink-100 shadow-inner">
                  <p className="text-pink-600 font-bold italic leading-relaxed text-lg italic">
                    "{randomMsg}"
                  </p>
                </div>
                <button 
                  onClick={() => setShowWithdrawPopup(false)} 
                  className="btn-3d w-full bg-gray-900 text-white py-5 rounded-[2rem] font-black text-lg flex items-center justify-center space-x-3 shadow-2xl transform hover:scale-105 active:scale-95 transition-all"
                >
                  <span>অপেক্ষা করছি জানু... ❤️</span>
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Profile Card */}
      <div className="glass-3d rounded-[3.5rem] p-8 flex flex-col items-center space-y-6 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500"></div>
         <div className="w-28 h-28 bg-gradient-to-br from-pink-400 to-purple-600 rounded-[2.2rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl border-4 border-white">
           {user.name[0].toUpperCase()}
         </div>
         <div className="text-center">
            <h1 className="text-3xl font-black text-gray-800 tracking-tighter uppercase">{user.name}</h1>
            <p className="text-[10px] font-bold text-pink-500 uppercase tracking-[0.2em]">{user.email}</p>
         </div>

         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
            {[
              { label: 'ক্রেডিট', val: (user.credits || 0) + ' ★', col: 'pink' },
              { label: 'নিট ব্যালেন্স', val: '৳' + netTotalAmount, col: 'orange' },
              { label: 'ওয়ালেট', val: '৳' + (user.withdrawableAmount || 0), col: 'blue' },
              { label: 'পেইড', val: '৳' + (user.totalPaid || 0), col: 'emerald' }
            ].map((stat, i) => (
              <div key={i} className={`bg-${stat.col}-50 rounded-3xl p-4 border border-${stat.col}-100 flex flex-col items-center shadow-inner`}>
                 <p className={`text-[8px] font-black text-${stat.col}-500 uppercase mb-1`}>{stat.label}</p>
                 <h4 className="text-base font-black text-gray-800">{stat.val}</h4>
              </div>
            ))}
         </div>
      </div>

      {/* Referral Hub */}
      <div className="bg-gray-900 rounded-[3rem] p-8 space-y-6 shadow-2xl border-b-8 border-gray-800">
         <div className="space-y-1">
           <h2 className="text-2xl font-black text-white flex items-center space-x-3">
             <span>রেফারেল কুপন</span>
             <span className="text-pink-500">🎁</span>
           </h2>
           <p className="text-[9px] font-black text-gray-400 tracking-widest uppercase italic">Earn {REFERRAL_COMMISSION * 100}% on every top-up!</p>
         </div>

         <div className="bg-gray-800/80 rounded-[2.5rem] p-8 border-2 border-dashed border-pink-500/30 flex flex-col items-center space-y-6 relative group transition-all hover:border-pink-500/60">
            <div className="text-center">
               <p className="text-[10px] text-pink-400 font-black mb-2">ইউনিক কুপন কোড</p>
               <h3 className="text-4xl font-black text-white tracking-[0.3em] drop-shadow-[0_0_15px_rgba(236,72,153,0.4)]">{user.referralCode}</h3>
            </div>
            <button 
              onClick={handleCopy}
              className="bg-white text-gray-900 px-8 py-4 rounded-2xl text-xs font-black shadow-2xl active:scale-95 transition-all flex items-center space-x-2 border-b-4 border-gray-200"
            >
               <span>কপি করুন জানু</span>
               <span>✂️</span>
            </button>
         </div>
      </div>

      {/* Withdraw Section */}
      <div className="glass-3d rounded-[3.5rem] p-8 space-y-8 shadow-2xl border-b-8 border-pink-50">
         <h2 className="text-2xl font-black text-gray-800 flex items-center space-x-3 border-l-4 border-pink-500 pl-4">
           <span>টাকা উত্তোলন</span>
           <span className="text-2xl">💸</span>
         </h2>
         
         <div className="space-y-6">
            <div className="space-y-2 px-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">উত্তোলনের পরিমাণ (অটো-ফিল)</label>
              <div className="relative">
                <input 
                   value={`৳ ${user.withdrawableAmount || 0}`}
                   readOnly
                   className="w-full glass-3d rounded-[2rem] py-5 px-8 text-sm font-black border-pink-50 bg-gray-50/50 text-pink-600 shadow-inner cursor-not-allowed" 
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100 uppercase">Wallet Balance</span>
              </div>
            </div>

            <div className="space-y-2 px-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">বিকাশ পার্সোনাল নাম্বার</label>
              <input 
                 value={bkashNum}
                 onChange={(e) => setBkashNum(e.target.value)}
                 placeholder="01XXXXXXXXX"
                 className="w-full glass-3d rounded-[2rem] py-5 px-8 text-sm font-black border-pink-100 focus:outline-none focus:ring-4 focus:ring-pink-300/20 shadow-inner bg-white/80" 
              />
            </div>

            <button 
              onClick={handleWithdraw}
              disabled={user.withdrawableAmount <= 0}
              className={`btn-3d w-full py-6 rounded-[2.5rem] font-black text-xl flex items-center justify-center space-x-3 shadow-2xl transition-all ${user.withdrawableAmount > 0 ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
            >
              <span>উত্তোলন সাবমিট করুন</span>
              <span className="bg-white/20 p-2 rounded-2xl">✨</span>
            </button>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
