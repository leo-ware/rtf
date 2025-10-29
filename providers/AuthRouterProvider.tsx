"use client"

import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ImSpinner8 } from "react-icons/im";

const AuthRouterProvider = ({ children }: { children: React.ReactNode }) => {
    const { isLoading, isAuthenticated } = useCurrentUser();

    const loadingPage = isLoading
    const authenticatedPage = isAuthenticated && !isLoading
    const unauthenticatedPage = !isAuthenticated && !isLoading

    return (
        <>
            {loadingPage && (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                    <div className="flex items-center justify-center gap-2">
                        <ImSpinner8 className="animate-spin size-4" />
                        <div className="text-xl">Authenticating...</div>
                    </div>
                </div>
            )}
            {authenticatedPage && (
                <>
                    {children}
                </>
            )}
            {unauthenticatedPage && (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                    <SignInButton>
                        <Button>
                            Sign In
                        </Button>
                    </SignInButton>
                </div>
            )}
        </>
    )
}

export default AuthRouterProvider