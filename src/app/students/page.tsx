"use client";

import { useState } from "react";
import { StudentDetailModal } from "@/components/StudentDetailModal";
import { DUMMY_STUDENTS, getDummyOrdersForStudent } from "@/lib/dummy-students";
import type { Student, Order } from "@/lib/types";

export default function StudentsPage() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
    setSelectedOrders(getDummyOrdersForStudent(student.id));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-olive-leaf mb-6 text-center">
        Students
      </h1>

      <div className="gradient-card rounded-xl border border-light-caramel/30 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="gradient-header text-cornsilk">
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">Referral Code</th>
                <th className="px-4 py-3 text-left font-semibold">Total Spent</th>
                <th className="px-4 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {DUMMY_STUDENTS.map((student, i) => (
                <tr
                  key={student.id}
                  className={`border-b border-light-caramel/20 ${
                    i % 2 === 0 ? "bg-cornsilk/30" : "bg-white/50"
                  } hover:bg-olive-leaf/5 transition-colors`}
                >
                  <td className="px-4 py-3 text-black-forest font-medium">{student.name}</td>
                  <td className="px-4 py-3 text-olive-leaf font-mono text-sm">{student.referralCode}</td>
                  <td className="px-4 py-3 text-black-forest/90">₹{student.totalSpent}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleViewDetails(student)}
                      className="gradient-button text-cornsilk px-4 py-2 rounded-lg font-medium text-sm shadow hover:shadow-md transition-all"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          orders={selectedOrders}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
}
