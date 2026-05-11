#!/bin/bash
# Copy built files to Nginx default serving directory
cp -r /var/www/html/dice-app/* /usr/share/nginx/html/

# Set permissions
chown -R nginx:nginx /usr/share/nginx/html
chmod -R 755 /usr/share/nginx/html

# Create basic auth credentials (username: Test, password: Test1234!)
htpasswd -cb /etc/nginx/.htpasswd Test Test1234!

# Configure Nginx with basic auth and Angular routing
tee /etc/nginx/default.d/angular.conf > /dev/null <<'EOF'
auth_basic "Restricted Access";
auth_basic_user_file /etc/nginx/.htpasswd;

location / {
    try_files $uri $uri/ /index.html;
}
EOF

# Restart Nginx
systemctl enable nginx
systemctl restart nginx
