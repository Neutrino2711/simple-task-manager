import React, { useState, useEffect } from 'react';
import { useAuth } from "react-oidc-context";
import apiService, { setAuthState } from './services/apiService';
import './Dashboard.css';

export default function Dashboard() {
    const auth = useAuth();
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showTokens, setShowTokens] = useState(false);

    // Load tasks from API
    const loadTasks = async () => {
        try {
            setError(null);
            setLoading(true);
            const fetchedTasks = await apiService.getTasks();
            setTasks(fetchedTasks);
        } catch (err) {
            setError(err.message || 'Failed to load tasks');
            console.error('Error loading tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Set auth state for API service
        setAuthState(auth);

        // Load tasks from API
        loadTasks();
    }, [auth]);

    const handleAddTask = async (e) => {
        e.preventDefault();

        if (!taskInput.trim()) {
            alert('Please enter a task');
            return;
        }

        try {
            setError(null);
            const newTask = await apiService.createTask(taskInput);
            setTasks([...tasks, newTask]);
            setTaskInput('');
        } catch (err) {
            setError(err.message || 'Failed to create task');
            console.error('Error creating task:', err);
        }
    };

    const handleRemoveTask = async (id) => {
        try {
            setError(null);
            await apiService.deleteTask(id);
            setTasks(tasks.filter(task => task.id !== id));
        } catch (err) {
            setError(err.message || 'Failed to delete task');
            console.error('Error deleting task:', err);
        }
    };

    const handleToggleTask = async (id) => {
        try {
            setError(null);
            const taskToUpdate = tasks.find(task => task.id === id);
            if (taskToUpdate) {
                await apiService.updateTask(id, {
                    completed: !taskToUpdate.completed
                });
                const updatedTasks = tasks.map(task =>
                    task.id === id ? { ...task, completed: !task.completed } : task
                );
                setTasks(updatedTasks);
            }
        } catch (err) {
            setError(err.message || 'Failed to update task');
            console.error('Error updating task:', err);
        }
    };

    const handleLogout = async () => {
        try {
            await auth.removeUser();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (loading) {
        return <div className="loading">Loading your tasks...</div>;
    }

    const completedCount = tasks.filter(t => t.completed).length;
    const userEmail = auth.user?.profile?.email || 'User';
    const userName = auth.user?.profile?.name || userEmail;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>Welcome, {userName}! 👋</h1>
                    <div className="header-actions">
                        <button
                            onClick={() => setShowTokens(!showTokens)}
                            className="btn-info"
                            title="Toggle authentication details"
                        >
                            ℹ️ Auth Info
                        </button>
                        <button onClick={handleLogout} className="btn-logout">
                            Sign Out
                        </button>
                    </div>
                </div>

                {showTokens && (
                    <div className="auth-details">
                        <div className="detail-item">
                            <span className="detail-label">Email:</span>
                            <span className="detail-value">{userEmail}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Access Token:</span>
                            <span className="detail-value mono">{auth.user?.access_token?.substring(0, 30)}...</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">ID Token:</span>
                            <span className="detail-value mono">{auth.user?.id_token?.substring(0, 30)}...</span>
                        </div>
                    </div>
                )}
            </header>

            <div className="dashboard-content">
                {error && (
                    <div className="error-banner">
                        <p>❌ {error}</p>
                        <button onClick={loadTasks} className="btn-retry">Retry</button>
                    </div>
                )}

                <div className="stats">
                    <div className="stat-box">
                        <span className="stat-label">Total Tasks</span>
                        <span className="stat-value">{tasks.length}</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-label">Completed</span>
                        <span className="stat-value">{completedCount}</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-label">Pending</span>
                        <span className="stat-value">{tasks.length - completedCount}</span>
                    </div>
                </div>

                <div className="task-manager">
                    <div className="add-task-section">
                        <form onSubmit={handleAddTask} className="task-form">
                            <input
                                type="text"
                                value={taskInput}
                                onChange={(e) => setTaskInput(e.target.value)}
                                placeholder="Add a new task..."
                                className="task-input"
                            />
                            <button type="submit" className="btn-add-task">
                                ➕ Add Task
                            </button>
                        </form>
                    </div>

                    <div className="task-list-section">
                        <h2>Your Tasks</h2>
                        {tasks.length === 0 ? (
                            <div className="empty-state">
                                <p>📝 No tasks yet. Create one to get started!</p>
                            </div>
                        ) : (
                            <ul className="task-list">
                                {tasks.map((task) => (
                                    <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                                        <div className="task-content">
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                onChange={() => handleToggleTask(task.id)}
                                                className="task-checkbox"
                                            />
                                            <div className="task-info">
                                                <span className="task-text">{task.text}</span>
                                                <span className="task-date">{task.createdAt}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveTask(task.id)}
                                            className="btn-delete"
                                            title="Delete task"
                                        >
                                            🗑️
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
