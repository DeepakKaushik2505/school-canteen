# PROMPTS_USED.md

This file records the prompts/instructions provided by the user during this session.

## 1) Initial Build + Styling

1. Create a Next.js (App Router) project with TypeScript + Tailwind.
2. Set pages: Snacks, Students, Student Detail, Create Student.
3. Add page behaviors (order flow, student listing, details, create form).
4. Theme colors:
   - Olive Leaf `#606c38`
   - Black Forest `#283618`
   - Cornsilk `#fefae0`
   - Light Caramel `#dda15e`
5. Reusable gradients for headers/cards/buttons/page background.

## 2) Supabase Integration

6. Install Supabase SDK and create reusable client in `src/lib/supabase.ts`.
7. Replace mock `data.ts` usage with Supabase queries.
8. Create `snacks`, `students`, `orders` tables with relationships:
   - `students.id -> orders.studentId`
   - `snacks.id -> orders.snackId`
9. Update pages to fetch from Supabase.
10. Update order creation to insert order + update snack count + student spend.

## 3) Clerk Auth + Google OAuth

11. Install Clerk SDK and configure `ClerkProvider`.
12. Enable Google OAuth in Clerk and connect env vars.
13. Add Sign In button in navbar.
14. Replace Sign In with avatar initials (`UserButton`) when logged in.
15. Ensure dropdown supports account management and logout.

## 4) Link Clerk User to Student + Access Rules

16. Auto-create Student record on first login (based on Clerk user).
17. Update Create Student to include Clerk `userId`.
18. Remove student picker from order modal and use logged-in student.
19. Prevent ordering when user is not logged in.
20. Protect student detail/order actions with auth guards.
21. Save orders against logged-in student's Supabase ID.

## 5) Navbar/Auth UX Fixes

22. Keep Create Student visible in navbar permanently.
23. Clicking Create Student should open form (not Clerk sign-in).
24. Fix route-matching middleware issue causing `/students/create` to be protected.

## 6) Assets + Snacks UI

25. Create assets folder.
26. Build snack cards from asset images with:
   - image
   - name
   - full/half price
   - Add button
27. If not logged in, clicking Add should open login auth.
28. Use named snacks from assets and ignore home image initially.

## 7) Snacks Fallback + Extended Menu

29. Fix snacks page error state shown in screenshot.
30. Add more snack dummy cards:
   - burger, chai, chilli-potato, chowmein, coke, cold-coffee, fries
31. Update Snacks heading style (no background, olive, centered).
32. Add quantity controls (`+` / `-`) after Add for logged-in users.
33. Show "Sign in to add items..." only when actually logged out.

## 8) Home Page Restyle

34. Restyle first landing page:
   - transparent hero background from `home-pic`
   - larger stylish heading, left aligned
   - improved buttons
   - extra lines under heading
   - hero background only for viewport section
35. Add About Us section with canteen details.
36. Add `home-canteen` image on right side of About Us.
37. Add footer with all-rights-reserved style.
38. Make hero background full-screen width.
39. Shift hero content slightly right from extreme left (between left and center).
40. Add site logo metadata/favicon from `assets/logo`.
41. Fine-tune hero:
   - move content a bit more left
   - increase heading-text gap
   - reduce background prominence
   - dark olive-themed text color

## 9) Create Student Page Restyle + Fields

42. Restyle Create Student:
   - remove heading background
   - dark olive heading
   - center heading/form/buttons
43. Add input fields:
   - Class
   - Section
   - Roll No.

## 10) Students Page Table + Popup

44. Replace students cards with a table showing:
   - Name
   - Referral Code
   - Total Spent
   - Button for detail view
45. Use 20 dummy students.
46. Replace separate detail page navigation with popup/modal showing:
   - student info
   - orders list (snack name, quantity, payable amount)

---

## AI Tooling Used

- Cursor coding agent (this session)
- Model-assisted code generation, refactoring, and documentation drafting
