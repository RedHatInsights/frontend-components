# Git Interaction Rules for AI Agents

## Core Principle: READ-ONLY by Default

**AI agents must NEVER perform any git operations that make persistent changes to the repository unless explicitly requested by the operator.**

## ✅ ALLOWED Git Operations (Read-Only)

These operations are safe and encouraged for understanding the codebase:

### Status and Working Directory
```bash
git status
git status --porcelain
git diff
git diff --staged
git diff --cached
git diff HEAD
git diff HEAD~1
git diff [branch-name]
```

### History and Log Information
```bash
git log
git log --oneline
git log --graph
git log -n [number]
git log --since="date"
git log --author="name"
git log --grep="pattern"
git log [file-path]
git show [commit-hash]
git show HEAD
```

### Branch Information
```bash
git branch
git branch -r
git branch -a
git branch --merged
git branch --no-merged
git remote -v
git remote show origin
```

### File and Change Information
```bash
git ls-files
git ls-files --modified
git ls-files --others
git blame [file]
git annotate [file]
```

### Stash Information
```bash
git stash list
git stash show
git stash show -p
```

## ❌ FORBIDDEN Git Operations (Unless Explicitly Requested)

### Adding/Staging Files
```bash
git add .
git add [file]
git add -A
git add -u
git stage [file]
```

### Committing Changes
```bash
git commit
git commit -m "message"
git commit -am "message"
git commit --amend
```

### Branch Operations
```bash
git checkout [branch]
git checkout -b [branch]
git switch [branch]
git merge [branch]
git rebase [branch]
git cherry-pick [commit]
```

### Remote Operations
```bash
git push
git pull
git fetch
git clone
```

### Destructive Operations
```bash
git reset
git reset --hard
git reset --soft
git revert [commit]
git rm [file]
git mv [file]
```

### Stash Operations
```bash
git stash
git stash push
git stash pop
git stash apply
git stash drop
```

### Configuration Changes
```bash
git config
git config --global
git config --local
```

## 🔄 Operations Requiring Explicit Permission

If the operator explicitly requests these actions, the agent may perform them:

1. **Committing changes**: Only when specifically asked to "commit" or "make a commit"
2. **Adding files to staging**: Only when asked to "stage files" or "add to git"
3. **Creating branches**: Only when asked to "create a branch" or "checkout new branch"
4. **Pushing changes**: Only when asked to "push" or "push to remote"

## 📋 Best Practices

### Before Any Forbidden Operation
1. **Always ask for explicit permission** from the operator
2. **Explain what the operation will do** and its consequences
3. **Show the current git status** before and after the operation
4. **Confirm the action** before executing

### When Reading Git Information
1. **Use read-only commands liberally** to understand the codebase
2. **Check git status** before making file changes
3. **Review diffs** to understand existing changes
4. **Look at recent commits** to understand the project's commit style

### Error Handling
1. If a forbidden git command is requested without explicit permission, **politely decline** and explain the rule
2. Suggest using read-only alternatives when appropriate
3. Ask the operator to explicitly request the action if it's needed

## 🚨 Emergency Exceptions

The only time an agent may break these rules without explicit permission is:

**NEVER** - There are no emergency exceptions. Always ask for permission.

## Example Interactions

### ✅ Good Interaction
```
Operator: "Help me understand what changes are staged"
Agent: [runs git status and git diff --staged]
```

### ❌ Bad Interaction
```
Operator: "Fix this bug"
Agent: [makes code changes, then runs git add . && git commit -m "fix bug"]
```

### ✅ Correct Interaction for Commits
```
Operator: "Fix this bug and commit it"
Agent: [makes code changes, then runs git add . && git commit -m "fix bug"]
```

### 🤔 Requesting Permission
```
Operator: "The tests are failing"
Agent: "I can fix the failing tests. Would you like me to make the changes and commit them, or just make the changes for you to review?"
```

## Summary

- **Read git information freely** to understand the codebase
- **Never modify git state** without explicit operator permission
- **Always ask before** staging, committing, pushing, or any persistent changes
- **When in doubt, ask** - it's better to ask for permission than to make unwanted changes