# Deploy Neurooz

Canonical site: **https://neurooz.com**

Deploys run on your machine. GitHub Actions on this account fail at startup, and GitHub Pages is not the host.

| Role | Host | Command |
|------|------|---------|
| Primary | Cloudflare Pages | `npm run deploy:cf` |
| Failover | DigitalOcean droplet | `npm run deploy:do` |

`public/CNAME` (contents `neurooz.com`) is only read by GitHub Pages. Cloudflare and the droplet do not use it. Leave the file in the repo.

`public/404.html` is the deep-link fallback for a host that serves it on unknown paths. Cloudflare uses `public/_redirects` instead (`/* /index.html 200`). The droplet uses `try_files` in `nginx.conf`.

## Before either deploy

```bash
cp .env.example .env
# Fill VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY if you want sign-in.
# The site still renders the home page when those are empty.
npm ci
```

Do not commit `.env` or a Cloudflare token.

## Primary: Cloudflare Pages

Wrangler uploads `dist/` directly. It does not use GitHub.

```bash
npx wrangler login
npm run deploy:cf
```

`deploy:cf` is `npm run build && npx wrangler pages deploy dist --project-name neurooz`.

If you would rather not use the browser login, create an API token in the Cloudflare dashboard (Pages: Edit) and export it in the shell for that run only:

```bash
export CLOUDFLARE_API_TOKEN="paste-here-do-not-commit"
npm run deploy:cf
```

The first upload creates the Pages project `neurooz` when the token is allowed to. The temporary hostname is `https://neurooz.pages.dev`.

### Attach neurooz.com

DNS for neurooz.com is at GoDaddy. Nameservers today are `ns45.domaincontrol.com` and `ns46.domaincontrol.com`.

In the Cloudflare dashboard, open the Pages project `neurooz` and add the custom domains `neurooz.com` and `www.neurooz.com`. Cloudflare then shows the DNS target (a `pages.dev` hostname). Use one of the two options below.

**Option A — move nameservers to Cloudflare.** Add the site `neurooz.com` in Cloudflare DNS. Cloudflare shows two nameservers of its own. At GoDaddy, replace `ns45.domaincontrol.com` and `ns46.domaincontrol.com` with those two nameservers. After they propagate, add the custom domain on the Pages project and let Cloudflare create the records. This is the option that lets Cloudflare proxy the domain.

**Option B — leave nameservers at GoDaddy.** Keep `ns45.domaincontrol.com` and `ns46.domaincontrol.com`. At GoDaddy, add a CNAME for `www` to the `pages.dev` target Cloudflare shows. A standard CNAME is not valid on the apex name (`@`). For the apex, use GoDaddy domain forwarding from `https://neurooz.com` to `https://www.neurooz.com`, or GoDaddy's CNAME flattening / ALIAS record if the panel offers it for `@`. Do not invent an A-record IP. Use only the target Cloudflare displays.

The canonical URL in the app stays `https://neurooz.com/`.

## Failover: DigitalOcean droplet

Use this when Cloudflare is down or you need the site on the droplet instead.

```bash
export DEPLOY_HOST="the.droplet.ip.or.hostname"
export DEPLOY_USER="ubuntu"
# optional:
# export DEPLOY_PATH="/home/ubuntu/neurooz/dist"
# export DEPLOY_SSH_KEY="$HOME/.ssh/your-key"
npm run deploy:do
```

`deploy:do` runs `deploy-server.sh`. With `DEPLOY_HOST` set, the script builds on your machine, rsyncs `dist/` and `nginx.conf` to the droplet, and reloads nginx. It does not print or store the SSH key. The default path matches the `root` in the neurooz.com server block of `nginx.conf`.

On the droplet, once, if HTTPS is not issued yet:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d neurooz.com -d www.neurooz.com
```

`nginx.conf` still contains the older `growlingeyes.com` server block. The `neurooz.com` block is added after it. Unknown paths use `try_files $uri $uri/ /index.html`, so a refresh on `/tornado-alley` loads the app. Files in `/assets/` are cached for a year because their names include a content hash. `index.html` is not given that long cache.

If you are already logged into the droplet as root and `DEPLOY_HOST` is unset, `sudo bash deploy-server.sh` still runs the older on-server installer.

### App Platform static site

DigitalOcean App Platform has a free static-site tier. Its setup connects a Git repository. This account cannot use GitHub for that right now, so there is no App Platform command in this repo. The failover you can run from this machine is the droplet script above.

## Switch DNS between the hosts

Do this in the DNS panel that is actually authoritative.

**Cloudflare is primary (normal).**

- Nameservers at Cloudflare (option A): the Pages custom domain records stay in place. `https://neurooz.com` is the Pages project.
- Nameservers still at GoDaddy (option B): the `www` CNAME points at the Pages `pages.dev` target, and the apex forwards or aliases to it.

**Move traffic to the droplet.**

- If nameservers are still `ns45.domaincontrol.com` and `ns46.domaincontrol.com`: at GoDaddy, remove the Pages CNAME and the apex forward. Add an A record for `@` and for `www` to the droplet's IP address.
- If nameservers are at Cloudflare: in Cloudflare DNS, replace the Pages records for `neurooz.com` and `www` with A records to the droplet IP. Turn the proxy off (DNS only) if the droplet should receive the traffic directly. Or move the nameservers back to `ns45.domaincontrol.com` and `ns46.domaincontrol.com`, then set those A records at GoDaddy.

**Move traffic back to Cloudflare.** Reverse the records: point the names at the Pages target again (option A or B above), then run `npm run deploy:cf` so the latest `dist/` is what Pages serves.

No deploy in this repo changes DNS for you. Switching hosts is a DNS edit in Cloudflare or GoDaddy.
