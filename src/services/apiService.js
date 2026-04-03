// API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Store auth state at module level
let authState = null;

// Function to set auth state (called from components)
export const setAuthState = (auth) => {
    authState = auth;
    console.log('Auth state updated in apiService');
};

// Function to get user email from Cognito
const getUserEmail = () => {
    const email = authState?.user?.profile?.email;
    if (!email) {
        throw new Error('User email not available. Make sure user is authenticated.');
    }
    return email;
};

// Function to get authorization headers
const getAuthHeaders = () => {
    const headers = {
        'Content-Type': 'application/json',
    };

    // Add Authorization header if we have an access token
    if (authState?.user?.access_token) {
        headers['Authorization'] = `Bearer ${authState.user.access_token}`;
    }

    return headers;
};

// Helper function to handle API errors
const handleResponse = async (response) => {
    console.log('API Response Status:', response.status);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || `API Error: ${response.status}`);
    }

    return data;
};

// Map Lambda task format to React format
const mapLambdaToReact = (lambdaTask) => {
    return {
        id: lambdaTask.task_id,
        text: lambdaTask.title,
        completed: lambdaTask.task_status === 'completed',
        createdAt: new Date(lambdaTask.created_at).toLocaleString(),
        task_status: lambdaTask.task_status,
    };
};

// Map React task format to Lambda format
const mapReactToLambda = (reactTask) => {
    return {
        title: reactTask.text,
        task_status: reactTask.completed ? 'completed' : 'pending',
    };
};

// API Service
export const apiService = {
    // Fetch all tasks
    getTasks: async () => {
        try {
            const userEmail = getUserEmail();

            // Build URL with user_id query parameter
            const url = new URL(`${API_BASE_URL}/tasks`);
            url.searchParams.append('user_id', userEmail);

            console.log(`Fetching tasks for user: ${userEmail}`);

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: getAuthHeaders(),
            });

            const data = await handleResponse(response);

            // Handle both direct array response and wrapped response
            const tasks = Array.isArray(data) ? data : data.body ? JSON.parse(data.body) : [];
            console.log(`Retrieved ${tasks.length} tasks`);
            return tasks.map(mapLambdaToReact);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    },

    // Create a new task
    createTask: async (taskText) => {
        try {
            const userEmail = getUserEmail();

            console.log(`Creating task for user: ${userEmail}`);

            const response = await fetch(`${API_BASE_URL}/tasks`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    user_id: userEmail,  // Include email as user_id
                    title: taskText,
                }),
            });

            const data = await handleResponse(response);

            // Handle both direct object response and wrapped response
            const task = data.body ? JSON.parse(data.body) : data;
            console.log(`Task created: ${task.task_id}`);
            return mapLambdaToReact(task);
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    },

    // Delete a task
    deleteTask: async (taskId) => {
        try {
            const userEmail = getUserEmail();

            // Build URL with user_id query parameter
            const url = new URL(`${API_BASE_URL}/tasks/${taskId}`);
            url.searchParams.append('user_id', userEmail);

            console.log(`Deleting task ${taskId} for user: ${userEmail}`);

            const response = await fetch(url.toString(), {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });

            await handleResponse(response);
            console.log(`Task deleted: ${taskId}`);
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    },

    // Update a task (status or title)
    updateTask: async (taskId, updates) => {
        try {
            const userEmail = getUserEmail();

            // Build URL with user_id query parameter
            const url = new URL(`${API_BASE_URL}/tasks/${taskId}`);
            url.searchParams.append('user_id', userEmail);

            const body = {};

            if (updates.text) {
                body.title = updates.text;
            }

            if (updates.completed !== undefined) {
                body.task_status = updates.completed ? 'completed' : 'pending';
            }

            console.log(`Updating task ${taskId} for user: ${userEmail}`, body);

            const response = await fetch(url.toString(), {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(body),
            });

            await handleResponse(response);
            console.log(`Task updated: ${taskId}`);
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    },
};

export default apiService;
