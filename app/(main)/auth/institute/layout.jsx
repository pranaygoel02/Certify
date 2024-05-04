'use client'
import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Page({children}) {
    const pathname = usePathname()
    const text = useMemo(() => {
        return pathname.includes('/login') ? `Don't have an account? Register` : `Already registered? Login`
    },[pathname])
    return (
        <>
            {children}
            <div className="w-full flex justify-center items-center subtext">
            <Link replace={true} href={`${pathname.includes('/login') ? 'register' : 'login'}`} className="subtext">{text}</Link>
            {pathname.includes('/login') && <Link href={`${'/auth/reset-password'}`} className="text-blue-500 ml-auto">Forgot Password?</Link>}
            </div>
        </>

    )
}

export default Page;
