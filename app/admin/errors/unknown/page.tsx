"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  HelpCircle,
  ArrowLeft,
  Home,
  RefreshCw,
  AlertCircle,
  Zap,
  Wifi,
  Monitor,
  Copy,
  Check,
  Bug
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const UnknownErrorPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>({});

  const errorMessage = searchParams.get("message") || "Something unexpected happened";
  const errorCode = searchParams.get("code") || "UNKNOWN_ERROR";
  const errorId = searchParams.get("id") || `UNK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = searchParams.get("timestamp") || new Date().toISOString();

  useEffect(() => {
    // Collect diagnostic information
    const collectDiagnostics = async () => {
      const info: any = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        language: navigator.language,
        platform: navigator.platform,
        cookiesEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        connection: (navigator as any).connection?.effectiveType || 'unknown',
        memory: (performance as any).memory ? {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
        } : null,
      };

      // Check local storage
      try {
        localStorage.setItem('diagnostic_test', 'test');
        localStorage.removeItem('diagnostic_test');
        info.localStorage = 'available';
      } catch (e) {
        info.localStorage = 'unavailable';
      }

      // Check session storage
      try {
        sessionStorage.setItem('diagnostic_test', 'test');
        sessionStorage.removeItem('diagnostic_test');
        info.sessionStorage = 'available';
      } catch (e) {
        info.sessionStorage = 'unavailable';
      }

      setDiagnosticInfo(info);
    };

    collectDiagnostics();
  }, []);

  const handleCopyDiagnostics = async () => {
    const diagnostics = `
UNKNOWN ERROR REPORT
==================
Error ID: ${errorId}
Timestamp: ${timestamp}
Error Code: ${errorCode}
Message: ${errorMessage}

BROWSER INFORMATION
------------------
URL: ${diagnosticInfo.url || 'N/A'}
User Agent: ${diagnosticInfo.userAgent || 'N/A'}
Viewport: ${diagnosticInfo.viewport || 'N/A'}
Language: ${diagnosticInfo.language || 'N/A'}
Platform: ${diagnosticInfo.platform || 'N/A'}
Online: ${diagnosticInfo.onLine || 'N/A'}
Connection: ${diagnosticInfo.connection || 'N/A'}
Cookies: ${diagnosticInfo.cookiesEnabled || 'N/A'}
Local Storage: ${diagnosticInfo.localStorage || 'N/A'}
Session Storage: ${diagnosticInfo.sessionStorage || 'N/A'}

PERFORMANCE INFO
---------------
${diagnosticInfo.memory ? `
JS Heap Used: ${(diagnosticInfo.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB
JS Heap Total: ${(diagnosticInfo.memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB
JS Heap Limit: ${(diagnosticInfo.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB
` : 'Memory info not available'}

