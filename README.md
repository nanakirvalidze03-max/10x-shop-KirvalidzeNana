 HEAD
# 10X Shop

## About
10X Shop is a single-page online store built with **React 19, TypeScript (strict) and Tailwind CSS v4**. Products come from the public DummyJSON API. Login and checkout are local simulations: there is no real authentication and no real payment.

## Features
**CORE**
- Catalog from `GET /products` with loading / error / empty states, `ProductCard` + `ProductGrid` (`map()` with stable `key`), responsive grid
- Product details (`/products/:id`): gallery, price with discount, stock states, quantity stepper, Add to cart, 404 handling
- Cart (Context + reducer): add, change quantity, remove, totals, saved in `localStorage` (`shop_cart`)
- Simple Login (`AuthContext`, controlled form, validation); guests are redirected from `/checkout` to `/login` and back after login
- Checkout: controlled form with validation, order summary, "Thank you!" confirmation, cart is cleared
- Layout route (Header / Footer), 404 page, ScrollToTop, Error Boundary

**FULL (chosen subset)**
- Catalog search (debounced 400 ms), category filter, sorting and pagination; all state lives in the URL; `AbortController` cancels stale requests
- Related products, read-only reviews tab, promo code `10X10`
- Orders list and details with status simulation (Processing → Shipped → Delivered)
- Dark mode with design tokens in `@theme`
- Sign Up page (`/signup`) with 5 fields and 5 exact validation messages; accounts are saved in `shop_users`; a registered email must log in with its own password
- Easter eggs: confetti + congratulations after an order, and a secret: click the logo 5 times quickly
- Route-level lazy loading (`React.lazy` + `Suspense`)
- Type guards for API / localStorage data, generic `useDebounce<T>`, discriminated unions (`AsyncState<T>`, `CartAction`)

## Tech Stack
Vite · React 19 · TypeScript · React Router · Tailwind CSS v4 (`@tailwindcss/vite`) · ESLint (typescript-eslint, react-hooks)

## Architecture
```
src/
  api/        ApiError.ts, products.api.ts   (fetch + response validation)
  types/      product, cart, order, user, catalog, api
  context/    AuthContext, CartContext (+ cart.reducer.ts), ThemeContext, ToastContext
  hooks/      useDebounce
  components/ layout/ ui/ product/            (reusable pieces)
  pages/      Catalog, Product, Cart, Login, Checkout, Orders, OrderDetails, NotFound
  routes/     ProtectedRoute
  utils/      format, cart (totals), validation, url, storage, guards, orders, errors, nav
```
Data flow: user action → event handler → Context function / `setState` → new immutable state → React re-renders. API requests start in `useEffect`; loading/error/empty are shown with conditional rendering. The cart reducer is a pure function; a `useEffect` in `CartProvider` saves the state to `localStorage`.

## How to Run
```bash
npm install
npm run dev        # http://localhost:5173
```

## Scripts
| Script | What it does |
|---|---|
| `npm run dev` | start the dev server |
| `npm run build` | typecheck + production build |
| `npm run preview` | preview the production build |
| `npm run typecheck` | `tsc --noEmit` (strict) |
| `npm run lint` | ESLint (`no-explicit-any` is an error) |

## Live Demo
<PASTE YOUR VERCEL / NETLIFY LINK HERE>

SPA refresh works: `vercel.json` and `public/_redirects` rewrite every path to `index.html`.

## Test Account
Any username with a password of 6+ characters works (login is a simulation), for example `emilys` / `emilyspass`. Or create an account on `/signup`; then log in with that email and password. Promo code: `10X10`.

## Security note
Sign Up stores the password as plain text in `localStorage` only because this is a learning project without a backend. A real shop must hash passwords on a server.

## Credits
- AI assistance: Claude (see `ai-log.md`)
- Data: [DummyJSON](https://dummyjson.com)
- Friends / classmates who helped: <write names or "none">


## Live Demo
🌐 საიტის ნახვა შეგიძლია აქ: [10x-shop Live Link](https://10x-shop-kirvalidze-nana-1nsb.vercel.app)
