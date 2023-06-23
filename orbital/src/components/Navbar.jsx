import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../images/One2Sell_logo.png'
import '../css/Home.css'
import Icon from 'react-icons-kit'
import { cart }  from 'react-icons-kit/entypo/cart'
import { auth } from '../config/config'
import { signOut } from 'firebase/auth'
import { CartContext } from '../global/CartContext'


export const Navbar = ({user}) => {

  const { totalQty } = useContext(CartContext)

  const navigate = useNavigate()

  const logout = () => {
    signOut(auth).then(() => {
      navigate('/login')
    })
  }

  return (
    <div className='navbox'>
        <div className='leftside'>
            <img src={logo} alt="" />
        </div>
        {!user && <div className='rightside'>
            <button className='navlinks' onClick={() => navigate('/signup')}>SIGN UP</button>
            <button className='navlinks' onClick={() => navigate('/login')}>LOG IN</button>
        </div>}
        {user && <div className='rightside'>
          <span><button className='navlinks' onClick={() => navigate('/')}>{user}</button></span>
          <span><button className='navlinks' onClick={() => navigate('/cartproducts')}><Icon icon={cart}/></button></span>
          <div className='relative'>
            <span className='no-of-produtcs'>{totalQty}</span>
            <span><button className='logout-btn' onClick={logout}>LOGOUT</button></span>
          </div>
          </div>}
    </div>
  )
}
