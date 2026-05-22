# DTFlow site — deployment

The whole landing is three static files: `index.html`, `privacy.html`, `terms.html`. No build step.

## Local preview

```bash
cd dtflow-site
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy to Netlify

### Option A — Netlify CLI (simplest)

```bash
npm i -g netlify-cli            # if you don't already have it
cd dtflow-site
netlify deploy --prod --dir=.
# follow the prompt to pick / create a site
```

That's it. Netlify gives you a `*.netlify.app` URL.

### Option B — Drag &amp; drop

1. Open <https://app.netlify.com/drop>
1. Drag the entire `dtflow-site/` folder onto the page
1. Netlify returns the deploy URL within ~10 seconds

### Option C — API deploy (SHA1 manifest)

Useful when scripting from CI. Requires a Personal Access Token (`PAT`) and an existing `SITE_ID`.

```bash
PAT="<your-netlify-token>"
SITE_ID="<your-site-id>"
cd dtflow-site

SHA_INDEX=$(sha1sum index.html   | awk '{print $1}')
SHA_PRIV=$(sha1sum  privacy.html | awk '{print $1}')
SHA_TERM=$(sha1sum  terms.html   | awk '{print $1}')

DEPLOY=$(curl -s -X POST "https://api.netlify.com/api/v1/sites/$SITE_ID/deploys" \
  -H "Authorization: Bearer $PAT" \
  -H "Content-Type: application/json" \
  -d "{\"files\":{
        \"/index.html\":\"$SHA_INDEX\",
        \"/privacy.html\":\"$SHA_PRIV\",
        \"/terms.html\":\"$SHA_TERM\"}}")

DID=$(echo "$DEPLOY" | python3 -c 'import sys,json;print(json.load(sys.stdin)["id"])')

# Upload only the files Netlify asks for
for f in index.html privacy.html terms.html; do
  curl -s -X PUT "https://api.netlify.com/api/v1/deploys/$DID/files/$f" \
    -H "Authorization: Bearer $PAT" \
    -H "Content-Type: application/octet-stream" \
    --data-binary @"$f" >/dev/null
done

echo "Deploy: $DID"
```

## Headers / SPA / forms

Not required &mdash; this site is plain static. If you later want form-handling for the trial signup, drop a Netlify form into `index.html` or wire it to a serverless function under `.netlify/functions/`.

## Custom domain

In the Netlify dashboard for the site: **Domain settings &rarr; Add a domain**. The site is built without absolute URLs, so any domain (including the temporary `*.netlify.app`) works without code changes.

## Performance notes

The site loads in well under 3 seconds:

* No runtime JS framework
* Single inline-CSS / inline-JS file (one HTTP request for the page)
* Google Fonts preconnected, `display=swap` so text paints immediately
* SVG icons inline, no image assets to download
* The Illustrator mockup is pure HTML/CSS, not an image

If you ever want to drop hero images in, add `loading="lazy"` to anything below the fold.
