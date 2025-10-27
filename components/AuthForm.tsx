"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {Form} from "@/components/ui/form"
import Image from "next/image";
import Link from "next/link";
import {toast} from "sonner";
import FormField from "@/components/FormField";
import {useRouter} from "next/navigation";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth"
import {auth} from "@/firebase/client";
import {signIn, signUp} from "@/lib/actions/auth.action";


const authFormSchema =(type: FormType) => {
    return z.object({
        name:type ==='sign-up'? z.string().min(3) : z.string().optional(),
        email: z.string().email("Enter email address"),
        password: z.string().min(3),
    })
}
// Validation schema

{/*
const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})
type AuthFormProps = {
    isSignIn?: boolean
}
*/}


const AuthForm = ({type}:{type: FormType})/*({ isSignIn = false }: AuthFormProps) */ => {
   const router = useRouter()
    const formSchema = authFormSchema(type)


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    {/*
        function onSubmit(data: z.infer<typeof formSchema>) {
            console.log("Form submitted:", data)
        }
    */}
    async function onSubmit(data: z.infer<typeof formSchema>) {

        const values = data;
        try {
            if(type === "sign-up") {
                const { name, email, password } = values;

                const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

                const result = await signUp({
                    uid: userCredentials.user.uid,
                    name: name!,
                    email,
                    password,
                })

                if (!result.success) {
                    toast.error(result?.message);
                    return;
                }

                toast.success('Account created successfully. Please sign in. ');
                router.push('/sign-in')
            } else {
                const { email, password } = values;

                const userCredential = await signInWithEmailAndPassword(auth, email, password);

                const idToken = await userCredential.user.getIdToken();

                if (!idToken) {
                    toast.error('Sign in failed')
                    return;
                }

                const result = await signIn({
                    email, idToken
                })

                if (!result.success) {
                    toast.error(result?.message || 'Sign in failed');
                    return;
                }

                toast.success('Sign in successfully.');
                router.push('/');
                router.refresh();
            }
        }   catch (error) {
            console.log(error);
            toast.error(`There was an error:${error}`)
        }
    }

    const isSignIn = type === 'sign-in';
    return (
        <div className="card-border lg:min-w-[566px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image
                        src="/logo.svg"
                        alt="logo"
                        height={ 32 }
                        width={ 38 }
                    />
                    <h2 className="text-primary-100">Prepwise</h2>
                </div>
                <h3>Practice job interviews with AI</h3>

                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">

                    {!isSignIn && (
                        <FormField
                            control={form.control}
                            name="name"
                            label="Name"
                            placeholder="Your Name"
                        />
                    )}

                        <FormField
                            control={form.control}
                            name="email"
                            label="Email"
                            placeholder="Your Email Address"
                            type="email"
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            label="password"
                            placeholder="Enter your password"
                            type="password"
                        />


                    <Button className="btn" type="submit">{isSignIn ? 'Sign in': 'Create an Account'} </Button>
                    {/*
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your email address" type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your password" type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full">
                        {isSignIn ? "Sign In" : "Create an Account"}
                    </Button>

                    */}
                </form>
            </Form>
                <p className={"text-center"}>
                    {isSignIn ? 'No account yet?' : 'Have an account already?'}
                    <Link href={!isSignIn ? '/sign-in' : '/sign-up'} className="font-bold text-user-primary ml-1">
                        {!isSignIn ? " Sign in" : ' Sign up'}
                    </Link>

                </p>
            </div>
        </div>
    )
}

export default AuthForm
