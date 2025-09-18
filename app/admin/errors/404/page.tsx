"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  ArrowLeft,
  Home,
  FileQuestion,
  Link as LinkIcon,
  Clock,
  Database
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const NotFoundPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const requestedUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
  const resourceType = searchParams.get("type") || "page";
  const resourceId = searchParams.get("id") || "";
  const suggestion = searchParams.get("suggestion") || "";

  const commonPages = [
    { name: "Admin Dashboard", path: "/admin", icon: Home },
    { name: "News Management", path: "/admin/news", icon: FileQuestion },
    { name: "User Management", path: "/admin/users", icon: Database },
    { name: "Image Library", path: "/admin/images", icon: Search },
    { name: "Events", path: "/admin/events", icon: Clock },
  ];

  const getResourceTypeDescription = (type: string) => {
    switch (type.toLowerCase()) {
      case "article":
        return "The news article you're looking for might have been moved, deleted, or the URL might be incorrect.";
      case "user":
        return "The user profile you're looking for might not exist or may have been removed.";
      case "image":
        return "The image you're looking for might have been deleted or moved to a different location.";
      case "event":
        return "The event you're looking for might have been cancelled, moved, or the URL might be incorrect.";
      default:
        return "The page you're looking for might have been moved, deleted, or the URL might be incorrect.";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="border-orange-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <FileQuestion className="h-8 w-8 text-orange-600" />
            </div>
            <CardTitle className="text-2xl text-orange-600">Page Not Found</CardTitle>
            <CardDescription className="text-lg">
              The {resourceType} you're looking for doesn't exist
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Details */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Search className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-orange-800 mb-2">Resource Not Found</h3>
                  <p className="text-sm text-orange-700 mb-3">
                    {getResourceTypeDescription(resourceType)}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between text-sm">
                      <span className="text-orange-600 font-medium flex-shrink-0">Requested URL:</span>
                      <code className="bg-orange-100 px-2 py-1 rounded text-orange-800 ml-3 text-right break-all">
                        {requestedUrl}
                      </code>
                    </div>
                    {resourceId && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-orange-600 font-medium">Resource ID:</span>
                        <code className="bg-orange-100 px-2 py-1 rounded text-orange-800">{resourceId}</code>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Suggestion */}
            {suggestion && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <LinkIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-medium text-blue-800 mb-2">Did you mean?</h3>
                    <p className="text-sm text-blue-700 mb-3">{suggestion}</p>
                    <Button size="sm" variant="outline" className="text-blue-700 border-blue-300">
                      Go to suggested page
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Common Reasons */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">Common reasons this might happen:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• The URL was typed incorrectly</li>
                <li>• The resource was moved or deleted</li>
                <li>• You don't have permission to view this resource</li>
                <li>• The link you followed is outdated or broken</li>
                <li>• The resource is temporarily unavailable</li>
              </ul>
            </div>

            {/* Quick Navigation */}
            <div>
              <h3 className="font-medium text-gray-800 mb-3">You might want to visit:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {commonPages.map((page, index) => (
                  <Link key={index} href={page.path}>
                    <Button
                      variant="outline"
                      className="w-full justify-start h-auto p-3"
                    >
                      <page.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span>{page.name}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            {/* Search Suggestion */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Search className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-green-800 mb-2">Still can't find what you're looking for?</h3>
                  <p className="text-sm text-green-700 mb-3">
                    Try searching through the admin dashboard or contact your administrator for assistance.
                  </p>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <details className="text-xs text-gray-500">
              <summary className="cursor-pointer hover:text-gray-700">Technical Details</summary>
              <div className="mt-2 bg-gray-100 p-3 rounded font-mono">
                <div>Timestamp: {new Date().toISOString()}</div>
                <div>Error Code: 404</div>
                <div>Requested Path: {pathname}</div>
                <div>Query Parameters: {searchParams.toString() || 'None'}</div>
                <div>Resource Type: {resourceType}</div>
                {resourceId && <div>Resource ID: {resourceId}</div>}
                <div>User Agent: {typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'}</div>
              </div>
            </details>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
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

export default NotFoundPage;