# ✅ Integration Checklist & Action Items

Use this checklist to ensure everything is set up correctly.

## 📋 Pre-Setup (Do This First)

- [ ] Read `QUICK_START.md` (5 minutes)
- [ ] Verify Lambda function is deployed
- [ ] Get your API Gateway URL ready
- [ ] Ensure DynamoDB table "tasks" exists
- [ ] Check Lambda execution role has DynamoDB permissions

## 🔧 Setup Steps

### Step 1: Create Environment File
```bash
# In project root, create .env file:
cp .env.example .env
```

**File:** `d:/simple_task_manager/simple-task-man/.env`

- [ ] `.env` file created
- [ ] Add this line with YOUR API Gateway URL:
```
REACT_APP_API_BASE_URL=https://YOUR_API_GATEWAY_ID.execute-api.REGION.amazonaws.com/STAGE/tasks
```

### Step 2: Update .gitignore
```bash
# Make sure .env is ignored
cat .gitignore | grep ".env"
```

If not there, add:
```
.env
.env.local
.env.*.local
```

- [ ] `.gitignore` updated with `.env`

### Step 3: Test Lambda Endpoints (Recommended)
Before running React app, verify your Lambda:

```bash
# Test GET /tasks
curl -X GET https://YOUR_API_URL/tasks

# Test POST /tasks
curl -X POST https://YOUR_API_URL/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task"}'
```

- [ ] GET /tasks works
- [ ] POST /tasks works
- [ ] PUT /tasks/{id} works (check LAMBDA_VERIFICATION.md)
- [ ] DELETE /tasks/{id} works (check LAMBDA_VERIFICATION.md)

### Step 4: Start React App
```bash
npm start
```

- [ ] App starts at http://localhost:3000
- [ ] No console errors
- [ ] Dashboard loads

### Step 5: Manual Testing
1. **Load Tasks**
   - [ ] Open Dashboard
   - [ ] Tasks load from Lambda (or shows "No tasks yet")
   - [ ] No error messages

2. **Create Task**
   - [ ] Type task in input field
   - [ ] Click "Add Task"
   - [ ] Task appears immediately
   - [ ] Check DynamoDB - task is there

3. **Mark Completed**
   - [ ] Click checkbox on task
   - [ ] Task shows completed state
   - [ ] Check DynamoDB - task_status changed to "completed"

4. **Delete Task**
   - [ ] Click delete button (🗑️)
   - [ ] Task disappears
   - [ ] Check DynamoDB - task is gone

5. **Error Handling**
   - [ ] Temporarily change API URL in `.env`
   - [ ] Reload app
   - [ ] Error banner appears
   - [ ] Click "Retry" button
   - [ ] Error clears when wrong URL is fixed

## 🔍 Verification Steps

### Verify Files Exist
- [ ] `src/services/apiService.js` exists
- [ ] `.env` file exists (created by you)
- [ ] `src/Dashboard.js` updated (check imports)
- [ ] `src/Dashboard.css` updated (check error-banner)

### Verify Dependencies
- [ ] `npm install` completed
- [ ] No missing dependencies
- [ ] `node_modules` folder exists

### Verify Configuration
- [ ] `REACT_APP_API_BASE_URL` in `.env`
- [ ] API URL is correct format
- [ ] No typos in environment variable
- [ ] `.env` added to `.gitignore`

### Verify Lambda
- [ ] Lambda handler processes GET correctly
- [ ] Lambda handler processes POST correctly
- [ ] Lambda handler processes PUT correctly
- [ ] Lambda handler processes DELETE correctly
- [ ] DynamoDB table exists and accessible
- [ ] Lambda execution role has permissions
- [ ] CORS enabled on API Gateway

## 🚨 Common Issues & Fixes

### Issue: "Failed to load tasks"
- [ ] Check API URL in `.env`
- [ ] Verify Lambda is deployed
- [ ] Check API Gateway is working
- [ ] See LAMBDA_VERIFICATION.md

### Issue: CORS Errors
- [ ] Check API Gateway CORS settings
- [ ] Verify headers are correct
- [ ] See LAMBDA_INTEGRATION.md

### Issue: 404 Errors
- [ ] Verify path: `/tasks` or `/tasks/{task_id}`
- [ ] Check Lambda routing
- [ ] See LAMBDA_VERIFICATION.md

