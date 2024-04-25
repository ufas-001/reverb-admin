"use client"

import { BACKEND_URL } from "@/lib/constant";
import { signUpValidator } from "@/validations/signUp";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";


type FormData = z.infer<typeof signUpValidator>

function classNames(...classes:any) {
    return classes.filter(Boolean).join(' ')
}

const SignUpPage = () => {
    const [isLoading, setIsLoading] = useState<Boolean>(false)
    const router = useRouter()
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(signUpValidator),
        })

    const onSubmitHandler = async (form: FormData) => {
        try {
            const validateInput = signUpValidator.parse(form)
            setIsLoading(true)
            const res = await fetch(BACKEND_URL + "/auth/register", {
                method: "POST",
                body: JSON.stringify({
                  name: validateInput.name,
                  email: validateInput.email,
                  password: validateInput.password,
                }),
                headers: {
                  "Content-Type": "application/json",
                },
            });
            const response = await res.json();
            toast.success("User Registered!");
        } catch (error) {
            if (error instanceof z.ZodError) {
                setError('email', { message: error.message })
                return
            }
        } finally {
            setIsLoading(false)
            router.push("/auth/login")
        }
    }
    return ( 
        <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <img
                  className="mx-auto h-10 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt="Your Company"
                />
                <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Create your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
                <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmitHandler)}>
                        <>
                            <label htmlFor="fuul-name" className="block text-sm font-medium leading-6 text-gray-900">
                            Full Name
                            </label>
                            <div className="mt-2">
                            <input
                                id="name"
                                type="text"
                                {...register("name")}
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 pl-4 sm:leading-6"
                            />
                            </div>
                        </>

                        <>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Email address
                            </label>
                            <div className="mt-2">
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
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
                                type="password"
                                autoComplete="current-password"
                                {...register("password")}
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 pl-4 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </>
                    <div>
                        <button
                        type="submit"
                        className={classNames(isLoading ? "bg-indigo-400": "bg-indigo-600", "flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600")}
                        >
                            Sign in
                        </button>
                    </div>
                    </form>
                </div>

            <p className="mt-10 text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link href="/auth/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                    login
                </Link>
            </p>
            </div>
        </div>
    );
}
 
export default SignUpPage;