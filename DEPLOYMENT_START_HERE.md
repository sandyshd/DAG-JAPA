# cPanel Deployment - Complete Package Summary

## 📦 What You Have

Your Next.js application is ready for deployment to cPanel at `https://developing.africa`. This package includes complete documentation and helper scripts.

---

## 📚 Documentation Files Created

### 1. **DEPLOYMENT_CPANEL.md** (Main Guide)
- Complete 11-step deployment guide
- Detailed cPanel setup instructions
- Database configuration
- SSL/HTTPS setup
- Troubleshooting guide
- Quick reference commands

### 2. **DEPLOYMENT_QUICK_REFERENCE.md** (Quick Lookup)
- Pre-deployment commands
- cPanel setup checklist
- All SSH commands needed
- PM2 management commands
- Testing procedures
- Emergency commands
- Reference table for environment variables

### 3. **ecosystem.config.js** (PM2 Configuration)
- Pre-configured PM2 ecosystem file
- Ready to use on cPanel server
- Includes logging, restart policies, memory limits

### 4. **deployment-setup.sh** (Linux/Mac Setup)
- Automated pre-deployment setup
- Runs build and validation checks
- Shows next steps

### 5. **deployment-setup.bat** (Windows Setup)
- Automated pre-deployment setup for Windows
- Same as shell script but for Windows

### 6. **verify-deployment.sh** (Server-Side Verification)
- Run on cPanel after deployment
- Verifies all components are working
- Tests database connection
- Shows system status

---

## 🚀 Quick Start Summary

### Phase 1: Local Preparation (Your Machine)
1. Run build: `npm run build`
2. Generate secret: `openssl rand -base64 32`
3. Create deployment package (zip file)

### Phase 2: cPanel Setup (Control Panel)
1. Create addon domain: `developing.africa`
2. Enable Node.js (v18+ or v20 LTS)
3. Create PostgreSQL database
4. Note credentials and port

### Phase 3: Server Deployment (SSH)
1. Upload and extract zip file
2. Run: `npm install --production`
3. Create `.env.local` with production values
4. Run: `npm run build`
5. Run Prisma migrations
6. Start with PM2
7. Run verification script

---

## 🔑 Key Information You'll Need

### From cPanel:
- [ ] Domain: `developing.africa`
- [ ] Document Root: `/home/username/public_html/developing.africa`
- [ ] Node.js Port (assigned by cPanel, usually 8080+)
- [ ] Database Host: `localhost`
- [ ] Database Port: `5432`
- [ ] Database Name: `dag_japa_production`
- [ ] Database User: Created by you
- [ ] Database Password: Created by you

### To Generate:
- [ ] NEXTAUTH_SECRET: `openssl rand -base64 32`
- [ ] Email app password (if using Gmail)

---

## 📋 Pre-Deployment Checklist

- [ ] **Build locally**: `npm run build`
- [ ] **Update .env.local**: All required variables
- [ ] **Verify** `ecosystem.config.js` exists
- [ ] **Generate** NEXTAUTH_SECRET with openssl
- [ ] **Create** deployment zip file (exclude node_modules, .next, .git)
- [ ] **Save** cPanel credentials securely
- [ ] **Save** database credentials securely
- [ ] **Backup** existing database (if upgrading)
- [ ] **Test** all API endpoints locally
- [ ] **Verify** all environment variables are correct

---

## 🛠️ Essential Commands Reference

### Local (Before Upload)
```bash
npm run build
openssl rand -base64 32
```

### Server (After SSH)
```bash
npm install --production
npm run build
npx prisma migrate deploy
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
bash verify-deployment.sh
```

---

## 📝 Environment Variables Template

```bash
# Database (PostgreSQL on cPanel)
DATABASE_URL="postgresql://username:password@localhost:5432/dag_japa_production"
PRISMA_DATABASE_URL="postgresql://username:password@localhost:5432/dag_japa_production"

# NextAuth
NEXTAUTH_URL="https://developing.africa"
NEXTAUTH_SECRET="your-generated-secret-here"

# Email Configuration
EMAIL_ENABLED="true"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-specific-password"
EMAIL_FROM="noreply@developing.africa"

# Node Environment
NODE_ENV="production"
PORT="3000"
```

---

## ⚠️ Important Notes

