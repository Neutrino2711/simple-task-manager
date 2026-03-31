import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        // Get existing users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // Check if user already exists
        if (users.some(u => u.email === email)) {
            setError('Email already registered');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Store current user session
        localStorage.setItem('currentUser', JSON.stringify({
            id: newUser.id,
            email: newUser.email,
            name: newUser.name
        }));

        // Initialize empty task list for new user
        localStorage.setItem(`tasks_${newUser.id}`, JSON.stringify([]));

        navigate('/dashboard');
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit" className="btn-submit">Sign Up</button>
                </form>
                <p className="toggle-auth">
                    Already have an account?{' '}
                    <span onClick={() => navigate('/login')} className="link">
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
}
