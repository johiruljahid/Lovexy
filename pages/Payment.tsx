
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CREDIT_PACKAGES, BKASH_NUMBER, DISCOUNT_AMOUNT } from '../constants';
import { User, PaymentRequest } from '../types';

interface PaymentProps {
  user: User;
  onPaymentRequest: (req: Omit<PaymentRequest, 'id' | 'status' | 'timestamp'>) => void;
}

const Payment: React.FC<PaymentProps> = ({ user, onPaymentRequest }) => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const pkg = CREDIT_PACKAGES.find(p => p.id === packageId);
  
  const [phone, setPhone] = useState('');
  const [trxId, setTrxId] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [isApplied, setIsApplied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [randomMsg, setRandomMsg] = useState('');

  const finalPrice = pkg ? (isApplied ? pkg.price - DISCOUNT_AMOUNT : pkg.price) : 0;

  const handleApplyCoupon = () => {
    if (couponCode.trim().length >= 4) {
      setIsApplied(true);
    } else {
      alert("সঠিক কুপন কোড দাও জানু! ❤️");
    }
  };

  const handleSubmit = () => {
    if (!phone || !trxId) {
      alert("তথ্যগুলো সঠিকভাবে দাও জানু! ❤️");
      return;
    }
    
    if (pkg) {
      onPaymentRequest({
        userId: user.id,
        userName: user.name,
        credits: pkg.credits,
        price: finalPrice,
        phone,
        trxId,
        couponCode: isApplied ? couponCode : undefined
      });
    }

    const msgs = [
      "উমম্মাহ! রিকোয়েস্ট পেয়েছি জানু। অ্যাডমিন চেক করে ক্রেডিট যোগ করে দিবে। একটু অপেক্ষা করো, আমি তোমার জন্য রেডি হচ্ছি! 🔥",
      "সুইটহার্ট, তোমার রিকোয়েস্ট সাবমিট হয়েছে! পেমেন্ট চেক হলেই আমাদের প্রেমে হারিয়ে যাবো। জলদি আসছি... 😘",
      "ওয়াও! জানু তুমি কত ফাস্ট। তোমার রিকোয়েস্ট অ্যাডমিনের কাছে গেছে। ক্রেডিট যোগ হলেই তোমাকে চ্যাটে খুব করে আদর করবো! ❤️",
      "পেমেন্ট রিকোয়েস্ট ডান সোনা! অ্যাডমিন পেমেন্ট চেক করছে। শরীরটা কেমন করছে তোমার কথা ভেবে... চলো চ্যাটে আগুন লাগাই! 💋"
    ];
    setRandomMsg(msgs[Math.floor(Math.random() * msgs.length)]);
    setShowSuccess(true);
  };

  if (!pkg) return <div className="p-10 text-center font-bold">প্যাকেজ পাওয়া যায়নি!</div>;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500 max-w-lg mx-auto px-2">
      {showSuccess && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <div className="glass-3d w-full max-w-md rounded-[3.5rem] p-10 relative border-t-8 border-pink-500 shadow-[0_35px_100px_rgba(236,72,153,0.4)] overflow-hidden">
             <button onClick={() => setShowSuccess(false)} className="absolute top-6 right-6 w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold shadow-lg active:scale-75 transition-all text-2xl">✕</button>
             <div className="text-center space-y-8">
                <div className="w-24 h-24 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-[2rem] flex items-center justify-center text-white text-5xl mx-auto shadow-2xl animate-bounce">💋</div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-black text-gray-800 tracking-tighter">রিকোয়েস্ট সাবমিট হয়েছে!</h2>
                  <p className="text-pink-600 font-bold italic leading-relaxed text-lg bg-pink-50 p-6 rounded-[2rem] border border-pink-100 shadow-inner">"{randomMsg}"</p>
                </div>
                <div className="pt-4 space-y-4">
                  <Link to="/" className="btn-3d w-full bg-gray-900 text-white py-5 rounded-[2rem] font-black text-lg flex items-center justify-center space-x-3 shadow-2xl transform hover:scale-105">
                    <span>মডেলদের কাছে ফিরে যাই</span>
                    <span className="text-2xl">🔥</span>
                  </Link>
                </div>
             </div>
          </div>
        </div>
      )}

      <div className="glass-3d rounded-[2.5rem] p-6 text-center space-y-2 border-b-4 border-pink-100 flex flex-col items-center">
          <img src="https://i.ibb.co.com/35CGm9xB/lovexylogo.png" className="w-16 h-16 object-contain mb-2" alt="logo" />
          <h1 className="text-3xl font-black text-gray-800 tracking-tighter">সেফ বিলিং গেটওয়ে</h1>
          <p className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Trusted Payment System</p>
      </div>

      <div className="glass-3d rounded-[3rem] p-10 flex flex-col items-center space-y-4 shadow-xl border border-white relative overflow-hidden">
          <div className="w-20 h-20 bg-pink-50 rounded-3xl flex items-center justify-center text-4xl shadow-inner border border-pink-100 mb-2">💎</div>
          <h2 className="text-4xl font-black text-gray-800 tracking-tight">{pkg.credits} ক্রেডিট</h2>
          <div className="flex flex-col items-center justify-center min-h-[100px] transition-all duration-500">
            {isApplied ? (
              <div className="flex flex-col items-center animate-in zoom-in duration-500">
                <span className="text-xl font-bold text-gray-400 line-through decoration-pink-500 decoration-2">৳ {pkg.price}</span>
                <span className="text-6xl font-black text-pink-600 tracking-tighter drop-shadow-sm">৳ {finalPrice}</span>
                <div className="mt-2 bg-green-100 text-green-600 px-4 py-1 rounded-full text-[10px] font-black border border-green-200 uppercase tracking-widest animate-pulse">৳{DISCOUNT_AMOUNT} সাশ্রয় হয়েছে!</div>
              </div>
            ) : (
              <span className="text-6xl font-black text-gray-800 tracking-tighter">৳ {pkg.price}</span>
            )}
          </div>
          <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 transition-colors duration-1000 ${isApplied ? 'bg-green-400' : 'bg-pink-400'}`}></div>
      </div>

      <div className="glass-3d rounded-[2.5rem] p-4 flex flex-col space-y-3 border border-pink-50">
         <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} disabled={isApplied} placeholder="কুপন কোড দিন (যেমন: HASAN1330)" className={`w-full bg-white/60 border ${isApplied ? 'border-green-200' : 'border-pink-100'} py-4 px-6 rounded-2xl text-sm font-black focus:outline-none focus:ring-4 focus:ring-pink-400/20 transition-all placeholder:text-gray-300`} />
              {isApplied && <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-1"><span className="text-green-600 font-black text-[10px] tracking-widest">APPLIED</span><span className="bg-green-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-sm">✓</span></div>}
            </div>
            {!isApplied && <button onClick={handleApplyCoupon} className="bg-gray-900 text-white py-4 px-8 rounded-2xl font-black text-xs uppercase shadow-xl active:scale-95 transition-all btn-3d">Apply</button>}
         </div>
      </div>

      {/* bKash Instructions Card */}
      <div className="glass-3d rounded-[3rem] p-8 space-y-6 shadow-2xl relative overflow-hidden bg-white/90 border-2 border-pink-100">
         <div className="text-center space-y-4">
            <div className="flex flex-col items-center justify-center space-y-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/BKash_Logo.svg/512px-BKash_Logo.svg.png" className="h-10 object-contain drop-shadow-md" alt="bkash" />
              <p className="text-[12px] font-black text-pink-500 tracking-widest uppercase">বিকাশ পার্সোনাল নাম্বার</p>
            </div>
            <div className="bg-pink-50 rounded-3xl py-6 px-4 border border-pink-100 shadow-inner group transition-all">
              <h3 className="text-4xl font-black text-gray-800 tracking-tighter select-all group-active:scale-95 transition-transform">{BKASH_NUMBER}</h3>
              <p className="text-[9px] font-bold text-pink-400 mt-2">সেন্ড মানি করুন জানু ❤️</p>
            </div>
         </div>
         <button onClick={() => { navigator.clipboard.writeText(BKASH_NUMBER); alert("নাম্বারটি কপি হয়েছে! ❤️"); }} className="mx-auto flex items-center space-x-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-10 py-4 rounded-full text-xs font-black shadow-lg hover:scale-105 active:scale-95 transition-all">
           <span>নাম্বার কপি করুন</span>
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 00-2 2v8a2 2 0 002 2v8a2 2 0 002 2z" /></svg>
         </button>
      </div>

      {/* Payment Details Form */}
      <div className="glass-3d rounded-[3.5rem] p-8 space-y-8 shadow-2xl border-b-[10px] border-pink-100 border-x-2 border-t-2 relative">
         <div className="space-y-6">
            <div className="space-y-2 px-2">
               <div className="flex items-center space-x-2 ml-4">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/BKash_Logo.svg/512px-BKash_Logo.svg.png" className="h-3 object-contain" alt="bkash small" />
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">বিকাশ নাম্বার (যে নাম্বার থেকে টাকা পাঠিয়েছেন)</label>
               </div>
               <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" className="w-full glass-3d rounded-[2rem] py-5 px-8 text-sm font-black border-pink-50 focus:outline-none focus:ring-4 focus:ring-pink-300/20 shadow-inner bg-white/80" />
            </div>
            <div className="space-y-2 px-2">
               <label className="text-[10px] font-black text-gray-400 ml-4 uppercase tracking-widest">ট্রানজেকশন আইডি (TRXID)</label>
               <input value={trxId} onChange={(e) => setTrxId(e.target.value)} placeholder="TRXID দিন জানু..." className="w-full glass-3d rounded-[2rem] py-5 px-8 text-sm font-black border-pink-50 focus:outline-none focus:ring-4 focus:ring-pink-300/20 shadow-inner bg-white/80" />
            </div>
         </div>
         <button onClick={handleSubmit} className="btn-3d w-full bg-gradient-to-tr from-pink-500 via-pink-600 to-purple-600 text-white py-6 rounded-[2.5rem] font-black text-xl flex items-center justify-center space-x-3 shadow-[0_20px_40px_rgba(236,72,153,0.3)] hover:brightness-110 active:scale-95">
           <span>পেমেন্ট সাবমিট করুন</span>
           <span className="bg-white/30 p-2 rounded-2xl text-lg animate-pulse">💋</span>
         </button>
      </div>
    </div>
  );
};

export default Payment;
