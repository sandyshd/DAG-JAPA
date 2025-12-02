# Quick Deployment Reference Card

## Pre-Deployment (Local Machine)

```bash
# 1. Build application
npm run build

# 2. Create ecosystem.config.js (already in repo)
# 3. Generate NEXTAUTH_SECRET
openssl rand -base64 32

# 4. Create deployment package
# Windows PowerShell:
Compress-Archive -Path . -DestinationPath dag-japa-nextjs.zip -Exclude node_modules, .next, .git

# Linux/Mac:
zip -r dag-japa-nextjs.zip . -x "node_modules/*" ".next/*" ".git/*"
```

---

## cPanel Setup

### 1. Create Addon Domain
- cPanel → Addon Domains
- Domain: `developing.africa`
- Document Root: `/home/username/public_html/developing.africa`

### 2. Enable Node.js
- cPanel → Node.js Selector
- Select domain: `developing.africa`
- Version: 18.x or 20.x LTS
- Save/Create

### 3. Create Database
- cPanel → PostgreSQL Databases
- Database: `dag_japa_production`
- User: `dag_japa_user`
- Save credentials

---

## SSH Commands (On Server)

```bash
# Connect
ssh username@developing.africa

# Navigate to app
cd /home/username/public_html/developing.africa

# Upload via SFTP or File Manager, then extract
unzip dag-japa-nextjs.zip

# Install dependencies
npm install --production

# Build
npm run build

# Create .env.local with production values
cat > .env.local << 'EOF'
DATABASE_URL="postgresql://user:pass@localhost:5432/dag_japa_production"
NEXTAUTH_URL="https://developing.africa"
NEXTAUTH_SECRET="<generated-secret-here>"
PRISMA_DATABASE_URL="postgresql://user:pass@localhost:5432/dag_japa_production"
EMAIL_ENABLED="true"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="noreply@developing.africa"
EOF

# Secure it
chmod 600 .env.local

# Create logs directory
mkdir -p logs

# Run Prisma migrations
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed

# Install PM2 globally
npm install -g pm2

# Start app with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Enable auto-restart on reboot
pm2 startup
# ^ Follow the command output, it will tell you to run another command

# Verify app is running
pm2 status
pm2 logs dag-japa-nextjs

# View monitoring
pm2 monit
```

---

## Port Configuration

### If Node.js Selector assigned a different port:
1. Update `PORT` in ecosystem.config.js
2. Update cPanel Node.js settings
3. Verify Apache proxy configuration

### Check which port is being used:
```bash
# On server
ps aux | grep node
netstat -tulpn | grep node
pm2 status
```

---

## SSL/HTTPS Setup

```bash
# In cPanel: AutoSSL
# Should auto-install Let's Encrypt certificate

# Verify:
curl -I https://developing.africa

# If needed, manually install:
# cPanel → AutoSSL or Let's Encrypt
```

---

## Monitoring & Logs

```bash
# View PM2 logs (real-time)
pm2 logs dag-japa-nextjs

# View specific logs
tail -f logs/error.log
tail -f logs/out.log
tail -f logs/combined.log

# Check application status
pm2 status

# Monitor resources
pm2 monit

# List all processes
pm2 list
```

---

## Restart & Maintenance

```bash
# Restart application
pm2 restart dag-japa-nextjs

# Stop application
pm2 stop dag-japa-nextjs

# Start application
pm2 start dag-japa-nextjs

# Restart all PM2 apps
pm2 restart all

# View startup scripts
pm2 startup

# Remove from startup
pm2 unstartup

# Delete app from PM2
pm2 delete dag-japa-nextjs
```

---

## Testing

```bash
# Test local endpoint
curl http://localhost:3000

# Test production endpoint
curl https://developing.africa

# Test API endpoints
curl https://developing.africa/api/modules
curl https://developing.africa/api/applications

# Test database
psql -U dag_japa_user -d dag_japa_production -h localhost -c "SELECT 1"
```

---

## Troubleshooting

```bash
# Check Node.js version
node -v

# Check npm version
npm -v

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --production

# Rebuild
npm run build

# Check environment variables
cat .env.local

# Check file permissions
ls -la
ls -la .env.local  # Should be 600

# Check disk space
df -h

# Check memory
free -h

# Check running processes
ps aux | grep node
ps aux | grep pm2

# Find port usage
netstat -tulpn | grep 3000
lsof -i :3000

# Kill process on specific port (if stuck)
kill -9 <PID>
```

---

## Emergency Commands

```bash
# Force restart everything
pm2 kill
sleep 2
pm2 start ecosystem.config.js --env production

# Complete rebuild
npm run build
pm2 restart dag-japa-nextjs

# Check system health
top
free -h
df -h

# Review recent logs
tail -100 logs/error.log
tail -100 logs/out.log
```

---

## Important Environment Variables for Production

| Variable | Example | Purpose |
|----------|---------|---------|
| DATABASE_URL | postgresql://user:pass@localhost:5432/dag_japa_production | PostgreSQL connection |
| NEXTAUTH_URL | https://developing.africa | NextAuth callback URL |
| NEXTAUTH_SECRET | random-32-char-string | Session encryption |
| PRISMA_DATABASE_URL | postgresql://user:pass@localhost:5432/dag_japa_production | Prisma connection |
| NODE_ENV | production | Node environment |
| PORT | 3000 | Application port |
| EMAIL_ENABLED | true | Enable email sending |
| SMTP_HOST | smtp.gmail.com | Email server |
| SMTP_PORT | 587 | Email server port |

---

## Resources

- **Deployment Guide**: DEPLOYMENT_CPANEL.md
- **Verify Script**: verify-deployment.sh
- **PM2 Docs**: https://pm2.keymetrics.io/
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **cPanel Docs**: https://documentation.cpanel.net/

---

## Support Checklist

Before contacting support, verify:
- [ ] Node.js is installed and correct version
- [ ] PM2 process is running: `pm2 status`
- [ ] .env.local has all required variables
- [ ] Database connection is working
- [ ] Logs show no critical errors: `pm2 logs`
- [ ] Disk space is available: `df -h`
- [ ] Memory is not exhausted: `free -h`
- [ ] Ports are not in conflict: `netstat -tulpn`
