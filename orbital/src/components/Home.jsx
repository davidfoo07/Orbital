import React, { useEffect } from 'react'
import { Navbar } from './Navbar'
import { Products } from './Products'
import { SignUp } from './SignUp'
import { Login } from './Login'
import { Route, Routes, useNavigate } from 'react-router-dom'
import '../css/Home.css'
import { auth } from '../config/config'
import { onAuthStateChanged } from 'firebase/auth'

export const Home = ({user}) => {

  const navigate = useNavigate()

  useEffect(() => {
      onAuthStateChanged(auth, user => {
        if (!user) {
          navigate('/login')
        }
      })
  })

  return (
    <div className='wrapper'>
        <Navbar user={user} />
        <Products />
        <Routes>
          <Route path='/signup' element={<SignUp />}></Route>
          <Route path='/login' element={<Login />}></Route>
        </Routes>
        
    </div>
  )
}
