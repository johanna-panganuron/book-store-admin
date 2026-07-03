# Bookstore Admin

A small React (Vite) admin UI for an online bookstore, built as a technical exam for YM Cargo.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router DOM
- Axios

## How to Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Test Accounts

- **Manager** (has cost price permission): `manager@test.com` / `password`
- **Staff** (no cost price permission): `staff@test.com` / `password`

## Features

1. **Login** — CSRF-safe login with Laravel Sanctum (cookie-based). Field-level validation errors displayed next to inputs.
2. **Books list** — Paginated table with title, author, and retail price.
3. **Permission-gated cost price** — "View cost price" button is only rendered (not just hidden) for users with `books.cost_price.view` permission. Staff users never see the button at all.
4. **Sensitive data flow** — Cost price is never in the DOM until a reason is submitted and the API call succeeds.
5. **Edit book** — Inline modal form with 422 field error handling per field.
6. **Logout** — Clears session via API.

## What I Used AI For

- Scaffolding the initial file structure and component shells
- Drafting the Axios API client and Sanctum CSRF setup
- Tailwind utility class suggestions for the table and modal layouts

All logic decisions (permission gating, sensitive data flow, error handling strategy) were made independently and I can explain any part of the code.

## What I Would Do Differently with More Time

- Add optimistic UI updates for the edit flow
- Add a search/filter bar on the books list
- Add a toast notification system for success/error feedback
- Write unit tests for the permission logic and modal flows
- Handle token expiry (401) globally with an Axios interceptor that redirects to login automatically

## Decisions I'm Unsure About

- The API response shape (nested `data.data` vs flat `data`) — I handled both cases defensively since I couldn't fully confirm the exact shape. If data doesn't render, this is the first place to check.
- Whether pagination metadata comes in `meta` or top-level — I handle both.
