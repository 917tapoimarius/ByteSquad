import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import './forms.css';

const RegisterForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const [fieldCompletionError, setFieldCompletionError] = useState(false);
    const [emailFormatError, setEmailFormatError] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
    const navigate = useNavigate();

    const handleEmailChange = (value: string) => {
        setEmail(value);
    };

    const handleUsernameChange = (value: string) => {
        setUsername(value);
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
    };

    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value);
    };

    const validateEmailFormat = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.com/;
        setEmailFormatError(!emailRegex.test(value));
    };

    const validatePasswordMatch = (value: string) => {
        setPasswordMismatch(value !== password);
    };

    const handleEmailBlur = () => {
        validateEmailFormat(email);
    };

    const handleConfirmPasswordBlur = () => {
        validatePasswordMatch(confirmPassword);
    };

    const handleFieldBlur = () => {
        if (!clicked) {
            validateEmailFormat(email);
            validatePasswordMatch(confirmPassword);
        }
    };

    const handleRegister = async () => {
        setClicked(true);

        setFieldCompletionError(!email || !username || !password || !confirmPassword);

        if (!fieldCompletionError && !passwordMismatch && !emailFormatError) {
            try {
                const response = await fetch('http://localhost:8080/api/v1/user/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, username, password }),
                });

                if (response.ok) {
                    console.log('User registered successfully!');

                    // Reset form state
                    setEmail('');
                    setUsername('');
                    setPassword('');
                    setConfirmPassword('');
                    
                    setSuccessSnackbarOpen(true);

                    setTimeout(() => {
                        setSuccessSnackbarOpen(false);
                        navigate('/'); 
                    }, 1000);
                } else {
                    const errorMessage = await response.text();
                    console.error(`Error: ${errorMessage}`);
                    
                    setErrorSnackbarOpen(true);
                }
            } catch (error) {
                console.error('Error during registration:', error);
            }
        }
    };

    return (
        <div>
            <h2>Registration <div className="logo">
        <img src="/img/logo.png" className="logo" />
      </div></h2>
            <div className="container register-form">
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        onBlur={handleEmailBlur}
                    />
                    {emailFormatError && (
                        <p style={{ color: 'red', marginBottom: '10px', fontSize: '15px' }}>
                            Invalid email format.
                        </p>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        onBlur={handleFieldBlur}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        onBlur={handleFieldBlur}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                        onBlur={handleConfirmPasswordBlur}
                    />
                    {passwordMismatch && (
                        <p style={{ color: 'red', marginBottom: '10px', fontSize: '15px' }}>
                            Passwords do not match.
                        </p>
                    )}
                    {clicked && fieldCompletionError && (
                        <p style={{ color: 'red', marginBottom: '10px', fontSize: '15px' }}>
                            All fields must be completed.
                        </p>
                    )}
                </div>
                <button className="button1" onClick={handleRegister}>
                    Register
                </button>
            </div>

            {successSnackbarOpen && !fieldCompletionError && (
                <Snackbar open={successSnackbarOpen} autoHideDuration={3000} onClose={() => setSuccessSnackbarOpen(false)}>
                    <MuiAlert elevation={6} variant="filled" onClose={() => setSuccessSnackbarOpen(false)} severity="success">
                        Registration successful! Redirecting to login...
                    </MuiAlert>
                </Snackbar>
            )}

            {errorSnackbarOpen && !fieldCompletionError && (
                <Snackbar open={errorSnackbarOpen} autoHideDuration={3000} onClose={() => setErrorSnackbarOpen(false)}>
                    <MuiAlert elevation={6} variant="filled" onClose={() => setErrorSnackbarOpen(false)} severity="error">
                        Registration failed. User already exists.
                    </MuiAlert>
                </Snackbar>
            )}
        </div>
    );
};

export default RegisterForm;
