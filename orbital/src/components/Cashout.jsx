import React from 'react'
import { Navbar } from './Navbar'
import { useState, useEffect, useContext } from 'react'
import { CartContext } from '../global/CartContext'
import { useNavigate } from 'react-router-dom'
import { db, auth } from '../config/config'
import { onAuthStateChanged } from 'firebase/auth'
import { addDoc, query, collection, getDocs, where } from 'firebase/firestore'


export const Cashout = (props) => {
    
    const { totalPrice, totalQty, dispatch } = useContext(CartContext)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [cell, setCell] = useState('')
    const [address, setAddress] = useState('')
    const [error, setError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const q = query(collection(db, "SignedUpUserData"), where("Uid", "==", user.uid));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    setName(querySnapshot.docs[0].data().Name)
                    setEmail(querySnapshot.docs[0].data().Email)
                }
            } else {
                navigate('/login')
            }
        })
    })

    const cashoutSubmit = (e) => {
        e.preventDefault()
        onAuthStateChanged(auth, async (user) => {
            const date = new Date()
            const time = date.getTime()
            if (user) {
                await addDoc(collection(db, 'Buyer-Info ' + user.uid), {
                    BuyerName: name,
                    BuyerEmail: email,
                    BuyerCell: cell,
                    BuyerAddress: address,
                    BuyerPayment: totalPrice,
                    BuyerQuantity: totalQty,
                }).then(() => {
                    setCell('')
                    setAddress('')
                    dispatch({type: 'EMPTY'})
                    setSuccessMsg('Your order has been placed successfully! Thank you for shopping on One2sell.')
                    setTimeout(() => {
                        navigate('/')
                    }, 5000)
                }).catch(err => setError(err.message))
            }
        })
    }


  return (
    <>
    <Navbar user={props.user} />
    <div className='container'>
        <br />
        <h2>Cashout Details</h2>
        <br />
        {successMsg && <div className='success-msg'>{successMsg}</div>}
        <form autoComplete="off" className='form-group' onSubmit={cashoutSubmit}>
            <label htmlFor="name">Name</label>
            <input type="text" className='form-control' required
                value={name} disabled />
            <br />
            <label htmlFor="email">Email</label>
            <input type="email" className='form-control' required
                value={email} disabled />
            <br />
            <label htmlFor="Cell No">Mobile phone number</label>
            <input type="number" className='form-control' required
                onChange={(e) => setCell(e.target.value)} value={cell} placeholder='eg 03123456789' />
            <br />
            <label htmlFor="Delivery Address">Delivery Address</label>
            <input type="text" className='form-control' required
                onChange={(e) => setAddress(e.target.value)} value={address} />
            <br />
            <label htmlFor="Price To Pay">Price To Pay</label>
            <input type="number" className='form-control' required
                value={totalPrice} disabled />
            <br />
            <label htmlFor="Total No of Products">Total No of Products</label>
            <input type="number" className='form-control' required
                value={totalQty} disabled />
            <br />
            <button type="submit" className='btn btn-success btn-md mybtn'>SUBMIT</button>
        </form>
        {error && <span className='error-msg'>{error}</span>}
    </div>
</>
  )
}
