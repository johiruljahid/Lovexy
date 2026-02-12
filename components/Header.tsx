
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 px-4 py-3 bg-white/80 backdrop-blur-md shadow-md border-b border-pink-100 flex items-center justify-between">
      <Link to="/" className="flex items-center space-x-2">
        <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-xl shadow-lg border-2 border-white bg-white">
          <img src="https://i.ibb.co.com/35CGm9xB/lovexylogo.png" alt="Lovexy Logo" className="w-full h-full object-contain p-1" />
        </div>
        <span className="text-2xl font-black gradient-text tracking-tighter">Lovexy</span>
      </Link>

      <div className="hidden md:flex items-center space-x-6 font-semibold text-sm">
        <Link to="/" className={isActive('/') ? 'text-pink-600' : 'text-gray-500 hover:text-pink-400'}>মডেলস</Link>
        <Link to="/credits" className={isActive('/credits') ? 'text-pink-600' : 'text-gray-500 hover:text-pink-400'}>ক্রেডিট কিনুন</Link>
        <Link to="/dashboard" className={isActive('/dashboard') ? 'text-pink-600' : 'text-gray-500 hover:text-pink-400'}>প্রোফাইল</Link>
      </div>

      <div className="relative">
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center space-x-2 bg-white rounded-full p-1 pr-3 shadow-sm border border-pink-100 hover:shadow-md transition-all active:scale-95"
        >
          <div className="w-8 h-8 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-inner">
            {user.name[0]}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-[10px] font-bold leading-none">{user.name}</p>
            <p className="text-[9px] text-pink-500 font-black">{user.credits} CR</p>
          </div>
          <svg className={`w-3 h-3 text-gray-400 transition-transform ${showMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-3 w-52 glass-3d rounded-[2rem] p-3 z-[110] shadow-2xl animate-in fade-in zoom-in slide-in-from-top-2 duration-200">
             <div className="p-3 border-b border-pink-50 flex items-center space-x-3 mb-2">
               <div className="w-10 h-10 bg-pink-500 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-lg overflow-hidden">
                <img src="https://i.ibb.co.com/35CGm9xB/lovexylogo.png" className="w-full h-full object-cover scale-150" alt="profile" />
               </div>
               <div>
                  <h4 className="font-black text-gray-800 text-sm leading-tight">{user.name}</h4>
                  <div className="text-[9px] font-black text-pink-500">প্রিমিয়াম ইউজার</div>
               </div>
             </div>
             <Link to="/" onClick={() => setShowMenu(false)} className="flex items-center space-x-3 p-3 hover:bg-pink-50 rounded-2xl transition-colors mt-1">
                <span className="text-lg">🏠</span>
                <span className="text-xs font-bold text-gray-700">হোম</span>
             </Link>
             <Link to="/dashboard" onClick={() => setShowMenu(false)} className="flex items-center space-x-3 p-3 hover:bg-pink-50 rounded-2xl transition-colors">
                <span className="text-lg">👤</span>
                <span className="text-xs font-bold text-gray-700">আমার প্রোফাইল</span>
             </Link>
             <Link to="/credits" onClick={() => setShowMenu(false)} className="flex items-center space-x-3 p-3 hover:bg-pink-50 rounded-2xl transition-colors">
                <span className="text-lg">💎</span>
                <span className="text-xs font-bold text-gray-700">ক্রেডিট কিনুন</span>
             </Link>
             <button 
                onClick={() => { setShowMenu(false); onLogout(); }}
                className="w-full flex items-center space-x-3 p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors mt-2 text-left"
             >
                <span className="text-lg">🚪</span>
                <span className="text-xs font-bold uppercase tracking-widest">লগআউট</span>
             </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
