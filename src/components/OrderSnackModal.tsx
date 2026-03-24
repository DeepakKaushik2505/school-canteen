"use client";

import { useState } from "react";
import type { Snack } from "@/lib/types";

interface OrderSnackModalProps {
  snacks: Snack[];
  studentId: string;
  onClose: () => void;
  onConfirm: (snackId: string, snackName: string, quantity: number, pricePerUnit: number) => void;
}

export function OrderSnackModal({ snacks, studentId, onClose, onConfirm }: OrderSnackModalProps) {
  const [snackId, setSnackId] = useState(snacks[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [plateType, setPlateType] = useState<"full" | "half">("full");

  const selectedSnack = snacks.find((s) => s.id === snackId);
  const fullPrice = selectedSnack?.price ?? 0;
  const halfPrice = selectedSnack?.halfPrice ?? Math.round(fullPrice / 2);
  const pricePerUnit = plateType === "full" ? fullPrice : halfPrice;
  const total = pricePerUnit * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSnack) return;
    onConfirm(snackId, selectedSnack.name, quantity, pricePerUnit);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="gradient-card rounded-xl shadow-xl max-w-md w-full p-6 border border-light-caramel/30"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-black-forest mb-4">Place New Order</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black-forest mb-2">Snack</label>
            <select
              value={snackId}
              onChange={(e) => setSnackId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-olive-leaf/30 bg-white text-black-forest focus:ring-2 focus:ring-olive-leaf focus:border-transparent"
              required
            >
              {snacks.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} - Full ₹{s.price} / Half ₹{s.halfPrice ?? Math.round(s.price / 2)}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black-forest mb-2">Plate size</label>
            <div className="flex gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-olive-leaf/30 bg-white cursor-pointer hover:bg-cornsilk/50 has-[:checked]:ring-2 has-[:checked]:ring-olive-leaf">
                <input
                  type="radio"
                  name="plateType"
                  value="full"
                  checked={plateType === "full"}
                  onChange={() => setPlateType("full")}
                  className="sr-only"
                />
                <span>Full ₹{fullPrice}</span>
              </label>
              <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-olive-leaf/30 bg-white cursor-pointer hover:bg-cornsilk/50 has-[:checked]:ring-2 has-[:checked]:ring-olive-leaf">
                <input
                  type="radio"
                  name="plateType"
                  value="half"
                  checked={plateType === "half"}
                  onChange={() => setPlateType("half")}
                  className="sr-only"
                />
                <span>Half ₹{halfPrice}</span>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black-forest mb-2">Quantity (1-5)</label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-olive-leaf/30 bg-white text-black-forest focus:ring-2 focus:ring-olive-leaf focus:border-transparent"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <p className="text-sm text-black-forest/70 mb-4">Total: ₹{total.toFixed(0)}</p>

          <div className="flex gap-3">
            <button
              type="submit"
              className="gradient-button text-cornsilk px-4 py-2 rounded-lg font-medium shadow transition-all flex-1"
            >
              Confirm Order
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-black-forest/30 text-black-forest hover:bg-black-forest/5 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
