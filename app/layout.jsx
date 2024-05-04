"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";
import { StateProvider } from "@/context";
import AppLayout from "@/layouts/AppLayout";
// import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ThirdwebProvider } from 'thirdweb/react'
import { UserProvider } from "@/context/userContext";
import { ContractProvider } from "@/context/contractContext";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <UserProvider>
                <ThirdwebProvider
                    // activeChain={"localhost"}
                    // clientId="ca85179f427a2446ac9822ffaae627ae"
                >
                    <ThemeProvider attribute="class" defaultTheme="light">
                        <ContractProvider>
                            {/* <StateProvider>
                                <body className={inter.className}>
                                    {children}
                                    <Toaster position="bottom-right" />
                                </body>
                            </StateProvider> */}
                            {children}
                        </ContractProvider>
                    </ThemeProvider>
                </ThirdwebProvider>
            </UserProvider>
        </html>
    );
}
