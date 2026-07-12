import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 p-8">
          <div className="max-w-md text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-accent-rose/10 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-accent-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-surface-900 dark:text-white">Something went wrong</h1>
            <p className="text-sm text-surface-500">An unexpected error occurred. Please try refreshing the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/15"
            >Refresh Page</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
