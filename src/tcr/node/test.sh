#!/bin/bash

# Running TCR
echo ""
echo "Running TCR..."
echo ""

# Run the tests
if npm run build --silent && npm run test --silent; then
    # If tests pass, commit changes locally
    git add .
    git commit -m "$1" --quiet
    echo "✅ Tests passed - committed: $1"
else
    # If tests fail, revert all changes
    git reset --hard
    git clean -fd  # Remove untracked files and directories
    echo "❌ Tests failed - changes reverted"
fi
