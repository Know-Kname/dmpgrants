#!/bin/bash

# Export Documentation Script
# Converts markdown files to HTML that can be opened in Word or saved as PDF

echo "📄 Exporting Documentation..."
echo ""

# Create exports directory
mkdir -p docs/exports

# Function to convert markdown to simple HTML
convert_to_html() {
    input_file=$1
    output_file=$2
    title=$3

    cat > "$output_file" << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TITLE_PLACEHOLDER</title>
    <style>
        @page { margin: 2cm; }
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 20px;
            color: #1f2937;
        }
        h1 {
            color: #0ea5e9;
            border-bottom: 3px solid #0ea5e9;
            padding-bottom: 10px;
            font-size: 2.5em;
        }
        h2 {
            color: #0369a1;
            margin-top: 30px;
            font-size: 1.8em;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 5px;
        }
        h3 {
            color: #075985;
            margin-top: 20px;
            font-size: 1.4em;
        }
        pre, code {
            background: #f3f4f6;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
        }
        pre {
            padding: 15px;
            overflow-x: auto;
            border-left: 4px solid #0ea5e9;
        }
        ul, ol {
            margin: 15px 0;
            padding-left: 30px;
        }
        li {
            margin: 8px 0;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #d1d5db;
            padding: 12px;
            text-align: left;
        }
        th {
            background: #f3f4f6;
            font-weight: bold;
        }
        .info-box {
            background: #dbeafe;
            border-left: 4px solid #0ea5e9;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .warning-box {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        blockquote {
            border-left: 4px solid #d1d5db;
            margin: 20px 0;
            padding-left: 20px;
            color: #6b7280;
            font-style: italic;
        }
        hr {
            border: none;
            border-top: 2px solid #e5e7eb;
            margin: 40px 0;
        }
        @media print {
            body { padding: 0; }
            h1 { page-break-before: always; }
            h1:first-child { page-break-before: avoid; }
        }
    </style>
</head>
<body>
<pre style="white-space: pre-wrap;">
EOF

    sed "s/TITLE_PLACEHOLDER/$title/" "$output_file" > "$output_file.tmp" && mv "$output_file.tmp" "$output_file"

    # Append the markdown content (as plain text in pre tag for now)
    cat "$input_file" >> "$output_file"

    cat >> "$output_file" << 'EOF'
</pre>
<hr>
<p style="text-align: center; color: #6b7280; margin-top: 40px;">
    <strong>Detroit Memorial Park Cemetery Management System</strong><br>
    © 2025 | Version 1.0.0
</p>
</body>
</html>
EOF

    echo "✅ Created: $output_file"
}

# Convert each document
convert_to_html "VISUAL_GUIDE.md" "docs/exports/Visual-Guide.html" "Visual Guide - Cemetery Management System"
convert_to_html "NOTION_VS_CUSTOM.md" "docs/exports/Notion-vs-Custom-Comparison.html" "Notion vs Custom Software Comparison"
convert_to_html "QUICKSTART.md" "docs/exports/Quick-Start-Guide.html" "Quick Start Guide"
convert_to_html "SETUP_GUIDE.md" "docs/exports/Complete-Setup-Guide.html" "Complete Setup Guide"
convert_to_html "claude.md" "docs/exports/Technical-Documentation.html" "Technical Documentation"
convert_to_html "README.md" "docs/exports/README.html" "README - Project Overview"

echo ""
echo "✨ Export Complete!"
echo ""
echo "📂 Files saved to: docs/exports/"
echo ""
echo "How to use:"
echo "1. Open any HTML file in your browser"
echo "2. Press Ctrl+P (or Cmd+P on Mac)"
echo "3. Select 'Save as PDF' or 'Print'"
echo "4. Or open in Microsoft Word: File → Open → Select .html file"
echo ""
echo "Files created:"
ls -1 docs/exports/
