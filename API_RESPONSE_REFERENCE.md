# API Response Reference

This document shows the exact format of API requests and responses for the Lambda function integration.

## GET /tasks - Retrieve All Tasks

### Request
```
GET /tasks
Content-Type: application/json
```

### Lambda Response
```json
{
  "statusCode": 200,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": "[{\"task_id\": \"550e8400-e29b-41d4-a716-446655440000\", \"title\": \"Buy groceries\", \"task_status\": \"pending\", \"created_at\": \"2026-04-01T10:30:00.000000\"}, {\"task_id\": \"550e8400-e29b-41d4-a716-446655440001\", \"title\": \"Complete project\", \"task_status\": \"completed\", \"created_at\": \"2026-03-31T15:45:00.000000\"}]"
}
```

### React App Receives
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "text": "Buy groceries",
    "completed": false,
    "createdAt": "4/1/2026, 10:30:00 AM",
    "task_status": "pending"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "text": "Complete project",
    "completed": true,
    "createdAt": "3/31/2026, 3:45:00 PM",
    "task_status": "completed"
  }
]
```

## POST /tasks - Create New Task

### Request
```
POST /tasks
Content-Type: application/json

{
  "title": "Buy groceries"
}
```

### Lambda Python Code
```python
def create_task(event):
    body = json.loads(event['body'])
    
    task = {
        "task_id": str(uuid.uuid4()),
        "title": body.get("title"),
        "task_status": "pending",
        "created_at": datetime.now().isoformat()
    }
    
    table.put_item(Item=task)
    return response(200, task)
```

### Lambda Response
```json
{
  "statusCode": 200,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": "{\"task_id\": \"550e8400-e29b-41d4-a716-446655440002\", \"title\": \"Buy groceries\", \"task_status\": \"pending\", \"created_at\": \"2026-04-01T12:00:00.123456\"}"
}
```

### React App Receives
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "text": "Buy groceries",
  "completed": false,
  "createdAt": "4/1/2026, 12:00:00 PM",
  "task_status": "pending"
}
```

## PUT /tasks/{task_id} - Update Task

### Request
```
PUT /tasks/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "title": "Buy groceries and cook",
  "task_status": "completed"
}
```

### Lambda Python Code
```python
def update_task(event):
    task_id = event['pathParameters']['task_id']
    body = parse_body(event)
    
    update_expression = "SET "
    expression_values = {}
    
    if "title" in body:
        update_expression += "title = :t, "
        expression_values[":t"] = body["title"]
    
    if "task_status" in body:
        update_expression += "task_status = :s, "
        expression_values[":s"] = body["task_status"]
    
    update_expression = update_expression.rstrip(', ')
    
    table.update_item(
        Key={"task_id": task_id},
        UpdateExpression=update_expression,
        ExpressionAttributeValues=expression_values
    )
    
    return response(200, {"message": "Task Updated"})
```

### Lambda Response
```json
{
  "statusCode": 200,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": "{\"message\": \"Task Updated\"}"
}
```

### React App Result
- Task is updated in local state
- No additional parsing needed

## DELETE /tasks/{task_id} - Delete Task

### Request
```
DELETE /tasks/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json
```

### Lambda Python Code
```python
def delete_task(event):
    task_id = event['pathParameters']['task_id']
    
    table.delete_item(
        Key={"task_id": task_id}
    )
    
    return response(200, {"message": "Task deleted"})
```

### Lambda Response
```json
{
  "statusCode": 200,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": "{\"message\": \"Task deleted\"}"
}
```

### React App Result
- Task is removed from local state
- No additional parsing needed

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": "{\"message\": \"Invalid request\"}"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": "{\"message\": \"Task not found\"}"
}
```

### 500 Server Error
```json
{
  "statusCode": 500,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": "{\"message\": \"Internal server error\"}"
}
```

## Complete Lambda Function Response Helper

```python
def response(status, body):
    return {
        'statusCode': status,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps(body)
    }
```

## Key Points

1. ✅ Always use the `response()` helper function
2. ✅ Wrap array responses in the response function
3. ✅ Parse event body with `json.loads(event['body'])`
4. ✅ Handle base64 encoded bodies with `parse_body()`
5. ✅ Extract path parameters from `event['pathParameters']`
6. ✅ Return proper status codes (200, 400, 404, 500)

## Testing with curl

```bash
# GET all tasks
curl -X GET https://your-api/tasks

# POST create task
curl -X POST https://your-api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task"}'

# PUT update task
curl -X PUT https://your-api/tasks/task-id-here \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title","task_status":"completed"}'

# DELETE task
curl -X DELETE https://your-api/tasks/task-id-here
```

## Testing with Python

```python
import requests

BASE_URL = "https://your-api/tasks"

# GET
tasks = requests.get(f"{BASE_URL}").json()

# POST
new_task = requests.post(f"{BASE_URL}", 
  json={"title": "New Task"}).json()

# PUT
updated = requests.put(f"{BASE_URL}/{task_id}", 
  json={"task_status": "completed"}).json()

# DELETE
deleted = requests.delete(f"{BASE_URL}/{task_id}").json()
```

## Testing with Thunder Client or Postman

### Environment Variables
```
{{base_url}} = https://your-api
{{task_id}} = 550e8400-e29b-41d4-a716-446655440000
```

### GET /tasks
- Method: GET
- URL: `{{base_url}}/tasks`

### POST /tasks
- Method: POST
- URL: `{{base_url}}/tasks`
- Body (JSON): `{"title":"Buy groceries"}`

### PUT /tasks/{task_id}
- Method: PUT
- URL: `{{base_url}}/tasks/{{task_id}}`
- Body (JSON): `{"task_status":"completed"}`

### DELETE /tasks/{task_id}
- Method: DELETE
- URL: `{{base_url}}/tasks/{{task_id}}`

---

**Important:** Make sure your Lambda responses exactly match these formats for the React app to parse them correctly!
