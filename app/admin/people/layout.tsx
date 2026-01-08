import { Button } from "@/components/ui/button"
import Link from "next/link"

const AdminPeopleLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-full h-fit">
            <div className="w-full bg-white py-2 border-b shadow-sm mb-4 flex justify-start items-center gap-4">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-start items-center gap-4">
                    <Link href="/admin/people/edit">
                        <Button variant="ghost" size="sm">
                            People
                        </Button>
                    </Link>
                    <Link href="/admin/people/roles">
                        <Button variant="ghost" size="sm">
                            Roles
                        </Button>
                    </Link>
                    <Link href="/admin/people/advisory-boards">
                        <Button variant="ghost" size="sm">
                            Advisory Boards
                        </Button>
                    </Link>
                    <Link href="/admin/people/opportunities">
                        <Button variant="ghost" size="sm">
                            Opportunities
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
            </div>
        </div>
    )
}

export default AdminPeopleLayout
