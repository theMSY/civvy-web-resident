#!/bin/sh

# Docker entrypoint script to inject runtime configuration
# This allows environment variables to be injected at container start time

# Create config.js with environment variables
cat > /usr/share/nginx/html/config.js <<EOF
window.__CONFIG__ = {
  API_BASE_URL: '${API_BASE_URL:-}',
  MAP_TILE_URL: '${MAP_TILE_URL:-https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png}',
  MAP_TILE_ATTRIBUTION: '${MAP_TILE_ATTRIBUTION:-&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors}'
};
EOF

# Inject config script into index.html if not already present
if ! grep -q "config.js" /usr/share/nginx/html/index.html; then
  sed -i 's|</head>|<script src="/config.js"></script></head>|' /usr/share/nginx/html/index.html
fi

# Execute the CMD
exec "$@"
