#!/bin/bash
cd /home/ubuntu/business-compass/dist
nohup python3.11 -m http.server 8888 > /tmp/server.log 2>&1 &
echo $! > /tmp/server.pid
echo "Server started on port 8888 with PID $(cat /tmp/server.pid)"
