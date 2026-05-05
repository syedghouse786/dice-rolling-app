#!/bin/bash
# Install or ensure Nginx is running
yum install -y nginx || apt-get install -y nginx
rm -rf /var/www/html/dice-app
mkdir -p /var/www/html/dice-app
