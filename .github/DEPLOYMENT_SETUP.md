# GitHub Actions CI/CD Deployment Setup

This guide explains how to set up automated deployment using GitHub Actions.

## Step 1: Add GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

### Required Secrets:

1. **VPS_HOST**
   - Value: Your VPS IP address or domain (e.g., `your-vps-ip`)
   - Used for SSH connection to deploy server

2. **VPS_USER**
   - Value: `root` (or your VPS username)
   - SSH user for deployment

3. **VPS_SSH_KEY**
   - Value: [Copy the PRIVATE KEY from below]
   - ED25519 private key for SSH authentication

4. **NEXT_PUBLIC_SITE_URL**
   - Value: `https://photos.nicogaray.com`
   - Public site URL for Next.js build

### Optional secret (Hostinger API)

5. **HOSTINGER_API_TOKEN**
   - Value: API token from Hostinger hPanel → search **API** → generate token (see [Hostinger API](https://support.hostinger.com/en/articles/10840865-what-is-hostinger-api))
   - Used only for **Hostinger REST API / CLI** (VPS management, snapshots, etc.); it does **not** replace SSH login
   - The deploy workflow does **not** read this secret today—add it if you later run Hostinger API calls from Actions or external tooling that expects `HOSTINGER_API_TOKEN` (or map it to `HAPI_API_TOKEN` for the [Hostinger API CLI](https://support.hostinger.com/en/articles/11679133-how-to-use-hostinger-api-cli))

## SSH Keys Generated

**Fingerprint:** `SHA256:2Ylx02hsd9UTmNh4PK6PHyKTHgPRnUTNT4F8wDKTOEI`

**Private Key:** (Already added to VPS authorized_keys)

## Workflow Behavior

When you push to `main` branch:

1. ✅ GitHub Actions clones your repo
2. ✅ Installs dependencies (`npm ci`)
3. ✅ Runs linter (if configured)
4. ✅ Runs TypeScript type check
5. ✅ Builds Next.js app (`npm run build`)
6. ✅ SSHes into VPS
7. ✅ Pulls latest code from GitHub
8. ✅ Rebuilds Docker image
9. ✅ Restarts containers
10. ✅ App is live!

## Monitoring Deployments

- View deployment logs: GitHub repo → Actions tab
- See real-time status of builds
- Click on workflow run to see detailed logs

## Local Development Workflow

```bash
# Make changes locally
git add .
git commit -m "feat: your change"

# Push to GitHub (triggers deployment automatically)
git push origin main

# Check deployment status on GitHub Actions
# → Go to Actions tab
# → Watch the workflow run
# → App updates automatically when build succeeds
```

## Manual Deployment (if needed)

To manually trigger deployment without code changes:

```bash
# On your VPS
cd /root/nico-garay
git pull origin main
docker compose down
docker compose up -d --build
```

## Troubleshooting

**Deployment fails with SSH error:**
- Verify VPS_SSH_KEY secret is correctly copied (full key including BEGIN/END lines)
- Check VPS_HOST and VPS_USER are correct
- Ensure SSH key is added to VPS authorized_keys

**Build fails:**
- Check GitHub Actions logs for specific error
- Verify all environment variables are set
- Ensure npm dependencies are up to date

**Container won't start:**
- SSH into VPS: `ssh root@<VPS_IP>`
- Check logs: `docker compose logs app`
- Verify .env file has all required variables
