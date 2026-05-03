# Déploiement VPS — Nico Garay

## Prérequis sur le VPS Ubuntu 24

```bash
# Mise à jour et outils
apt update && apt upgrade -y
apt install -y nginx certbot python3-certbot-nginx docker.io docker-compose-plugin git

# Activer Docker
systemctl enable --now docker

# Créer un utilisateur applicatif (optionnel mais recommandé)
adduser nico-app
usermod -aG docker nico-app
```

## Installation du projet

```bash
# Cloner le repo
git clone https://github.com/votrecompte/nico-garay.git /home/nico-app/nico-garay
cd /home/nico-app/nico-garay

# Copier et configurer les variables d'environnement
cp .env.example .env
nano .env  # remplir toutes les clés

# Construire et démarrer
docker compose up -d --build

# Appliquer les migrations Prisma
docker compose exec app npx prisma migrate deploy
```

## Nginx + TLS (Let's Encrypt)

```bash
# Copier la config
cp nginx.conf.example /etc/nginx/sites-available/nico-garay
ln -s /etc/nginx/sites-available/nico-garay /etc/nginx/sites-enabled/

# Obtenir le certificat (domaine doit déjà pointer vers ce VPS)
certbot --nginx -d photos-garaynico.com -d www.photos-garaynico.com

# Vérifier et recharger nginx
nginx -t && systemctl reload nginx
```

## Firewall (UFW)

```bash
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
ufw status
```

## Sauvegardes PostgreSQL (crontab)

```bash
# Ajouter dans crontab -e (root ou nico-app)
0 3 * * * docker compose -f /home/nico-app/nico-garay/docker-compose.yml exec -T db pg_dump -U nico nico_garay | gzip > /var/backups/nico_garay_$(date +\%Y\%m\%d).sql.gz
# Garder 30 jours
0 4 * * * find /var/backups -name "nico_garay_*.sql.gz" -mtime +30 -delete
```

## Mise à jour

```bash
cd /home/nico-app/nico-garay
git pull
docker compose up -d --build
docker compose exec app npx prisma migrate deploy
```

## Webhook Stripe

Configurer dans le tableau de bord Stripe :
- URL : `https://photos-garaynico.com/api/stripe/webhook`
- Événement : `checkout.session.completed`
- Copier le `STRIPE_WEBHOOK_SECRET` dans `.env`
