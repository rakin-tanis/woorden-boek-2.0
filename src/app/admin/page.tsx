import React from 'react'
import SSProtectedComponent from '@/components/SSProtectedComponent';
import UserPanel from '@/components/admin/UsersPanel';
import ExamplesPanel from '@/components/admin/ExamplesPanel';

const page = async () => {

  return (
    <SSProtectedComponent allowedRoles={['editor', 'admin']} redirectToLogin={true}>
      <div className='flex flex-col gap-20 justify-center h-full py-48 bg-white dark:bg-gray-800 max-w-[1400px] m-auto'>
        <ExamplesPanel></ExamplesPanel>
        <SSProtectedComponent allowedRoles={['admin']}>
          <UserPanel></UserPanel>
        </SSProtectedComponent>
      </div>
    </SSProtectedComponent>
  )
}

export default page
