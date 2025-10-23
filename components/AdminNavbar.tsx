"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import {
    Home,
    FileText,
    DollarSign,
    Calendar,
    Camera,
    Users,
    Shield,
    Settings,
    BookOpen,
    Menu,
    X,
    BarChart3,
    Folder,
    Heart
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
    description?: string;
    requiresAdmin?: boolean;
    badge?: string;
}

const AdminNavbar = () => {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const currentUser = useQuery(api.users.getCurrentUser)
    const hasAdminAccess = currentUser?.atLeastAdmin ?? false
    const currentUserRole = currentUser?.role

    const navigationItems: NavItem[] = [
        {
            name: "Dashboard",
            href: "/admin",
            icon: Home,
            description: "Overview and statistics"
        },
        {
            name: "News",
            href: "/admin/news",
            icon: FileText,
            description: "Manage articles"
        },
        {
            name: "Events",
            href: "/admin/events",
            icon: Calendar,
            description: "Schedule events"
        },
        {
            name: "Animals",
            href: "/admin/animals",
            icon: Heart,
            description: "Manage animals"
        },
        {
            name: "Media",
            href: "/admin/images",
            icon: Camera,
            description: "Image library"
        },
        {
            name: "People",
            href: "/admin/people",
            icon: Users,
            description: "Manage team members"
        },
        {
            name: "Analytics",
            href: "/admin/analytics",
            icon: BarChart3,
            description: "View reports"
        }
    ].concat(hasAdminAccess ? [
        {
            name: "Users",
            href: "/admin/users",
            icon: Shield,
            description: "User management"
        }
    ]: []);

    const isActive = (href: string) => {
        if (href === "/admin") {
            return pathname === "/admin";
        }
        return pathname.startsWith(href);
    };

    const filteredNavItems = navigationItems.filter(item => {
        if (item.requiresAdmin) {
            return hasAdminAccess === true;
        }
        return true;
    });

    const getCurrentPageTitle = () => {
        const currentItem = navigationItems.find(item => isActive(item.href));
        if (currentItem) {
            return {
                title: currentItem.name,
                description: currentItem.description
            };
        }

        // Handle special cases
        if (pathname.includes("/profile")) {
            return { title: "Profile Settings", description: "Manage your account" };
        }
        if (pathname.includes("/pages")) {
            return { title: "Pages", description: "Website content" };
        }
        if (pathname.includes("/bootstrap")) {
            return { title: "Bootstrap", description: "System setup" };
        }
        if (pathname.includes("/errors")) {
            return { title: "Error", description: "Something went wrong" };
        }

        return { title: "Admin", description: "Administration panel" };
    };

    const { title, description } = getCurrentPageTitle();

    return (
        <div className="bg-white border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Header */}
                <div className="flex justify-between items-center py-4">
                    {/* Left Section - Title & Breadcrumb */}
                    <div className="flex items-center space-x-4">
                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="lg:hidden"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>

                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{title}</h1>
                            {description && (
                                <p className="text-gray-600 mt-1 text-sm lg:text-base">{description}</p>
                            )}
                        </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex items-center space-x-2 lg:space-x-4">
                        <Link href="/" className="hidden sm:block">
                            <Button variant="outline" size="sm">
                                <BookOpen className="h-4 w-4 mr-2" />
                                <span className="hidden md:inline">View Site</span>
                                <span className="md:hidden">Site</span>
                            </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="hidden lg:flex">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                        </Button>
                        <ProfileDropdown />
                    </div>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:block">
                    <nav className="flex space-x-8 pb-4">
                        {filteredNavItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                        active
                                            ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                    {item.badge && (
                                        <Badge variant="secondary" className="text-xs">
                                            {item.badge}
                                        </Badge>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden border-t bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                        <nav className="space-y-2">
                            {filteredNavItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            "flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-colors",
                                            active
                                                ? "text-blue-600 bg-blue-50"
                                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                        )}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <span>{item.name}</span>
                                                {item.badge && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        {item.badge}
                                                    </Badge>
                                                )}
                                            </div>
                                            {item.description && (
                                                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}

                            {/* Mobile-only links */}
                            <div className="border-t pt-4 mt-4">
                                <Link
                                    href="/"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                >
                                    <BookOpen className="h-5 w-5" />
                                    <span>View Site</span>
                                </Link>
                                <Link
                                    href="/admin/profile"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                >
                                    <Settings className="h-5 w-5" />
                                    <span>Settings</span>
                                </Link>
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminNavbar;