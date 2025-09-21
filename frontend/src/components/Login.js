import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import './AuthForm.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', { username, password });
            sessionStorage.setItem('token', response.data.token);
            navigate('/');
            window.location.reload();
        } catch (err) { setError(err.response?.data?.message || 'Login failed.'); }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Welcome back to SimpleNotes</h2>
                <p>Log in to access your notes.</p>
                {error && <div className="error-message">{error}</div>}
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Log In</button>
                <div className="switch-auth">
                    <span>Don't have an account? </span>
                    <Link to="/register">Sign Up</Link>
                </div>
            </form>
        </div>
    );
}
export default Login;