ADDITIONAL CONTEXT
-----------------
Generated: ${diagnosticInfo.timestamp || 'N/A'}
    `.trim();

    try {
      await navigator.clipboard.writeText(diagnostics);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy diagnostics:', err);
    }
  };

  const runDiagnostics = () => {
    const checks = [
      {
        name: "Internet Connection",
        icon: Wifi,
        status: diagnosticInfo.onLine ? "online" : "offline",
        details: `Connection: ${diagnosticInfo.connection || 'unknown'}`
      },
      {
        name: "Browser Compatibility",
        icon: Monitor,
        status: "good",
        details: `Modern browser detected`
      },
      {
        name: "Local Storage",
        icon: Zap,
        status: diagnosticInfo.localStorage === 'available' ? "working" : "error",
        details: `Status: ${diagnosticInfo.localStorage || 'checking...'}`
      },
      {
        name: "Memory Usage",
        icon: Zap,
        status: diagnosticInfo.memory && diagnosticInfo.memory.usedJSHeapSize < diagnosticInfo.memory.jsHeapSizeLimit * 0.8 ? "good" : "warning",
        details: diagnosticInfo.memory ?
          `${(diagnosticInfo.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB used` :
          'Not available'
      }
    ];

    return checks;
  };

  const diagnosticChecks = runDiagnostics();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="border-gray-300">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <HelpCircle className="h-8 w-8 text-gray-600" />
            </div>
            <CardTitle className="text-2xl text-gray-700">Unknown Error</CardTitle>
            <CardDescription className="text-lg">
              Something unexpected happened that we couldn't identify
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 mb-2">Error Information</h3>
                  <p className="text-sm text-gray-700 mb-3">{errorMessage}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 font-medium">Error ID:</span>
                      <div className="flex items-center space-x-2">
                        <code className="bg-gray-200 px-2 py-1 rounded text-gray-800">{errorId}</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCopyDiagnostics}
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
                      <span className="text-gray-600 font-medium">Type:</span>
                      <Badge variant="secondary" className="text-xs">
                        {errorCode}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Possible Causes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-800 mb-2">Possible causes:</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Browser compatibility issue or missing features</li>
                <li>• Temporary network or connectivity problem</li>
                <li>• Client-side JavaScript error or conflict</li>
                <li>• Insufficient browser resources (memory, storage)</li>
                <li>• Third-party extension or ad-blocker interference</li>
                <li>• Corrupted browser cache or cookies</li>
              </ul>
            </div>

            {/* Diagnostic Checks */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-3">System Diagnostics</h3>
              <div className="space-y-3">
                {diagnosticChecks.map((check, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <check.icon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-700">{check.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-blue-600">{check.details}</span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          check.status === 'good' || check.status === 'online' || check.status === 'working'
                            ? 'border-green-300 text-green-700'
                            : check.status === 'warning'
                            ? 'border-yellow-300 text-yellow-700'
                            : 'border-red-300 text-red-700'
                        }`}
                      >
                        {check.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Troubleshooting Steps */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-800 mb-2">Try these troubleshooting steps:</h3>
              <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
                <li>Refresh the page or try again in a few moments</li>
                <li>Clear your browser cache and cookies</li>
                <li>Disable browser extensions temporarily</li>
                <li>Try using an incognito/private browsing window</li>
                <li>Check your internet connection</li>
                <li>Try a different browser (Chrome, Firefox, Safari)</li>
                <li>Restart your browser completely</li>
              </ol>
            </div>

            {/* Browser Information */}
            <details className="text-xs text-gray-500">
              <summary className="cursor-pointer hover:text-gray-700 font-medium">
                Browser Information
              </summary>
              <div className="mt-2 bg-gray-100 p-3 rounded font-mono text-xs">
                <div>User Agent: {diagnosticInfo.userAgent || 'Loading...'}</div>
                <div>Platform: {diagnosticInfo.platform || 'Loading...'}</div>
                <div>Language: {diagnosticInfo.language || 'Loading...'}</div>
                <div>Viewport: {diagnosticInfo.viewport || 'Loading...'}</div>
                <div>Online: {String(diagnosticInfo.onLine)}</div>
                <div>Connection: {diagnosticInfo.connection || 'unknown'}</div>
                <div>Cookies: {String(diagnosticInfo.cookiesEnabled)}</div>
                <div>Local Storage: {diagnosticInfo.localStorage || 'checking...'}</div>
                <div>Session Storage: {diagnosticInfo.sessionStorage || 'checking...'}</div>
              </div>
            </details>

            {/* Support Information */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Bug className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-purple-800 mb-2">Still experiencing issues?</h3>
                  <p className="text-sm text-purple-700 mb-3">
                    If the error persists after trying the troubleshooting steps, please copy the diagnostic
                    information above and contact our support team.
                  </p>
                  <Button size="sm" variant="outline" className="text-purple-700 border-purple-300">
                    <Bug className="h-3 w-3 mr-2" />
                    Report Bug
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => router.refresh()}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Page
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

export default UnknownErrorPage;