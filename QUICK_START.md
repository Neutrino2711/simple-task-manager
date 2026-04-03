# ⚡ Quick Start Guide

Get your Lambda-powered task manager running in 5 minutes!

## Step 1: Set Environment Variable (2 min)

Create `.env` file in project root:
```bash
REACT_APP_API_BASE_URL=https://abc123xyz.execute-api.us-east-1.amazonaws.com/stage/tasks
```

Replace with your actual API Gateway URL.

## Step 2: Verify Lambda Endpoints (2 min)

Test your Lambda is working:
```bash
# Test GET
curl https://your-api/tasks

# Test POST
curl -X POST https://your-api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task"}'
```

See `LAMBDA_VERIFICATION.md` for full testing steps.

## Step 3: Start Your App (1 min)

```bash
npm start
```

Your app will open at `http://localhost:3000`

## Step 4: Test It! (minimal effort)

1. ✅ View tasks (should load from Lambda)
2. ✅ Create a task (type and click "Add Task")
3. ✅ Toggle completed (check the checkbox)
4. ✅ Delete a task (click 🗑️)
5. ✅ Check DynamoDB for new tasks via AWS Console

## That's it! 🎉

## Troubleshooting

### Tasks won't load
- Check `.env` file exists and has correct URL
- Verify Lambda is deployed and accessible
- Check browser console for errors

### CORS errors
- Add CORS headers to API Gateway
- Allow `*` origin or your frontend URL

### 404 errors
- Verify Path: `/tasks` and `/tasks/{task_id}`
- Check Lambda handler routing

### Need help?
- See `INTEGRATION_SUMMARY.md` for detailed guide
- See `LAMBDA_VERIFICATION.md` for endpoint testing
- See `API_RESPONSE_REFERENCE.md` for response formats

---

## What You Get

✨ **Fully Working Features**
- ✓ Load tasks from DynamoDB
- ✓ Create new tasks
- ✓ Mark tasks as completed
- ✓ Delete tasks  
- ✓ Error handling with retry
- ✓ Loading states
- ✓ Responsive design

✨ **Going Production?**
1. Update `.env` with production API URL
2. Run `npm run build`
3. Deploy to your hosting (Vercel, AWS S3, etc.)

---

Happy task managing! 🚀
