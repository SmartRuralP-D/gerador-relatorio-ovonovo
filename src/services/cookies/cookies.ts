'use server'

import { cookies } from 'next/headers'

async function setCookie(name: string | number, content: string | number, expiry_date: string | Date | null, path: string | null) {
    try {
        const cookieStore = await cookies()
        cookieStore.set(String(name), String(content), { expires: expiry_date ? new Date(expiry_date) : undefined, path: path || '/' })
    } catch (error) {
        throw new Error(String(error))
    }
}

async function getCookies(): Promise<string> {
    const allCookies = (await cookies()).getAll()
    return JSON.stringify(allCookies)
}

async function getCookie(name: string): Promise<string | undefined> {
    const cookie = (await cookies()).get(name);
    return cookie?.value;
}

async function deleteCookie(name: string) {
    try {
        const cookieStore = await cookies()
        cookieStore.set(name, '', { expires: new Date(0), path: '/' })
    } catch (error) {
        throw new Error(String(error))
    }
}

async function clearCookies() {
    try {
        const cookieStore = await cookies()
        const allCookies = (await cookieStore.getAll())
        for (const cookie of allCookies) {
            cookieStore.set(cookie.name, '', { expires: new Date(0), path: '/' })
        }
    } catch (error) {
        throw new Error(String(error))
    }
}

export { setCookie, getCookies, getCookie, deleteCookie, clearCookies }
