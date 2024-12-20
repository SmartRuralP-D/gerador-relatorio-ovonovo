'use client'

import React, { useEffect, useState } from "react";
import { toast } from '@/hooks/use-toast';
import { getCookie } from '@/services/cookies/cookies';
import { login } from '@/services/firebase/firebase';
import { useRouter } from "next/navigation";
import { DateForm } from '@/components/core/DateForm/date-form';

export default function Dashboard() {
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const userCookie = document.cookie.includes("user") ? await getCookie("user") : null;
            const passwordCookie = document.cookie.includes("password") ? await getCookie("password") : null;

            const user = userCookie ? decodeURIComponent(userCookie) : null;
            const password = passwordCookie ? passwordCookie : null;

            if (user && password) {
                login(user, password).then(() => {
                    toast({
                        description: "Bem vindo " + user,
                        duration: 2000,
                    })
                }).catch(() => { // todo: handle error message better
                    toast({
                        title: "Erro ao fazer login",
                        description: "Por favor faça login novamente",
                        duration: 2000,
                    })
                    router.push('/');
                })
            } else {
                toast({
                    title: "Faça login para acessar o sistema",
                    duration: 2000,
                })
                router.push('/');
            }
        };
        checkUser()
    }, [router])

    return (
        <div className="h-[86vh] w-full flex justify-center items-center">
            <div className="w-[55vw] lg:w-[35vw] flex flex-col bg-slate-300 rounded-xl">
                <div className='m-10 flex flex-col items-center justify-center space-y-10'>
                    <h1 className='text-2xl'>Gerar relatório Avicultura</h1>
                    <DateForm />
                </div>
            </div>
        </div>
    )
}
