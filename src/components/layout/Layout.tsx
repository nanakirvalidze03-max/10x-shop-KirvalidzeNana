import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { StatusMessage } from '../ui/StatusMessage';
import { Footer } from './Footer';
import { Header } from './Header';
import { Marquee } from './Marquee';
import { ScrollToTop } from './ScrollToTop';

// One shared layout for every route: Marquee + Header + page + Footer (written once).
export default function Layout() {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Marquee />
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        {/* key={pathname}: the boundary resets when the user navigates away from a broken page */}
        <ErrorBoundary key={pathname}>
          <Suspense fallback={<StatusMessage tone="info">Loading page...</StatusMessage>}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
