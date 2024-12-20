'use client'

import React, { useEffect } from 'react'
import { toast } from '@/hooks/use-toast'
import { getCookie, deleteCookie } from '@/services/cookies/cookies'
import { login } from '@/services/firebase/firebase'
import { useRouter } from 'next/navigation'
import { DateForm } from '@/components/core/DateForm/date-form'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
    const router = useRouter()

    useEffect(() => {
        const checkUser = async () => {
            const userCookie = document.cookie.includes("temp_user") ? await getCookie("user") : null
            const passwordCookie = document.cookie.includes("temp_password") ? await getCookie("password") : null

            const user = userCookie ? decodeURIComponent(userCookie) : null
            const password = passwordCookie ? passwordCookie : null

            if (user && password) {
                login(user, password).then(() => {
                    toast({
                        description: "Bem vindo " + user,
                        duration: 3000,
                    })
                }).catch(() => { // todo: handle error message better
                    toast({
                        title: "Erro ao fazer login",
                        description: "Por favor faça login novamente",
                        duration: 3500,
                    })

                    router.push('/')
                })
            } else {
                toast({
                    title: "Faça login para acessar o sistema",
                    duration: 3500,
                })

                router.push('/')
            }

            deleteCookie("temp_user", "/")
            deleteCookie("temp_password", "/")
        }
        checkUser()
    }, [router, toast])

    function handleLogout() {
        router.push('/')
    }

    return (
        <div className="h-[84vh] w-full flex justify-center items-center">
            <div className="w-auto h-auto flex flex-col bg-slate-300 rounded-xl">
                <div className="my-10 mx-7 flex flex-col items-center justify-center space-y-10">
                    <h1 className="text-2xl">Gerar relatório Avicultura</h1>
                    <DateForm />
                </div>
            </div>
            <div className="absolute bottom-0 left-0 p-5">
                <Button variant="default" onClick={() => handleLogout()}>Logout</Button>
            </div>
        </div>
    )
}
