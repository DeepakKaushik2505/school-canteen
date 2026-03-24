import { create } from "zustand";
import type { Order, Student } from "@/lib/types";

interface AppState {
  selectedStudent: Student | null;
  selectedOrders: Order[];
  isStudentModalOpen: boolean;
  openStudentModal: (student: Student, orders: Order[]) => void;
  closeStudentModal: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedStudent: null,
  selectedOrders: [],
  isStudentModalOpen: false,
  openStudentModal: (student, orders) =>
    set({
      selectedStudent: student,
      selectedOrders: orders,
      isStudentModalOpen: true,
    }),
  closeStudentModal: () =>
    set({
      selectedStudent: null,
      selectedOrders: [],
      isStudentModalOpen: false,
    }),
}));

