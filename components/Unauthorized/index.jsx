'use client';
import Link from 'next/link';

function Unauthorized() {
  return (
    <div className='load-section'>
      <h1 className='text-3xl font-bold'>Unauthorized page</h1>
    <Link href='/'>Go to home</Link>
    </div>
  )
}

export default Unauthorized