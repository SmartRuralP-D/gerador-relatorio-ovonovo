'use client'

import React, { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { thingsBoardInstance } from '@/services/axios/instances';
import { toast } from '@/hooks/use-toast';
import { getCookie } from '@/services/cookies/cookies';
import { login } from '@/services/firebase/firebase';
import { useRouter } from "next/navigation";
import { DateForm } from '@/components/core/DateForm/date-form';

export default function Dashboard() {
    const router = useRouter();

    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [accommodationDate, setAccommodationDate] = useState<Date | undefined>(undefined);

    function handleReport() {
        if (!startDate || !endDate || !accommodationDate) {
            toast({
                title: "Preencha todos os campos",
                description: "Por favor preencha todos os campos para gerar o relatório",
                duration: 2000,
            })
            return;
        }

        function getBearerToken() { // TODO: fix thingsboard api call
            thingsBoardInstance.get("/api/auth/login").then((response) => {
                return response.data.token;
            }).catch((error) => {
                toast({
                    title: "Erro ao fazer login no thingsboard",
                    description: error.message,
                    duration: 3500,
                })
            })
        }
        const token = getBearerToken();

        // transform to unix dates
        const start = startDate?.getTime();
        const end = endDate?.getTime();
        const accommodation = accommodationDate?.getTime();

        // TODO: fix thingsboard api call
        thingsBoardInstance.get(`/reports/telemetry/${start}/${end}`)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                toast({
                    title: "Erro ao gerar relatório, tente novamente",
                    description: error.message,
                    duration: 3000,
                })
            });
    }

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
                    router.push("/");
                })
            } else {
                toast({
                    title: "Faça login para acessar o sistema",
                    duration: 2000,
                })
                router.push("/");
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