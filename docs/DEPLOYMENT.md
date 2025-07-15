# 部署指南

**Project**: 中日交流标准日本语 - 词汇学习系统  
**Date**: January 15, 2025  
**Purpose**: 完整的项目部署和配置说明

## 🎯 部署概览

本项目是一个基于 Next.js 的静态站点，支持多种部署方式。推荐使用静态导出以获得最佳性能和兼容性。

### 支持的部署平台
- **Vercel** (推荐) - 零配置部署
- **Netlify** - 静态站点托管
- **GitHub Pages** - 免费静态托管
- **CloudFlare Pages** - 全球CDN
- **AWS S3 + CloudFront** - 企业级解决方案
- **自建服务器** - 完全控制

## 🚀 快速部署

### Vercel 部署 (推荐)

#### 1. 自动部署
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/biaori-vocab)

#### 2. 手动部署
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署项目
vercel

# 生产部署
vercel --prod
```

#### 3. GitHub 集成
1. 在 Vercel 中连接 GitHub 仓库
2. 配置构建设置：
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `out`
   - **Install Command**: `npm ci`

### Netlify 部署

#### 1. 通过 Git 部署
```bash
# 构建设置
Build command: npm run build
Publish directory: out
```

#### 2. 拖拽部署
```bash
# 本地构建
npm run build

# 上传 out 文件夹到 Netlify
```

#### 3. 配置文件
创建 `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/data/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## ⚙️ 构建配置

### Next.js 配置
确保 `next.config.ts` 配置正确：

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 静态导出配置
  output: 'export',
  distDir: 'out',
  
  // 图片优化 (静态导出时需要禁用)
  images: {
    unoptimized: true,
  },
  
  // 路径配置
  basePath: process.env.NODE_ENV === 'production' ? '/biaori-vocab' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/biaori-vocab/' : '',
  
  // 严格模式
  reactStrictMode: true,
  
  // TypeScript 配置
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint 配置
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // 压缩配置
  compress: true,
  
  // 性能优化
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
```

### 环境变量
创建 `.env.local` (生产环境需要相应配置):

```bash
# 应用配置
NEXT_PUBLIC_APP_NAME="中日交流标准日本语 - 词汇学习系统"
NEXT_PUBLIC_APP_VERSION="1.1.0"
NEXT_PUBLIC_APP_URL="https://your-domain.com"

# 分析配置
NEXT_PUBLIC_ANALYTICS_ID="your-analytics-id"

# 功能开关
NEXT_PUBLIC_ENABLE_PWA="true"
NEXT_PUBLIC_ENABLE_OFFLINE="true"

# API 配置 (如果有)
NEXT_PUBLIC_API_BASE_URL="https://api.your-domain.com"

# 调试配置
NEXT_PUBLIC_DEBUG="false"
```

### 构建脚本
`package.json` 中的构建配置：

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "build:analyze": "ANALYZE=true next build",
    "build:production": "NODE_ENV=production next build",
    "export": "next export",
    "deploy": "npm run build && npm run export"
  }
}
```

## 🏗️ 自建服务器部署

### Docker 部署

