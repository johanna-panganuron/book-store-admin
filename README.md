# Bookstore Admin

A clean, responsive React (Vite) admin UI for an online bookstore, built as a technical assessment for YM Cargo.

## Live Demo
[https://book-store-admin-alpha.vercel.app](https://book-store-admin-alpha.vercel.app) *(Update this with your actual Vercel URL)*

## Tech Stack
- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router DOM
- Axios
- Lucide React (Icons)

## How to Run

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open `http://localhost:5173` in your browser.

## Test Accounts
- **Manager** (has cost price permission): `manager@test.com` / `password`
- **Staff** (no cost price permission): `staff@test.com` / `password`

## Features Implemented
- **Modern UI/UX** — Designed with a premium, minimal aesthetic using the "Plus Jakarta Sans" font, floating labels on login inputs, and smooth micro-animations.
- **Authentication** — Bearer token authentication. Field-level validation errors are mapped directly from the API to the UI inputs.
- **Paginated Books List** — Fetches books from the API with full server-side pagination support.
- **Client-Side Search** — A responsive search bar that instantly filters the current page of books by title or author, including a custom empty state UI.
- **Permission-Gated Cost Price** — The "View cost price" button strictly respects the `books.cost_price.view` permission from the `/api/me` payload.
- **Sensitive Data Protection** — Cost price requires a 5+ character reason via a modal. The price is never exposed in the DOM until the `POST` request succeeds.
- **Edit Book Form** — Modal form handling `PUT` updates, capturing 422 validation errors specifically to the correct fields.
- **Toast Notifications** — Non-blocking, animated success toast notifications confirming when specific books are successfully edited.

## What I Used AI For
I used AI extensively as a pair-programming partner during development to:
- Quickly scaffold boilerplate components, routing, and the Axios API client.
- Iterate on the UI/UX design (e.g., suggesting a cohesive color palette, implementing floating labels, choosing the "Plus Jakarta Sans" font).
- Rapidly build and style the UI components (Modals, Toast notifications, empty search states) using Tailwind CSS.
- Identify and resolve TypeScript strictness errors during Vercel deployments.

## What I Would Do Differently with More Time
- **Backend Search Integration**: I currently implemented client-side search because the provided API did not support a `search` query parameter. With more time (and backend access), I would implement server-side search to filter across all paginated pages.
- **Global Error Handling**: Implement an Axios interceptor to catch 401 Unauthorized responses globally and automatically redirect the user to the login screen.
- **Unit Testing**: Add unit tests specifically covering the permission-gated logic and sensitive data modal flow to ensure regressions don't expose cost prices.

## Decisions I'm Unsure About
- **API Pagination Metadata Shape**: The exam brief showed pagination inside a `meta` object, but depending on the framework version, it sometimes places these properties directly on the root object. I wrote the pagination parsing defensively to support both structures just in case.
