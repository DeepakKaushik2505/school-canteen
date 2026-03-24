"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { createStudent } from "@/lib/db";

function generateReferralCode(name: string): string {
  const prefix = name.slice(0, 2).toUpperCase();
  const random = Math.random().toString(36).slice(2, 4).toUpperCase();
  return `${prefix}-${random}-2024`;
}

export default function CreateStudentPage() {
  const router = useRouter();
  const { user } = useUser();
  const [name, setName] = useState("");
  const [classVal, setClassVal] = useState("");
  const [section, setSection] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (value.trim()) {
      setReferralCode(generateReferralCode(value));
    } else {
      setReferralCode("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter a name.");
      return;
    }
    try {
      setSubmitting(true);
      setError("");
      const student = await createStudent(trimmed, user?.id ?? null, {
        class: classVal.trim() || null,
        section: section.trim() || null,
        rollNo: rollNo.trim() || null,
      });
      router.push(`/students/${student.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create student");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-olive-leaf/30 bg-white text-black-forest placeholder-black-forest/40 focus:ring-2 focus:ring-olive-leaf focus:border-transparent";

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold text-olive-leaf mb-8 text-center">
        Create Student
      </h1>

      <div className="gradient-card rounded-xl p-6 border border-light-caramel/30 shadow-md w-full max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="w-full mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-black-forest mb-2 text-center">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter student name"
              className={inputClass}
              required
            />
          </div>

          <div className="w-full mb-4">
            <label htmlFor="class" className="block text-sm font-medium text-black-forest mb-2 text-center">
              Class
            </label>
            <input
              id="class"
              type="text"
              value={classVal}
              onChange={(e) => setClassVal(e.target.value)}
              placeholder="e.g. 10"
              className={inputClass}
            />
          </div>

          <div className="w-full mb-4">
            <label htmlFor="section" className="block text-sm font-medium text-black-forest mb-2 text-center">
              Section
            </label>
            <input
              id="section"
              type="text"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              placeholder="e.g. A"
              className={inputClass}
            />
          </div>

          <div className="w-full mb-4">
            <label htmlFor="rollNo" className="block text-sm font-medium text-black-forest mb-2 text-center">
              Roll No.
            </label>
            <input
              id="rollNo"
              type="text"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              placeholder="e.g. 15"
              className={inputClass}
            />
          </div>

          <div className="w-full mb-6">
            <label className="block text-sm font-medium text-black-forest mb-2 text-center">
              Referral Code (auto-generated)
            </label>
            <div className="px-3 py-2 rounded-lg border border-olive-leaf/20 bg-cornsilk/50 text-black-forest/80 font-mono text-sm text-center">
              {referralCode || "—"}
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
          )}

          <div className="flex gap-3 w-full">
            <button
              type="submit"
              disabled={submitting}
              className="gradient-button text-cornsilk px-4 py-2 rounded-lg font-medium shadow transition-all flex-1 disabled:opacity-70"
            >
              {submitting ? "Creating…" : "Create Student"}
            </button>
            <Link
              href="/students"
              className="px-4 py-2 rounded-lg border border-black-forest/30 text-black-forest hover:bg-black-forest/5 transition-all text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>

      <Link
        href="/students"
        className="inline-block mt-6 text-olive-leaf hover:underline font-medium text-center"
      >
        ← Back to Students
      </Link>
    </div>
  );
}
