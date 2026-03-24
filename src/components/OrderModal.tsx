"use client";

import { useState } from "react";
import Image from "next/image";
import type { Snack, Student } from "@/lib/types";

interface OrderModalProps {
  snack: Snack;
  student: Student;
  initialQuantity?: number;
  onClose: () => void;
  onConfirm: (studentId: string, quantity: number, pricePerUnit: number) => void;
}

export function OrderModal({ snack, student, initialQuantity = 1, onClose, onConfirm }: OrderModalProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [plateType, setPlateType] = useState<"full" | "half">("full");
  const fullPrice = snack.price;
  const halfPrice = snack.halfPrice ?? Math.round(snack.price / 2);
  const pricePerUnit = plateType === "full" ? fullPrice : halfPrice;
  const total = pricePerUnit * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(student.id, quantity, pricePerUnit);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="gradient-card rounded-xl shadow-xl max-w-md w-full p-6 border border-light-caramel/30 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-4 mb-4">
          {snack.image && (
            <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-black-forest/10">
              <Image
                src={snack.image}
                alt={snack.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-black-forest">{snack.name}</h2>
            <p className="text-sm text-black-forest/70 mt-1">Ordering as: {student.name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black-forest mb-2">Plate size</label>
            <div className="flex gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-olive-leaf/30 bg-white cursor-pointer hover:bg-cornsilk/50 has-[:checked]:ring-2 has-[:checked]:ring-olive-leaf has-[:checked]:border-olive-leaf">
                <input
                  type="radio"
                  name="plateType"
                  value="full"
                  checked={plateType === "full"}
                  onChange={() => setPlateType("full")}
                  className="sr-only"
                />
                <span className="font-medium text-black-forest">Full</span>
                <span className="text-olive-leaf">₹{fullPrice}</span>
              </label>
              <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-olive-leaf/30 bg-white cursor-pointer hover:bg-cornsilk/50 has-[:checked]:ring-2 has-[:checked]:ring-olive-leaf has-[:checked]:border-olive-leaf">
                <input
                  type="radio"
                  name="plateType"
                  value="half"
                  checked={plateType === "half"}
                  onChange={() => setPlateType("half")}
                  className="sr-only"
                />
                <span className="font-medium text-black-forest">Half</span>
                <span className="text-olive-leaf">₹{halfPrice}</span>
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
              Add to order
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
