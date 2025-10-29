import React from "react"
import { AdminErrorBoundary } from "@/components/AdminErrorBoundary"
import AdminNavbar from "@/components/AdminNavbar"
import AuthRouterProvider from "@/providers/AuthRouterProvider"

interface AdminLayoutProps {
    children: React.ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    return (
        <AuthRouterProvider>
            <AdminErrorBoundary>
                <div className="min-h-screen bg-gray-50">
                    <AdminNavbar />
                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </AdminErrorBoundary>
        </AuthRouterProvider>
    );
};

export default AdminLayout