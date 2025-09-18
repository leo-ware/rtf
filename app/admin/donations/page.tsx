"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

export default function AdminDonationsPage() {
    const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "failed" | "pending">("all");
    const [limit, setLimit] = useState(50);

    const donations = useQuery(api.donations.getAllDonations, {
        limit,
        status: statusFilter === "all" ? undefined : statusFilter,
    });

    const stats = useQuery(api.donations.getDonationStats);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            completed: "bg-green-100 text-green-800",
            failed: "bg-red-100 text-red-800",
            pending: "bg-yellow-100 text-yellow-800",
            processing: "bg-blue-100 text-blue-800",
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800"}`}>
                {status}
            </span>
        );
    };

    if (donations === undefined || stats === undefined) {
        return (
            <div className="p-8">
                <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-center text-gray-600 mt-4">Loading donation data...</p>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Total Donations</h3>
                    <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
                    <p className="text-sm text-gray-500">{stats.totalCount} donations</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Average Donation</h3>
                    <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.averageAmount)}</p>
                    <p className="text-sm text-gray-500">per donation</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">One-time Donations</h3>
                    <p className="text-3xl font-bold text-gray-900">{stats.oneTimeCount}</p>
                    <p className="text-sm text-gray-500">donations</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Recurring Donations</h3>
                    <p className="text-3xl font-bold text-gray-900">{stats.recurringCount}</p>
                    <p className="text-sm text-gray-500">monthly donors</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status Filter
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="all">All Statuses</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Results Limit
                        </label>
                        <select
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                        >
                            <option value={25}>25 results</option>
                            <option value={50}>50 results</option>
                            <option value={100}>100 results</option>
                            <option value={200}>200 results</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Donations Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Donations</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Donor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Transaction ID
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {donations && donations.length > 0 ? (
                                donations.map((donation) => (
                                    <tr key={donation._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {donation.isAnonymous ? "Anonymous" : donation.donorName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {donation.donorEmail}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900">
                                                {formatCurrency(donation.amount)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">
                                                {donation.isRecurring ? "Monthly" : "One-time"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(donation.paymentStatus)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(donation.completedAt || donation.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-xs font-mono text-gray-500">
                                                {donation.transactionId || "N/A"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No donations found matching the selected criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {donations && donations.length >= limit && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-sm text-gray-600 text-center">
                            Showing {donations.length} results. Increase the limit to see more donations.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
