#!/bin/bash
FILE_PATH=$(jq -r '.tool_input.file_path')
bunx eslint --fix "$FILE_PATH"
