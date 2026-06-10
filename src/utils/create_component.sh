#!/bin/bash

# This script creates a new React component with a specified name.
# It creates a directory for the component, along with a .jsx file and a .css file.

# Check if a component name is provided
if [ -z "$1" ]; then
  echo "Usage: ./create-component.sh ComponentName"
  exit 1
fi

# Set variables
COMPONENT_NAME=$1
COMPONENT_DIR="src/components/$COMPONENT_NAME"

# Check if the component directory already exists
if [ -d "$COMPONENT_DIR" ]; then
  echo "Folder already exists: $COMPONENT_DIR"
  exit 0
fi

# Create folder and files
mkdir -p $COMPONENT_DIR
touch $COMPONENT_DIR/$COMPONENT_NAME.jsx
touch $COMPONENT_DIR/$COMPONENT_NAME.css

# Populate .jsx with basic component structure
cat <<EOL > $COMPONENT_DIR/$COMPONENT_NAME.jsx
import React from 'react';
import './$COMPONENT_NAME.css';

const $COMPONENT_NAME = () => {
  return (
    <>
    </>
  );
};

export default $COMPONENT_NAME;
EOL

echo "Component $COMPONENT_NAME created successfully in $COMPONENT_DIR. Might need to refresh to see the changes"
