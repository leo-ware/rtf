import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

const AdminNotFoundPage = () => {
    return (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
                <p className="text-gray-500">The page you are looking for does not exist.</p>
                <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4" />
                    Back to admin dashboard
                </Button>
            </div>
        </div>
    )
}

export default AdminNotFoundPage