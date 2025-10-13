import type { Metadata } from "next";
import { Geist, Geist_Mono, Work_Sans, Marcellus } from "next/font/google";
import "./globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import ConvexClientProvider from "@/components/ConvexClientProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const workSans = Work_Sans({
    variable: "--font-work-sans",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"]
});

const marcellus = Marcellus({
    variable: "--font-marcellus",
    subsets: ["latin"],
    weight: "400",
});

export const metadata: Metadata = {
    title: "Wild Horse Conservation - Return to Freedom",
    description: "Wild Horse Conservation, sanctuary, advocacy and education.",
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ConvexAuthNextjsServerProvider>
            <html className="w-screen min-h-screen overflow-x-hidden" lang="en">
                <body
                    className={`${workSans.variable} ${marcellus.variable} antialiased w-screen min-h-screen`}
                >
                    <ConvexClientProvider>
                        {children}
                    </ConvexClientProvider>
                </body>
            </html>
        </ConvexAuthNextjsServerProvider>
    );
}
