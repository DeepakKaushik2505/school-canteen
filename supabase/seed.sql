-- Seed data - run after schema.sql when tables are empty
insert into snacks (name, price, "ordersCount") values
  ('Chips', 2.5, 0),
  ('Chocolate Bar', 3.0, 0),
  ('Fruit Cup', 2.0, 0),
  ('Sandwich', 4.5, 0),
  ('Juice Box', 1.5, 0);

insert into students (name, "referralCode", "totalSpent") values
  ('Emma Wilson', 'EM-WL-2024', 0),
  ('Liam Brown', 'LB-BR-2024', 0),
  ('Olivia Davis', 'OD-DV-2024', 0);
