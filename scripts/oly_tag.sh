#!/bin/bash
# ZAP-OS AUTOMATIC OLY-ID TAGGER
# Purpose: Maintain the link between Strategy (Tommy) and Execution (Jerry)

OLY_ID=$1
FILE_NAME=$2

if [ -z "$OLY_ID" ] || [ -z "$FILE_NAME" ]; then
    echo "Usage: ./oly_tag.sh [OLY-ID] [FileName]"
    exit 1
fi

# Create file with the Olympus ID header (Markdown format)
echo "# [$OLY_ID] - $(basename "$FILE_NAME")" > "$FILE_NAME"
echo "" >> "$FILE_NAME"
echo "> **Status:** B.L.A.S.T. Initialized" >> "$FILE_NAME"
echo "" >> "$FILE_NAME"

echo "Successfully tagged $FILE_NAME with $OLY_ID."
