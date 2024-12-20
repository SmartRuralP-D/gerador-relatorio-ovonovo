'use client'

import React, { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import {
    Form,
    FormField,
    FormLabel,
    FormMessage,
    FormItem,
    FormControl,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { login } from '@/services/firebase/firebase'
import { useToast } from '@/hooks/use-toast'
import { getCookie, setCookie, deleteCookie } from '@/services/cookies/cookies'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/ui/spinner'

const schema = z.object({
    email: z.string().email({ message: "Por favor insira um email válido" }).nonempty({ message: "Por favor insira um email" }),
    password: z.string().nonempty({ message: "Por favor insira uma senha" }),
});

export default function Home() {
    const router = useRouter();
    const { toast } = useToast();

    const [loading, setLoading] = useState<boolean>(false);

    const [rememberMe, setRememberMe] = useState<boolean>(false);

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
            // if login works, there will be a toast message on the other page
            const cookiePath = "/"
            setCookie("temp_user", data.email, null, cookiePath)
            setCookie("temp_password", data.password, null, cookiePath)

            if (rememberMe) {
                setCookie("user", data.email, null, cookiePath)
                setCookie("password", data.password, null, cookiePath)
            } else {
                deleteCookie("user", cookiePath)
                deleteCookie("password", cookiePath)
            }
            setTimeout(() => {
                router.push("/dashboard")
            }, 2000);
        }).catch((error: Error) => { // TODO: handle error message better (cases where its not incorrect email/password)
            console.log(error)
            toast({
                title: "Erro ao fazer login",
                description: error.message,
                duration: 3000,
            })
        })
        setLoading(false);
    }

    useEffect(() => { // check if the user has saved credentials
        const fetchData = async () => {
            try {
                const user = await getCookie("user")
                const password = await getCookie("password")
                if (user && password) {
                    form.setValue("email", user)
                    form.setValue("password", password)
                    setRememberMe(true)
                }
            } catch (error) {
                console.error("Error fetching cookies:", error)
            }
        }
        fetchData()
    }, [router, toast]);

    return (
        <div className="h-[84vh] w-full">
            <div className="w-full h-full flex justify-center items-center">
                <div className="w-[55vw] lg:w-[35vw] bg-slate-300 rounded-xl">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="m-10 flex flex-col items-center justify-center space-y-10">
                            <div className="flex flex-col space-y-3 w-full">
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
                                <div className="flex w-full justify-start gap-1">
                                    <Checkbox
                                        className="flex"
                                        checked={rememberMe}
                                        onCheckedChange={() => setRememberMe(!rememberMe)}
                                    />
                                    <p className="text-xs">Lembrar de mim</p>
                                </div>
                            </div>
                            <Button loader={<Spinner />} loading={loading} variant="default" type="submit">Entrar</Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
