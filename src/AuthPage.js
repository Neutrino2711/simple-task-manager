import React from 'react';
import { useAuth } from "react-oidc-context";
import './Auth.css';

export default function AuthPage() {
    const auth = useAuth();

    const handleSignIn = async () => {
        try {
            await auth.signinRedirect();
        } catch (error) {
            console.error('Sign in error:', error);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1>Task Manager</h1>
                <h2>Sign In with Cognito</h2>

                <div className="auth-info">
                    <p>Secure authentication powered by Amazon Cognito</p>
                </div>

                <button
                    onClick={handleSignIn}
                    className="auth-button sign-in-button"
                >
                    Sign In with Cognito
                </button>

                {auth.error && (
                    <div className="error-message">
                        <p>Authentication Error: {auth.error.message}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
