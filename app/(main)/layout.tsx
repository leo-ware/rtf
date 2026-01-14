import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="w-full grow">
                {children}
            </main>
            <Footer />
        </div>
    )
}
