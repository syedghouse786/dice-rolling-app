#!/bin/bash
# Copy built files to Nginx default serving directory
cp -r /var/www/html/dice-app/* /usr/share/nginx/html/

# Set permissions
chown -R nginx:nginx /usr/share/nginx/html
chmod -R 755 /usr/share/nginx/html

# Configure Nginx for Angular routing (try_files fallback to index.html)
tee /etc/nginx/default.d/angular.conf > /dev/null <<'EOF'
location / {
    try_files $uri $uri/ /index.html;
}
EOF

# Restart Nginx
systemctl enable nginx
systemctl restart nginx
