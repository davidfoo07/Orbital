import React, { useState } from 'react'
import { auth, db } from '../config/config'
import { collection, addDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

export const SignUp = (props) => {
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()


  const signup = (e) => {
    e.preventDefault()
    // console.log('form submitted')
    // console.log(name, email, password)
    createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        addDoc(collection(db, 'SignedUpUserData'), {
            Name: name,
            Email: email,
            Password: password,
            Uid: userCredential.user.uid
        }).then(() => {
            setName('')
            setEmail('')
            setPassword('')
            setError('')
            //props.history.push('/login')
        }).catch(err => setError(err.message))}
    ).catch(err => setError(err.message))
  }

  return (
    <div className='container'>
        <br />
        <h2>Sign Up</h2>
        <br />
        <form action="" autoComplete='off' className='form-group' onSubmit={signup}>
            <label htmlFor="Name">Name</label>
            <br />
            <input type="text" className='form-control' onChange={(e) => setName(e.target.value)} value={name}/>
            <br />
            <label htmlFor="Email">Email</label>
            <br />
            <input type="email" placeholder='youremail@gmail.com' className='form-control' onChange={(e) => setEmail(e.target.value)} value={email}/>
            <br />
            <label htmlFor="Password">Password</label>
            <br />
            <input type="password" placeholder='********' className='form-control' onChange={(e) => setPassword(e.target.value)} value={password}/>
            <br />
            <button type='submit' className='btn btn-success btn-md mybtn'>REGISTER</button>
        </form>
        {error && <div className='error-msg'>{error}</div>}
        <br />
        <div>Already have an account? Login
                <span className='text-decoration-underline' onClick={() => navigate('/login')}> Here</span>
            </div>
    </div>
  )
}
