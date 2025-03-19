#!/bin/bash

# Install Python
echo "Installing Python..."
apt-get update && apt-get install -y python3 python3-pip

# Set default Python version
ln -s /usr/bin/python3 /usr/bin/python

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt
