# -*- coding: utf-8 -*-
"""DFW TV Mounting Guide — page generator (v2).
Fixes: depth-aware relative paths so nested pages (guides/, service-areas/)
resolve index.html, assets/ and sibling pages correctly.

Run from repo root:  python -m generators.build
"""
import os, json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://dfwtvmountingguide-com.github.io/DFWTVMOUNTINGGUIDE/"
ROOT_PATH = "/DFWTVMOUNTINGGUIDE/"   # used for absolute-path links (robust)
BOOK = "https://oandctvmounting-ai.github.io/co-tv-mounting-booking/"

def depth_prefix(path):
    """Return '../' chain to reach repo root from a page path."""
    d = path.count("/")
    return "../" * d

def asset_url(path, target):
    """Resolve an asset/root file reference to a correct relative path from `path`."""
    return depth_prefix(path) + target

FAVICON_TMPL = '<link rel="icon" type="image/svg+xml" href="{P}assets/images/favicon.svg">'

NAV_TMPL = """  <a href="{P}index.html">Home</a>
      <a href="{P}tv-mounting-cost.html">Cost</a>
      <a href="{P}tv-size-guides.html">TV Size Guides</a>
      <a href="{P}tv-wire-concealment.html">Wire Concealment</a>
      <a href="{P}service-areas.html">Service Areas</a>
      <a href="{P}commercial-tv-installation.html">Commercial</a>
      <a href="{P}guides.html">Guides</a>
      <a class="btn btn-royal" href="{BOOK}" target="_blank" rel="noopener">Get a Quote</a>"""

LOGO_TMPL = ('<a class="logo" href="{P}index.html"><span class="logo-mark">'
  '<svg width="20" height="20" viewBox="0 0 32 32" fill="none" aria-hidden="true">'
  '<rect x="6" y="9" width="20" height="13" rx="2" fill="#ffffff"/>'
  '<rect x="15" y="22" width="2" height="4" fill="#ffffff"/>'
  '<rect x="7" y="26" width="18" height="1.6" rx="0.8" fill="#D4AF37"/></svg></span>'
  '<span>DFW TV Mounting Guide<small>TV mounting info for Dallas-Fort Worth</small></span></a>')

def head(title, desc, canonical_path, schema):
    P = depth_prefix(canonical_path)
    img = BASE + "assets/images/og-image.png"
    return """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>%s</title>
<meta name="description" content="%s">
<link rel="canonical" href="%s%s">
<meta property="og:type" content="website">
<meta property="og:title" content="%s">
<meta property="og:description" content="%s">
<meta property="og:image" content="%s">
<meta property="og:url" content="%s%s">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="%s">
<meta name="twitter:description" content="%s">
<meta name="twitter:image" content="%s">
%s
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="%sassets/css/styles.css">
<script type="application/ld+json">
%s
</script>
</head>
<body>
""" % (title, desc, BASE, canonical_path, title, desc, img, BASE, canonical_path, title, desc, img, FAVICON_TMPL.replace("{P}", P), P, json.dumps(schema))

def header(path):
    P = depth_prefix(path)
    return """<header class="site-header">
  <div class="container navbar">
    %s
    <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
    <nav class="nav-links" aria-label="Main navigation">
      %s
    </nav>
  </div>
</header>
""" % (LOGO_TMPL.replace("{P}", P), NAV_TMPL.replace("{P}", P).replace("{BOOK}", BOOK))

def breadcrumbs(path, items):
    P = depth_prefix(path)
    out = '<div class="breadcrumbs" style="max-width:var(--maxw);margin:0 auto;padding:16px 20px 0;">'
    for i, (label, href) in enumerate(items):
        if href:
            out += '<a href="%s%s">%s</a>' % (P, href, label)
        else:
            out += '<span>%s</span>' % label
        if i < len(items) - 1:
            out += '<span class="sep">›</span>'
    return out + '</div>'

def cta_band():
    return """    <div class="cta-band">
      <h2>Have a TV Ready to Mount in DFW?</h2>
      <p>Get a professional installation quote from C&O TV Mounting, proudly serving the Dallas-Fort Worth area.</p>
      <a class="btn btn-gold" href="%s" target="_blank" rel="noopener">Book Your Installation</a>
      <p class="cta-note">DFW TV Mounting Guide is an informational resource. Professional installation services are provided by C&O TV Mounting.</p>
    </div>""" % BOOK

