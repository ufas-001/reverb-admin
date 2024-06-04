"use client"

import { BACKEND_URL } from "@/lib/constant";
import { loginValidator } from "@/validations/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import LogoIcon from "@/public/logo.svg"

function classNames(...classes:any) {
    return classes.filter(Boolean).join(' ')
}
type FormData = z.infer<typeof loginValidator>
const SignInPage = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(loginValidator),
        })

    const onSubmitHandler = async (form: FormData) => {
        try {
            // Validate form data
            const validateInput = loginValidator.parse(form);
            setIsLoading(true)
            // Send sign-in request with credentials
            const response = await signIn("credentials", { ...validateInput, redirect: false });
            // Check response status
            if (response?.ok) {
                // Authentication successful, show success message
                toast.success("Logged In Successfully");
                router.push("/dashboard")

            } 
            if (response?.error) {
                toast.error(response.error)
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false)
        }
    };
    return ( 
        <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <LogoIcon className="h-8 w-8 mx-auto fill-gray-950" />
                <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
                <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmitHandler)}>
                        <>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                            <input
                                id="email"
                                {...register("email")}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 pl-4 sm:text-sm sm:leading-6"
                            />
                            </div>
                        </>
                        <>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                            Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    {...register("password")}
                                    type="password"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 pl-4 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </>
                        <div>
                            <button
                            type="submit"
                            className={classNames(isLoading ? "bg-indigo-400" : "bg-indigo-600", "flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600")}
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>

            <p className="mt-10 text-center text-sm text-gray-500">
                Create and account?{' '}
                <Link href="/auth/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                    Sign Up
                </Link>
            </p>
            </div>
        </div>
     );
}
 
export default SignInPage;