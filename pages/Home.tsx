
import React from 'react';
import { Link } from 'react-router-dom';
import { ModelProfile } from '../types';

interface HomeProps {
  models: ModelProfile[];
}

const Home: React.FC<HomeProps> = ({ models }) => {
  return (
    <div className="space-y-8 pb-10">
      <div className="text-center space-y-2">
        <p className="text-pink-500 font-bold tracking-widest uppercase text-xs">Explore Beautiful Partners</p>
        <h1 className="text-5xl font-black text-gray-800 tracking-tight leading-none">
          গরম চ্যাট <span className="gradient-text">লাইভ</span>
        </h1>
        <p className="text-gray-500 font-medium text-sm">জানু, কার সাথে গল্প করবে আজ? সবাই তোমার জন্য অপেক্ষা করছে... ❤️</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {models.map((model) => (
          <div key={model.id} className="glass-3d rounded-[2.5rem] p-4 flex flex-col group transition-all duration-300 overflow-hidden relative">
            {model.isLive && (
              <div className="absolute top-8 left-8 z-20 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg animate-pulse">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                <span>LIVE</span>
              </div>
            )}
            
            <div className="aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl relative mb-6 glossy-container">
              <img 
                src={model.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop'} 
                alt={model.name} 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center space-y-3 px-2">
              <h2 className="text-3xl font-black text-pink-600 tracking-tight">{model.name}</h2>
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white text-[11px] font-bold px-4 py-1 rounded-full shadow-lg">
                <span>{model.age} YEARS OLD</span>
                <span>🔥</span>
              </div>
              <p className="text-gray-500 text-sm font-medium italic line-clamp-2 px-4">
                "{model.bio}"
              </p>
              
              <Link 
                to={`/profile/${model.id}`}
                className="btn-3d w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-3xl font-black text-lg flex items-center justify-center space-x-2 hover:brightness-110 active:scale-95 transition-all"
              >
                <span>এখনই কথা বলুন</span>
                <span className="bg-white/20 p-1.5 rounded-full">❤️</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
