# Lambda Function Verification Checklist

Before integrating with your React app, verify your Lambda function is working correctly.

## Lambda Function Validation

### ✅ Function Imports
```python
import json
import boto3
import uuid
import base64 
from datetime import datetime 
```

### ✅ DynamoDB Connection
```python
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('tasks')
```

## Endpoint Testing

Use AWS Console, Postman, or curl to test these endpoints:

### 1. **GET /tasks**
```bash
curl -X GET https://your-api-gateway-url/tasks
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": "[...array of tasks...]"
}
```

### 2. **POST /tasks** (Create Task)
```bash
curl -X POST https://your-api-gateway-url/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task"}'
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": "{\"task_id\":\"uuid\",\"title\":\"My Task\",\"task_status\":\"pending\",\"created_at\":\"2026-04-01T...\"}"
}
```

### 3. **PUT /tasks/{task_id}** (Update Task)
```bash
curl -X PUT https://your-api-gateway-url/tasks/uuid-here \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title","task_status":"completed"}'
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": "{\"message\":\"Task Updated\"}"
}
```

### 4. **DELETE /tasks/{task_id}** (Delete Task)
```bash
curl -X DELETE https://your-api-gateway-url/tasks/uuid-here \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "statusCode": 200,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": "{\"message\":\"Task deleted\"}"
}
```

## Lambda Handler Validation

Your `lambda_handler` should:

```python
def lambda_handler(event, context):
    method = event['requestContext']['http']['method']
    path = event['rawPath']

    if method == 'GET' and path.endswith('/tasks'):
        return get_tasks()
    
    elif method == 'POST' and path.endswith('/tasks'):
        return create_task(event)

    elif method == 'DELETE':
        return delete_task(event)      

    elif method == 'PUT':
        return update_task(event)

    return response(404,{"message": path})
```

## DynamoDB Table Requirements

Your DynamoDB table should have:

| Field | Type | Notes |
|-------|------|-------|
| `task_id` | String | Partition Key (Primary Key) |
| `title` | String | Task title |
| `task_status` | String | "pending" or "completed" |
| `created_at` | String | ISO timestamp |

### Create DynamoDB Table (AWS CLI)
```bash
aws dynamodb create-table \
  --table-name tasks \
  --attribute-definitions AttributeName=task_id,AttributeType=S \
  --key-schema AttributeName=task_id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

## Common Issues & Fixes

### Issue: "pathParameters is None"
Check that path parameters are extracted correctly:
```python
task_id = event['pathParameters']['task_id']  # Make sure event has pathParameters
```

### Issue: Base64 Encoding Errors
Ensure `parse_body()` handles both encoded and non-encoded bodies:
```python
def parse_body(event):
    body = event.get("body")
    if event.get("isBase64Encoded"):
        body = base64.b64decode(body).decode("utf-8")
    return json.loads(body or "{}")
```

### Issue: CORS Errors
Enable CORS on API Gateway with these headers:
```javascript
{
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Amz-Date, Authorization, X-Api-Key"
}
```

### Issue: DynamoDB Permission Denied
Ensure Lambda execution role has these permissions:
```json
{
  "Effect": "Allow",
  "Action": [
    "dynamodb:GetItem",
    "dynamodb:PutItem",
    "dynamodb:UpdateItem",
    "dynamodb:DeleteItem",
    "dynamodb:Scan",
    "dynamodb:Query"
  ],
  "Resource": "arn:aws:dynamodb:region:account:table/tasks"
}
```

## API Gateway Configuration

### Route Setup
- **GET** `/tasks` → Lambda
- **POST** `/tasks` → Lambda
- **PUT** `/tasks/{task_id}` → Lambda
- **DELETE** `/tasks/{task_id}` → Lambda

### Integration Type
- Select **Lambda**
- Check **Lambda Proxy Integration** (if available)

### Enable CORS
- Authorization: NONE
- Check **Enable CORS and replace CORS headers**

## Verification Checklist

- [ ] Lambda function code is correct
- [ ] DynamoDB table exists with correct schema
- [ ] Lambda execution role has DynamoDB permissions
- [ ] API Gateway routes are set up correctly
- [ ] CORS is enabled on API Gateway
- [ ] Endpoints respond with correct status codes
- [ ] Responses follow JSON format expected by React app
- [ ] API Gateway URL is copied to `.env` file
- [ ] React app can make requests to the API

## Once Everything is Verified

1. Update `.env` with your API Gateway URL
2. Run `npm start` to start the React app
3. Test creating, reading, updating, and deleting tasks
4. Check browser console for any errors
5. Verify DynamoDB has the new tasks

---

**Note:** It's critical that your Lambda responses follow the exact format used in the response() function for the React app to parse them correctly.
