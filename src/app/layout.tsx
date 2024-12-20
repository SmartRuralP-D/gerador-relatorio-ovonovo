import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { Toaster } from "@/components/ui/toaster"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Gerador de Relatórios Ovonovo",
    description:
        "Sistema para geração de relatórios de dispositivos IoT da Ovonovo",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <div className="w-full h-full flex flex-col">
                    <div className="bg-cyan-600 py-3 flex justify-center w-full">
                        <Image
                            src="/SmartruralLogoGalinha_preto.svg"
                            alt="Logo SmartRural"
                            width={120}
                            height={120}
                            className="block dark:hidden"
                            quality={100}
                            loading="eager"
                            priority={true}
                        />
                        <Image
                            src="/SmartruralLogoGalinha_branco.svg"
                            alt="Logo SmartRural"
                            width={120}
                            height={120}
                            className="hidden dark:block"
                            quality={100}
                            loading="eager"
                            priority={true}
                        />
                    </div>
                    <main>{children}</main>
                    <Toaster />
                </div>
            </body>
        </html>
    );
}
