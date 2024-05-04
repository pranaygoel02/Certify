"use client";

import { StateProvider } from "@/context";
import { Toaster } from "react-hot-toast";
import { Inter } from "next/font/google";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AddFonts } from "@/utils/addFonts";

const inter = Inter({ subsets: ["latin"] });

function Layout({children}) {
    const { userLoggedIn, setUser } = useUserContext();

    const router = useRouter();

    useEffect(() => {
        if (userLoggedIn) {
            router.replace("/dashboard");
        }
    }, [userLoggedIn, router]);

    return (
        <StateProvider>
            <body className={inter.className}>
                {children}
                <AddFonts />
                <Toaster position="bottom-right" />
            </body>
        </StateProvider>
    );
}

export default Layout;
