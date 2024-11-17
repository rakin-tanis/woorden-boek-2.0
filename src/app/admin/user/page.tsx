import EditUserPage from '@/components/EditUserPage'
import SSProtectedComponent from '@/components/SSProtectedComponent'
import React from 'react'

const page = () => {
  return (
    <SSProtectedComponent allowedRoles={['admin']} redirectToLogin={true}>
      <div>
        <EditUserPage></EditUserPage>
      </div>
    </SSProtectedComponent>
  )
}

export default page
