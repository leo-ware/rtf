import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
    providers: [
        Password
    ],
    // callbacks: {
    //     createOrUpdateUser: async (ctx, args) => {
    //         const existingUserPromise = ctx.db
    //             .query("users")
    //             .withIndex("email", q => q.eq("email", args.profile.email))
    //             .first();
            
    //         const approvedUserEmailPromise = ctx.db
    //             .query("approvedUserEmails")
    //             .withIndex("email", q => q.eq("email", args.profile.email))
    //             .first();
            
    //         const [existingUser, approvedUserEmail] = await Promise.all([existingUserPromise, approvedUserEmailPromise]);

    //         if (!existingUser && !approvedUserEmail) {
    //             throw new Error("New users must be pre-approved in the admin dashboard.");
    //         }

    //         if (existingUser) {
    //             return existingUser._id;
    //         } else {
    //             return ctx.db.insert("users", {
    //                 email: args.profile.email,
    //                 name: args.profile.name,
    //                 role: approvedUserEmail?.role || "authorized",
    //             });
    //         }
    //     }
    // }
});
