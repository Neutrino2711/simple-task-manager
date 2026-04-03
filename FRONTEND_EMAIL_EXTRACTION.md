# Frontend Email Extraction Guide

## Overview
The React frontend now automatically extracts the user's email from the Cognito authentication token and includes it as `user_id` in all API requests to Lambda.

## 🔄 How It Works

### 1. Authentication Flow
```
User Login (Cognito)
    ↓
Cognito returns access_token + user profile (with email)
    ↓
React stores in auth context: auth.user.profile.email
```

### 2. API Request Flow
```
React Component (Dashboard.js)
    ↓
setAuthState(auth) - stores auth context in apiService
    ↓
API call (getTasks, createTask, etc)
    ↓
getUserEmail() - extracts email from auth.user.profile.email
    ↓
Includes email as user_id in request
    ↓
Lambda function receives and processes request
```

## 📍 Key Files Updated

### [src/services/apiService.js](src/services/apiService.js)
**New Functions:**
- `getUserEmail()` - Extracts email from Cognito user profile
- Modified all API methods to include `user_id = email`

**API Endpoints Behavior:**

#### GET /tasks
```javascript
// Automatically adds query parameter: ?user_id={email}
const tasks = await apiService.getTasks();
// URL: /tasks?user_id=user@example.com
```

#### POST /tasks
```javascript
// Automatically includes user_id in body
const newTask = await apiService.createTask(title);
// Body: { user_id: "user@example.com", title: "..." }
```

#### DELETE /tasks/{taskId}
```javascript
// Automatically adds query parameter: ?user_id={email}
await apiService.deleteTask(taskId);
// URL: /tasks/{taskId}?user_id=user@example.com
```

#### PUT /tasks/{taskId}
```javascript
// Automatically adds query parameter: ?user_id={email}
await apiService.updateTask(taskId, updates);
// URL: /tasks/{taskId}?user_id=user@example.com
// Body: { task_status: "...", title: "..." }
```

### [src/Dashboard.js](src/Dashboard.js)
**No changes needed** - Already configured with:
```javascript
useEffect(() => {
    setAuthState(auth);  // Pass auth context to apiService
    loadTasks();
}, [auth]);
```

## 🔐 Data Security

### User Isolation
- Each user's tasks are identified by their Cognito email
- Lambda function validates `user_id` matches request
- Users cannot access other users' tasks

### Email Extraction
```javascript
// In apiService.js
const getUserEmail = () => {
    const email = authState?.user?.profile?.email;
    if (!email) {
        throw new Error('User email not available. Make sure user is authenticated.');
    }
    return email;
};
```

## 🧪 Testing the Implementation

### 1. Create a Task
```
Expected behavior:
✅ Task created with user_id = your Cognito email
✅ Only visible when you retrieve your tasks
```

### 2. Verify Email in Console
Open browser DevTools → Console:
```javascript
// You should see something like:
// "Auth state updated in apiService"
// "Creating task for user: user@example.com"
```

### 3. Check Network Requests
DevTools → Network tab:
- **GET /tasks** → Query string has `?user_id=user@example.com`
- **POST /tasks** → Body contains `{"user_id":"user@example.com","title":"..."}`
- **DELETE /tasks/{id}** → Query string has `?user_id=user@example.com`

## 📋 Email Sources

The frontend extracts email from Cognito user profile, which comes from:

1. **Cognito Scopes** (configured in `.env`)
```
scope: "phone openid email"  // Must include "email"
```

2. **User Profile Structure**
```javascript
auth.user.profile.email  // Email from Cognito user attributes
```

3. **Available in Dashboard**
```javascript
const userEmail = auth.user?.profile?.email || 'User';
```

## 🛠️ Troubleshooting

### "User email not available"
**Cause:** User not authenticated or email scope missing
**Fix:** 
1. Verify Cognito login successful
2. Check Cognito app client includes `email` scope
3. Check `.env` has `scope: "phone openid email"`

### Email not matching Lambda expectations
**Cause:** Case sensitivity or whitespace
**Fix:**
- Email is automatically trimmed
- Cognito emails are lowercase
- Check Lambda receives exact same email

### Tasks showing 401 Unauthorized
**Cause:** Missing or invalid token in Authorization header
**Fix:**
- Verify auth.user.access_token exists
- Check Dashboard.js calls setAuthState(auth)
- Restart dev server after changes

### Getting other user's tasks
**Cause:** Lambda validation not working
**Fix:**
- Lambda should have `ConditionExpression` checking user_id
- Verify your original Lambda code has security checks

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│ React Dashboard Component                               │
│ - User logged in with Cognito                          │
│ - auth.user.profile.email available                    │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ setAuthState(auth)
                   ↓
┌─────────────────────────────────────────────────────────┐
│ API Service (apiService.js)                            │
│ - Stores auth in module state                          │
│ - getUserEmail() extracts email                        │
└──────────────────┬──────────────────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
         ↓                   ↓
    ┌─────────┐         ┌────────────┐
    │ GET/PUT │         │ POST/DEL   │
    │ DELETE  │         │ CREATE     │
    └─────────┘         └────────────┘
         │                   │
         │ ?user_id=email    │ body: {user_id:email,..}
         │                   │
         └─────────┬─────────┘
                   ↓
         ┌─────────────────────┐
         │ Lambda Function     │
         │ - Receives email    │
         │ - Queries by user_id│
         │ - Returns filtered  │
         └──────────┬──────────┘
                    ↓
         ┌─────────────────────┐
         │ DynamoDB            │
         │ - Filter by user_id │
         │ - Only user's tasks │
         └─────────────────────┘
```

## ✅ Checklist Before Deployment

- [ ] Dashboard.js imports and calls `setAuthState`
- [ ] apiService.js has `getUserEmail()` function
- [ ] All API methods add email as `user_id`
- [ ] Lambda function expects `user_id` parameter
- [ ] Test: Create a task, verify email is user_id
- [ ] Test: Login as different user, verify isolation
- [ ] Check browser console for errors
- [ ] Check network tab for correct email in requests

## 📚 Configuration Reference

### Environment Variables (.env)
```env
# Must include email scope
REACT_APP_COGNITO_AUTHORITY=https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_hvkWLwFOg
REACT_APP_COGNITO_CLIENT_ID=1h7s11q2r96cc1jq5h36orfrk7
# Scopes must include "email"
# (configured in index.js: scope: "phone openid email")
```

### Lambda Function
```python
# GET /tasks - expects user_id in query string
user_id = event['queryStringParameters']['user_id']

# POST /tasks - expects user_id in body
user_id = body.get("user_id")

# DELETE/PUT - expects user_id in query string
user_id = event['queryStringParameters']['user_id']
```

## 🔍 Console Debugging

Enable logging in browser console to trace email extraction:

```javascript
// apiService logs:
// "Auth state updated in apiService"
// "Fetching tasks for user: user@example.com"
// "Creating task for user: user@example.com"
// "Deleting task xyz for user: user@example.com"
// "Updating task xyz for user: user@example.com"
```

---

**Status**: ✅ Frontend configured for email-based user identification
**Last Updated**: April 3, 2026
**Files Modified**: apiService.js (Dashboard.js unchanged - already configured)
