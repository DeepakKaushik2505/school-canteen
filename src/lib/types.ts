export interface Snack {
  id: string;
  name: string;
  price: number;
  halfPrice?: number | null;
  ordersCount: number;
  image?: string | null;
}

export interface Student {
  id: string;
  name: string;
  referralCode: string;
  totalSpent: number;
  userId?: string | null;
  class?: string | null;
  section?: string | null;
  rollNo?: string | null;
}

export interface Order {
  id: string;
  studentId: string;
  snackId: string;
  snackName: string;
  quantity: number;
  payableAmount: number;
  createdAt: string;
}
