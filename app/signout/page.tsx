"use client"

import { SignOutButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

const SignOut = () => {
    return (
        <div className="w-full h-full min-h-screen flex items-center justify-center">
            <SignOutButton>
                <Button>Sign Out</Button>
            </SignOutButton>
        </div>
    )
}

export default SignOut
