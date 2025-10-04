"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ImSpinner8 } from "react-icons/im";

const SignOut = () => {
    const { signOut } = useAuthActions();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        signOut()
        .then(() => {
            router.push("/");
        })
        .catch((error) => {
            console.error(error);
            setError(error.message);
        })
    }, [signOut])
    
    return (
        <div className="w-full h-full min-h-screen flex items-center justify-center">
            <div className="flex items-center justify-center gap-4 ">
                
                {error
                    ? (
                        <div className="flex flex-col items-center justify-center gap-2">
                            <div>Error signing out. Please reload page.</div>
                            <p className="text-sm text-gray-500">{error}</p>
                        </div>
                    )
                    : (
                        <>
                            <ImSpinner8 className="animate-spin" />
                            <div>Signing out...</div>
                        </>
                    )}
            </div>
        </div>
    )
}

export default SignOut;
