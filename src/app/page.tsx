'use client'

import React, { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    })

export default function Home() {
    const router = useRouter()

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    // checks cookies for user session
    // if session is active, redirect to dashboard

    return (
        <div className="">
            <p className="font-bold">test</p>
            <p>dois</p>
        </div>
    )
}
