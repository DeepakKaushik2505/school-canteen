"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { SignInButton, useUser } from "@clerk/nextjs";
import { OrderModal } from "@/components/OrderModal";
import { fetchSnacks, createOrder, getStudentByUserId, ensureSnackExists } from "@/lib/db";
import { getSnacksFallback } from "@/lib/snacks-config";
import type { Snack, Student } from "@/lib/types";

export default function SnacksPage() {
  const { isSignedIn, user } = useUser();
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderSnack, setOrderSnack] = useState<Snack | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [expandedSnackId, setExpandedSnackId] = useState<string | null>(null);
  const [quantityMap, setQuantityMap] = useState<Record<string, number>>({});

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const snacksData = await fetchSnacks();
        setSnacks(snacksData);
      } catch {
        setSnacks(getSnacksFallback());
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!isSignedIn || !user?.id) {
      setCurrentStudent(null);
      return;
    }
    getStudentByUserId(user.id)
      .then(setCurrentStudent)
      .catch(() => setCurrentStudent(null));
  }, [isSignedIn, user?.id]);

  const handleAddClick = (snack: Snack) => {
    if (!isSignedIn || !currentStudent) return;
    setExpandedSnackId(snack.id);
    setQuantityMap((prev) => ({ ...prev, [snack.id]: 1 }));
  };

  const handleQuantityChange = (snackId: string, delta: number) => {
    setQuantityMap((prev) => {
      const current = prev[snackId] ?? 1;
      const next = Math.min(5, Math.max(1, current + delta));
      return { ...prev, [snackId]: next };
    });
  };

  const handleAddToOrderClick = (snack: Snack) => {
    const qty = quantityMap[snack.id] ?? 1;
    setOrderQuantity(qty);
    setOrderSnack(snack);
    setExpandedSnackId(null);
  };

  const handleConfirmOrder = async (studentId: string, quantity: number, pricePerUnit: number) => {
    if (!orderSnack) return;
    try {
      let snackId = orderSnack.id;
      if (snackId.startsWith("fallback-")) {
        snackId = await ensureSnackExists(orderSnack.name, orderSnack.price, orderSnack.halfPrice ?? undefined, orderSnack.image ?? undefined);
      }
      await createOrder(studentId, snackId, orderSnack.name, quantity, pricePerUnit);
      try {
        const [snacksData, student] = await Promise.all([
          fetchSnacks(),
          user ? getStudentByUserId(user.id) : Promise.resolve(null),
        ]);
        setSnacks(snacksData);
        setCurrentStudent(student ?? null);
      } catch {
        // Keep current snacks if refresh fails
      }
      setOrderSnack(null);
      setExpandedSnackId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-black-forest/80">Loading snacks…</div>
    );
  }

  const canOrder = isSignedIn && currentStudent;

  return (
    <div>
      <h1 className="text-3xl font-bold text-olive-leaf mb-6 text-center">
        Snacks
      </h1>

      {error && (
        <div className="gradient-card rounded-xl p-4 mb-6 border border-red-200 bg-red-50 flex items-center justify-between gap-4">
          <p className="text-red-700 text-sm">{error}</p>
          <button onClick={() => setError(null)} className="text-red-700 underline text-sm shrink-0">Dismiss</button>
        </div>
      )}
      {!isSignedIn && (
        <div className="gradient-card rounded-xl p-4 mb-6 border border-light-caramel/30 flex items-center justify-between gap-4">
          <p className="text-black-forest/80">Sign in to add items to your order.</p>
          <SignInButton mode="modal">
            <button className="gradient-button text-cornsilk px-4 py-2 rounded-lg font-medium shadow hover:shadow-md transition-all shrink-0">
              Login
            </button>
          </SignInButton>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {snacks.map((snack) => (
          <div
            key={snack.id}
            className="gradient-card rounded-xl overflow-hidden border border-light-caramel/30 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="relative aspect-square bg-black-forest/5">
              {snack.image ? (
                <Image
                  src={snack.image}
                  alt={snack.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-black-forest/30 text-4xl">
                  {snack.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-black-forest">{snack.name}</h3>
              <div className="flex gap-3 mt-2 text-sm">
                <span className="text-olive-leaf font-medium">Full: ₹{snack.price}</span>
                <span className="text-black-forest/70">Half: ₹{snack.halfPrice ?? Math.round(snack.price / 2)}</span>
              </div>
              {canOrder ? (
                expandedSnackId === snack.id ? (
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() => handleQuantityChange(snack.id, -1)}
                      className="w-9 h-9 rounded-lg border border-olive-leaf/30 bg-white text-olive-leaf font-bold hover:bg-olive-leaf/10 transition-all shrink-0"
                    >
                      −
                    </button>
                    <span className="flex-1 text-center font-medium text-black-forest min-w-[2rem]">
                      {quantityMap[snack.id] ?? 1}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(snack.id, 1)}
                      className="w-9 h-9 rounded-lg border border-olive-leaf/30 bg-white text-olive-leaf font-bold hover:bg-olive-leaf/10 transition-all shrink-0"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleAddToOrderClick(snack)}
                      className="gradient-button text-cornsilk px-3 py-2 rounded-lg font-medium shadow text-sm shrink-0"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddClick(snack)}
                    className="gradient-button text-cornsilk w-full mt-4 px-4 py-2 rounded-lg font-medium shadow hover:shadow-md transition-all"
                  >
                    Add
                  </button>
                )
              ) : (
                <SignInButton mode="modal">
                  <button className="gradient-button text-cornsilk w-full mt-4 px-4 py-2 rounded-lg font-medium shadow hover:shadow-md transition-all">
                    Add
                  </button>
                </SignInButton>
              )}
            </div>
          </div>
        ))}
      </div>

      {orderSnack && currentStudent && (
        <OrderModal
          snack={orderSnack}
          student={currentStudent}
          initialQuantity={orderQuantity}
          onClose={() => setOrderSnack(null)}
          onConfirm={handleConfirmOrder}
        />
      )}
    </div>
  );
}
