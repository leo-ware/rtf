"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  ArrowLeft,
  Home,
  RefreshCw,
  Bug,
  Server,
  Database,
  Copy,
  Check,
  Mail
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const ServerErrorPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const errorMessage = searchParams.get("message") || "An unexpected server error occurred";
  const errorCode = searchParams.get("code") || "INTERNAL_SERVER_ERROR";
  const errorId = searchParams.get("id") || `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = searchParams.get("timestamp") || new Date().toISOString();
  const stack = searchParams.get("stack") || "";

  const handleRetry = async () => {
    setRetrying(true);
    // Wait a moment for visual feedback
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.refresh();
    setRetrying(false);
  };

  const handleCopyError = async () => {
    const errorDetails = `
Error ID: ${errorId}
Timestamp: ${timestamp}
Error Code: ${errorCode}
Message: ${errorMessage}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
${stack ? `\nStack Trace:\n${stack}` : ''}
    `.trim();

    try {
      await navigator.clipboard.writeText(errorDetails);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy error details:', err);
    }
  };

  const getErrorTypeInfo = (code: string) => {
    switch (code) {
      case "DATABASE_ERROR":
        return {
          icon: Database,
          title: "Database Connection Error",
          description: "Unable to connect to or query the database",
          color: "text-red-600 bg-red-100"
        };
      case "AUTHENTICATION_ERROR":
        return {
          icon: Bug,
          title: "Authentication Error",
          description: "There was a problem verifying your credentials",
          color: "text-orange-600 bg-orange-100"
        };
      case "CONVEX_ERROR":
        return {
          icon: Server,
          title: "Backend Service Error",
          description: "The backend service encountered an unexpected error",
          color: "text-purple-600 bg-purple-100"
        };
      default:
        return {
          icon: AlertTriangle,
          title: "Internal Server Error",
          description: "An unexpected error occurred on our servers",
          color: "text-red-600 bg-red-100"
        };
    }
  };

  const errorInfo = getErrorTypeInfo(errorCode);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="border-red-200">
          <CardHeader className="text-center">
            <div className={`mx-auto w-16 h-16 ${errorInfo.color} rounded-full flex items-center justify-center mb-4`}>
              <errorInfo.icon className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl text-red-600">{errorInfo.title}</CardTitle>
            <CardDescription className="text-lg">
              {errorInfo.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Summary */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-red-800 mb-2">Error Details</h3>
                  <p className="text-sm text-red-700 mb-3">{errorMessage}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-red-600 font-medium">Error ID:</span>
                      <div className="flex items-center space-x-2">
                        <code className="bg-red-100 px-2 py-1 rounded text-red-800">{errorId}</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCopyError}
                          className="h-6 w-6 p-0"
                        >
                          {copied ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-red-600 font-medium">Timestamp:</span>
                      <code className="bg-red-100 px-2 py-1 rounded text-red-800 text-xs">
                        {new Date(timestamp).toLocaleString()}
                      </code>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-red-600 font-medium">Error Type:</span>
                      <Badge variant="destructive" className="text-xs">
                        {errorCode}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What happened */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-800 mb-2">What happened?</h3>
              <p className="text-sm text-yellow-700">
                Our servers encountered an unexpected error while processing your request.
                This is usually temporary and our development team has been automatically notified.
              </p>
            </div>

            {/* What to do */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">What you can do:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Try refreshing the page or retrying your action</li>
                <li>• Check if the issue persists after a few minutes</li>
                <li>• Try accessing a different admin page to see if the issue is specific</li>
                <li>• Clear your browser cache and cookies if the problem continues</li>
                <li>• Contact support with the error ID if the issue persists</li>
              </ul>
            </div>

            {/* System Status */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-800">System Status</h3>
                <Badge variant="outline" className="text-xs">
                  Live
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">API Server:</span>
                  <span className="text-green-600">●</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Database:</span>
                  <span className="text-green-600">●</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Authentication:</span>
                  <span className="text-green-600">●</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">File Storage:</span>
                  <span className="text-green-600">●</span>
                </div>
              </div>
            </div>

            {/* Support Information */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-green-800 mb-2">Need immediate help?</h3>
                  <p className="text-sm text-green-700 mb-2">
                    If this error is blocking critical operations, please contact our support team
                    with the error ID above.
                  </p>
                  <Button size="sm" variant="outline" className="text-green-700 border-green-300">
                    <Mail className="h-3 w-3 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>

            {/* Stack trace for development */}
            {stack && (
              <details className="text-xs text-gray-500">
                <summary className="cursor-pointer hover:text-gray-700 font-medium">
                  Stack Trace (Development)
                </summary>
                <div className="mt-2 bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs overflow-x-auto">
                  <pre>{stack}</pre>
                </div>
              </details>
            )}

            {/* Technical Details */}
            <details className="text-xs text-gray-500">
              <summary className="cursor-pointer hover:text-gray-700">Technical Details</summary>
              <div className="mt-2 bg-gray-100 p-3 rounded font-mono">
                <div>Error ID: {errorId}</div>
                <div>Timestamp: {timestamp}</div>
                <div>Error Code: {errorCode}</div>
                <div>URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</div>
                <div>User Agent: {typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'}</div>
              </div>
            </details>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleRetry}
                variant="outline"
                className="flex-1"
                disabled={retrying}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${retrying ? 'animate-spin' : ''}`} />
                {retrying ? 'Retrying...' : 'Try Again'}
              </Button>
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
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
};

export default ServerErrorPage;