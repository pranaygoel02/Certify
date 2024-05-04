import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import React from 'react'

function PublicLayout({children}) {
    return (
        <>
          <main>
            <Navbar/>
            {children}
          </main>
        </>
      );
}

export default PublicLayout