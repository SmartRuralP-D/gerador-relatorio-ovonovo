import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Image from 'next/image'
import { Toaster } from '@/components/ui/toaster'

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "Gerador de Relatórios Ovonovo",
    description: "Sistema para geração de relatórios de dispositivos IoT da Ovonovo",
    authors: [{ name: "SmartFarma" }],
    keywords: ["IoT", "Relatórios", "Ovonovo", "Dispositivos", "SmartFarma"],
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-br">
            <head>
                <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <link rel="shortcut icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <meta name="apple-mobile-web-app-title" content="SmartFarm" />
                <link rel="manifest" href="/site.webmanifest" />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <div className="w-full h-full flex flex-col">
                    <div className="bg-cyan-600 py-3 flex justify-center">
                        <Image
                            src="/SmartruralLogoGalinha_preto.svg"
                            alt="Logo SmartRural"
                            width={60}
                            height={60}
                            className="block dark:hidden"
                            quality={100}
                            loading="eager"
                            priority={true}
                            style={{ width: "6rem", height: "6rem" }}
                        />
                        <Image
                            src="/SmartRuralLogoGalinha_branco.svg"
                            alt="Logo SmartRural"
                            width={60}
                            height={60}
                            className="hidden dark:block"
                            quality={100}
                            loading="eager"
                            priority={true}
                            style={{ width: "6rem", height: "6rem" }}
                        />
                    </div>
                    <main>{children}</main>
                    <Toaster />
                </div>
            </body>
        </html>
    )
}
