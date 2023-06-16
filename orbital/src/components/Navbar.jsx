import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../images/One2Sell_logo.png'
import '../css/Home.css'
import Icon from 'react-icons-kit'
import { cart }  from 'react-icons-kit/entypo/cart'
import { auth } from '../config/config'
import { signOut } from 'firebase/auth'


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
            <Link to='signup' className='navlinks'>SIGN UP</Link>
            <Link to='login' className='navlinks'>LOG IN</Link>
        </div>}
        {user && <div className='rightside'>
          <span><Link to= '/' className='navlinks'>{user}</Link></span>
          <span><Link to= 'cartproducts' className='navlinks'><Icon icon={cart}/></Link></span>
          <span className='no-of-produtcs'>{totalQty}</span>
          <span><button className='logout-btn' onClick={logout}>LOGOUT</button></span>
          </div>}
    </div>
  )
}
