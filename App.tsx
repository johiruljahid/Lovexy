
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  setDoc, 
  getDoc, 
  getDocs,
  addDoc, 
  increment,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { auth, db } from './services/firebase';

import Header from './components/Header';
import Home from './pages/Home';
import ProfileDetails from './pages/ProfileDetails';
import ChatPage from './pages/ChatPage';
import Credits from './pages/Credits';
import Payment from './pages/Payment';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Welcome from './pages/Welcome';
import AdminPanel from './pages/AdminPanel';
import { User, ModelProfile, WithdrawalRequest, PaymentRequest } from './types';
import { MODELS as INITIAL_MODELS } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  
  const [models, setModels] = useState<ModelProfile[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [unlockedContentIds, setUnlockedContentIds] = useState<string[]>([]);

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Sync user data from Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            setUser({ id: firebaseUser.uid, ...snapshot.data() } as User);
          }
        });

        // Sync unlocks
        const qUnlocks = query(collection(db, 'unlocks'), where('userId', '==', firebaseUser.uid));
        onSnapshot(qUnlocks, (snapshot) => {
          setUnlockedContentIds(snapshot.docs.map(d => d.data().contentId));
        });
      } else {
        setUser(null);
        setUnlockedContentIds([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Data Listeners for Admin and Global State
  useEffect(() => {
    const qModels = collection(db, 'models');
    const unsubModels = onSnapshot(qModels, (snapshot) => {
      setModels(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ModelProfile)));
    });

    const qUsers = collection(db, 'users');
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      setUsers(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as User)));
    });

    const qPayments = query(collection(db, 'paymentRequests'), orderBy('timestamp', 'desc'));
    const unsubPayments = onSnapshot(qPayments, (snapshot) => {
      setPaymentRequests(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PaymentRequest)));
    });

    const qWithdrawals = query(collection(db, 'withdrawals'), orderBy('timestamp', 'desc'));
    const unsubWithdrawals = onSnapshot(qWithdrawals, (snapshot) => {
      setWithdrawals(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as WithdrawalRequest)));
    });

    return () => {
      unsubModels();
      unsubUsers();
      unsubPayments();
      unsubWithdrawals();
    };
  }, []);

  const handleLogout = () => {
    signOut(auth);
    setIsAdmin(false);
  };

  const verifyAdminCode = () => {
    if (adminCode === "Jahid") {
      setIsAdmin(true);
      setShowAdminModal(false);
      setAdminCode('');
    } else {
      alert("ভুল কোড! আপনার এক্সেস নেই।");
    }
  };

  const handleUpdateModels = async (updatedModels: ModelProfile[]) => {
    for (const m of updatedModels) {
      const { id, ...data } = m;
      await setDoc(doc(db, 'models', id), data);
    }
  };

  const handleUnlockContent = async (contentId: string, modelId: string) => {
    if (!user) return;
    if (user.credits < 100) {
      alert("জানু, তোমার ক্রেডিট শেষ! ১০০ ক্রেডিট লাগবে আনলক করতে। ❤️");
      return;
    }

    const unlockId = `${user.id}_${contentId}`;
    await setDoc(doc(db, 'unlocks', unlockId), {
      userId: user.id,
      contentId,
      modelId,
      timestamp: new Date().toISOString()
    });

    await updateDoc(doc(db, 'users', user.id), {
      credits: increment(-100)
    });
    
    alert("সাফল্যের সাথে আনলক হয়েছে জানু! উপভোগ করো। 😘");
  };

  const handleCreatePaymentRequest = async (req: Omit<PaymentRequest, 'id' | 'status' | 'timestamp'>) => {
    await addDoc(collection(db, 'paymentRequests'), {
      ...req,
      status: 'pending',
      timestamp: new Date().toLocaleString()
    });
  };

  const handleApprovePayment = async (paymentId: string) => {
    const req = paymentRequests.find(p => p.id === paymentId);
    if (!req || req.status === 'approved') return;

    const userRef = doc(db, 'users', req.userId);
    await updateDoc(userRef, { credits: increment(req.credits) });

    if (req.couponCode) {
      const commission = Math.floor(req.price * 0.20);
      const q = query(collection(db, 'users'), where('referralCode', '==', req.couponCode));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (d) => {
        await updateDoc(doc(db, 'users', d.id), {
          totalEarnings: increment(commission),
          withdrawableAmount: increment(commission)
        });
      });
    }

    await updateDoc(doc(db, 'paymentRequests', paymentId), { status: 'approved' });
    alert("পেমেন্ট সফলভাবে অ্যাপ্রুভ করা হয়েছে! ✅");
  };

  const handleRequestWithdrawal = async (amount: number, bkash: string) => {
    if (!user) return;
    if (user.withdrawableAmount < amount) return alert("পর্যাপ্ত ব্যালেন্স নেই জানু!");
    
    await addDoc(collection(db, 'withdrawals'), {
      userId: user.id,
      userName: user.name,
      amount,
      bkashNumber: bkash,
      status: 'pending',
      timestamp: new Date().toLocaleDateString()
    });

    await updateDoc(doc(db, 'users', user.id), { withdrawableAmount: 0 });
  };

  const handleApproveWithdrawal = async (withdrawId: string) => {
    const request = withdrawals.find(w => w.id === withdrawId);
    if (!request || request.status === 'approved') return;

    await updateDoc(doc(db, 'withdrawals', withdrawId), { status: 'approved' });
    await updateDoc(doc(db, 'users', request.userId), { totalPaid: increment(request.amount) });
    alert("উইথড্রাল অ্যাপ্রুভ করা হয়েছে! ✅");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-pink-500 animate-pulse text-2xl">লোড হচ্ছে... জানু একটু অপেক্ষা করো! ❤️</div>;

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#f8fafc]">
        {showAdminModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in zoom-in duration-300">
            <div className="glass-3d w-full max-w-sm rounded-[3rem] p-8 space-y-6 border-t-8 border-pink-500 shadow-2xl relative text-center">
              <button onClick={() => setShowAdminModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold">✕</button>
              <div className="space-y-2">
                <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-inner">🔐</div>
                <h3 className="text-xl font-black text-gray-800">অ্যাডমিন এক্সেস</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Security Verification</p>
              </div>
              <input 
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && verifyAdminCode()}
                placeholder="অ্যাক্সেস কোড দিন..."
                className="w-full glass-3d rounded-2xl py-4 px-6 text-sm font-black border-pink-50 focus:outline-none focus:ring-4 focus:ring-pink-400/20 text-center"
                autoFocus
              />
              <button 
                onClick={verifyAdminCode}
                className="w-full btn-3d bg-pink-500 text-white py-4 rounded-2xl font-black shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                ভেরিফাই করুন
              </button>
            </div>
          </div>
        )}

        {(user && !isAdmin) && <Header user={user} onLogout={handleLogout} />}
        <main className={`flex-1 ${(user && !isAdmin) ? 'container mx-auto px-4 py-6 max-w-2xl' : ''}`}>
          <Routes>
            <Route path="/welcome" element={(!user && !isAdmin) ? <Welcome onAdminClick={() => setShowAdminModal(true)} /> : <Navigate to={isAdmin ? "/admin" : "/"} />} />
            <Route path="/login" element={(!user && !isAdmin) ? <Login onAdminClick={() => setShowAdminModal(true)} /> : <Navigate to={isAdmin ? "/admin" : "/"} />} />
            <Route path="/register" element={(!user && !isAdmin) ? <Register onAdminClick={() => setShowAdminModal(true)} /> : <Navigate to={isAdmin ? "/admin" : "/"} />} />
            
            <Route path="/admin" element={isAdmin ? <AdminPanel models={models} users={users} withdrawals={withdrawals} paymentRequests={paymentRequests} onApprovePayment={handleApprovePayment} onApproveWithdrawal={handleApproveWithdrawal} onUpdateModels={handleUpdateModels} onLogout={handleLogout} /> : <Navigate to="/welcome" />} />
            
            <Route path="/" element={user ? <Home models={models} /> : <Navigate to="/welcome" />} />
            <Route path="/profile/:id" element={user ? <ProfileDetails models={models} unlockedContentIds={unlockedContentIds} onUnlock={handleUnlockContent} /> : <Navigate to="/welcome" />} />
            <Route path="/chat/:id" element={user ? <ChatPage user={user} models={models} /> : <Navigate to="/welcome" />} />
            <Route path="/credits" element={user ? <Credits /> : <Navigate to="/welcome" />} />
            <Route path="/payment/:packageId" element={user ? <Payment user={user} onPaymentRequest={handleCreatePaymentRequest} /> : <Navigate to="/welcome" />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} onRequestWithdrawal={handleRequestWithdrawal} /> : <Navigate to="/welcome" />} />
            
            <Route path="*" element={<Navigate to="/welcome" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
