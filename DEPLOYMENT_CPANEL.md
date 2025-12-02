# Next.js Application Deployment Guide - cPanel

## Overview
This guide provides step-by-step instructions to deploy your Next.js application to cPanel with Node.js support.

---

## STEP 1: Prepare Your Application Locally

### 1.1 Build the Application
```bash
npm run build
```
This creates an optimized production build in the `.next` directory.

### 1.2 Create PM2 Ecosystem Configuration File
Create `ecosystem.config.js` in the project root:

```javascript
module.exports = {
  apps: [{
    name: "dag-japa-nextjs",
    script: "./node_modules/.next/standalone/server.js",
    env: {
      NODE_ENV: "production",
      PORT: 3000
    },
    instances: 1,
    exec_mode: "cluster",
    watch: false,
    max_memory_restart: "500M"
  }]
};
```

### 1.3 Create .cpanelrc Configuration (Optional but Recommended)
```bash
cat > .cpanelrc << EOF
{
  "deployment_type": "nodejs"
}
EOF
```

### 1.4 Update next.config.js (if needed)
Ensure your `next.config.js` includes:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // ... rest of your config
};

module.exports = nextConfig;
```

---

## STEP 2: cPanel Setup

### 2.1 Create Addon Domain
1. Log in to cPanel
2. Go to **Addon Domains**
3. Click **Create Addon Domain**
4. Enter:
   - **Domain Name**: `developing.africa` (or appropriate subdomain)
   - **Subdomain**: Leave as default or set to `www`
   - **Document Root**: `/home/username/public_html/developing.africa` (automatically set)
5. Click **Add Domain**

### 2.2 Enable Node.js
1. In cPanel, go to **Node.js Selector** (or **Node.js Manager**)
2. Select your addon domain `developing.africa`
3. Choose Node.js version: **18.x** or **20.x** (latest LTS recommended)
4. Click **Save** or **Create**
5. Note the port assigned (usually 8080 or higher)

### 2.3 Create Application Directory
The document root will be created. You'll deploy your app there.

---

## STEP 3: Prepare Database Connection

### 3.1 Create PostgreSQL Database on cPanel
1. Go to **MySQL® Databases** or **PostgreSQL Databases** in cPanel
2. Create new database:
   - **Database Name**: `dag_japa_production`
   - **Username**: Create new user
   - **Password**: Use strong password (save this!)
3. Add user to database with all privileges
4. Save connection details:
   ```
   HOST: localhost
   PORT: 5432
   DATABASE: dag_japa_production
   USER: your_db_user
   PASSWORD: your_db_password
   ```

### 3.2 Alternative: Remote PostgreSQL
If using external PostgreSQL (e.g., AWS RDS):
- Ensure cPanel server has internet access
- Whitelist cPanel server IP in database firewall
- Update DATABASE_URL accordingly

---

## STEP 4: Upload Application to cPanel

### 4.1 Zip Your Application
On your local machine:
```bash
# Remove node_modules and .next (we'll reinstall on server)
rm -rf node_modules .next

# Create zip excluding unnecessary files
zip -r dag-japa-nextjs.zip . \
  -x "node_modules/*" \
  ".next/*" \
  ".git/*" \
  ".env.local" \
  "*.log"
```

### 4.2 Upload via cPanel File Manager
1. In cPanel, go to **File Manager**
2. Navigate to `/home/username/public_html/developing.africa`
3. Upload `dag-japa-nextjs.zip`
4. Right-click → **Extract** to unzip

**Alternative: Use SFTP/SSH**
```bash
# Using scp (if SSH enabled on cPanel)
scp -r . username@your-cpanel-host:/home/username/public_html/developing.africa/

# Using SFTP
sftp username@your-cpanel-host
cd /home/username/public_html/developing.africa
put -r .
```

### 4.3 Connect via SSH (Recommended for Next Steps)
```bash
ssh username@your-cpanel-host
cd /home/username/public_html/developing.africa
```

---

## STEP 5: Install Dependencies on cPanel Server

### 5.1 SSH into Your Server
```bash
ssh username@developing.africa
```

### 5.2 Install Node Packages
```bash
cd /home/username/public_html/developing.africa
npm install --production
```

### 5.3 Build Application
```bash
npm run build
```

---

## STEP 6: Configure Environment Variables

### 6.1 Create .env.local on Server
```bash
cat > .env.local << 'EOF'
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/dag_japa_production"

# NextAuth
NEXTAUTH_URL="https://developing.africa"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

# Email Configuration
EMAIL_ENABLED="true"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="noreply@developing.africa"

# Prisma
PRISMA_DATABASE_URL="postgresql://username:password@localhost:5432/dag_japa_production"
EOF
```

### 6.2 Generate NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```
Copy the output and paste as NEXTAUTH_SECRET value.

