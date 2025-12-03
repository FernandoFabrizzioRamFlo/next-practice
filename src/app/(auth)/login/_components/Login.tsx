"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";
import HeaderLogin from "@/components/layout/HeaderLogin";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define the Zod schema for validation
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const Login: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Initialize react-hook-form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        console.log("Submitting:", values.email, values.password);
        try {
            const res = await fetch("/api/auth/handleLogin", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: values.email, password: values.password }),
            });
            if (res.ok) {
                router.push("/home");
                return;
            }
            setLoading(false);
            alert("Error in request");
            return;
        } catch (error) {
            console.error(error);
            alert("Error processing request");
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader message="Authenticating user..." />;
    }

    return (
        <>
            <HeaderLogin />
            <div className="bg-[url('/herobanner.png')] h-[200px] w-full bg-cover bg-center flex justify-center items-center">
                <span className="text-3xl text-white">Login</span>
            </div>
            <div className="flex w-full h-[calc(100vh-200px)] justify-center items-center">
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="example@mail.com" {...field} />
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
                                                <Input type="password" placeholder="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full">
                                    Submit
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default Login;