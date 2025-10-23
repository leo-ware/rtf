import {
    convexAuthNextjsMiddleware,
    createRouteMatcher,
    nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";
import { NextResponse } from "next/server";

const isSignInPage = createRouteMatcher(["/signin"]);
// const isProtectedRoute = createRouteMatcher(["/admin/(.*)"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
    const searchParams = request.nextUrl.searchParams
    const pathname = request.nextUrl.pathname

    const isProtectedRoute = pathname.startsWith("/admin");

    // console.log({
    //     isAuthenticated: await convexAuth.isAuthenticated(),
    //     isSignInPage: isSignInPage(request),
    //     isProtectedRoute: isProtectedRoute,
    //     pathname: pathname,
    //     searchParams: searchParams,
    // })

    // if the user is authenticated and on the signin page, redirect
    if (isSignInPage(request) && (await convexAuth.isAuthenticated())) {
        const next = searchParams.get("next") || "/admin"
        return nextjsMiddlewareRedirect(request, next);
    }

    if (
        isProtectedRoute &&
        !isSignInPage(request) &&
        !(await convexAuth.isAuthenticated())
    ) {
        const redirectUrl = new URL(`/signin`, request.url);
        if (pathname && pathname !== "/") {
            redirectUrl.searchParams.set("next", pathname);
        }
        return NextResponse.redirect(redirectUrl);
    }
});

export const config = {
    // The following matcher runs middleware on all routes
    // except static assets.
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}