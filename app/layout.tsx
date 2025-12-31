import type { Metadata } from "next";
import {
    // Geist,
    // Geist_Mono,
    Work_Sans,
    Marcellus
} from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/providers/ConvexClientProvider";
import { ClerkProvider } from '@clerk/nextjs'
import { TooltipProvider } from "@/components/ui/tooltip"
import DnDProvider from "@/providers/DnDProvider"

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
        <html className="w-screen min-h-screen overflow-x-hidden" lang="en">
            <body
                className={`${workSans.variable} ${marcellus.variable} antialiased w-screen min-h-screen`}
            >
                <ClerkProvider>
                    <ConvexClientProvider>
                        <TooltipProvider>
                            <DnDProvider>
                                {children}
                            </DnDProvider>
                        </TooltipProvider>
                    </ConvexClientProvider>
                </ClerkProvider>
            </body>
        </html>
    );
}
