import React, { useState } from 'react'
import LoginForm from '../components/LoginForm'

const AuthPage = () => {
  const [isLogin,setIsLogin] = useState(true)
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-gray-500 p-4'>
      <div className='w-full max-w-md'>
        <h2 className='text-3xl text-center font-extrabold text-white mb-8'>
          Sign in to SketchBattle
        </h2>
        <div className='bg-white shadow-xl rounded-lg p-8 h-[300px] '>
          <LoginForm /> 
        </div>
      </div>
    </div>
  )
}

export default AuthPage