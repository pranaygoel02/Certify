'use client'

import Button from '@/components/Button'
import { useUserContext } from '@/context/userContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

function Layout({children}) {

    const {userLoggedIn} = useUserContext()

    const router = useRouter()

    useEffect(() => {
        if(userLoggedIn) {
            router.replace('/dashboard')
        }
    },[userLoggedIn])

  return (
    <main className='centered min-h-screen min-w-[30vw] max-w-[95vw] sm:max-w-[70vw] md:max-w-[50vw] m-auto space-y-4'>
    {children}
    <Button className='w-full' onClick={() => router.back()} label={'Go back'} variant='secondary' style={{
        width: '100%'
    }}/>
    </main>
  )
}

export default Layout