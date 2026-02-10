import { redirect } from "next/navigation"

export const metadata = {
    title: "Programs - Return to Freedom"
}

const ProgramsPage = () => {
    return redirect("/visit-us")
}

export default ProgramsPage