
export interface ExclusiveItem {
  id: string;
  url: string;
  caption?: string;
}

export interface ModelProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  avatar: string;
  gallery: string[];
  exclusiveContent: ExclusiveItem[];
  isLive: boolean;
  creditsPerMessage: number;
}

export interface UnlockedContent {
  id: string;
  userId: string;
  contentId: string;
  modelId: string;
  timestamp: string;
}

export interface CreditPackage {
  id: string;
  credits: number;
  price: number;
  label: string;
  isPopular?: boolean;
  isKing?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  referralCode: string;
  totalEarnings: number;
  withdrawableAmount: number;
  totalPaid: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'model';
  text?: string;
  mediaType?: 'image' | 'audio';
  mediaData?: string; // base64
  timestamp: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  bkashNumber: string;
  status: 'pending' | 'approved';
  timestamp: string;
}

export interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  credits: number;
  price: number;
  phone: string;
  trxId: string;
  couponCode?: string;
  status: 'pending' | 'approved';
  timestamp: string;
}
