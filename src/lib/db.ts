import { supabase } from "./supabase";
import type { Snack, Student, Order } from "./types";
import { SNACKS_DISPLAY } from "./snacks-config";

// Snacks - merge Supabase data with display config (image, halfPrice)
export async function fetchSnacks(): Promise<Snack[]> {
  await Promise.all(
    SNACKS_DISPLAY.map((d) => ensureSnackExists(d.name, d.fullPrice, d.halfPrice, d.image))
  );
  const { data, error } = await supabase
    .from("snacks")
    .select("*")
    .in("name", SNACKS_DISPLAY.map((d) => d.name))
    .order("name");
  if (error) throw error;
  const dbSnacks = data ?? [];
  return SNACKS_DISPLAY.map((display) => {
    const db = dbSnacks.find((r) => r.name === display.name);
    return {
      id: db?.id ?? "",
      name: display.name,
      price: Number(db?.price ?? display.fullPrice),
      halfPrice: db?.halfPrice != null ? Number(db.halfPrice) : display.halfPrice,
      ordersCount: db?.ordersCount ?? 0,
      image: display.image,
    };
  }).filter((s) => s.id);
}

// Ensure snack exists in DB (for ordering); returns snack id
export async function ensureSnackExists(
  name: string,
  fullPrice: number,
  _halfPrice?: number,
  _image?: string
): Promise<string> {
  const { data: existing } = await supabase.from("snacks").select("id").eq("name", name).maybeSingle();
  if (existing) return existing.id;
  const { data: inserted, error } = await supabase
    .from("snacks")
    .insert({ name, price: fullPrice, ordersCount: 0 })
    .select("id")
    .single();
  if (error) throw error;
  return inserted.id;
}

// Students
export async function fetchStudents(): Promise<Student[]> {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .order("name");
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    referralCode: r.referralCode,
    totalSpent: Number(r.totalSpent ?? 0),
    userId: r.userId ?? null,
    class: r.class ?? null,
    section: r.section ?? null,
    rollNo: r.rollNo ?? null,
  }));
}

// Student detail with orders (join orders + snacks for snackName)
export async function fetchStudentWithOrders(studentId: string): Promise<{
  student: Student | null;
  orders: Order[];
}> {
  const [studentRes, ordersRes] = await Promise.all([
    supabase.from("students").select("*").eq("id", studentId).single(),
    supabase
      .from("orders")
      .select(`
        id,
        studentId,
        snackId,
        quantity,
        payableAmount,
        createdAt,
        snacks ( name )
      `)
      .eq("studentId", studentId)
      .order("createdAt", { ascending: false }),
  ]);

  if (studentRes.error && studentRes.error.code !== "PGRST116") throw studentRes.error;
  if (ordersRes.error) throw ordersRes.error;

  const student = studentRes.data
    ? {
        id: studentRes.data.id,
        name: studentRes.data.name,
        referralCode: studentRes.data.referralCode,
        totalSpent: Number(studentRes.data.totalSpent ?? 0),
        userId: studentRes.data.userId ?? null,
        class: studentRes.data.class ?? null,
        section: studentRes.data.section ?? null,
        rollNo: studentRes.data.rollNo ?? null,
      }
    : null;

  const orders: Order[] = (ordersRes.data ?? []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    studentId: r.studentId as string,
    snackId: r.snackId as string,
    snackName: (r.snacks as { name: string } | null)?.name ?? "",
    quantity: r.quantity as number,
    payableAmount: Number(r.payableAmount),
    createdAt: r.createdAt as string,
  }));

  return { student, orders };
}

// Get student by Clerk userId
export async function getStudentByUserId(userId: string): Promise<Student | null> {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("userId", userId)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  if (!data) return null;
  return {
    id: data.id,
    name: data.name,
    referralCode: data.referralCode,
    totalSpent: Number(data.totalSpent ?? 0),
    userId: data.userId ?? null,
    class: data.class ?? null,
    section: data.section ?? null,
    rollNo: data.rollNo ?? null,
  };
}

// Create or get student for Clerk user (used on first login)
export async function ensureStudentForUser(userId: string, name: string): Promise<Student> {
  const existing = await getStudentByUserId(userId);
  if (existing) return existing;
  return createStudent(name, userId);
}

// Create student (with optional Clerk userId and class/section/rollNo)
export async function createStudent(
  name: string,
  userId?: string | null,
  extra?: { class?: string | null; section?: string | null; rollNo?: string | null }
): Promise<Student> {
  const referralCode = `${name.slice(0, 2).toUpperCase()}-${Math.random().toString(36).slice(2, 4).toUpperCase()}-2024`;
  const insertData: Record<string, unknown> = { name, referralCode, totalSpent: 0, userId: userId ?? null };
  if (extra?.class) insertData.class = extra.class;
  if (extra?.section) insertData.section = extra.section;
  if (extra?.rollNo) insertData.rollNo = extra.rollNo;
  const { data, error } = await supabase
    .from("students")
    .insert(insertData)
    .select()
    .single();
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    referralCode: data.referralCode,
    totalSpent: Number(data.totalSpent ?? 0),
    userId: data.userId ?? null,
    class: data.class ?? null,
    section: data.section ?? null,
    rollNo: data.rollNo ?? null,
  };
}

// Create order + update snack ordersCount + update student totalSpent
export async function createOrder(
  studentId: string,
  snackId: string,
  snackName: string,
  quantity: number,
  price: number
): Promise<Order> {
  const payableAmount = price * quantity;

  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({ studentId, snackId, quantity, payableAmount })
    .select()
    .single();
  if (orderError) throw orderError;

  const { data: snack } = await supabase.from("snacks").select("ordersCount").eq("id", snackId).single();
  const newOrdersCount = (snack?.ordersCount ?? 0) + quantity;
  const { error: snackError } = await supabase.from("snacks").update({ ordersCount: newOrdersCount }).eq("id", snackId);
  if (snackError) throw snackError;

  const { data: student } = await supabase.from("students").select("totalSpent").eq("id", studentId).single();
  const newTotalSpent = Number(student?.totalSpent ?? 0) + payableAmount;
  const { error: studentError } = await supabase
    .from("students")
    .update({ totalSpent: newTotalSpent })
    .eq("id", studentId);
  if (studentError) throw studentError;

  return {
    id: orderData.id,
    studentId: orderData.studentId,
    snackId: orderData.snackId,
    snackName,
    quantity: orderData.quantity,
    payableAmount: Number(orderData.payableAmount),
    createdAt: orderData.createdAt,
  };
}
