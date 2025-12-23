#!/bin/bash
echo "🔍 Verifying all files are accessible..."
echo ""

files=(
    "HOW_TO_RUN.md"
    "IMPROVEMENTS.md"
    "SETUP_COMPLETE.md"
    ".env"
    "server/db/createAdmin.js"
    "server/db/runMigrations.js"
    "server/db/migrations/001_performance_improvements.sql"
    "server/utils/constants.js"
    "src/lib/constants.ts"
)

all_good=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        size=$(du -h "$file" | cut -f1)
        echo "✅ $file ($size)"
    else
        echo "❌ $file - MISSING!"
        all_good=false
    fi
done

echo ""
if [ "$all_good" = true ]; then
    echo "🎉 All files verified successfully!"
    echo ""
    echo "📖 Read the documentation:"
    echo "   cat HOW_TO_RUN.md        # Complete guide"
    echo "   cat IMPROVEMENTS.md       # What was improved"
    echo "   cat SETUP_COMPLETE.md     # Setup verification"
    echo ""
    echo "🚀 Quick start:"
    echo "   npm run server            # Terminal 1"
    echo "   npm run dev               # Terminal 2"
    echo "   open http://localhost:5173"
else
    echo "⚠️  Some files are missing!"
fi
