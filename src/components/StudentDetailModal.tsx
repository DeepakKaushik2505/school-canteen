"use client";

import type { Student, Order } from "@/lib/types";

interface StudentDetailModalProps {
  student: Student;
  orders: Order[];
  onClose: () => void;
}

export function StudentDetailModal({ student, orders, onClose }: StudentDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="gradient-card rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col border border-light-caramel/30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-light-caramel/30">
          <h2 className="text-xl font-bold text-black-forest">{student.name}</h2>
          <p className="text-olive-leaf mt-1">Referral Code: {student.referralCode}</p>
          <p className="text-black-forest/80 mt-1">Total Spent: ₹{student.totalSpent.toFixed(0)}</p>
          {(student.class || student.section || student.rollNo) && (
            <p className="text-black-forest/70 text-sm mt-1">
              {[student.class, student.section, student.rollNo].filter(Boolean).join(" • ")}
            </p>
          )}
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <h3 className="text-lg font-semibold text-black-forest mb-3">Orders</h3>
          {orders.length === 0 ? (
            <p className="text-black-forest/70 text-center py-4">No orders yet.</p>
          ) : (
            <div className="space-y-2">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex justify-between items-center py-2 px-3 rounded-lg bg-cornsilk/50 border border-light-caramel/20"
                >
                  <span className="text-black-forest font-medium">
                    {order.snackName} × {order.quantity}
                  </span>
                  <span className="text-olive-leaf font-medium">₹{order.payableAmount.toFixed(0)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-light-caramel/30">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-lg border border-black-forest/30 text-black-forest hover:bg-black-forest/5 transition-all font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
