import {redirect} from "next/navigation"

const NotFoundPage = () => {
    return redirect("/404")
}

export default NotFoundPage;