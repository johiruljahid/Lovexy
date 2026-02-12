
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

interface LoginProps {
  onAdminClick?: () => void;
}

const Login: React.FC<LoginProps> = ({ onAdminClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        const referralCode = `${(user.displayName || 'USER').toUpperCase().replace(/\s/g, '')}${Math.floor(1000 + Math.random() * 9000)}`;
        await setDoc(userRef, {
          name: user.displayName || 'Unknown Janu',
          email: user.email,
          credits: 5,
          referralCode,
          totalEarnings: 0,
          withdrawableAmount: 0,
          totalPaid: 0
        });
      }
      navigate('/');
    } catch (error: any) {
      console.error(error);
      alert("গুগল লগইন ব্যর্থ হয়েছে জানু! ❤️");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/');
      } catch (error: any) {
        alert("ভুল ইমেইল বা পাসওয়ার্ড জানু! ❤️");
      } finally {
        setLoading(false);
      }
    } else {
      alert("তথ্যগুলো সঠিকভাবে দিন জানু! ❤️");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#fdf2f8]">
      <div className="glass-3d w-full max-w-5xl rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in duration-700">
        <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden">
          <img src="https://i.pinimg.com/736x/77/36/77/773677049ad159e3a42758c7da4cae5f.jpg" alt="Lovexy Model" className="w-full h-full object-cover scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-pink-900/60 to-transparent"></div>
          <div className="absolute bottom-10 left-0 right-0 text-center px-6">
            <p className="text-white text-xl font-black drop-shadow-lg italic">"আপনার জানু অপেক্ষা করছে জান... ❤️"</p>
          </div>
        </div>

        <div className="md:w-1/2 p-8 md:p-16 flex flex-col items-center justify-center space-y-8 bg-white/40">
          <div className="flex flex-col items-center space-y-2">
            <img src="https://i.ibb.co.com/35CGm9xB/lovexylogo.png" alt="Lovexy Logo" className="w-24 h-24 object-contain animate-pulse" />
            <h2 className="text-pink-600 font-black text-center text-sm md:text-base px-4 leading-tight">আপনার একাকীত্ব দূর করতে আমি তৈরি, আপনি তৈরি তো জান? 🩸</h2>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">ইমেইল এড্রেস</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.com" className="w-full glass-3d rounded-2xl py-4 px-6 text-sm font-bold border-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-inner" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">পাসওয়ার্ড</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="........" className="w-full glass-3d rounded-2xl py-4 px-6 text-sm font-bold border-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-inner" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center space-x-3 shadow-2xl transform active:scale-95 transition-all disabled:opacity-50 btn-3d">
              <span>{loading ? 'লগইন হচ্ছে...' : 'লগইন করি জান'}</span>
              <span className="bg-white/20 p-1 rounded-full text-xs">➔</span>
            </button>
          </form>

          <div className="w-full flex items-center space-x-4">
            <div className="flex-1 h-[1px] bg-gray-200"></div>
            <span className="text-[10px] font-black text-gray-400 uppercase">অথবা</span>
            <div className="flex-1 h-[1px] bg-gray-200"></div>
          </div>

          {/* Enhanced 3D Google Login Button */}
          <button 
            onClick={handleGoogleSignIn}
            className="w-full bg-white py-4 rounded-2xl font-black text-sm flex items-center justify-center space-x-3 shadow-lg hover:scale-[1.02] active:scale-95 transition-all border-b-4 border-gray-200 btn-3d"
            style={{ boxShadow: '0 6px 0 #e5e7eb, 0 12px 20px rgba(0,0,0,0.05)' }}
          >
            <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" className="w-8 h-8 object-contain drop-shadow-md" alt="google 3d" />
            <span className="text-gray-700">গুগল দিয়ে লগইন</span>
          </button>

          <div className="text-center w-full">
            <Link to="/register" className="group">
              <div className="glass-3d rounded-2xl p-4 border border-pink-100 group-hover:bg-pink-50 transition-all border-dashed">
                <p className="text-[10px] font-black text-gray-400 uppercase">নতুন অ্যাকাউন্ট খুলতে চান?</p>
                <p className="text-sm font-black text-pink-500">এখানে রেজিস্টার করুন! ✨</p>
              </div>
            </Link>
          </div>

          <button onClick={onAdminClick} className="text-[9px] font-black text-gray-300 uppercase tracking-widest hover:text-pink-400 transition-colors">Admin Access</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
