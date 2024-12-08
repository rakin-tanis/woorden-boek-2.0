import SSProtectedComponent from '@/components/SSProtectedComponent'
import TrainingSetup from '@/components/training/TrainingSetup'
import React from 'react'

const page = () => {
  return (
    <SSProtectedComponent allowedPermissions={[{ resource: 'trainingPage', action: 'view' }]} redirectToLogin={true}>
      <TrainingSetup />
    </SSProtectedComponent>
  )
}

export default page