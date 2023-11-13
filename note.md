# deploy

## docker

.dockerignore
Dockerfile
compose.yaml

## 域名解析

在 do 添加一条 three.icyh.me dns 记录

## nginx

反向代理到 3004 端口
更新 nginx

```bash
cd /etc/nginx/conf.d
vim default.conf
```

```
server {
    listen       80;
    server_name  icyh.me;

    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://137.184.121.139:3004;
    }
}

server {
    listen       80;
    server_name  ui.icyh.me;
    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://137.184.121.139:3000;
    }
}

server {
    listen       80;
    server_name  blog.icyh.me;
    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://137.184.121.139:3001;
    }
}

server {
    listen       80;
    server_name  d3.icyh.me;
    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://137.184.121.139:3002;
    }
}

server {
    listen       80;
    server_name  realtime.icyh.me;

    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://137.184.121.139:3003;
    }
}

server {
    listen       80;
    server_name  three.icyh.me;

    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://137.184.121.139:3005;
    }
}

server {
    listen       80;
    server_name  api.icyh.me;

    location / {
        proxy_pass http://137.184.121.139:4000;
    }
}
```

## https

certbot 自动配置 https

```bash
sudo certbot --nginx
sudo certbot renew --dry-run
```

## github action

```yml
name: docker compose

on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]

jobs:
  build:
    runs-on: self-hosted

    steps:
      - uses: actions/checkout@v3
      - name: run docker compose
        run: docker-compose -p three up --build -d
```

## self-hosted runner

安装 runner, 配置为服务

```bash
# error: Must not run with sudo
export RUNNER_ALLOW_RUNASROOT="1"
```

## git push

自动部署完成
每次在 main 分支提交自动部署
