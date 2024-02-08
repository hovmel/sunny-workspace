#!/bin/bash

cd ./build ||  exit

rsync -av -e 'ssh -p 61522' . root@keyhole.sunny.solutions:/usr/share/sunny/sunny-workspace-app/

#rsync -av -e 'ssh -p 61522' --exclude='node_modules/' --exclude='dist/' --exclude='.*' . root@keyhole.sunny.solutions:/usr/share/sunny/sunny-workspace-app/

#ssh -p 61522 root@keyhole.sunny.solutions "cd /usr/share/sunny/sunny-workspace-app && npm i && pm2 restart sunny-workspace-app && exit"
ssh -p 61522 root@keyhole.sunny.solutions "cd /usr/share/sunny/sunny-workspace-app && pm2 restart sunny-workspace-app && exit"
