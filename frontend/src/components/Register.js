import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import './AuthForm.css';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/register', { username, password });
            navigate('/login');
        } catch (err) { setError(err.response?.data?.message || 'Registration failed.'); }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Create Your SimpleNotes Account</h2>
                <p>Begin your note-taking journey.</p>
                {error && <div className="error-message">{error}</div>}
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Create Account</button>
                <div className="switch-auth">
                    <span>Already have an account? </span>
                    <Link to="/login">Log In</Link>
                </div>
            </form>
        </div>
    );
}
export default Register;