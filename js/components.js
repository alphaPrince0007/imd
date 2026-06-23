/* ============================================================
   Dynamic header & footer
   Edit SITE_CONFIG once — both the nav and footer rebuild from it.
   Rendered into <header id="site-header"> and <footer id="site-footer">
   which live in index.html.
   ============================================================ */

const SITE_CONFIG = {
  brand: "India Mushroom Days",
  // Shown at logoImgSize in the header and footer. NOTE: this file has
  // "October 2024, New Delhi" baked into the artwork — kept as-is per
  // request; swap the file for a 2027/New Delhi version when one exists.
  logoImage: "logo.png",
  // Primary navigation. `cta:true` renders the item as the orange button;
  // `gold:true` (on top of cta:true) renders it as the gold sponsor button
  // instead. NOTE: points at #partners until a dedicated #sponsors
  // page/form exists.
  nav: [
    { label: "About", href: "#about" },
    { label: "Schedule", href: "#schedule" },
    { label: "Partners", href: "#partners" },
    { label: "Speakers", href: "#speakers" },
    { label: "Venue", href: "#venue" },
    { label: "Memories", href: "memories.html" },
    { label: "FAQ", href: "#faq" },
    {
      label: "Sponsor",
      href: "https://www.cognitoforms.com/IMD27/SponsorIMD27",
      cta: true,
      gold: true,
    },
  ],
  tagline:
    "Where Global precision meets Indian cultivation. New Delhi · 19-21 February 2027.",
  contact: {
    email: "info@indiamushroomdays.in",
    phone: "(+91)-9811775220",
    phoneHref: "+919811775220",
  },
  social: [
    { label: "LinkedIn", short: "in", href: "#" },
    { label: "Twitter", short: "X", href: "#" },
    { label: "Instagram", short: "IG", href: "#" },
  ],
  // Footer link columns
  footerCols: [
    {
      title: "Event",
      links: [
        { label: "About", href: "#about" },
        { label: "Schedule", href: "#schedule" },
        { label: "Partners", href: "#partners" },
        { label: "Speakers", href: "#speakers" },
        { label: "Memories", href: "memories.html" },
        { label: "Register", href: "#register" },
      ],
    },
    {
      title: "Visit",
      links: [
        { label: "Venue", href: "#venue" },
        { label: "Travel", href: "#venue" },
        { label: "FAQ", href: "#faq" },
        { label: "Pricing", href: "#register" },
      ],
    },
  ],
  legal: "© 2027 India Mushroom Days. All rights reserved.",
  legalLinks: "Privacy · Terms · Cookies",
};

/* ---------- Cross-page links ----------
   Section anchors (#about, #schedule…) only resolve on index.html. Every
   other page is a flat sibling, so on those pages we prefix anchor hrefs
   with "index.html" — SITE_CONFIG itself stays page-agnostic. */
const ON_INDEX =
  !/[\w-]+\.html$/.test(location.pathname) ||
  /(^|\/)index\.html$/.test(location.pathname);
function resolveHref(href) {
  return href.startsWith("#") && !ON_INDEX ? "index.html" + href : href;
}

/* ---------- Header ---------- */
function renderHeader(cfg) {
  const links = cfg.nav
    .map((item) =>
      item.cta
        ? `<a href="${resolveHref(item.href)}" class="btn ${item.gold ? "btn-gold" : "btn-primary"}" style="padding:9px 18px">${item.label}</a>`
        : `<a href="${resolveHref(item.href)}">${item.label}</a>`,
    )
    .join("\n      ");

  return `
  <nav id="nav"><div class="wrap nav-in">
    <a href="${resolveHref("#home")}" class="logo"><img src="${cfg.logoImage}" alt="${cfg.brand} logo" class="logo-img">${cfg.brand.replace(/ /g, "&nbsp;")}</a>
    <div class="nav-links">
      ${links}
    </div>
    <button class="menu-btn" aria-label="Open menu" aria-expanded="false">☰</button>
  </div></nav>`;
}

/* ---------- Footer ---------- */
function renderFooter(cfg) {
  const cols = cfg.footerCols
    .map(
      (col) => `
      <div><h5>${col.title}</h5>${col.links
        .map((l) => `<a href="${resolveHref(l.href)}">${l.label}</a>`)
        .join("")}</div>`,
    )
    .join("");

  const socials = cfg.social
    .map((s) => `<a href="${s.href}" aria-label="${s.label}">${s.short}</a>`)
    .join("");

  return `
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <div class="logo" style="margin-bottom:16px"><img src="${cfg.logoImage}" alt="${cfg.brand} logo" class="logo-img" loading="lazy">${cfg.brand}</div>
        <p>${cfg.tagline}</p>
      </div>
      ${cols}
      <div>
        <h5>Contact</h5>
        <a href="mailto:${cfg.contact.email}">${cfg.contact.email}</a>
        <a href="tel:${cfg.contact.phoneHref}">${cfg.contact.phone}</a>
        <div class="socials" style="margin-top:14px">${socials}</div>
      </div>
    </div>
    <div class="foot-bottom">
      <span>${cfg.legal}</span>
      <span>${cfg.legalLinks}</span>
    </div>
  </div>`;
}

/* ---------- Mount + wire up ---------- */
function mountChrome() {
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");
  if (header) header.innerHTML = renderHeader(SITE_CONFIG);
  if (footer) footer.innerHTML = renderFooter(SITE_CONFIG);

  // Mobile menu toggle (accessible)
  const btn = document.querySelector(".menu-btn");
  const links = document.querySelector(".nav-links");
  if (btn && links) {
    btn.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
    // Close menu after tapping a link on mobile
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      }),
    );
  }

  // Newsletter button feedback
  const news = document.querySelector("[data-news]");
  if (news)
    news.addEventListener("click", () => (news.textContent = "Subscribed ✓"));
}

// Mount as early as possible so the rest of app.js can find nav elements.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountChrome);
} else {
  mountChrome();
}
