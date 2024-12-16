#!/bin/bash

script_dir=$(dirname "$(realpath "$0")")
main_path="$script_dir/main.js"

echo "Started installing node..."
sudo apt install npm -y
echo "Successfully installed node."

echo "Creating systemd service..."
cat <<EOL | sudo tee "/etc/systemd/system/deluxe-wol-router.service"
[Unit]
Description=Deluxe WakeOnLan Router Service
After=multi-user.target

[Service]
ExecStart=/usr/bin/sudo /usr/bin/node $main_path
Type=simple
Restart=always
WorkingDirectory=$script_dir

[Install]
WantedBy=multi-user.target
EOL
echo "Successfully created systemd service at /etc/systemd/system/deluxe-wol-router.service"

echo "Enabling service..."
sudo systemctl daemon-reload
sudo systemctl enable deluxe-wol-router.service
sudo systemctl start deluxe-wol-router.service

echo "Service status:"
sudo systemctl status deluxe-wol-router.service
