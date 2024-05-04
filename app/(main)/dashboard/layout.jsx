"use client";

import Profile from "@/components/Auth/Institute/Profile";
import Modal from "@/components/Modal";
import Navbar from "@/components/Navbar";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function DashboardLayout({ children }) {
    const { userLoggedIn, showProfileModal, toggleProfileModal, user } =
        useUserContext();
    const router = useRouter();

    useEffect(() => {
        if (!userLoggedIn) router.replace("/");
    }, [userLoggedIn, router]);

    return (
        <>
            <main className="flex flex-col min-h-screen">
                <Navbar />
                {children}
            </main>
            {user?.type === 'institute' && <Modal
                title={"Profile"}
                open={showProfileModal}
                toggle={toggleProfileModal}
            >
                <Profile />
            </Modal>}
        </>
    );
}

export default DashboardLayout;
