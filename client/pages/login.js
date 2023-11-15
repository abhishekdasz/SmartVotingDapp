import React from 'react'

const Login = ({connectWallet}) => {
  return (
    <div>
        <button onClick={connectWallet}> Login </button>
    </div>
  )
}

export default Login