1. **Never commit .env.local** to git - create it fresh on the server
2. **Use strong database password** - different from any other password
3. **Enable HTTPS** - Get SSL certificate through cPanel AutoSSL
4. **Monitor logs** - Check `pm2 logs dag-japa-nextjs` regularly
5. **Backup database** - Before running migrations
6. **Keep backups** - Regular database and file backups
7. **Update Node.js** - Keep version updated through cPanel

---

## 🔒 Security Checklist

- [ ] .env.local file permissions set to 600
- [ ] Database password is strong (16+ chars, mixed case, numbers, symbols)
- [ ] NEXTAUTH_SECRET is randomly generated (32+ characters)
- [ ] SMTP credentials are app-specific (not main password)
- [ ] Email from address is verified
- [ ] SSL/HTTPS is enabled
- [ ] PM2 is running with non-root user
- [ ] Firewall rules are configured if needed
- [ ] Regular security updates installed

---

## 🆘 Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| App not starting | Check PM2 logs: `pm2 logs dag-japa-nextjs` |
| Database connection error | Verify DATABASE_URL in .env.local |
| Port already in use | Find process: `lsof -i :3000` and kill it |
| Node version mismatch | Update through cPanel Node.js Selector |
| File permission errors | Run `chmod 600 .env.local` |
| HTTPS not working | Check SSL cert in cPanel AutoSSL |
| High memory usage | Check app logs for errors, increase limit if needed |

---

## 📞 Support Resources

- **Full Guide**: Read DEPLOYMENT_CPANEL.md
- **Quick Reference**: Check DEPLOYMENT_QUICK_REFERENCE.md
- **Verification**: Run verify-deployment.sh on server
- **PM2 Docs**: https://pm2.keymetrics.io/
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **cPanel Documentation**: https://documentation.cpanel.net/

---

## ✅ After Deployment

Once deployment is complete:

1. **Verify application is running**:
   ```bash
   curl https://developing.africa
   ```

2. **Test critical endpoints**:
   ```bash
   curl https://developing.africa/api/modules
   curl https://developing.africa/api/applications
   ```

3. **Monitor logs for first 24 hours**:
   ```bash
   pm2 logs dag-japa-nextjs
   ```

4. **Set up automated monitoring** (optional):
   - cPanel monitoring tools
   - Email alerts for PM2
   - Uptime monitoring service

5. **Schedule regular backups**:
   - Database backups (daily)
   - File backups (weekly)
   - Keep multiple versions

---

## 📊 Performance Monitoring

Monitor these metrics regularly:

- **CPU Usage**: `top`
- **Memory Usage**: `free -h`
- **Disk Space**: `df -h`
- **Application Status**: `pm2 status`
- **Database Performance**: Monitor query logs
- **Error Logs**: `tail -f logs/error.log`
- **Request Logs**: `tail -f logs/out.log`

---

## 🔄 Deployment Maintenance

### Regular Tasks:
- ✓ Check logs weekly
- ✓ Monitor disk space
- ✓ Verify backups are working
- ✓ Update npm packages monthly
- ✓ Review error logs for issues

### Monthly Tasks:
- ✓ Update Node.js if new LTS available
- ✓ Rotate logs
- ✓ Review performance metrics
- ✓ Update security certificates

### Quarterly Tasks:
- ✓ Full security audit
- ✓ Database optimization
- ✓ Performance benchmarking
- ✓ Disaster recovery testing

---

## 🎯 Success Criteria

Your deployment is successful when:

✓ Application is accessible at https://developing.africa
✓ All API endpoints respond correctly
✓ Database connectivity is working
✓ Emails are being sent (if enabled)
✓ SSL/HTTPS is active
✓ PM2 shows app as "online"
✓ No critical errors in logs
✓ Performance is acceptable
✓ Backups are being created

---

## 📞 Ready to Deploy?

1. **Read**: DEPLOYMENT_CPANEL.md (5-10 minutes)
2. **Prepare**: Follow Phase 1 instructions locally
3. **Execute**: Follow Phase 2 in cPanel
4. **Deploy**: Follow Phase 3 via SSH
5. **Verify**: Run verify-deployment.sh

**Need help?** Check DEPLOYMENT_QUICK_REFERENCE.md for common issues.

---

## 📞 Contact Information

For support during deployment:
- Check application logs: `pm2 logs dag-japa-nextjs`
- Review cPanel error logs
- Run verification script: `bash verify-deployment.sh`
- Check server resources: `top`, `df -h`, `free -h`

---

**Good luck with your deployment! 🚀**

The application is ready. Follow the guides and you'll have it running in no time.
