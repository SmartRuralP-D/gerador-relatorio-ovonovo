"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
    Form,
    FormField,
    FormLabel,
    FormMessage,
    FormItem,
    FormControl,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "@/services/firebase/firebase";
import { useToast } from "@/hooks/use-toast"
import { getCookie, setCookie } from "@/services/cookies/cookies";

const schema = z.object({
    email: z.string().email({ message: "Por favor insira um email válido" }).nonempty({ message: "Por favor insira um email" }),
    password: z.string().nonempty({ message: "Por favor insira uma senha" }),
});

export default function Home() {
    const router = useRouter();
    const { toast } = useToast();

    const [loading, setLoading] = useState<boolean>(false);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(data: z.infer<typeof schema>) {
        setLoading(true);
        login(data.email, data.password).then(() => {
            toast({
                title: "Login efetuado com sucesso",
                description: "Redirecionando para o dashboard",
                duration: 2000,
            })
            const cookiePath = "/";
            setCookie("user", data.email, null, cookiePath);
            setCookie("password", data.password, null, cookiePath);
            setTimeout(() => {
                router.push("/dashboard")
            }, 1000);
        }).catch((error: Error) => { // todo: handle error message better
            toast({
                title: "Erro ao fazer login",
                description: error.message,
                duration: 2000,
            })
        })
        setLoading(false);
    }

    useEffect(() => { // check if user is already logged in
        const user = document.cookie.includes("user") ? getCookie("user") : null;
        const password = document.cookie.includes("password") ? getCookie("password") : null;
        if (user && password) {
            login(user, password).then(() => {
                router.push("/dashboard")
            }).catch(() => { // todo: handle error message better
                toast({
                    title: "Erro ao fazer login",
                    description: "Tente novamente",
                    duration: 2000,
                })
            })
        }
    }, [router, toast])

    return (
        <div className="h-[86vh] w-full">
            <div className="w-full h-full flex justify-center items-center">
                <div className="w-[55vw] lg:w-[35vw] bg-slate-300 rounded-xl">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="m-10 flex flex-col items-center justify-center space-y-10">
                            <div className="flex flex-col space-y-6 w-full">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Senha</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Senha" type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                            </div>
                            <Button loader={true} loading={loading} variant="secondary" type="submit">Entrar</Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
