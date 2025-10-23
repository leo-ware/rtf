"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ImSpinner8 } from "react-icons/im";
import Image from "next/image";

const LogIn = () => {
    const { signIn } = useAuthActions();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(e.target as HTMLFormElement);
        formData.set("flow", "signIn");

        try {
            const result = await signIn("password", formData);
            // Check if result is null or undefined
            if (!result) {
                setError("Invalid email or password");
                return;
            }
        } catch (err: any) {
            console.error("Sign in error:", err);

            // Handle specific error types
            if (err.message?.includes("InvalidSecret") ||
                err.message?.includes("Invalid") ||
                err.toString().includes("InvalidSecret")) {
                setError("Invalid email or password");
            } else if (err.message?.includes("Account not found")) {
                setError("No account found with this email");
            } else {
                setError("An error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Image
                src="/img/Owyhee-9925-scaled.jpg"
                alt="background"
                layout="fill"
                objectFit="cover"
                className="absolute inset-0 z-0 opacity-30"
            />
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800 z-10">
                <div className="flex flex-col items-center">
                    <Image
                        src="/img/RTFLogo_2024-Wild-Horses.png"
                        alt="logo"
                        width={150}
                        height={150}
                    />
                    <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                        Sign In
                    </h1>
                </div>

                <form
                    className="flex flex-col gap-4"
                    onSubmit={handleSubmit}
                >
                    <input
                        className="px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {loading ? (
                        <Button variant="outline" type="submit" disabled className="w-full flex items-center justify-center gap-2">
                            <ImSpinner8 className="animate-spin size-4" />
                            Signing in...
                        </Button>
                    ) : (
                        <Button
                            variant="default"
                            type="submit"
                        >
                            Sign In
                        </Button>
                    )}
                </form>

                {error && (
                    <div className="p-4 mt-4 text-sm text-red-800 bg-red-100 border border-red-400 rounded-md dark:bg-red-800/20 dark:text-red-400 dark:border-red-400/50">
                        <p className="font-mono text-xs">Error: {error}</p>
                    </div>
                )}
            </div>
        </div >
    );
}

export default LogIn;