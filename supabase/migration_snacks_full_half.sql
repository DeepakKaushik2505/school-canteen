-- Add image and halfPrice to snacks table
alter table snacks add column if not exists image text;
alter table snacks add column if not exists "halfPrice" numeric;
