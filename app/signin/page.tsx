"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function SignIn() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Image
        src="/img/Owyhee-9925-scaled.jpg"
        alt="background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0 opacity-30"
      />
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800 z-10">
        <div className="flex flex-col items-center">
          <Image
            src="/img/RTFLogo_2024-Wild-Horses.png"
            alt="logo"
            width={150}
            height={150}
          />
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            {flow === "signIn" ? "Sign In" : "Sign Up"}
          </h1>
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            formData.set("flow", flow);
            void signIn("password", formData)
              .catch((error) => {
                setError(error.message);
              })
              .then(() => {
                router.push("/");
              });
          }}
        >
          <input
            className="px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            type="email"
            name="email"
            placeholder="Email"
          />
          <input
            className="px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            type="password"
            name="password"
            placeholder="Password"
          />
          <button
            className="px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            type="submit"
          >
            {flow === "signIn" ? "Sign in" : "Sign up"}
          </button>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {flow === "signIn"
                ? "Don't have an account?"
                : "Already have an account?"}
            </span>
            <span
              className="text-sm text-blue-600 underline cursor-pointer hover:text-blue-700"
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
            >
              {flow === "signIn" ? "Sign up" : "Sign in"}
            </span>
          </div>
          {error && (
            <div className="p-4 mt-4 text-sm text-red-800 bg-red-100 border border-red-400 rounded-md dark:bg-red-800/20 dark:text-red-400 dark:border-red-400/50">
              <p className="font-mono text-xs">Error signing in: {error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

