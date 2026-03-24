-- Run if students.userId was created as uuid - Clerk IDs are strings
alter table students alter column "userId" type text using "userId"::text;
