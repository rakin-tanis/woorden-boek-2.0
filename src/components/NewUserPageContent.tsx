'use client'

import { useSession } from 'next-auth/react'
import React from 'react'
import Link from 'next/link'

const NewUserPageContent = () => {
  const { data: session } = useSession()
  return (
    <div className='dark:bg-gray-800 dark:text-white w-full min-h-[calc(100vh-74px)] flex flex-col justify-center items-center p-6 space-y-8'>
      <h2 className='text-3xl font-bold'>Welkom, <b>{session?.user.name}</b>!</h2>

      <div className='grid md:grid-cols-2 gap-6 max-w-4xl'>
        <div className='bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md'>
          <h3 className='text-2xl font-semibold mb-4'>Startpagina</h3>
          <p className='mb-4'>
            Ontdek je dashboard, volg je voortgang en bekijk je recente activiteiten.
          </p>
          <Link href="/home" className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'>
            Ga naar Home
          </Link>
        </div>

        <div className='bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md'>
          <h3 className='text-2xl font-semibold mb-4'>Ranglijst</h3>
          <p className='mb-4'>
            Vergelijk je prestaties met andere gebruikers en zie wie bovenaan staat!
          </p>
          <Link href="/leaderboard" className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition'>
            Bekijk Ranglijst
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NewUserPageContent