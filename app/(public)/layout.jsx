"use client";

import { Toaster } from "react-hot-toast";
import { Inter } from "next/font/google";
import { AddFonts } from "@/utils/addFonts";

const inter = Inter({ subsets: ["latin"] });

function layout({ children }) {
    return (
        <body className={inter.className}>
            {children}
            <AddFonts />
            <Toaster position="bottom-right" />
        </body>
    );
}

export default layout;
