import React from 'react'
import { AccountProvider } from './context/AccountProvider'

const index = () => {
  return (
    <AccountProvider>
    <div>
      Welcome
    </div>
    </AccountProvider>
  )
}

export default index
