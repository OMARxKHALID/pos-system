"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="w-full max-w-sm bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/60 p-6">
            <div className="text-center space-y-4">
              {/* Icon */}
              <div className="mx-auto w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>

              {/* Title */}
              <div>
                <h1 className="text-lg font-semibold text-gray-900 mb-1">
                  Oops! Something went wrong
                </h1>
                <p className="text-sm text-gray-600">
                  We encountered an unexpected error. Please try again.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  onClick={this.handleReset}
                  className="w-full h-9 bg-primary hover:bg-primary/90 text-sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>

                <Link href="/">
                  <Button
                    variant="outline"
                    className="w-full h-9 text-sm bg-white/60 border-gray-200 hover:bg-white"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go to POS
                  </Button>
                </Link>
              </div>

              {/* Development Error Details */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="text-left pt-4 border-t border-gray-100">
                  <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700 font-medium">
                    Error Details (Development)
                  </summary>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <pre className="text-xs text-gray-700 overflow-auto whitespace-pre-wrap">
                      {this.state.error && this.state.error.toString()}
                      {this.state.errorInfo &&
                        this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
