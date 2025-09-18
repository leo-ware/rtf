"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  ArrowLeft,
  Home,
  AlertTriangle,
  Lock,
  User,
  Crown
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const ForbiddenPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const action = searchParams.get("action") || "access this resource";
  const resource = searchParams.get("resource") || "resource";
  const requiredRole = searchParams.get("required") || "admin";
  const currentRole = searchParams.get("current") || "authorized";

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "dev":
        return <Crown className="h-4 w-4" />;
      case "admin":
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "dev":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "admin":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "dev":
        return "Full system access including user management and system configuration";
      case "admin":
        return "Administrative access to content management and user oversight";
      case "authorized":
        return "Basic access to view and manage assigned content";
      default:
        return "Limited access permissions";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="border-red-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-600">Access Forbidden</CardTitle>
            <CardDescription className="text-lg">
              You don't have permission to {action}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Details */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-red-800 mb-2">Permission Denied</h3>
                  <p className="text-sm text-red-700 mb-3">
                    The action you attempted requires elevated permissions that your account doesn't currently have.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-red-600 font-medium">Resource:</span>
                      <code className="bg-red-100 px-2 py-1 rounded text-red-800">{resource}</code>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-red-600 font-medium">Action:</span>
                      <span className="text-red-800">{action}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Permission Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-orange-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-orange-600 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Your Current Role
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge className={`${getRoleBadgeColor(currentRole)} border`}>
                      <span className="flex items-center space-x-1">
                        {getRoleIcon(currentRole)}
                        <span className="capitalize">{currentRole}</span>
                      </span>
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">
                    {getRoleDescription(currentRole)}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-green-600 flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Required Role
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge className={`${getRoleBadgeColor(requiredRole)} border`}>
                      <span className="flex items-center space-x-1">
                        {getRoleIcon(requiredRole)}
                        <span className="capitalize">{requiredRole}</span>
                      </span>
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">
                    {getRoleDescription(requiredRole)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* What to do next */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">What you can do:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Contact your administrator to request elevated permissions</li>
                <li>• Return to your dashboard to access available features</li>
                <li>• Check with your team lead about role requirements</li>
                <li>• Review the organization's access policy documentation</li>
              </ul>
            </div>

            {/* Error Details for Debugging */}
            <details className="text-xs text-gray-500">
              <summary className="cursor-pointer hover:text-gray-700">Technical Details</summary>
              <div className="mt-2 bg-gray-100 p-3 rounded font-mono">
                <div>Timestamp: {new Date().toISOString()}</div>
                <div>Error Code: 403</div>
                <div>Current Role: {currentRole}</div>
                <div>Required Role: {requiredRole}</div>
                <div>Resource: {resource}</div>
                <div>Action: {action}</div>
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

export default ForbiddenPage;