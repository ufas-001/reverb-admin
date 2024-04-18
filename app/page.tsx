"use client"
import SignUpPage from "@/components/SignUp";
import SignInPage from "./auth/login/page";

export default function Home() {
  return (
    <div className="h-screen">
      <SignInPage />
    </div>
  );
}
