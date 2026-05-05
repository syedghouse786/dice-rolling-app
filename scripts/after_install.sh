#!/bin/bash
# Set permissions and restart Nginx
chown -R nginx:nginx /var/www/html/dice-app
chmod -R 755 /var/www/html/dice-app
systemctl enable nginx
systemctl restart nginx
