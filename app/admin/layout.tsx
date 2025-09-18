"use client";

import React, { useEffect } from "react";
import { AdminErrorBoundary } from "@/components/AdminErrorBoundary";
import AdminNavbar from "@/components/AdminNavbar";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const router = useRouter();
    const currentUser = useQuery(api.users.currentUser);

    // Check if user is authenticated
    if (currentUser === null) {
        // Redirect to login
        router.push('/login');

        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    // Show loading while checking authentication
    if (currentUser === undefined) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Authenticating...</p>
                </div>
            </div>
        );
    }

    return (
        <AdminErrorBoundary>
            <div className="min-h-screen bg-gray-50">
                <AdminNavbar />
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </AdminErrorBoundary>
    );
};

export default AdminLayout;