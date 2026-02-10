'use client'

import { Toaster } from 'sonner'

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {children}
            <Toaster position="bottom-center" duration={2000} />
        </>
    )
}

export default ToastProvider
