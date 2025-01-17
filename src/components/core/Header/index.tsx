'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Header = () => {
    const router = useRouter()

    return (
        <div className="bg-cyan-600 py-3 flex justify-center">
            <Image
                src="/SmartruralLogoGalinha_preto.svg"
                alt="Logo SmartRural"
                width={60}
                height={60}
                className="block dark:hidden cursor-pointer"
                quality={100}
                loading="eager"
                priority={true}
                style={{ width: "6rem", height: "6rem" }}
                onClick={() => router.push('/')}
            />
            <Image
                src="/SmartRuralLogoGalinha_branco.svg"
                alt="Logo SmartRural"
                width={60}
                height={60}
                className="hidden dark:block cursor-pointer"
                quality={100}
                loading="eager"
                priority={true}
                style={{ width: "6rem", height: "6rem" }}
            />
        </div>
    )
}

export default Header
