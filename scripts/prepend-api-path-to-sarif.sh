#!/bin/bash

# Check if the correct number of arguments are provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <input_json_file> <output_json_file>"
    exit 1
fi

# Assign arguments to variables
input_file="$1"
output_file="$2"

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "jq is not installed. Please install it and run the script again."
    exit 1
fi

# Check if input file exists
if [ ! -f "$input_file" ]; then
    echo "Input file not found: $input_file"
    exit 1
fi

# Process the JSON file
jq '
  .runs[].results[].locations[].physicalLocation.artifactLocation.uri |= "api/" + .
' "$input_file" > "$output_file"

echo "The updated JSON has been saved to $output_file"
