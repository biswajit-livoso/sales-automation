export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  department?: string;
  joinDate?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed';
  value: number;
  source: string;
  assignedTo: string;
  createdAt: string;
}

export interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  probability: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  expectedCloseDate: string;
  assignedTo: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  assignedTo: string;
}

export interface SalesMetrics {
  totalRevenue: number;
  monthlyGrowth: number;
  activeLeads: number;
  conversionRate: number;
  averageDealSize: number;
  salesTarget: number;
}

// Visits feature types
export type PaymentMode = 'cash' | 'card' | 'upi' | 'bank-transfer' | 'cheque' | 'other';

// Order types for visit completion
export type OrderUnit = 'box' | 'pcs';

export interface VisitOrderItem {
  product: string; // liquor name or SKU
  quantity: number; // numeric quantity
  unit: OrderUnit; // box or pieces
}

export interface Vendor {
  id: string;
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export type VisitStatus = 'open' | 'closed';

export interface VisitPaymentInfo {
  amount?: number;
  mode?: PaymentMode;
  referenceId?: string;
  notes?: string;
}

export interface Visit {
  id: string;
  vendorId: string;
  createdBy: string; // user id
  topic: string; // what to discuss
  createdAt: string; // ISO
  status: VisitStatus;
  startedAt: string; // ISO when ticket created
  closedAt?: string; // ISO when closed
  discussionSummary?: string;
  payment?: VisitPaymentInfo;
  order?: VisitOrderItem[];
}