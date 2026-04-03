# Lambda Integration Guide

This project is now configured to work with your AWS Lambda function for task management. Follow these steps to set it up.

## Prerequisites

- AWS Lambda function deployed with the endpoints
- API Gateway configured to call the Lambda function
- CORS enabled on your API Gateway

## Setup Instructions

### 1. Configure Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```bash
REACT_APP_API_BASE_URL=https://your-api-gateway-url/tasks
```

**Example:**
```
REACT_APP_API_BASE_URL=https://abc123xyz789.execute-api.us-east-1.amazonaws.com/prod/tasks
```

### 2. File Structure

The project now includes:

```
src/
├── services/
│   └── apiService.js          # API service for Lambda integration
├── Dashboard.js               # Updated with API calls
├── Dashboard.css              # Updated with error styles
├── ...
└── .env.example               # Environment variable template
```

## API Endpoints

Your Lambda function handles these endpoints:

### GET /tasks
- **Description:** Retrieve all tasks
- **Response:** Array of tasks
```javascript
[
  {
    task_id: "uuid",
    title: "Task title",
    task_status: "pending" | "completed",
    created_at: "ISO timestamp"
  },
  ...
]
```

### POST /tasks
- **Description:** Create a new task
- **Body:** 
```json
{
  "title": "Task title"
}
```
- **Response:** Created task object

### PUT /tasks/{task_id}
- **Description:** Update a task (title or status)
- **Body:**
```json
{
  "title": "Updated title",
  "task_status": "pending" | "completed"
}
```

### DELETE /tasks/{task_id}
- **Description:** Delete a task
- **Response:** Success message

## Changes Made

### 1. **apiService.js** (New)
Created a centralized API service that:
- Handles all Lambda API calls
- Maps between React task format and Lambda format
- Includes error handling and response parsing
- Supports both direct responses and wrapped responses from Lambda

### 2. **Dashboard.js** (Updated)
- Removed localStorage dependency
- Added state management for `loading` and `error`
- All CRUD operations now call the API service
- Added error banner with retry functionality
- Added error handling and user feedback

### 3. **Dashboard.css** (Updated)
- Added `.error-banner` styling
- Added `.btn-retry` button styling
- Error messages display prominently to the user

## Task Format Mapping

**React Format → Lambda Format:**
```javascript
{
  id: task_id,
  text: title,
  completed: (task_status === 'completed'),
  createdAt: formatted created_at,
  task_status: original status
}
```

## Error Handling

The application includes:
- **Error Banner:** Displays API errors with a retry button
- **Loading States:** Shows loading indicator while fetching/updating data
- **Console Logs:** Detailed error logging for debugging
- **Graceful Fallbacks:** User-friendly error messages

## Testing the Integration

1. Start your React app:
   ```bash
   npm start
   ```

2. Ensure your Lambda function is running and accessible

3. Create a `.env` file with your API Gateway URL

4. The Dashboard will automatically load tasks from your Lambda function

5. Try creating, updating, and deleting tasks to test all endpoints

## CORS Configuration

Make sure your API Gateway has CORS enabled. Add these headers:

```json
{
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Failed to load tasks" | Check API URL in `.env` file |
| CORS errors | Enable CORS on API Gateway |
| 404 errors | Verify Lambda endpoints exist |
| Tasks not appearing | Check browser console for detailed errors |
| API returns null | Check Lambda response format matches expected structure |

## Local Development

For local testing without AWS:

1. Mock the apiService in `src/services/apiService.js`
2. Or set up a local API server on the same port

## Next Steps

1. Set up your `.env` file with the API Gateway URL
2. Test each CRUD operation
3. Monitor console for any errors
4. Deploy to production once tested

---

**Note:** The application still uses localStorage for user authentication. Only task data is now served by Lambda.