def footer(path):
    P = depth_prefix(path)
    return """<div class="mobile-cta">
  <a class="btn btn-royal" href="{BOOK}" target="_blank" rel="noopener">Get a Quote</a>
</div>
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        {LOGO}
        <p style="color:rgba(255,255,255,0.7);">Helpful TV mounting information for Dallas-Fort Worth.</p>
      </div>
      <div>
        <h4>Guides</h4>
        <a href="{P}tv-mounting-cost.html">TV Mounting Cost</a>
        <a href="{P}tv-mount-types.html">TV Mount Types</a>
        <a href="{P}tv-wire-concealment.html">Wire Concealment</a>
        <a href="{P}tv-mounting-drywall.html">Mounting on Drywall</a>
        <a href="{P}tv-size-guides.html">TV Size Guides</a>
      </div>
      <div>
        <h4>Service Areas</h4>
        <a href="{P}service-areas.html">Fort Worth</a>
        <a href="{P}service-areas.html">Dallas</a>
        <a href="{P}service-areas.html">Mid-Cities</a>
        <a href="{P}service-areas.html">North DFW</a>
        <a href="{P}service-areas.html">All Areas</a>
      </div>
      <div>
        <h4>C&O TV Mounting</h4>
        <a href="{BOOK}" target="_blank" rel="noopener">Get a Quote</a>
        <a href="{BOOK}" target="_blank" rel="noopener">Book an Installation</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>DFW TV Mounting Guide is an informational resource. Professional installation services are provided by <a href="{BOOK}" target="_blank" rel="noopener" style="color:var(--gold-soft);display:inline;">C&O TV Mounting</a>.</p>
    </div>
  </div>
</footer>
<script src="{P}assets/js/main.js"></script>
</body>
</html>""".replace("{P}", P).replace("{BOOK}", BOOK).replace("{LOGO}", LOGO_TMPL.replace("{P}", P))

def guide_page(obj):
    path = obj["path"]
    schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": obj["h1"],
        "author": {"@type": "Organization", "name": "DFW TV Mounting Guide"},
        "publisher": {"@type": "Organization", "name": "DFW TV Mounting Guide"},
        "url": BASE + path,
    }
    if obj.get("schema_extra"):
        schema.update(obj["schema_extra"])

    P = depth_prefix(path)
    body = [head(obj["title"], obj["desc"], path, schema), header(path)]
    body.append(breadcrumbs(path, [("Home", "index.html"), (obj["crumb"] or obj["h1"], None)]))
    body.append('<section class="hero"><div class="container"><p class="kicker">%s</p><h1>%s</h1><p class="lead">%s</p></div></section>' % (obj.get("kicker","DFW TV Mounting Guide"), obj["h1"], obj["intro"]))
    body.append('<div class="section"><div class="container"><article class="article">')
    for sec in obj["sections"]:
        if isinstance(sec, (list, tuple)) and len(sec) == 2:
            body.append('<h2>%s</h2>%s' % (sec[0], sec[1]))
        else:
            body.append(str(sec))
    body.append('</article></div>')
    body.append('<div class="container">' + cta_band() + '</div></div>')
    if obj.get("faq"):
        body.append('<section class="section bg-soft"><div class="container"><div class="section-head"><p class="kicker">FAQ</p><h2 class="section-title">Common Questions</h2></div><div style="max-width:760px;margin:0 auto;">')
        for q, a in obj["faq"]:
            body.append('<div class="faq-item"><button class="faq-q" aria-expanded="false">%s <span class="chev">▾</span></button><div class="faq-a"><p>%s</p></div></div>' % (q, a))
        body.append('</div></div></section>')
    body.append(footer(path))
    write_page(path, "\n".join(body))

def write_page(path, html):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full) if os.path.dirname(path) else ROOT, exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(html)
    print("wrote", path)

def main():
    from generators.content import get_pages
    pages = get_pages()
    for obj in pages:
        guide_page(obj)
    write_page("robots.txt", "User-agent: *\nAllow: /\nSitemap: %ssitemap.xml\n" % BASE)
    generate_sitemap(pages)
    print("DONE — %d pages" % len(pages))

def generate_sitemap(pages):
    urls = ["index.html"]
    for p in pages:
        urls.append(p["path"])
    urls = sorted(set(urls), key=lambda u: (u.count("/"), u))
    xml = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in urls:
        xml.append('<url><loc>%s%s</loc></url>' % (BASE, u))
    xml.append('</urlset>')
    with open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write("\n".join(xml))
    print("wrote sitemap.xml (%d urls)" % len(urls))

if __name__ == "__main__":
    main()