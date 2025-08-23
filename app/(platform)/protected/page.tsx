import { UserButton } from '@clerk/nextjs'
import React from 'react'

const ProtectedPage = async() => {
  return (
    <div>
      <UserButton />
    </div>
  )
}

export default ProtectedPage
