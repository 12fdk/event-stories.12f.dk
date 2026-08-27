# HTTP response headers

`public/_headers` used to live in this repo. It declared security headers and
1-year immutable caching, but **none of it ever applied** and it was removed in
issue #49.

`_headers` is a build convention of **Netlify** and **Cloudflare Pages**. This
site is served by GitHub Pages, proxied through Fastly and then Cloudflare:

```
Cloudflare (proxy)  ->  Fastly  ->  GitHub Pages
```

None of those three read a `_headers` file from the site root, so the file was
inert — a security control that looked implemented but was not. Verified
against the live site: no `X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy` or `Permissions-Policy` was present in any response, and
cache lifetimes were GitHub's defaults (`max-age=600` for HTML,
`max-age=14400` for assets) rather than the values the file declared.

## What is set now

`Referrer-Policy` is the one header in that set that a static page can set for
itself, so it is applied via `<meta name="referrer">` in `src/Layout.astro`.

## What still needs the edge

These cannot be set from the document and need a host that can add response
headers. Cloudflare already fronts the domain, so the cheapest route is a
**Transform Rule -> Modify Response Header** (Rules -> Transform Rules) on
`event-stories.12f.dk`:

| Header | Value |
| --- | --- |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

Longer asset caching is best handled by a Cloudflare **Cache Rule** on
`/_astro/*`, `/fonts/*`, `/blog/*` and `/screenshots/*` — those paths are all
either content-hashed or immutable in practice.
