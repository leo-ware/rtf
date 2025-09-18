"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface AdminErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export class AdminErrorBoundary extends React.Component<AdminErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: AdminErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Admin Error Boundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error reporting service
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.handleReset} />;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <Card className="border-red-200">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-2xl text-red-600">Something went wrong</CardTitle>
                <CardDescription className="text-lg">
                  The admin interface encountered an unexpected error
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Error Details */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-medium text-red-800 mb-2">Error Information</h3>
                      <p className="text-sm text-red-700 mb-3">
                        {this.state.error.message || "An unexpected error occurred in the admin interface"}
                      </p>
                      <div className="text-xs text-red-600">
                        <strong>Error:</strong> {this.state.error.name}
                      </div>
                    </div>
                  </div>
                </div>

                {/* What to do */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-800 mb-2">What you can do:</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Try refreshing the page or clicking "Try Again"</li>
                    <li>• Return to the admin dashboard and try a different page</li>
                    <li>• Check your internet connection</li>
                    <li>• Clear your browser cache if the problem persists</li>
                  </ul>
                </div>

                {/* Development Info */}
                {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                  <details className="text-xs text-gray-500">
                    <summary className="cursor-pointer hover:text-gray-700 font-medium">
                      Stack Trace (Development)
                    </summary>
                    <div className="mt-2 bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs overflow-x-auto">
                      <pre>{this.state.error.stack}</pre>
                      {this.state.errorInfo.componentStack && (
                        <>
                          <div className="mt-4 text-gray-300">Component Stack:</div>
                          <pre>{this.state.errorInfo.componentStack}</pre>
                        </>
                      )}
                    </div>
                  </details>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={this.handleReset}
                    variant="outline"
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                  <Link href="/admin" className="flex-1">
                    <Button className="w-full">
                      <Home className="h-4 w-4 mr-2" />
                      Admin Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export const useErrorBoundary = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
};