#!/bin/bash

echo "Installing Python..."
apt-get update && apt-get install -y python3 python3-pip

# Ensure "python" command points to Python 3
ln -s /usr/bin/python3 /usr/bin/python || true

echo "Installing dependencies..."
pip3 install -r requirements.txt
