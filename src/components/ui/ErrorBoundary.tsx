import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
}

// Error Boundaries must be classes. They catch errors thrown while rendering their children,
// so one broken component does not blank the whole app.
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="mx-auto max-w-md rounded-2xl border-2 border-line bg-surface shadow-pop p-8 text-center">
          <h1 className="font-display text-2xl font-extrabold">Something went wrong.</h1>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 min-h-11 rounded-xl bg-brand px-4 py-2 font-semibold text-on-brand hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
