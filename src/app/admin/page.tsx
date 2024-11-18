import React from 'react'
import SSProtectedComponent from '@/components/SSProtectedComponent';
import UserPanel from '@/components/UsersPanel';
import ExamplesPanel from '@/components/ExamplesPanel';

const page = async () => {

  return (
    <SSProtectedComponent allowedRoles={['editor', 'admin']} redirectToLogin={true}>
      <div className='flex flex-col gap-20 justify-center h-full'>
        <ExamplesPanel></ExamplesPanel>
        <SSProtectedComponent allowedRoles={['admin']}>
          <UserPanel></UserPanel>
        </SSProtectedComponent>
      </div>
    </SSProtectedComponent>
  )
}

export default page
