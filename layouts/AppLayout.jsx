"use client";

import React, { useState } from "react";
import { useStateContext } from "@/context";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import { useUserContext } from "@/context/userContext";
import Unauthenticated from "@/components/Loading";
import PublicLayout from "./PublicLayout";

function AppLayout({ children }) {

  // const [selectedState, setSelectedState] = useState(null);

  // const {userLoggedIn} = useUserContext()
  
  // if(selectedState === 'verify') {
  //   return <PublicLayout>{children}</PublicLayout>
  // }

  // if (!userLoggedIn) {
  //   return <Unauthenticated selectedState={selectedState} setSelectedState={setSelectedState}/>;
  // }

  return (
    <>
      <main>
        <Navbar />
        {children}
      </main>
    </>
  );
}

export default AppLayout;
