export interface Admin {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Trainer {
  id: string;
  name: string;
  phone: string;
  specialization: string;
  experienceYears: number;
  activeClients: number;
  createdAt: string;
}

export interface MembershipPlan {
  id: string;
  planName: string;
  durationDays: number;
  price: number;
  description: string;
}

export interface Member {
  id: string;
  name: string;
  phone: string;
  email: string;
  trainer?: Trainer;
  membershipPlan?: MembershipPlan;
  trainerId: string;
  membershipPlanId: string;
  joinDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'cancelled';
  notes: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  memberId: string;
  member?: Member;
  amount: number;
  paymentMethod: 'cash' | 'upi' | 'card' | 'bank_transfer';
  paymentDate: string;
  status: 'paid' | 'pending' | 'overdue';
  notes: string;
}

export interface Message {
  id: string;
  memberId: string;
  member?: Member;
  messageType: 'renewal_reminder' | 'offer' | 'announcement';
  channel: 'sms' | 'whatsapp' | 'internal';
  messageText: string;
  sentAt: string;
  status: 'sent' | 'failed' | 'pending';
}

export interface Reminder {
  id: string;
  memberId: string;
  member?: Member;
  reminderType: string;
  triggeredAt: string;
  resolved: boolean;
}

export interface AnalyticsSummary {
  totalMembers: number;
  activeMembers: number;
  expiringThisWeek: number;
  monthlyRevenue: number;
  trainerCount: number;
}
