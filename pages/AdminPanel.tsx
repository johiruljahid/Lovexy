
import React, { useState } from 'react';
import { ModelProfile, User, WithdrawalRequest, PaymentRequest, ExclusiveItem } from '../types';
import { generateModelPersona } from '../services/geminiService';

interface AdminPanelProps {
  onLogout: () => void;
  models: ModelProfile[];
  users: User[];
  withdrawals: WithdrawalRequest[];
  paymentRequests: PaymentRequest[];
  onApprovePayment: (id: string) => void;
  onApproveWithdrawal: (id: string) => void;
  onUpdateModels: (models: ModelProfile[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  onLogout, models, users, withdrawals, paymentRequests, 
  onApprovePayment, onApproveWithdrawal, onUpdateModels 
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'payments' | 'withdrawals' | 'users' | 'models'>('dashboard');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<ModelProfile | null>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [age, setAge] = useState(20);
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [vault, setVault] = useState<ExclusiveItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newVaultUrl, setNewVaultUrl] = useState('');
  const [newVaultCaption, setNewVaultCaption] = useState('');

  const totalRevenue = paymentRequests.filter(p => p.status === 'approved').reduce((acc, curr) => acc + curr.price, 0);
  const totalPaidOut = users.reduce((acc, curr) => acc + curr.totalPaid, 0);

  const stats = [
    { label: 'TOTAL REVENUE', value: `৳ ${totalRevenue}`, color: 'bg-[#6366f1]', textColor: 'text-white' },
    { label: 'PENDING PAYMENTS', value: paymentRequests.filter(p => p.status === 'pending').length.toString(), color: 'bg-white', textColor: 'text-pink-500' },
    { label: 'TOTAL PAID', value: `৳ ${totalPaidOut}`, color: 'bg-white', textColor: 'text-emerald-500', border: 'border-r-[12px] border-emerald-400' },
    { label: 'TOTAL USERS', value: users.length.toString(), color: 'bg-white', textColor: 'text-gray-800' },
  ];

  const resetForm = (model: ModelProfile | null = null) => {
    setName(model?.name || '');
    setAge(model?.age || 20);
    setBio(model?.bio || '');
    setAvatar(model?.avatar || '');
    setGallery(model?.gallery || []);
    setVault(model?.exclusiveContent || []);
    setNewGalleryUrl('');
    setNewVaultUrl('');
    setNewVaultCaption('');
  };

  const handleEdit = (model: ModelProfile) => {
    setEditingModel(model);
    resetForm(model);
    setIsEditModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingModel(null);
    resetForm();
    setIsEditModalOpen(true);
  };

  const handleAutoGenerate = async () => {
    setIsGenerating(true);
    const data = await generateModelPersona();
    setName(data.name);
    setAge(data.age);
    setBio(data.bio);
    setIsGenerating(false);
  };

  const addGalleryItem = () => {
    if (newGalleryUrl.trim()) {
      setGallery([...gallery, newGalleryUrl.trim()]);
      setNewGalleryUrl('');
    }
  };

  const addVaultItem = () => {
    if (newVaultUrl.trim()) {
      const newItem: ExclusiveItem = {
        id: 'ex_' + Date.now().toString() + Math.random().toString(36).substring(2, 7),
        url: newVaultUrl.trim(),
        caption: newVaultCaption.trim() || 'জানু, আমার এই গোপন ভিডিওটি দেখবে নাকি? ❤️'
      };
      setVault([...vault, newItem]);
      setNewVaultUrl('');
      setNewVaultCaption('');
    }
  };

  const removeItem = (e: React.MouseEvent, list: any[], setList: (l: any[]) => void, index: number) => {
    e.stopPropagation();
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const handleSaveModel = () => {
    if (!name || !avatar) {
      alert("মডেলের নাম এবং প্রোফাইল পিকচার অবশ্যই দিতে হবে জানু! ❤️");
      return;
    }

    const modelData: ModelProfile = {
      id: editingModel?.id || Date.now().toString(),
      name,
      age,
      bio,
      avatar,
      gallery,
      exclusiveContent: vault,
      isLive: true,
      creditsPerMessage: 1
    };

    let updatedModels: ModelProfile[];
    if (editingModel) {
      updatedModels = models.map(m => m.id === editingModel.id ? modelData : m);
    } else {
      updatedModels = [...models, modelData];
    }

    onUpdateModels(updatedModels);
    setIsEditModalOpen(false);
    alert(`মডেল সফলভাবে ${editingModel ? 'আপডেট' : 'পাবলিশ'} হয়েছে জানু! ✨`);
  };

  const handleDeleteModel = (id: string) => {
    if (window.confirm("জানু, তুমি কি নিশ্চিতভাবে এই মডেলটিকে মুছে ফেলতে চাও?")) {
      onUpdateModels(models.filter(m => m.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b]">
      {viewingImage && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/95 backdrop-blur-md p-6 animate-in fade-in duration-300">
           <button onClick={() => setViewingImage(null)} className="fixed top-8 right-8 w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-900 text-4xl font-black shadow-[0_15px_30px_rgba(0,0,0,0.5)] z-[3001] active:scale-90 transition-all border-b-4 border-gray-300">✕</button>
           <img src={viewingImage} className="max-w-full max-h-full object-contain rounded-[3rem] shadow-2xl border-2 border-white/20" alt="Preview" />
        </div>
      )}

      <div className="bg-[#1e1b21] py-2 px-8 flex justify-between items-center shadow-xl">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Admin Secure Session</span>
        </div>
        <button onClick={onLogout} className="text-[10px] font-black text-gray-400 hover:text-white transition-colors uppercase tracking-widest">Logout</button>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-12">
        <div className="bg-white rounded-[3rem] p-4 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] flex flex-col md:flex-row items-center justify-between border border-white gap-6">
           <div className="flex items-center space-x-4 ml-4">
             <img src="https://i.ibb.co.com/35CGm9xB/lovexylogo.png" className="w-10 h-10 object-contain" alt="logo" />
             <h1 className="text-2xl md:text-3xl font-black text-[#0f172a] tracking-tight">Prio <span className="text-pink-50">Admin Panel</span></h1>
           </div>
           
           <div className="bg-[#f8fafc] rounded-full p-2 flex items-center space-x-1 border border-gray-100 shadow-inner w-full md:w-auto overflow-x-auto scrollbar-hide">
              {[
                { id: 'dashboard', label: 'DASHBOARD' },
                { id: 'payments', label: `পেমেন্ট (${paymentRequests.filter(p => p.status === 'pending').length})` },
                { id: 'withdrawals', label: `উইথড্র (${withdrawals.filter(w => w.status === 'pending').length})` },
                { id: 'users', label: 'USERS' },
                { id: 'models', label: 'MODELS' }
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`whitespace-nowrap px-6 py-3 rounded-full text-[10px] font-black transition-all ${activeTab === tab.id ? 'bg-white text-pink-600 shadow-[0_8px_20px_-5px_rgba(236,72,153,0.3)] border border-pink-50 translate-y-[-2px]' : 'text-gray-400 hover:text-gray-600'}`}>{tab.label}</button>
              ))}
           </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className={`${stat.color} ${stat.border || ''} rounded-[3rem] p-10 flex flex-col justify-center min-h-[220px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/20 transition-transform hover:-translate-y-2`}>
                   <p className={`text-[10px] font-black ${stat.textColor} opacity-60 uppercase tracking-widest mb-4`}>{stat.label}</p>
                   <h3 className={`text-5xl font-black ${stat.textColor} tracking-tighter`}>{stat.value}</h3>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-6">
              <h2 className="text-4xl font-black tracking-tight px-4 text-gray-800">ক্রেডিট পারচেজ রিকোয়েস্ট</h2>
              <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-white">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="px-10 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">ইউজার</th>
                        <th className="px-10 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">ক্রেডিট / এমাউন্ট</th>
                        <th className="px-10 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">বিকাশ / TRXID</th>
                        <th className="px-10 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">কুপন</th>
                        <th className="px-10 py-8 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentRequests.length > 0 ? paymentRequests.map((req, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                          <td className="px-10 py-8">
                             <p className="font-black text-gray-800">{req.userName}</p>
                             <p className="text-[9px] text-gray-400 font-bold">{req.timestamp}</p>
                          </td>
                          <td className="px-10 py-8">
                             <p className="font-black text-pink-600">{req.credits} CR</p>
                             <p className="text-sm font-bold text-gray-400">৳{req.price}</p>
                          </td>
                          <td className="px-10 py-8">
                             <p className="font-black text-gray-800">{req.phone}</p>
                             <code className="text-[10px] bg-gray-100 px-2 py-1 rounded-md text-pink-500 font-bold">{req.trxId}</code>
                          </td>
                          <td className="px-10 py-8">
                             {req.couponCode ? <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-[10px] font-black tracking-widest">{req.couponCode}</span> : <span className="text-gray-300 text-[10px]">None</span>}
                          </td>
                          <td className="px-10 py-8 text-right">
                             {req.status === 'pending' ? (
                               <button onClick={() => onApprovePayment(req.id)} className="bg-emerald-500 text-white px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase shadow-lg hover:brightness-110 active:scale-95 transition-all">Approve</button>
                             ) : (
                               <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-xl">Approved ✅</span>
                             )}
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={5} className="py-24 text-center font-bold text-gray-400 italic">কোনো পেমেন্ট রিকোয়েস্ট নেই।</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'withdrawals' && (
            <div className="space-y-6">
              <h2 className="text-4xl font-black tracking-tight px-4">উইথড্র রিকোয়েস্ট</h2>
              <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-white">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-50">
                        <th className="px-10 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">ইউজার</th>
                        <th className="px-10 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">পরিমাণ</th>
                        <th className="px-10 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">বিকাশ নাম্বার</th>
                        <th className="px-10 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">স্ট্যাটাস</th>
                        <th className="px-10 py-8 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawals.length > 0 ? withdrawals.map((req, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="px-10 py-8 font-black text-gray-800">{req.userName}</td>
                          <td className="px-10 py-8 font-black text-pink-500">৳{req.amount}</td>
                          <td className="px-10 py-8 font-bold text-gray-400">{req.bkashNumber}</td>
                          <td className="px-10 py-8">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${req.status === 'approved' ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' : 'bg-pink-50 text-pink-500 border border-pink-100 animate-pulse'}`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="px-10 py-8 text-right">
                            {req.status === 'pending' && (
                              <button onClick={() => onApproveWithdrawal(req.id)} className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase shadow-lg active:scale-95 transition-all">Approve</button>
                            )}
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={5} className="py-20 text-center font-bold text-gray-400">কোনো রিকোয়েস্ট নেই জানু।</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-8">
               <h2 className="text-4xl font-black tracking-tight px-4">ইউজার লিস্ট</h2>
               <div className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-white">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-50">
                          <th className="px-10 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">নাম</th>
                          <th className="px-10 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">ওয়ালেট (৳)</th>
                          <th className="px-10 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">পেইড (৳)</th>
                          <th className="px-10 py-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">রেফার কোড</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u, i) => (
                          <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                             <td className="px-10 py-10">
                                <p className="font-black text-gray-800">{u.name}</p>
                                <p className="text-[10px] text-gray-400 font-bold">{u.email}</p>
                             </td>
                             <td className="px-10 py-10 font-black text-pink-500">৳{u.withdrawableAmount}</td>
                             <td className="px-10 py-10 font-black text-emerald-500">৳{u.totalPaid}</td>
                             <td className="px-10 py-10 font-black text-gray-800 tracking-wider">{u.referralCode}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'models' && (
            <div className="space-y-8 px-4">
               <div className="flex justify-between items-center">
                 <h2 className="text-4xl font-black tracking-tight">মডেল ম্যানেজমেন্ট</h2>
                 <button onClick={handleAddNew} className="bg-[#1e293b] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">নতুন মডেল</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {models.map(model => (
                    <div key={model.id} className="bg-white rounded-[3rem] p-6 shadow-2xl border border-white space-y-6 group">
                       <div className="aspect-square rounded-[2.5rem] overflow-hidden shadow-inner">
                          <img src={model.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-zoom-in" alt={model.name} onClick={() => setViewingImage(model.avatar)} />
                       </div>
                       <div className="px-2">
                          <h3 className="text-3xl font-black text-gray-800 tracking-tight">{model.name}</h3>
                          <p className="text-[10px] text-gray-400 font-bold italic leading-relaxed mt-2 line-clamp-2">"{model.bio}"</p>
                       </div>
                       <div className="flex items-center space-x-3">
                          <button onClick={() => handleEdit(model)} className="flex-1 bg-pink-50 text-pink-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-pink-100 transition-colors shadow-sm">এডিট</button>
                          <button onClick={() => handleDeleteModel(model.id)} className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-xl hover:bg-red-100 transition-colors shadow-sm">✕</button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/50 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl rounded-[4rem] p-10 md:p-14 relative shadow-[0_50px_100px_rgba(0,0,0,0.25)] border border-white overflow-y-auto max-h-[95vh] scrollbar-hide">
             <button onClick={() => setIsEditModalOpen(false)} className="fixed md:absolute top-8 right-8 w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors shadow-sm text-2xl font-bold z-10 border-b-2 border-gray-200 active:translate-y-0.5">✕</button>
             <div className="flex flex-col space-y-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-4xl font-black tracking-tight">{editingModel ? 'মডেল এডিট' : 'নতুন মডেল যুক্ত করুন'}</h2>
                  <button onClick={handleAutoGenerate} disabled={isGenerating} className="bg-gradient-to-r from-pink-500 to-orange-400 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl flex items-center space-x-2 active:scale-95 transition-all disabled:opacity-50 btn-3d">
                    <span>{isGenerating ? 'জেনারেট হচ্ছে...' : '🪄 AI অটো জেনারেট'}</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                   <div className="space-y-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">নাম</label>
                        <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#f8fafc] rounded-2xl py-5 px-8 text-sm font-bold border-transparent focus:outline-none focus:ring-4 focus:ring-pink-300/20 shadow-inner" placeholder="মডেলের নাম দিন..." />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">বয়স</label>
                        <input type="number" value={age} onChange={e => setAge(parseInt(e.target.value))} className="w-full bg-[#f8fafc] rounded-2xl py-5 px-8 text-sm font-bold border-transparent focus:outline-none focus:ring-4 focus:ring-pink-300/20 shadow-inner" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">বায়ো</label>
                        <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full bg-[#f8fafc] rounded-3xl py-5 px-8 text-sm font-bold border-transparent focus:outline-none focus:ring-4 focus:ring-pink-300/20 shadow-inner min-h-[140px]" placeholder="মডেলের সুন্দর একটি বায়ো লিখুন..." />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">প্রোফাইল পিকচার URL</label>
                        <input value={avatar} onChange={e => setAvatar(e.target.value)} className="w-full bg-[#f8fafc] rounded-2xl py-5 px-8 text-sm font-bold border-transparent focus:outline-none focus:ring-4 focus:ring-pink-300/20 shadow-inner" placeholder="https://image-url.com" />
                      </div>
                   </div>
                   <div className="space-y-10">
                      <div className="bg-[#f8fafc] rounded-[3.5rem] p-8 border-2 border-dashed border-gray-100 space-y-6">
                         <div className="flex items-center justify-between">
                            <h4 className="font-black text-gray-500 text-sm uppercase">পাবলিক গ্যালারি (FREE)</h4>
                            <span className="text-[10px] bg-gray-200 text-gray-600 px-3 py-1 rounded-full font-black">{gallery.length} ছবি</span>
                         </div>
                         <div className="flex gap-2">
                            <input value={newGalleryUrl} onChange={e => setNewGalleryUrl(e.target.value)} placeholder="ছবির লিংক দিন..." className="flex-1 bg-white rounded-xl py-3 px-4 text-xs font-bold focus:outline-none border border-gray-100" />
                            <button onClick={addGalleryItem} className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-lg active:translate-y-1 transition-all">+</button>
                         </div>
                         <div className="grid grid-cols-4 gap-4 max-h-40 overflow-y-auto scrollbar-hide">
                            {gallery.map((url, i) => (
                              <div key={i} onClick={() => setViewingImage(url)} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group cursor-zoom-in">
                                <img src={url} className="w-full h-full object-cover" alt="gallery" />
                                <button onClick={(e) => removeItem(e, gallery, setGallery, i)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">✕</button>
                              </div>
                            ))}
                         </div>
                      </div>
                      <div className="bg-pink-50/50 rounded-[3.5rem] p-8 border-2 border-dashed border-pink-200 space-y-6">
                         <div className="flex items-center justify-between">
                            <h4 className="font-black text-pink-500 text-sm uppercase">প্রাইভেট ভল্ট (FIXED 100 CR)</h4>
                            <span className="text-[10px] bg-pink-100 text-pink-500 px-3 py-1 rounded-full font-black">{vault.length} গোপন বিষয়</span>
                         </div>
                         <div className="space-y-3">
                            <input value={newVaultUrl} onChange={e => setNewVaultUrl(e.target.value)} placeholder="গোপন ছবির লিংক দিন..." className="w-full bg-white rounded-xl py-3 px-4 text-xs font-bold focus:outline-none border border-pink-100" />
                            <div className="flex gap-2">
                               <input value={newVaultCaption} onChange={e => setNewVaultCaption(e.target.value)} placeholder="গোপন ক্যাপশন (বাংলায়)..." className="flex-1 bg-white rounded-xl py-3 px-4 text-xs font-bold focus:outline-none border border-pink-100" />
                               <button onClick={addVaultItem} className="w-12 h-12 bg-pink-500 text-white rounded-xl flex items-center justify-center text-xl font-bold shadow-lg active:translate-y-1 transition-all">+</button>
                            </div>
                         </div>
                         <div className="grid grid-cols-4 gap-4 max-h-40 overflow-y-auto scrollbar-hide">
                            {vault.map((item, i) => (
                              <div key={item.id} onClick={() => setViewingImage(item.url)} className="relative aspect-square rounded-xl overflow-hidden border border-pink-200 group cursor-zoom-in">
                                <img src={item.url} className="w-full h-full object-cover blur-[2px] group-hover:blur-0 transition-all" alt="vault" />
                                <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <p className="text-[6px] text-white truncate font-bold text-center">{item.caption}</p>
                                </div>
                                <button onClick={(e) => removeItem(e, vault, setVault, i)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">✕</button>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
                <div className="flex items-center space-x-6 pt-6">
                   <button onClick={handleSaveModel} className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-6 rounded-[2.5rem] font-black text-xl shadow-[0_20px_40px_rgba(236,72,153,0.3)] hover:brightness-110 active:scale-95 transition-all btn-3d">
                     {editingModel ? 'পরিবর্তন সেভ করুন' : 'মডেল পাবলিশ করুন'}
                   </button>
                   <button onClick={() => setIsEditModalOpen(false)} className="w-44 bg-white border border-gray-100 py-6 rounded-[2.5rem] font-black text-xl text-gray-400 hover:text-gray-600 transition-colors shadow-sm active:translate-y-0.5">বাতিল</button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
