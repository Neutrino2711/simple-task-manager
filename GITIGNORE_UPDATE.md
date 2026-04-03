# .gitignore Update

Make sure your `.gitignore` file excludes sensitive environment variables.

## Add These Lines to .gitignore

```
# Environment variables
.env
.env.local
.env.*.local

# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build

# Misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

## Why?

The `.env` file contains your AWS API Gateway URL, which might expose sensitive information. It should **NEVER** be committed to version control.

## Check Current .gitignore

```bash
cat .gitignore
```

## Update .gitignore

Make sure these lines exist:
```
.env
.env.local
.env.*.local
```

If `.gitignore` doesn't exist, create one with the content above.

## Already Committed .env?

If you accidentally committed it:

```bash
# Remove from git (but keep locally)
git rm --cached .env

# Commit the removal
git commit -m "Remove .env file from tracking"

# Add to .gitignore
echo ".env" >> .gitignore

# Commit the .gitignore update
git commit -m "Add .env to .gitignore"
```

## Verify

```bash
# Check that .env is ignored
git check-ignore .env

# Should output: .env (if ignored)
```

---

**Important:** Never share your `.env` file or commit it to public repositories!