### Issue: "Task not found" on update/delete
- [ ] Check `task_id` is valid
- [ ] Verify task exists in DynamoDB
- [ ] Check path parameters format

### Issue: DynamoDB says table doesn't exist
- [ ] Create table named "tasks"
- [ ] Set partition key as "task_id"
- [ ] See LAMBDA_VERIFICATION.md

## 📊 Expected Results

After setup, you should see:

```
Dashboard
├── Welcome message with your name
├── Stats box showing:
│   ├── Total Tasks
│   ├── Completed
│   └── Pending
├── Add Task form
┃   ├── Input field
│   └── Add Task button
└── Task List
    ├── Each task shows:
    │   ├── Checkbox (toggle status)
    │   ├── Task title
    │   ├── Created date
    │   └── Delete button
    └── Empty state (if no tasks)
```

## 🎯 Production Readiness

Before deploying to production:

- [ ] All CRUD operations work
- [ ] Error handling works
- [ ] `.env` file configured
- [ ] `.env` in `.gitignore`
- [ ] No hardcoded secrets
- [ ] No console errors
- [ ] Lambda performance acceptable
- [ ] DynamoDB scaling configured
- [ ] CloudWatch logging enabled
- [ ] CORS restricted to your domain

## 📚 Documentation Quick Reference

| Need | File | Lines |
|------|------|-------|
| Quick setup | QUICK_START.md | 1-50 |
| Full guide | LAMBDA_INTEGRATION.md | All |
| Test endpoints | LAMBDA_VERIFICATION.md | All |
| API format | API_RESPONSE_REFERENCE.md | All |
| File layout | PROJECT_STRUCTURE.md | All |
| Errors | LAMBDA_VERIFICATION.md | Troubleshooting section |

## 🔗 Links to Key Files

- **API Service:** `src/services/apiService.js`
- **React Component:** `src/Dashboard.js`
- **Configuration:** `.env` (you create this)
- **Styling:** `src/Dashboard.css`
- **Documentation:** All `.md` files

## 💾 Files You Created/Modified

### You Need to Create:
1. `.env` file (copy from `.env.example`)

### Already Updated for You:
1. `src/services/apiService.js` ✅ Created
2. `src/Dashboard.js` ✅ Updated
3. `src/Dashboard.css` ✅ Updated
4. `.env.example` ✅ Created
5. All documentation files ✅ Created

## 🧪 Testing Commands

```bash
# Test GET
curl -X GET https://your-api/tasks \
  -H "Content-Type: application/json"

# Test POST
curl -X POST https://your-api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task"}'

# Test PUT
curl -X PUT https://your-api/tasks/task-id-here \
  -H "Content-Type: application/json" \
  -d '{"task_status":"completed"}'

# Test DELETE
curl -X DELETE https://your-api/tasks/task-id-here \
  -H "Content-Type: application/json"
```

## 🎯 Success Criteria

Check all these boxes:

- [ ] App starts without errors
- [ ] Can load tasks
- [ ] Can create tasks
- [ ] Can update tasks (toggle completion)
- [ ] Can delete tasks
- [ ] Tasks persist in DynamoDB
- [ ] Error messages display on failure
- [ ] Retry button recovers from errors
- [ ] No console errors
- [ ] Ready for production

## 📝 Next Actions

1. **Right Now:**
   - [ ] Create `.env` file
   - [ ] Add API URL
   - [ ] Run `npm start`

2. **Next 10 minutes:**
   - [ ] Test CRUD operations
   - [ ] Create a few tasks
   - [ ] Delete a few tasks
   - [ ] Check DynamoDB

3. **Next Hour:**
   - [ ] Deploy to dev/staging
   - [ ] Run full test suite
   - [ ] Check CloudWatch logs

4. **Following Day:**
   - [ ] Deploy to production
   - [ ] Monitor Lambda
   - [ ] Monitor DynamoDB
   - [ ] Get user feedback

## 🎉 Ready?

Start here: **QUICK_START.md**

Then follow this checklist!

---

**Questions?** Check the documentation files or review Lambda logs in CloudWatch.

**Stuck?** See the "Common Issues & Fixes" section above.

Good luck! 🚀
