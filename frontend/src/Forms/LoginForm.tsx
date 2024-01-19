import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import './forms.css';

interface LoginFormProps {
    onLoginSuccess: (userId: number) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(false);
    const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const url = `http://localhost:8080/api/v1/user/login?username=${username}&password=${password}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const user = await response.json();

                console.log('User object:', user);

                const userId = user;
                localStorage.setItem('userId', userId);
                localStorage.setItem('username', username);

                console.log(`User logged in successfully with ID: ${userId}`);
                console.log(`User logged in successfully with name: ${username}`);
                onLoginSuccess(userId);

                setSuccessSnackbarOpen(true);

                setTimeout(() => {
                    navigate(`/main/${userId}`);
                }, 1000);
            } else {
                setLoginError(true);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const handleSnackbarClose = () => {
        setSuccessSnackbarOpen(false);
    };

    return (
        <div>  <h2>Login  <div className="logo">
            <img src="/img/logo.png" className="logo" />
        </div></h2>
            <div className="container login-form">
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button className="button1" onClick={handleLogin}>
                    Login
                </button>
                <p
                    style={{ fontSize: '15px', textAlign: 'center' }}>
                    Don't have an account? <Link to="/register">Register</Link>
                </p>

                <Snackbar open={loginError} autoHideDuration={3000} onClose={() => setLoginError(false)}>
                    <MuiAlert elevation={6} variant="filled" onClose={() => setLoginError(false)} severity="error">
                        Login failed. Please check your username and password.
                    </MuiAlert>
                </Snackbar>

                <Snackbar open={successSnackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
                    <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity="success">
                        Login successful!
                    </MuiAlert>
                </Snackbar>
            </div>
        </div>
    );
};

export default LoginForm;
