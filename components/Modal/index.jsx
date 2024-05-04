import React from 'react'
import { IoCloseOutline } from "react-icons/io5";

function Modal({children, title, open, toggle, footer=null}) {
  if(!open) return null;
  return (
    <>
    <div className='fixed inset-0 bg-black/10 backdrop-blur-[2px] z-10'>
    </div>
    <div className='fixed overflow-auto space-y-2 z-10 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full min-w-[40vw] max-w-[100vw] md:max-w-[50vw] h-screen md:h-auto bg-black/90 backdrop-blur-sm rounded-lg border border-neutral-900 modal'>
        <header className='w-full bg-inherit/100'>  
        <h3 className="text-lg p-2 font-semibold">{title}</h3>
        <button onClick={() => toggle(false)} data-type='danger' className='rounded-full flex absolute right-0 top-0 m-2 bg-red-500' style={{
            padding: '3px',
            borderRadius:'50%',
            fontSize:'10px',
        }}><IoCloseOutline /></button>
        </header>
        <div className='overflow-scroll md:max-h-[60vh] p-2 pt-0 pb-4'>
        {children}
        </div>
        {footer}
    </div>
    </>
  )
}

export default Modal