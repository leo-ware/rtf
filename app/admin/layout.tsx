import React from "react"
import { AdminErrorBoundary } from "@/components/AdminErrorBoundary"
import AdminNavbar from "@/components/AdminNavbar"

interface AdminLayoutProps {
    children: React.ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
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

export default AdminLayout