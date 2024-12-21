'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-neutral-100 '>
      <div className='bg-white p-8 rounded-md shadow-md w-full max-w-md text-center border border-neutral-200 '>
        <h1 className='text-3xl font-semibold mb-4 text-neutral-800'>
          IMAGE AUTHENTICATION
        </h1>
        <p className='text-neutral-600 mb-6'>
          Secure access with
          <span className='font-medium text-neutral-900'>
            {' '}
            Password + Image
          </span>
        </p>
        <div className='flex flex-col space-y-1'>
          <Link href='/register' passHref>
            <button
              type='button'
              className='w-2/3 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
            >
              Register
            </button>
          </Link>
          <Link href='/login' passHref>
            <button
              type='button'
              className='w-2/3 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500'
            >
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
