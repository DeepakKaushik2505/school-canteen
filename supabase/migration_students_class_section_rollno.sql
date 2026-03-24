-- Add class, section, rollNo to students table
alter table students add column if not exists class text;
alter table students add column if not exists section text;
alter table students add column if not exists "rollNo" text;
