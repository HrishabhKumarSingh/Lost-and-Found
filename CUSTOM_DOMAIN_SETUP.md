# Custom Domain Setup Guide

This guide explains how to connect and configure your own custom domain (e.g., `lostfound.org` or `lost.youruniversity.edu`) for the Lost & Found application.

---

## 1. Configure Application Environment Variables

Set the `NEXT_PUBLIC_APP_URL` variable in your production environment to your custom domain:

```env
NEXT_PUBLIC_APP_URL=https://lostfound.org
```

This ensures:
- Canonical metadata and OpenGraph tags reference your custom domain.
- OAuth callbacks and verification links generate correct absolute URLs.
- Secure origin headers align with your production URL.

---

## 2. DNS Configuration Options

Depending on your DNS provider (Cloudflare, Namecheap, GoDaddy, AWS Route 53, etc.) and hosting platform:

### Option A: Vercel / Next.js Managed Hosting
1. Add your custom domain in your Vercel Dashboard under **Project Settings > Domains**.
2. Add the recommended DNS records to your domain registrar:
   - **Apex Domain (`@` / `example.com`)**:
     - Type: `A`
     - Name: `@`
     - Value: `76.76.21.21`
   - **Subdomain (`www` or `lost`)**:
     - Type: `CNAME`
     - Name: `www` (or `lost`)
     - Value: `cname.vercel-dns.com`

### Option B: Self-Hosted Server (VPS / Docker / Nginx)
1. Add an `A` record pointing to your server's public IP address:
   - Type: `A`
   - Name: `@`
   - Value: `<Your-Server-Public-IP>`
2. Configure Nginx reverse proxy to forward traffic to `localhost:3000`:

```nginx
server {
    server_name lostfound.org www.lostfound.org;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3. Provision a free SSL/TLS certificate using Certbot:
```bash
sudo certbot --nginx -d lostfound.org -d www.lostfound.org
```

---

## 3. Verification & SSL

Once your DNS records propagate (typically 5 to 30 minutes):
1. Test your custom domain in your browser.
2. Confirm HTTPS certificate is active.
3. Test API endpoints to verify CORS headers accept requests from your custom domain.
