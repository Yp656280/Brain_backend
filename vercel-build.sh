#!/bin/bash

echo "Updating package lists..."
apt-get update

echo "Installing Python & Pip..."
apt-get install -y python3 python3-pip

# Ensure "python" command points to Python 3
ln -s /usr/bin/python3 /usr/bin/python || true

echo "Installing Python dependencies..."
pip3 install -r requirements.txt