#### 1. Dockerfile
```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine

# 复制构建文件
COPY --from=builder /app/out /usr/share/nginx/html

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### 2. Nginx 配置
创建 `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # 安全头
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

        # 缓存配置
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        location /data/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # SPA 路由支持
        location / {
            try_files $uri $uri/ /index.html;
        }

        # API 代理 (如果需要)
        location /api/ {
            proxy_pass http://api-server:3001;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

#### 3. Docker Compose
创建 `docker-compose.yml`:

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    volumes:
      - ./logs:/var/log/nginx

  # 可选：添加 SSL 终止
  nginx-proxy:
    image: nginxproxy/nginx-proxy
    ports:
      - "443:443"
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - ./certs:/etc/nginx/certs
    environment:
      - DEFAULT_HOST=your-domain.com
```

#### 4. 部署命令
```bash
# 构建和运行
docker-compose up -d

# 查看日志
docker-compose logs -f

# 更新部署
docker-compose down
docker-compose build
docker-compose up -d
```

### 传统服务器部署

#### 1. 系统要求
- **操作系统**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **Node.js**: 18.x+
- **内存**: 最低 2GB，推荐 4GB+
- **存储**: 最低 10GB，推荐 20GB+
- **网络**: 稳定的互联网连接

#### 2. 服务器配置
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 Nginx
sudo apt install nginx -y

# 安装 PM2 (进程管理)
sudo npm install -g pm2

# 安装 Git
sudo apt install git -y
```

#### 3. 项目部署
```bash
# 克隆项目
git clone https://github.com/your-username/biaori-vocab.git
cd biaori-vocab

# 安装依赖
npm ci --only=production

# 构建项目
npm run build

# 复制文件到 Web 目录
sudo cp -r out/* /var/www/html/

# 设置权限
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/
```

#### 4. Nginx 配置
```bash
# 创建站点配置
sudo nano /etc/nginx/sites-available/biaori-vocab

# 添加配置 (参考上面的 nginx.conf)

# 启用站点
sudo ln -s /etc/nginx/sites-available/biaori-vocab /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

## 🔒 HTTPS 配置

### Let's Encrypt (免费)
```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo crontab -e
# 添加: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 自定义证书
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # 其他配置...
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

## 📊 监控和维护

### 性能监控
```bash
# 安装监控工具
sudo apt install htop iotop netstat-nat -y

# 检查系统状态
htop
df -h
free -m
```

### 日志管理
```bash
# Nginx 日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# 系统日志
journalctl -f -u nginx
```

### 备份策略
```bash
#!/bin/bash
# backup.sh

# 备份网站文件
tar -czf backup-$(date +%Y%m%d).tar.gz /var/www/html/

# 上传到云存储 (示例)
# aws s3 cp backup-$(date +%Y%m%d).tar.gz s3://your-backup-bucket/

# 清理旧备份 (保留7天)
find . -name "backup-*.tar.gz" -mtime +7 -delete
```

### 自动更新脚本
```bash
#!/bin/bash
# deploy.sh

# 进入项目目录
cd /path/to/biaori-vocab

# 拉取最新代码
git pull origin main

# 安装依赖
npm ci --only=production

# 构建项目
npm run build

# 复制文件
sudo cp -r out/* /var/www/html/

# 重启服务
sudo systemctl reload nginx

echo "部署完成！"
```

## 🔧 故障排除

### 常见问题

#### 1. 构建失败
```bash
# 清理缓存
rm -rf .next node_modules package-lock.json
npm install

# 检查 Node.js 版本
node --version  # 应该是 18+

# 检查 TypeScript 错误
npm run type-check
```

#### 2. 静态文件 404
```bash
# 检查 basePath 配置
# 确保 next.config.ts 中的 basePath 正确

# 检查文件权限
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/
```

#### 3. 路由不工作
```nginx
# 在 Nginx 配置中添加
location / {
    try_files $uri $uri/ /index.html;
}
```

#### 4. 性能问题
```bash
# 启用 Gzip 压缩
# 检查 Nginx 配置中的 gzip 设置

# 检查静态资源缓存
curl -I https://your-domain.com/some-static-file.js
# 应该有 Cache-Control header
```

### 调试工具
```bash
# 检查端口占用
sudo netstat -tlnp | grep :80

# 检查进程
ps aux | grep nginx

# 检查磁盘空间
df -h

# 检查内存使用
free -m
```

## 📋 部署检查清单

### 部署前检查
- [ ] 代码已测试且无错误
- [ ] 环境变量已配置
- [ ] 构建成功
- [ ] 静态资源路径正确
- [ ] 安全配置就位

### 部署后检查
- [ ] 网站可正常访问
- [ ] 所有页面加载正常
- [ ] 静态资源加载正常
- [ ] 移动端显示正常
- [ ] 搜索功能正常
- [ ] 筛选功能正常
- [ ] 导出功能正常
- [ ] 模态框正常工作
- [ ] 性能符合预期

### 安全检查
- [ ] HTTPS 已启用
- [ ] 安全头已配置
- [ ] 敏感信息已保护
- [ ] 访问控制已设置
- [ ] 备份策略已就位

## 🚀 持续集成/持续部署 (CI/CD)

### GitHub Actions
创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run linting
      run: npm run lint
    
    - name: Type check
      run: npm run type-check

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build project
      run: npm run build
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-files
        path: out/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: build-files
        path: out/
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
```

---

本部署指南确保你能够在各种环境中成功部署和维护应用。如有问题，请参考故障排除部分或提交 GitHub Issue。
