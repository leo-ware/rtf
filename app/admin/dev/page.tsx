import Link from "next/link"

export const metadata = {
    title: "Developer Information - RTF Admin"
}

const Dev = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-8 w-full mx-auto lg:w-1/2 py-12 px-8 prose prose-lg">
            <h1 className="text-2xl font-bold">Information for Developers</h1>

            <p className="w-full text-md text-left">
                My name is Leo Ware. I created this website in 2025. You can reach me at leobpware@gmail.com.
                You can also reach the project manager for this project at nitinnaidumariserla@gmail.com.
            </p>

            <p className="w-full text-md text-left">
                This website is built with Next.js, Tailwind CSS, and Convex.
                Auth is handled with Clerk.
                Convex cloud serves the backend and database. The frontend is hosted on Vercel.
                Certain large assets are hosted on Cloudflare R2 and served via CDN.
                The package manager is Yarn.
            </p>

            <p>
                The code is on 
                <Link className="underline mx-1" target="_blank" href="https://github.com/leo-ware/rtf">GitHub</Link>.
                I can set you up with the necessary environment variables if you want to make changes.
                I'm also happy to transfer administration of any of the backend services if someone at
                RTF wants to take responsibility for them.
            </p>

            <p className="w-full text-md text-left">
                I use these services for all my projects. If something goes wrong, I should
                get an email and be able to see what's happening. Feel free to reach out to
                me if there's any issue.
            </p>

            <h1 className="text-2xl font-bold">Implementation Notes</h1>

            <h2 className="text-xl font-bold">Hosting</h2>

            <p className="w-full text-md text-left">
                Because this project is relatively small and is intended for a small number of users,
                it fits within the free tier of all
                the services I used. I expect this to continue to be true in the medium term,
                however, there is a possibility that one of these services restrict the free tier
                in future, in which case it would be necessary to start paying for hosting.
            </p>

            <p className="w-full text-md text-left">
                If this happens, I should be notified, and I'll reach out to you guys.
            </p>

            <h2 className="text-xl font-bold">Auth</h2>

            <p className="w-full text-md text-left">
                Clerk cloud hosts a database of user accounts and authenticates requests.
                Public sign up is disabled, so new accounts need to be invited
                by an administrator. When a new user signs up, the interaction is handled
                by Clerk, which fires a webhook to update the database in Convex.
            </p>

            <p className="w-full text-md text-left">
                There are four user roles: guest, authorized, admin, and dev.
                Every new user defaults to the authorized role.
                Authorized users have read and write access to almost everything in the database, 
                except the user database. This role is intended for employees.
                Admins, in addition to these privledges, can edit the user database
                and create new admins. This role is intended for managers 
                Guests is a category with almost no privledges, which is intended for situations
                where it is desired to revoke edit access without deleting the account.
            </p>

            <p className="w-full text-md text-left">
                There is only one dev user, and this user cannot be deleted. This is so I can
                troubleshoot the system if needed. I can add another dev user if the team needs more access,
                but this should probably not be necessary.
            </p>

            <h2 className="text-xl font-bold">Storage</h2>
            <p className="w-full text-md text-left">
                Convex cloud serves the backend and database. Images are hosted here, and there is
                some upper limit on the amount of storage that can be used. So, if there's a huge backlog of
                unused images, it's probably good to delete them.
            </p>

            <p className="w-full text-md text-left">
                Videos for the heros on certain pages are hosted on Cloudflare R2 and served via CDN.
                This is because Convex limits egress more aggressively than storage. Also, the videos
                need to load quickly. There is no ability to edit these from the admin dashboard. For other videos,
                YouTube and Vimeo are used to take advantage of free hosting.
            </p>

            <h2 className="text-xl font-bold">SSR</h2>

            <p className="w-full text-md text-left">
                Convex provides soft guarantees of data consistency inside this application, which
                requires using websockets instead of http. This means it doesn't play nicely with SSR.
                So, most pages are implemented using "use client" which disables SSR. This doesn't seem
                to result in a huge performance penalty though because most of the pages are small, and
                also, the slow part is always the images.
            </p>
        </div>
    )
}

export default Dev;