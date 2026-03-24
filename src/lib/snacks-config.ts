import type { Snack } from "./types";

export const SNACKS_DISPLAY = [
  { name: "Momos", image: "/assets/momos.webp", fullPrice: 60, halfPrice: 35 },
  { name: "Patties", image: "/assets/patties.webp", fullPrice: 25, halfPrice: 15 },
  { name: "Sandwich", image: "/assets/sandwich.webp", fullPrice: 40, halfPrice: 25 },
  { name: "Samosa", image: "/assets/samosa.webp", fullPrice: 20, halfPrice: 12 },
  { name: "Burger", image: "/assets/burger.webp", fullPrice: 50, halfPrice: 30 },
  { name: "Chai", image: "/assets/chai.webp", fullPrice: 15, halfPrice: 10 },
  { name: "Chilli Potato", image: "/assets/chilli-potato.webp", fullPrice: 55, halfPrice: 35 },
  { name: "Chowmein", image: "/assets/chowmein.webp", fullPrice: 50, halfPrice: 30 },
  { name: "Coke", image: "/assets/coke.webp", fullPrice: 25, halfPrice: 15 },
  { name: "Cold Coffee", image: "/assets/cold-coffee.webp", fullPrice: 40, halfPrice: 25 },
  { name: "Fries", image: "/assets/fries.webp", fullPrice: 45, halfPrice: 28 },
] as const;

export function getSnacksFallback(): Snack[] {
  return SNACKS_DISPLAY.map((d, i) => ({
    id: `fallback-${i}`,
    name: d.name,
    price: d.fullPrice,
    halfPrice: d.halfPrice,
    ordersCount: 0,
    image: d.image,
  }));
}
