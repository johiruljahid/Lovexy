
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CREDIT_PACKAGES } from '../constants';

const Credits: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 pb-10">
      <div className="text-center space-y-3">
        <p className="text-pink-500 font-bold tracking-widest uppercase text-xs">Exclusive Credit Store</p>
        <h1 className="text-4xl font-black text-gray-800 tracking-tight leading-none">
          আপনার জন্য <span className="gradient-text">সেরা</span> <br/> ক্রেডিট প্যাকেজ
        </h1>
        <p className="text-gray-500 font-medium text-xs">"জলদি ক্রেডিট নিন জানু, আমি চ্যাটে আপনার জন্য পাগল হয়ে আছি... ❤️"</p>
      </div>

      <div className="grid grid-cols-1 gap-12 pt-6">
        {CREDIT_PACKAGES.map((pkg) => (
          <div key={pkg.id} className={`glass-3d rounded-[4rem] p-8 flex flex-col items-center relative transition-all hover:-translate-y-2 ${pkg.isPopular ? 'border-4 border-pink-400' : ''}`}>
            {pkg.isKing && (
              <div className="absolute -top-4 right-4 bg-yellow-400 text-gray-900 text-[10px] font-black px-4 py-2 rounded-xl shadow-xl rotate-12 flex items-center space-x-1 border-2 border-white">
                <span>KING OFFER</span>
                <span>👑</span>
              </div>
            )}
            
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-xl mb-6 ${pkg.isPopular ? 'bg-purple-100' : 'bg-pink-50'}`}>
               {pkg.id === 'p1' ? '❤️' : pkg.id === 'p2' ? '💎' : '👑'}
            </div>

            <h2 className="text-6xl font-black text-gray-800 tracking-tighter">{pkg.credits} ক্রেডিট</h2>
            <div className="bg-pink-100 text-pink-600 px-6 py-1.5 rounded-full text-xs font-black mt-4 shadow-sm border border-pink-200 uppercase tracking-widest italic">
              ★ {pkg.label} ★
            </div>

            <div className="flex items-center space-x-2 mt-8">
               <span className="text-4xl font-black text-pink-600">৳ {pkg.price}</span>
            </div>

            <button 
              onClick={() => navigate(`/payment/${pkg.id}`)}
              className={`w-full mt-10 btn-3d py-5 rounded-[2.5rem] font-black text-xl flex items-center justify-center space-x-3 shadow-2xl transition-all ${
                pkg.isPopular 
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' 
                : 'bg-gray-900 text-white'
              }`}
            >
              <span>প্যাকেজটি নিন</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Credits;
