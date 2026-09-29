import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component boundary:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center select-none bg-surface-interactive/30 rounded-xl border border-status-error/30">
          <div className="w-10 h-10 rounded-full bg-status-error/15 border border-status-error/30 flex items-center justify-center text-status-error mb-3 shadow-inner">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-content-primary mb-1">
            {this.props.fallbackTitle || 'Application Error Encountered'}
          </h3>
          <p className="text-xs text-content-muted max-w-xs mb-3 font-mono">
            {this.state.error?.message || 'An unexpected runtime error occurred.'}
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-interactive hover:bg-surface-selected border border-border-default text-xs text-content-primary font-semibold transition hover:scale-105 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Component</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
