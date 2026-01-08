import { redirect } from "next/navigation"

const PeopleRedirectPage = () => {
    return redirect("/admin/people/edit")
}

export default PeopleRedirectPage