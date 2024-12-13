'use server'

import{ cookies } from 'next/headers'

export class CookieError extends Error {
    constructor(error: string) {
        super(error)
        this.name = 'CookieError'
    }
}

async function setCookie(name: string | number, content: string | number, expiry_date: string | Date | null, path: string | null) {
    try {
        document.cookie = `${name}=${content}; expires=${expiry_date}; path=${path}`
    } catch (error) {
        throw new CookieError(String(error))
    }
}

async function getCookies(): Promise<string> {
    const allCookies = (await cookies()).getAll()
    return JSON.stringify(allCookies)
}


async function getCookie(name: string): Promise<string> {
    const cookie = (await cookies()).get(name)
    return JSON.stringify(cookie)
}

async function deleteCookie(name: string) {
    try {
        // sets the cookie to expire
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
    } catch (error) {
        throw new CookieError(String(error))
    }
}

async function clearCookies() {
    try {
        const cookies = document.cookie.split("; ");
        for (const cookie of cookies) {
            const [name] = cookie.split("=");
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        }
    } catch (error) {
        throw new CookieError(String(error));
    }
}

export { setCookie, getCookies, getCookie, deleteCookie, clearCookies }
