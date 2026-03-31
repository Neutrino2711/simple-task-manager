import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (!user) {
            navigate('/login');
            return;
        }

        setCurrentUser(user);

        // Load tasks for this user
        const userTasks = JSON.parse(
            localStorage.getItem(`tasks_${user.id}`) || '[]'
        );
        setTasks(userTasks);
    }, [navigate]);

    const handleAddTask = (e) => {
        e.preventDefault();

        if (!taskInput.trim()) {
            alert('Please enter a task');
            return;
        }

        const newTask = {
            id: Date.now().toString(),
            text: taskInput,
            completed: false,
            createdAt: new Date().toLocaleString()
        };

        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        localStorage.setItem(`tasks_${currentUser.id}`, JSON.stringify(updatedTasks));
        setTaskInput('');
    };

    const handleRemoveTask = (id) => {
        const updatedTasks = tasks.filter(task => task.id !== id);
        setTasks(updatedTasks);
        localStorage.setItem(`tasks_${currentUser.id}`, JSON.stringify(updatedTasks));
    };

    const handleToggleTask = (id) => {
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
        localStorage.setItem(`tasks_${currentUser.id}`, JSON.stringify(updatedTasks));
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/login');
    };

    if (!currentUser) {
        return <div className="loading">Loading...</div>;
    }

    const completedCount = tasks.filter(t => t.completed).length;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>Welcome, {currentUser.name}! 👋</h1>
                    <button onClick={handleLogout} className="btn-logout">
                        Logout
                    </button>
                </div>
            </header>

            <div className="dashboard-content">
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
