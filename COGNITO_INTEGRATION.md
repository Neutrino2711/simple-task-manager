# Amazon Cognito Authentication Integration Guide

## Overview
Your task manager application has been successfully integrated with Amazon Cognito for secure authentication. This guide explains the implementation and how to use it.

## 🔑 Key Features Implemented

### 1. **OIDC Authentication with Cognito**
   - Uses `react-oidc-context` and `oidc-client-ts` libraries
   - Secure token-based authentication
   - Automatic token refresh handling

### 2. **Protected Routes**
   - Dashboard only accessible to authenticated users
   - Automatic redirect to login for unauthenticated access

### 3. **Auth Token Integration**
   - Access tokens automatically included in API calls
   - Bearer token authentication for Lambda API

### 4. **User Information Display**
   - Show user email in dashboard header
   - Toggle to view authentication token details
   - Sign out functionality

## 📋 Configuration

### Environment Variables (.env)
```env
# Lambda API Endpoint
REACT_APP_API_BASE_URL=https://8v3udq3tuh.execute-api.ap-south-1.amazonaws.com/dev

# Cognito Configuration
REACT_APP_COGNITO_AUTHORITY=https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_hvkWLwFOg
REACT_APP_COGNITO_CLIENT_ID=1h7s11q2r96cc1jq5h36orfrk7
REACT_APP_COGNITO_REDIRECT_URI=https://d84l1y8p4kdic.cloudfront.net
REACT_APP_COGNITO_LOGOUT_URI=https://d84l1y8p4kdic.cloudfront.net
```

**To customize:**
1. Update `REACT_APP_COGNITO_AUTHORITY` with your Cognito User Pool authority
2. Update `REACT_APP_COGNITO_CLIENT_ID` with your app client ID
3. Update redirect URIs to match your application domain

## 🏗️ Component Architecture

### App.js
- Main entry point that checks authentication state
- Routes to AuthPage (login) or Dashboard (authenticated)
- Handles loading and error states

### AuthPage.js
- Login page with Cognito sign-in button
- Displays branding and authentication status

### Dashboard.js
- Main application interface after authentication
- Shows user email and authentication details
- Allows toggling token visibility for debugging
- Sign out button integrated with Cognito

### ProtectedRoute.js
- Wrapper component that verifies authentication
- Redirects unauthenticated users to login

### apiService.js
- All API calls automatically include Authorization header
- Access token from Cognito automatically added to requests
- `setAuthState()` function updates auth context for all API calls

## 🔐 Authentication Flow

```
1. User visits app
   ❯ App checks auth state
   
2. If not authenticated
   ❯ Redirect to AuthPage
   ❯ User clicks "Sign In with Cognito"
   ❯ Redirected to Cognito login page
   ❯ User enters credentials
   
3. If authenticated
   ❯ Cognito redirects back with auth code
   ❯ OIDC provider exchanges code for tokens
   ❯ Access token stored in auth context
   
4. Dashboard loads
   ❯ setAuthState() provides token to API service
   ❯ API calls automatically include Authorization header
   ❯ Tasks fetched and displayed
   
5. User signs out
   ❯ removeUser() called
   ❯ Cognito session cleared
   ❯ Redirect to login
```

## 📝 Available Tokens

### Access Token
- Used for API authorization
- Included in API request headers as `Authorization: Bearer {token}`
- Visible in dashboard info panel

### ID Token
- Contains user identity information
- Includes claims like email, name, user ID
- Visible in dashboard info panel

### Refresh Token
- Used to obtain new access tokens when expired
- Handled automatically by OIDC provider
- Not directly exposed in code

## 🚀 API Integration

All API calls now include the Cognito access token:

```javascript
// Automatic Bearer token added by apiService
const response = await fetch(`${API_BASE_URL}/tasks`, {
  method: 'GET',
  headers: getAuthHeaders(), // Includes Authorization header
});
```

Your Lambda API can now verify tokens using:
```javascript
const token = event.headers.Authorization.split(' ')[1];
// Verify token with Cognito User Pool
```

## 🛠️ Development Setup

### Local Development
For local development, you may need to update redirect URIs:

```env
REACT_APP_COGNITO_REDIRECT_URI=http://localhost:3000/
REACT_APP_COGNITO_LOGOUT_URI=http://localhost:3000/login
```

Then update your Cognito app client settings to include these localhost URIs.

### Running the Application
```bash
npm install              # Install dependencies
npm start               # Start development server
```

The app will:
1. Load the Cognito configuration from environment variables
2. Wrap the app with AuthProvider
3. Check authentication on startup
4. Redirect to login or dashboard accordingly

## 🔄 User Experience

### Unauthenticated
- User sees login page with "Sign In with Cognito" button
- Clicking redirects to Cognito hosted UI
- After login, returns to dashboard

### Authenticated
- Dashboard displays user email in header
- "Auth Info" button shows token details
- "Sign Out" button clears session
- After sign out, redirected to login page

## 🐛 Debugging

### View Authentication Details
1. In Dashboard, click "ℹ️ Auth Info" button
2. View email, access token, and ID token details
3. Check browser console for detailed logs

### Check Token in Browser
Open browser DevTools → Storage → Session Storage → see `oidc` entries

### Common Issues
- **"Loading..." forever**: Check network tab in DevTools, verify Cognito configuration
- **Sign in redirects to wrong page**: Verify redirect URIs in Cognito app client settings
- **API returns 401**: Ensure Lambda validates the Bearer token correctly

## 📚 Next Steps

1. **Verify Lambda Security**: Update Lambda function to validate Cognito tokens
2. **Configure CORS**: Ensure CloudFront/API Gateway CORS allows requests
3. **Test End-to-End**: Sign in → Add task → Sign out → Sign in again
4. **Monitor Tokens**: Monitor token expiration and refresh behavior

## 📖 Additional Resources

- [React OIDC Context Documentation](https://github.com/authts/react-oidc-context)
- [AWS Cognito Developer Guide](https://docs.aws.amazon.com/cognito/)
- [OIDC Protocol](https://openid.net/connect/)

---

**Status**: ✅ Cognito authentication fully integrated
**Dependencies**: react-oidc-context, oidc-client-ts
**Last Updated**: April 3, 2026
