import { redirect } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "People - RTF Admin"
}

const PeopleRedirectPage = () => {
    return redirect("/admin/people/edit")
}

export default PeopleRedirectPage