### 6.3 Secure .env.local
```bash
chmod 600 .env.local
```

---

## STEP 7: Setup Database on Production

### 7.1 Run Prisma Migrations
```bash
npx prisma migrate deploy
```

### 7.2 Seed Database (Optional)
```bash
npx prisma db seed
```

---

## STEP 8: Configure PM2

### 8.1 Install PM2 Globally on cPanel
```bash
npm install -g pm2
```

### 8.2 Start Application with PM2
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

The `pm2 startup` command will show output - copy and run it to enable auto-restart on reboot.

### 8.3 View Application Status
```bash
pm2 status
pm2 logs dag-japa-nextjs
```

---

## STEP 9: Configure Reverse Proxy (If Needed)

### 9.1 Check Apache Configuration
cPanel may have automatically configured Apache to proxy to your Node.js app.

### 9.2 Manual Proxy Configuration (if needed)
Create/update `.htaccess` in document root:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
</IfModule>
```

---

## STEP 10: SSL Certificate Setup

### 10.1 Enable AutoSSL in cPanel
1. In cPanel, go to **AutoSSL**
2. Check if certificate is auto-installed
3. If not, click **Run AutoSSL** or use **Let's Encrypt** from cPanel

### 10.2 Verify HTTPS
```bash
curl -I https://developing.africa
```

---

## STEP 11: Verify Deployment

### 11.1 Test Application
```bash
# Check if app is running
curl http://localhost:3000

# Check specific endpoints
curl https://developing.africa
curl https://developing.africa/api/modules
```

### 11.2 Monitor Logs
```bash
# PM2 logs
pm2 logs dag-japa-nextjs

# Nginx/Apache logs (if applicable)
tail -f /var/log/apache2/error.log
tail -f /var/log/apache2/access.log
```

### 11.3 Test Database Connection
```bash
# SSH to server and test
psql postgresql://username:password@localhost:5432/dag_japa_production -c "SELECT 1"
```

---

## Troubleshooting

### Application Not Starting
```bash
# Check PM2 status
pm2 status

# View detailed logs
pm2 logs dag-japa-nextjs --lines 100

# Restart application
pm2 restart dag-japa-nextjs
```

### Database Connection Error
```bash
# Verify DATABASE_URL in .env.local
cat .env.local | grep DATABASE_URL

# Test connection manually
psql $DATABASE_URL -c "SELECT 1"
```

### Port Already in Use
```bash
# Find process using port
lsof -i :3000
# Kill it if needed
kill -9 <PID>
```

### Node Version Issues
```bash
# Check Node version
node -v

# Check npm version
npm -v

# Update if needed through cPanel Node.js Selector
```

### Permissions Issues
```bash
# Fix file permissions
chmod -R 755 /home/username/public_html/developing.africa
chmod 600 .env.local
```

---

## Deployment Checklist

- [ ] Build Next.js application locally
- [ ] Create ecosystem.config.js
- [ ] Create addon domain in cPanel
- [ ] Enable Node.js in cPanel Node.js Selector
- [ ] Create PostgreSQL database on cPanel
- [ ] Upload application files to cPanel
- [ ] SSH into server
- [ ] Run `npm install --production`
- [ ] Run `npm run build`
- [ ] Create .env.local with production values
- [ ] Generate and set NEXTAUTH_SECRET
- [ ] Run Prisma migrations: `npx prisma migrate deploy`
- [ ] Install PM2 globally
- [ ] Start with PM2: `pm2 start ecosystem.config.js`
- [ ] Enable PM2 startup: `pm2 startup`
- [ ] Verify HTTPS/SSL certificate
- [ ] Test application endpoints
- [ ] Monitor logs for errors
- [ ] Set up automated backups

---

## Quick Reference Commands

```bash
# SSH to server
ssh username@developing.africa

# Navigate to app
cd /home/username/public_html/developing.africa

# Install dependencies
npm install --production

# Build app
npm run build

# Start with PM2
pm2 start ecosystem.config.js

# View logs
pm2 logs dag-japa-nextjs

# Restart app
pm2 restart dag-japa-nextjs

# Check status
pm2 status

# Stop app
pm2 stop dag-japa-nextjs
```

---

## Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [cPanel Node.js Documentation](https://documentation.cpanel.net/display/cpdocs/Node.js+Domains)
- [PostgreSQL on cPanel](https://documentation.cpanel.net/display/cpdocs/PostgreSQL+Databases)

---

## Support

For issues or questions:
1. Check PM2 logs: `pm2 logs`
2. Check cPanel error logs
3. Review .env.local configuration
4. Verify database connectivity
5. Check server resource usage: `top`, `df -h`
