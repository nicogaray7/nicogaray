# GitHub Actions CI/CD Deployment Setup

This guide explains how to set up automated deployment using GitHub Actions.

## Step 1: Add GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

### Required secrets

1. **VPS_HOST**
   - Value: Your VPS IP address or domain (e.g., `your-vps-ip`)
   - Used for SSH connection to deploy server

2. **VPS_USER**
   - Value: `root` (or your VPS username)
   - SSH user for deployment

3. **NEXT_PUBLIC_SITE_URL**
   - Value: `https://photos.nicogaray.com`
   - Public site URL for Next.js build

### SSH authentication (at least one)

Provide **either** a private key **or** the root password. If **both** `VPS_SSH_KEY` and `VPS_ROOT_PASSWORD` are set, the SSH client uses **key authentication** first (keep only the secret you need if you want password-only deploys).

4. **VPS_SSH_KEY** (recommended)
   - ED25519 **private** key (full PEM block including `BEGIN` / `END` lines)
   - Public key must be in `~/.ssh/authorized_keys` on the VPS

5. **VPS_ROOT_PASSWORD** (alternative, e.g. Hostinger root password)
   - Root password as shown in hPanel / VPS SSH settings
   - Stored only as a GitHub Actions secret (masked in logs)
   - Prefer rotating to **key-based auth** when possible

## Dependency install (CI and Docker)

The repo includes a root `.npmrc` with `legacy-peer-deps=true` so `npm ci` matches the Docker build (React 19 and `react-simple-maps` peer range). **Do not remove** without resolving that peer conflict upstream.

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
10. ✅ Confirms VPS `HEAD` matches the deployed revision
11. ✅ Smoke-tests `GET /api/health` on the public URL

You can also run the workflow manually: GitHub → **Actions** → **Build and Deploy** → **Run workflow** (always builds and deploys `main`).

## Monitoring Deployments

- View deployment logs: GitHub repo → Actions tab
- See real-time status of builds
- Click on workflow run to see detailed logs

After each deploy, Actions verifies:

1. **VPS git commit** — SHA under `/root/nico-garay` matches the revision built in the workflow.
2. **`GET /api/health`** — returns HTTP 200 on `NEXT_PUBLIC_SITE_URL` (fallback `https://photos.nicogaray.com`), with retries while containers start.

If either step fails, the workflow fails so you know production may be out of sync.

## Verify production matches GitHub

### Automated (recommended)

See the **Assert VPS revision** and **Smoke test production /api/health** steps in the latest **Build and Deploy** run on `main`.

### Manual (SSH)

```bash
ssh root@<VPS_IP> 'cd /root/nico-garay && git fetch origin main && git rev-parse HEAD && git rev-parse origin/main'
```

### Manual (HTTP)

```bash
curl -sfS https://photos.nicogaray.com/api/health
```

Expect JSON `{"ok":true}` and HTTP 200 after a successful deploy that includes this endpoint.

The two git hashes from SSH should match each other and match the latest `main` commit on GitHub after deploy.

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

To manually trigger deployment from GitHub (no local/VPS shell): **Actions** → **Build and Deploy** → **Run workflow**.

To update only from the server:

```bash
# On your VPS
cd /root/nico-garay
git pull origin main
docker compose down
docker compose up -d --build
```

## Troubleshooting

**Deployment fails with SSH error:**

- If using **key**: verify `VPS_SSH_KEY` includes the full private key and the matching public key is on the server
- If using **password**: verify `VPS_ROOT_PASSWORD` matches the VPS root password and `VPS_USER` is correct (often `root`)
- Confirm `VPS_HOST` is reachable from the internet (SSH port 22 open)
- On the VPS, ensure `PasswordAuthentication` is allowed if you rely only on password (Hostinger images usually allow this by default)

**Build fails:**

- Check GitHub Actions logs for specific error
- Verify all environment variables are set
- Ensure npm dependencies are up to date

**Smoke test / health fails:**

- Ensure `NEXT_PUBLIC_SITE_URL` matches the URL nginx proxies to (no trailing slash required). Check container logs: `docker compose logs app`
- First deploy after adding `/api/health` must complete once before this check passes

**Container won't start:**

- SSH into VPS: `ssh root@<VPS_IP>`
- Check logs: `docker compose logs app`
- Verify .env file has all required variables
