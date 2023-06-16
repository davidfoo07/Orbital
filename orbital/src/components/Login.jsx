import React, { useState } from 'react'
import { auth } from '../config/config'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'

export const Login = (props) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate()
    
    const login = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password).then(() => {
            setEmail('');
            setPassword('');
            setError('');
            //props.history.push('/');
            navigate('/')
        }).catch(err => setError(err.message));
    }

    

    return (
        <div className='container'>
            <br />
            <h2>Login</h2>
            <br />
            <form autoComplete="off" className='form-group' onSubmit={login}>
                <label htmlFor="email">Email</label>
                <input type="email" className='form-control' required
                    onChange={(e) => setEmail(e.target.value)} value={email} />
                <br />
                <label htmlFor="password">Password</label>
                <input type="password" className='form-control' required
                    onChange={(e) => setPassword(e.target.value)} value={password} />
                <br />
                <button type="submit" className='btn btn-success btn-md mybtn'>LOGIN</button>
            </form>
            {error && <span className='error-msg'>{error}</span>}
            <br/>
            <div>Don't have an account? Register
                <span className='text-decoration-underline' onClick={() => navigate('/signup')}> Here</span>
            </div>
        </div>
    )
}