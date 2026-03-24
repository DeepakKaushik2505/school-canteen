"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { OrderSnackModal } from "@/components/OrderSnackModal";
import { fetchStudentWithOrders, fetchSnacks, createOrder, getStudentByUserId } from "@/lib/db";
import type { Student, Order } from "@/lib/types";

export default function StudentDetailPage() {
  const params = useParams();
  const { user } = useUser();
  const id = params.id as string;
  const [student, setStudent] = useState<Student | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [snacks, setSnacks] = useState<Awaited<ReturnType<typeof fetchSnacks>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [result, snacksData] = await Promise.all([
          fetchStudentWithOrders(id),
          fetchSnacks(),
        ]);
        setStudent(result.student);
        setOrders(result.orders);
        setSnacks(snacksData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // Only allow ordering if this is the current user's student record
  const currentStudent = user?.id && student?.userId === user.id;
  const canOrder = !!currentStudent;

  const handleConfirmOrder = async (
    snackId: string,
    snackName: string,
    quantity: number,
    price: number
  ) => {
    if (!student) return;
    try {
      await createOrder(student.id, snackId, snackName, quantity, price);
      const result = await fetchStudentWithOrders(id);
      setStudent(result.student);
      setOrders(result.orders);
      setShowOrderModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-black-forest/80">Loading…</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>{error}</p>
        <Link href="/students" className="text-olive-leaf hover:underline mt-2 inline-block">
          Back to Students
        </Link>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-black-forest/80">Student not found</p>
        <Link href="/students" className="text-olive-leaf hover:underline mt-2 inline-block">
          Back to Students
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-black-forest mb-6 gradient-header text-cornsilk -mx-4 -mt-8 px-4 py-6 rounded-b-xl shadow">
        Student Details
      </h1>

      <div className="gradient-card rounded-xl p-6 border border-light-caramel/30 shadow-md mb-6">
        <h2 className="text-xl font-semibold text-black-forest">{student.name}</h2>
        <p className="text-olive-leaf mt-2">Referral Code: {student.referralCode}</p>
        <p className="text-black-forest/80 mt-1">Total Spent: ${student.totalSpent.toFixed(2)}</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-black-forest">Orders</h3>
        {canOrder && (
          <button
            onClick={() => setShowOrderModal(true)}
            className="gradient-button text-cornsilk px-4 py-2 rounded-lg font-medium shadow hover:shadow-md transition-all"
          >
            Place New Order
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="gradient-card rounded-xl p-8 border border-light-caramel/30 text-center text-black-forest/70">
          No orders yet. {canOrder ? "Place a new order to get started." : ""}
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="gradient-card rounded-xl p-4 border border-light-caramel/30 flex justify-between items-center"
            >
              <div>
                <span className="font-medium text-black-forest">{order.snackName}</span>
                <span className="text-black-forest/70 ml-2">× {order.quantity}</span>
              </div>
              <span className="font-medium text-olive-leaf">${order.payableAmount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/students"
        className="inline-block mt-6 text-olive-leaf hover:underline font-medium"
      >
        ← Back to Students
      </Link>

      {showOrderModal && canOrder && (
        <OrderSnackModal
          snacks={snacks}
          studentId={student.id}
          onClose={() => setShowOrderModal(false)}
          onConfirm={handleConfirmOrder}
        />
      )}
    </div>
  );
}
