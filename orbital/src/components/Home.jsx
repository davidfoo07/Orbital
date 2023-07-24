import React, { useEffect } from 'react'
import { Navbar } from './Navbar'
import { Products } from './Products'
import { useNavigate } from 'react-router-dom'
import '../css/Home.css'
import { auth } from '../config/config'
import { onAuthStateChanged } from 'firebase/auth'

export const Home = ({userName}) => {

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
        <Navbar user={userName} />
        <Products />
    </div>
  )
}
