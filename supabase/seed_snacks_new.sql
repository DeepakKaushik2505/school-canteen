-- Replace snacks with Momos, Patties, Sandwich, Samosa
-- Run after migration_snacks_full_half.sql
-- Delete existing snacks first (orders may need to be cleared if they reference old snacks)
delete from snacks;

insert into snacks (name, price, "halfPrice", image, "ordersCount") values
  ('Momos', 60, 35, '/assets/momos.webp', 0),
  ('Patties', 25, 15, '/assets/patties.webp', 0),
  ('Sandwich', 40, 25, '/assets/sandwich.webp', 0),
  ('Samosa', 20, 12, '/assets/samosa.webp', 0);
