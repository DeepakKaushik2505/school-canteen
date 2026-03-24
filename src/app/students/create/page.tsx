"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createStudent } from "@/lib/db";

function generateReferralCode(name: string): string {
  const prefix = name.slice(0, 2).toUpperCase();
  const random = Math.random().toString(36).slice(2, 4).toUpperCase();
  return `${prefix}-${random}-2024`;
}

const createStudentSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  classVal: z.string().trim().regex(/^\d{1,2}$/, "Class must be a 1 or 2 digit number").optional(),
  section: z
    .string()
    .trim()
    .max(2, "Section should be an uppercase letter (e.g. A, B)")
    .optional(),
  rollNo: z
    .string()
    .trim()
    .regex(/^\d*$/, "Roll No. should contain only numbers")
    .optional(),
});

type CreateStudentFormValues = z.infer<typeof createStudentSchema>;

export default function CreateStudentPage() {
  const router = useRouter();
  const { user } = useUser();
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateStudentFormValues>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      name: "",
      classVal: "",
      section: "",
      rollNo: "",
    },
  });

  const name = watch("name");
  const referralCode = useMemo(
    () => (name?.trim() ? generateReferralCode(name) : ""),
    [name]
  );

  const onSubmit = async (values: CreateStudentFormValues) => {
    try {
      setSubmitting(true);
      setSubmitError("");
      const student = await createStudent(values.name.trim(), user?.id ?? null, {
        class: values.classVal?.trim() || null,
        section: values.section?.trim() || null,
        rollNo: values.rollNo?.trim() || null,
      });
      router.push(`/students/${student.id}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to create student"
      );
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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center">
          <div className="w-full mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-black-forest mb-2 text-center">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter student name"
              className={inputClass}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-600 text-xs mt-1 text-center">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="w-full mb-4">
            <label htmlFor="class" className="block text-sm font-medium text-black-forest mb-2 text-center">
              Class
            </label>
            <input
              id="class"
              type="text"
              placeholder="e.g. 10"
              className={inputClass}
              {...register("classVal")}
            />
          </div>

          <div className="w-full mb-4">
            <label htmlFor="section" className="block text-sm font-medium text-black-forest mb-2 text-center">
              Section
            </label>
            <input
              id="section"
              type="text"
              placeholder="e.g. A"
              className={inputClass}
              {...register("section")}
            />
            {errors.section && (
              <p className="text-red-600 text-xs mt-1 text-center">
                {errors.section.message}
              </p>
            )}
          </div>

          <div className="w-full mb-4">
            <label htmlFor="rollNo" className="block text-sm font-medium text-black-forest mb-2 text-center">
              Roll No.
            </label>
            <input
              id="rollNo"
              type="text"
              placeholder="e.g. 15"
              className={inputClass}
              {...register("rollNo")}
            />
            {errors.rollNo && (
              <p className="text-red-600 text-xs mt-1 text-center">
                {errors.rollNo.message}
              </p>
            )}
          </div>

          <div className="w-full mb-6">
            <label className="block text-sm font-medium text-black-forest mb-2 text-center">
              Referral Code (auto-generated)
            </label>
            <div className="px-3 py-2 rounded-lg border border-olive-leaf/20 bg-cornsilk/50 text-black-forest/80 font-mono text-sm text-center">
              {referralCode || "—"}
            </div>
          </div>

          {submitError && (
            <p className="text-red-600 text-sm mb-4 text-center">{submitError}</p>
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
