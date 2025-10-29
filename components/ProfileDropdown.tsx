"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { UserButton, SignOutButton } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    User,
    Settings,
    LogOut,
    Shield,
    Mail,
    Calendar
} from "lucide-react";

const ProfileDropdown = () => {
    return (
        <UserButton />
    )
}

// const ProfileDropdown: React.FC = () => {

//     const currentUser = useQuery(api.users.current);

//     const getInitials = (name?: string, email?: string) => {
//         if (name) {
//             return name
//                 .split(" ")
//                 .map(word => word.charAt(0))
//                 .join("")
//                 .toUpperCase()
//                 .slice(0, 2);
//         }
//         if (email) {
//             return email.charAt(0).toUpperCase();
//         }
//         return "AD";
//     };

//     const formatJoinDate = (timestamp: number) => {
//         return new Date(timestamp).toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//         });
//     };

//     return (
//         <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//                 <button className="relative h-8 w-8 rounded-full">
//                     <Avatar className="h-8 w-8">
//                         {/* <AvatarImage
//                             src={currentUser?.image || "/placeholder-avatar.jpg"}
//                             alt={currentUser?.name || currentUser?.email || "User"}
//                         /> */}
//                         <AvatarFallback>
//                             {getInitials(currentUser?.name, currentUser?.email[0])}
//                         </AvatarFallback>
//                     </Avatar>
//                 </button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="w-64" align="end" forceMount>
//                 {currentUser && (
//                     <>
//                         <DropdownMenuLabel className="font-normal">
//                             <div className="flex flex-col space-y-1">
//                                 <p className="text-sm font-medium leading-none">
//                                     {currentUser.name || "Admin User"}
//                                 </p>
//                                 <p className="text-xs leading-none text-muted-foreground">
//                                     {currentUser.email}
//                                 </p>
//                             </div>
//                         </DropdownMenuLabel>
//                         <DropdownMenuSeparator />
//                     </>
//                 )}

//                 <DropdownMenuItem asChild>
//                     <div className="w-full h-full flex items-center gap-2">
//                         <User className="mr-2 h-4 w-4" />
//                         <span>Profile</span>
//                     </div>
//                 </DropdownMenuItem>

//                 <DropdownMenuItem disabled>
//                     <Settings className="mr-2 h-4 w-4" />
//                     <span>Settings</span>
//                 </DropdownMenuItem>

//                 {currentUser && (
//                     <>
//                         <DropdownMenuSeparator />
//                         <div className="px-2 py-1.5 text-xs text-muted-foreground">
//                             <div className="flex items-center space-x-2 mb-1">
//                                 <Shield className="h-3 w-3" />
//                                 <span>Admin Access</span>
//                             </div>
//                             <div className="flex items-center space-x-2 mb-1">
//                                 <Mail className="h-3 w-3" />
//                                 <span className="truncate">{currentUser.email}</span>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <Calendar className="h-3 w-3" />
//                                 <span>Since {formatJoinDate(currentUser._creationTime)}</span>
//                             </div>
//                         </div>
//                     </>
//                 )}

//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem
//                     className="cursor-pointer text-red-600 focus:text-red-600"
//                 >
//                     <SignOutButton>
//                         <div className="w-full h-full flex items-center">
//                             <LogOut className="mr-2 h-4 w-4" />
//                             <span>Sign out</span>
//                         </div>
//                     </SignOutButton>
//                 </DropdownMenuItem>
//             </DropdownMenuContent>
//         </DropdownMenu>
//     );
// };

export default ProfileDropdown;