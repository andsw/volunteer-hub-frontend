import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../../../firebase/authContext'
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth'
import './register.css';
import { updateProfile } from 'firebase/auth';

const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const { userLoggedIn } = useAuth()

    const onSubmit = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do NOT match!")
            return;
        }
        if (!isRegistering) {
            setIsRegistering(true)
            await doCreateUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // register successful
                    const user = userCredential.user;
                    console.log('registerd as user:', user);
                    // set default info
                    updateProfile(user, {
                        displayName: `${email.split('@')[0]}`,
                        photoURL: '../../assets/user.png'
                    });
                }).catch((error) => {
                    // Handle Errors here
                    console.error('Registeration error:', error);
                    if (error.message === 'Firebase: Error (auth/email-already-in-use).') {
                        setErrorMessage('Email already in use!')
                    }
                    if (error.message === 'Firebase: Password should be at least 6 characters (auth/weak-password).') {
                        setErrorMessage("Password should be at least 6 characters!");
                    }
                    setIsRegistering(false)
                });
        }
    }

    return (
        <>
            {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}
            <div className="main-container">
                <div className="card">
                    <h3>Create a New Account</h3>
                    <form onSubmit={onSubmit}>
                        <div>
                            <label>Email</label>
                            <input
                                type="email"
                                autoComplete='email'
                                required
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
                            />
                        </div>

                        <div>
                            <label>Password</label>
                            <input
                                disabled={isRegistering}
                                type="password"
                                autoComplete='new-password'
                                required
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }}
                            />
                        </div>

                        <div>
                            <label>Confirm Password</label>
                            <input
                                disabled={isRegistering}
                                type="password"
                                autoComplete='off'
                                required
                                value={confirmPassword}
                                onChange={(e) => { setConfirmPassword(e.target.value) }}
                            />
                        </div>
                        {errorMessage && (
                            <span className='error-message'>{errorMessage}</span>
                        )}

                        <button
                            type="submit"
                            disabled={isRegistering}
                            className={`submit-button ${isRegistering ? 'disabled' : ''}`}
                        >
                            {isRegistering ? 'Signing Up...' : 'Sign Up'}
                        </button>

                        <div className="text-center">
                            Already have an account? <Link to={'/login'} className="link">Continue</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Register;