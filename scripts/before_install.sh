#!/bin/bash
# Install Nginx and httpd-tools (for htpasswd)
yum install -y nginx httpd-tools || apt-get install -y nginx apache2-utils
rm -rf /var/www/html/dice-app
mkdir -p /var/www/html/dice-app
