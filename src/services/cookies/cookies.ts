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
    try {
        const cookieStore = await cookies()
        const allCookies = cookieStore.getAll()
        return JSON.stringify(allCookies)
    } catch (error) {
        throw new Error(String(error))
    }
}

async function getCookie(name: string): Promise<string | null> {
    try {
        const cookieStore = await cookies();
        const cookie = cookieStore.get(name);
        return cookie ? cookie.value : null;
    } catch (error: any) {
        throw new Error(`Failed to get cookie: ${error.message}`);
    }
}

async function deleteCookie(name: string, path: string) {
    try {
        const cookieStore = await cookies()
        cookieStore.set(name, '', { expires: new Date(0), path: path })
    } catch (error) {
        throw new Error(String(error))
    }
}

async function clearCookies(path: string) {
    try {
        const cookieStore = await cookies()
        const allCookies = (await cookieStore.getAll())
        for (const cookie of allCookies) {
            cookieStore.set(cookie.name, '', { expires: new Date(0), path: path })
        }
    } catch (error) {
        throw new Error(String(error))
    }
}

export { setCookie, getCookies, getCookie, deleteCookie, clearCookies }
