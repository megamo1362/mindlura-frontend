#!/usr/bin/env bash
set -euo pipefail

NGINX_CONF="/etc/nginx/sites-available/mindlura"

sudo tee "$NGINX_CONF" > /dev/null <<'EOF'
server {
    listen 80;
    server_name www.mindlura.com;
    return 301 http://mindlura.com$request_uri;
}

server {
    listen 80;
    server_name mindlura.com 37.235.18.227;

    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header CF-IPCountry $http_cf_ipcountry;
    }

    location /webhook/ {
        proxy_pass http://localhost:8000/webhook/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header CF-IPCountry $http_cf_ipcountry;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header CF-IPCountry $http_cf_ipcountry;
    }
}
EOF

sudo nginx -t
sudo systemctl reload nginx
