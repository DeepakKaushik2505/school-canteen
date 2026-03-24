import type { Student, Order } from "./types";

const firstNames = ["Aarav", "Ananya", "Arjun", "Diya", "Ishaan", "Kavya", "Rohan", "Saanvi", "Vivaan", "Aadhya", "Aditya", "Aryan", "Ishita", "Krishna", "Neha", "Priya", "Rahul", "Sneha", "Vikram", "Zara"];
const lastNames = ["Sharma", "Patel", "Singh", "Kumar", "Reddy", "Gupta", "Mehta", "Joshi", "Nair", "Rao", "Verma", "Agarwal", "Malhotra", "Khanna", "Kapoor", "Shah", "Desai", "Iyer", "Pillai", "Chopra"];

function generateReferralCode(name: string, i: number): string {
  const prefix = name.slice(0, 2).toUpperCase();
  return `${prefix}-${String(i).padStart(2, "0")}-2024`;
}

export const DUMMY_STUDENTS: Student[] = firstNames.map((firstName, i) => {
  const lastName = lastNames[i % lastNames.length];
  const name = `${firstName} ${lastName}`;
  return {
    id: `dummy-${i + 1}`,
    name,
    referralCode: generateReferralCode(firstName, i + 1),
    totalSpent: Math.floor(Math.random() * 500) + 50,
    userId: null,
    class: String((i % 12) + 1),
    section: ["A", "B", "C"][i % 3],
    rollNo: String((i % 40) + 1),
  };
});

const snackNames = ["Momos", "Patties", "Sandwich", "Samosa", "Burger", "Chai", "Chowmein", "Coke", "Fries", "Cold Coffee"];

export function getDummyOrdersForStudent(studentId: string): Order[] {
  const student = DUMMY_STUDENTS.find((s) => s.id === studentId);
  if (!student) return [];
  const numOrders = Math.floor(Math.random() * 5) + 1;
  const orders: Order[] = [];
  for (let i = 0; i < numOrders; i++) {
    const snack = snackNames[Math.floor(Math.random() * snackNames.length)];
    const quantity = Math.floor(Math.random() * 3) + 1;
    const price = Math.floor(Math.random() * 80) + 20;
    orders.push({
      id: `order-${studentId}-${i}`,
      studentId,
      snackId: `snack-${i}`,
      snackName: snack,
      quantity,
      payableAmount: price * quantity,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    });
  }
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
