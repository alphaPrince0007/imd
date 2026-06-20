// ===== Scroll-driven harvest canvas =====
// Disabled — hero now uses a plain black background instead of the
// scroll-driven frame sequence. Re-enable by uncommenting this block
// (and restoring .scroll-section's height + #harvest-canvas in CSS).
/*
(function () {
  const canvas = document.getElementById("harvest-canvas");
  const ctx = canvas.getContext("2d");
  const imgs = [];
  let loaded = 0;
  FRAMES.forEach((src, i) => {
    const im = new Image();
    im.onload = () => {
      loaded++;
      if (i === 0) draw(0);
    };
    im.src = src;
    imgs[i] = im;
  });
  function fit() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw(curr);
  }
  let curr = 0;
  function draw(idx) {
    const im = imgs[idx];
    if (!im || !im.complete) return;
    const cw = canvas.width,
      ch = canvas.height,
      iw = im.width,
      ih = im.height;
    const r = Math.max(cw / iw, ch / ih),
      w = iw * r,
      h = ih * r;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h);
  }
  const section = document.getElementById("home");
  function onScroll() {
    const rect = section.getBoundingClientRect();
    const total = section.offsetHeight - window.innerHeight;
    const prog = Math.min(1, Math.max(0, -rect.top / total));
    const idx = Math.min(
      FRAMES.length - 1,
      Math.floor(prog * (FRAMES.length - 1)),
    );
    if (idx !== curr) {
      curr = idx;
      draw(idx);
    }
  }
  window.addEventListener("resize", fit);
  window.addEventListener("scroll", onScroll, { passive: true });
  fit();
})();
*/

// ===== Countdown =====
(function () {
  const target = new Date("2027-02-19T09:00:00+05:30").getTime();
  const eD = document.getElementById("cd-d"),
    eH = document.getElementById("cd-h"),
    eM = document.getElementById("cd-m"),
    eS = document.getElementById("cd-s");
  function tick() {
    const d = target - Date.now();
    if (d < 0) return;
    const D = Math.floor(d / 864e5),
      H = Math.floor((d % 864e5) / 36e5),
      M = Math.floor((d % 36e5) / 6e4),
      S = Math.floor((d % 6e4) / 1e3);
    eD.textContent = D;
    eH.textContent = H;
    eM.textContent = String(M).padStart(2, "0");
    eS.textContent = String(S).padStart(2, "0");
  }
  setInterval(tick, 1000);
  tick();
})();

// ===== Nav scrolled =====
addEventListener(
  "scroll",
  () => {
    document.getElementById("nav")?.classList.toggle("scrolled", scrollY > 40);
    document.getElementById("toTop")?.classList.toggle("show", scrollY > 600);
  },
  { passive: true },
);
document.getElementById("toTop").onclick = () =>
  scrollTo({ top: 0, behavior: "smooth" });

// ===== Reveal on scroll =====
const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        if (e.target.dataset && e.target.querySelector("[data-count]")) {
        }
      }
    }),
  { threshold: 0.15 },
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ===== Count up stats =====
const co = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) {
        const b = e.target;
        const t = +b.dataset.count;
        let n = 0;
        const step = t / 40;
        const iv = setInterval(() => {
          n += step;
          if (n >= t) {
            n = t;
            clearInterval(iv);
          }
          b.textContent = Math.floor(n).toLocaleString();
        }, 25);
        co.unobserve(b);
      }
    }),
  { threshold: 0.5 },
);
document.querySelectorAll("[data-count]").forEach((b) => co.observe(b));

// ===== Schedule data =====
const SESS = [
  {
    time: "Day 1 · 09:30",
    t: "Opening Keynote: The Global Yield Model",
    w: "Dr. Anneke van Dijk · Wageningen UR",
    track: "science",
    tag: "Keynote",
  },
  {
    time: "Day 1 · 11:00",
    t: "Climate Control for Indian Tunnels",
    w: "Rohan Mehta · ClimaGrow",
    track: "tech",
    tag: "Workshop",
  },
  {
    time: "Day 1 · 14:00",
    t: "Substrate Science Deep Dive",
    w: "Prof. S. Iyer · IARI",
    track: "science",
    tag: "Session",
  },
  {
    time: "Day 2 · 09:30",
    t: "Autonomous Harvesting Live Demo",
    w: "Lars Bakker · RoboPick",
    track: "tech",
    tag: "Demo",
  },
  {
    time: "Day 2 · 11:30",
    t: "Building an Export Supply Chain",
    w: "Priya Nair · AgriExport India",
    track: "business",
    tag: "Session",
  },
  {
    time: "Day 2 · 15:00",
    t: "Financing Your Farm Expansion",
    w: "Vikram Shah · NABARD",
    track: "business",
    tag: "Panel",
  },
  {
    time: "Day 3 · 10:00",
    t: "Post-Harvest Cold Chain",
    w: "Dr. Femke Jansen · CoolChain NL",
    track: "tech",
    tag: "Workshop",
  },
  {
    time: "Day 3 · 13:00",
    t: "Grower Awards & Closing",
    w: "IMD Council",
    track: "business",
    tag: "Awards",
  },
];
function renderSess(f) {
  document.getElementById("sessions").innerHTML = SESS.filter(
    (s) => f === "all" || s.track === f,
  )
    .map(
      (s) => `
   <div class="sess"><div class="time">${s.time}</div>
   <div><h4>${s.t}</h4><div class="who">${s.w}</div></div>
   <span class="tag">${s.tag}</span></div>`,
    )
    .join("");
}
renderSess("all");
document.querySelectorAll(".filt").forEach(
  (b) =>
    (b.onclick = () => {
      document
        .querySelectorAll(".filt")
        .forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      renderSess(b.dataset.f);
    }),
);

// ===== Partners =====
// Placeholder wordmark logos generated as inline SVG data URIs, since no
// real partner logo assets exist yet. Swap `logo` for a real asset path
// (SVG preferred, PNG fallback) and `url` for each partner's actual site
// once partnerships are confirmed — `tier`/`alt`/`descriptor` carry over.
function plogo(short, hue) {
  const mark = short
    .replace(/[^A-Za-z]/g, "")
    .slice(0, 3)
    .toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 56">
    <circle cx="28" cy="28" r="22" fill="hsl(${hue},58%,46%)"/>
    <text x="28" y="33" font-family="Arial,Helvetica,sans-serif" font-size="14" font-weight="700" fill="#fff" text-anchor="middle">${mark}</text>
    <text x="60" y="33" font-family="Arial,Helvetica,sans-serif" font-size="16" font-weight="600" fill="#e9e9e9">${short}</text>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}
const PARTNERS = [
  {
    name: "Wageningen University & Research",
    short: "Wageningen UR",
    url: "https://example.org/partners/wageningen-ur",
    tier: "association",
    alt: "Wageningen University & Research logo",
    descriptor: "Lead knowledge partner · Netherlands",
    hue: 212,
  },
  {
    name: "Ministry of Agriculture & Farmers Welfare, Government of India",
    short: "Govt. of India, Agriculture",
    url: "https://example.org/partners/moafw-india",
    tier: "association",
    alt: "Ministry of Agriculture & Farmers Welfare, Government of India logo",
    descriptor: "Official endorsement · Government of India",
    hue: 198,
  },

  {
    name: "NABARD",
    short: "NABARD",
    url: "https://example.org/partners/nabard",
    tier: "strategic",
    alt: "NABARD logo",
    hue: 150,
  },
  {
    name: "Netherlands Enterprise Agency (RVO)",
    short: "RVO",
    url: "https://example.org/partners/rvo",
    tier: "strategic",
    alt: "Netherlands Enterprise Agency (RVO) logo",
    hue: 205,
  },
  {
    name: "Indian Council of Agricultural Research",
    short: "ICAR",
    url: "https://example.org/partners/icar",
    tier: "strategic",
    alt: "Indian Council of Agricultural Research logo",
    hue: 95,
  },
  {
    name: "Sylvan Europe",
    short: "Sylvan Europe",
    url: "https://example.org/partners/sylvan-europe",
    tier: "strategic",
    alt: "Sylvan Europe logo",
    hue: 265,
  },

  {
    name: "ClimaGrow",
    short: "ClimaGrow",
    url: "https://example.org/partners/climagrow",
    tier: "supporting",
    alt: "ClimaGrow logo",
    hue: 165,
  },
  {
    name: "RoboPick",
    short: "RoboPick",
    url: "https://example.org/partners/robopick",
    tier: "supporting",
    alt: "RoboPick logo",
    hue: 220,
  },
  {
    name: "CoolChain NL",
    short: "CoolChain NL",
    url: "https://example.org/partners/coolchain-nl",
    tier: "supporting",
    alt: "CoolChain NL logo",
    hue: 190,
  },
  {
    name: "AgriExport India",
    short: "AgriExport India",
    url: "https://example.org/partners/agriexport-india",
    tier: "supporting",
    alt: "AgriExport India logo",
    hue: 140,
  },
  {
    name: "IARI New Delhi",
    short: "IARI New Delhi",
    url: "https://example.org/partners/iari",
    tier: "supporting",
    alt: "IARI New Delhi logo",
    hue: 60,
  },
  {
    name: "KAS Partners",
    short: "KAS Partners",
    url: "https://example.org/partners/kas-partners",
    tier: "supporting",
    alt: "KAS Partners logo",
    hue: 280,
  },
  {
    name: "Maharashtra Agri-Tech Cluster",
    short: "Maharashtra Agri-Tech Cluster",
    url: "https://example.org/partners/maharashtra-agritech",
    tier: "supporting",
    alt: "Maharashtra Agri-Tech Cluster logo",
    hue: 175,
  },
  {
    name: "Mushroom Growers Association of India",
    short: "Mushroom Growers Assoc. of India",
    url: "https://example.org/partners/mgai",
    tier: "supporting",
    alt: "Mushroom Growers Association of India logo",
    hue: 340,
  },
].map((p) => ({ ...p, logo: plogo(p.short, p.hue) }));

function partnerCard(p, editorial) {
  return `
   <a class="partner-card${editorial ? " partner-card-lead" : ""}" href="${p.url}" target="_blank" rel="noopener"
     aria-label="${p.name} — opens in a new tab">
     <span class="partner-logo-box"><img src="${p.logo}" alt="${p.alt}" loading="lazy" width="200" height="56"></span>
     ${editorial ? `<span class="partner-name">${p.name}</span><span class="partner-desc">${p.descriptor}</span>` : ""}
   </a>`;
}

function renderPartners() {
  const byTier = (t) => PARTNERS.filter((p) => p.tier === t);
  document.getElementById("partnersAssociation").innerHTML = byTier(
    "association",
  )
    .map((p) => partnerCard(p, true))
    .join("");
  document.getElementById("partnersStrategic").innerHTML = byTier("strategic")
    .map((p) => partnerCard(p, false))
    .join("");

  const supporting = byTier("supporting");
  const wrap = document.getElementById("partnersSupportingWrap");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || supporting.length <= 6) {
    // Static wall: every logo visible at once, nothing relies on motion.
    wrap.classList.add("static");
    wrap.innerHTML = `<div class="partner-wall">${supporting.map((p) => partnerCard(p, false)).join("")}</div>`;
  } else {
    // Seamless marquee: the list is duplicated so the loop has no visible seam.
    const cards = supporting.map((p) => partnerCard(p, false)).join("");
    wrap.innerHTML = `<div class="partner-marquee-track">${cards}${cards}</div>`;
  }
}
renderPartners();

// ===== Speakers =====
const SPK = [
  {
    n: "Dr. Anneke van Dijk",
    r: "Lead Researcher",
    o: "Wageningen UR",
    fl: "🇳🇱",
    i: "AD",
  },
  { n: "Rohan Mehta", r: "Founder & CEO", o: "ClimaGrow", fl: "🇮🇳", i: "RM" },
  { n: "Lars Bakker", r: "CTO", o: "RoboPick", fl: "🇳🇱", i: "LB" },
  {
    n: "Priya Nair",
    r: "Head of Trade",
    o: "AgriExport India",
    fl: "🇮🇳",
    i: "PN",
  },
  {
    n: "Prof. S. Iyer",
    r: "Professor",
    o: "IARI New Delhi",
    fl: "🇮🇳",
    i: "SI",
  },
  {
    n: "Dr. Femke Jansen",
    r: "Cold Chain Lead",
    o: "CoolChain NL",
    fl: "🇳🇱",
    i: "FJ",
  },
  { n: "Vikram Shah", r: "Agri Finance Lead", o: "NABARD", fl: "🇮🇳", i: "VS" },
  {
    n: "Maud de Vries",
    r: "Substrate Scientist",
    o: "Sylvan Europe",
    fl: "🇳🇱",
    i: "MV",
  },
];
function renderSpk(q = "") {
  document.getElementById("spk-grid").innerHTML = SPK.filter((s) =>
    (s.n + s.o + s.r).toLowerCase().includes(q.toLowerCase()),
  )
    .map(
      (s) => `
   <div class="spk"><div class="spk-img"><span class="flag">${s.fl}</span>${s.i}</div>
   <div class="spk-body"><h4>${s.n}</h4><div class="role">${s.r}</div><div class="org">${s.o}</div></div></div>`,
    )
    .join("");
}
renderSpk();
document.getElementById("spk-search").oninput = (e) =>
  renderSpk(e.target.value);

// ===== Pricing phases =====
// Single source of truth for the offer: change dates/prices here only —
// every status label, ribbon, disabled state and the countdown below all
// derive from this array, recomputed fresh against the current time.
const PRICING_PHASES = [
  {
    // start is intentionally far in the past — this tier is meant to read
    // as "already open, free until the end date" from the moment the page
    // goes live, not gated behind a future start date.
    name: "Free Pass",
    price: 0,
    start: "2024-01-01",
    end: "2026-07-31",
    note: "Free entry — limited time",
  },
  { name: "Phase 2", price: 5000, start: "2026-08-01", end: "2026-10-31" },
  // Phase 3 runs right up to the event itself (19 Feb 2027).
  { name: "Phase 3", price: 10000, start: "2026-11-01", end: "2027-02-19" },
];
const PRICING_BENEFITS = [
  "All keynotes & sessions",
  "Exhibition floor access",
  "Hands-on workshops",
  "Welcome reception & meals",
];

// IST-safe parsing so the boundary day of each window behaves correctly
// regardless of the visitor's own timezone.
const istStart = (s) => new Date(s + "T00:00:00+05:30");
const istEnd = (s) => new Date(s + "T23:59:59+05:30");
const fmtLong = (d) =>
  d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
const fmtShort = (d) =>
  d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  });
const priceLabel = (p) => (p === 0 ? "Free" : `₹${p.toLocaleString("en-IN")}`);

function phaseStatus(phase, now) {
  if (now < istStart(phase.start)) return "upcoming";
  if (now > istEnd(phase.end)) return "expired";
  return "active";
}
function phaseDateLine(phase) {
  return phase.price === 0
    ? `Free until ${fmtLong(istEnd(phase.end))}`
    : `${fmtShort(istStart(phase.start))} – ${fmtLong(istEnd(phase.end))}`;
}

function renderPricing() {
  const now = new Date();
  const last = PRICING_PHASES[PRICING_PHASES.length - 1];
  const allClosed = now > istEnd(last.end);
  const active = PRICING_PHASES.find((p) => phaseStatus(p, now) === "active");

  document.getElementById("pricingGrid").innerHTML = PRICING_PHASES.map(
    (phase) => {
      const status = allClosed ? "expired" : phaseStatus(phase, now);
      let ctaLabel,
        disabled = false,
        statusLabel;
      if (allClosed) {
        ctaLabel = "Registration closed";
        disabled = true;
        statusLabel = "Registration closed";
      } else if (status === "expired") {
        ctaLabel = "Closed";
        disabled = true;
        statusLabel = "Closed";
      } else if (status === "upcoming") {
        ctaLabel = `Opens ${fmtShort(istStart(phase.start))}`;
        disabled = true;
        statusLabel = ctaLabel;
      } else {
        ctaLabel = `Choose ${phase.name}`;
        statusLabel = "Active now";
      }

      return `
    <div class="price reveal in${status === "active" ? " feature" : ""}${status === "expired" ? " expired" : ""}${status === "upcoming" ? " upcoming" : ""}">
      ${status === "active" ? '<span class="ribbon">Active now</span>' : ""}
      <h3>${phase.name}</h3>
      <div class="amt">${priceLabel(phase.price)}${phase.price ? "<small>/pass</small>" : ""}</div>
      <p class="price-dates">${phaseDateLine(phase)}</p>
      <p class="price-status">${statusLabel}</p>
      ${status === "active" ? `<p class="price-countdown" data-end="${phase.end}"></p>` : ""}
      <ul>${PRICING_BENEFITS.map((b) => `<li>${b}</li>`).join("")}</ul>
      <button type="button" class="btn ${status === "active" ? "btn-primary" : "btn-ghost"}"${disabled ? ' disabled aria-disabled="true"' : ' data-cta="1"'}>${ctaLabel}</button>
    </div>`;
    },
  ).join("");

  document
    .querySelectorAll("#pricingGrid [data-cta]")
    .forEach((b) =>
      b.addEventListener("click", () =>
        document
          .getElementById("regform")
          .scrollIntoView({ behavior: "smooth" }),
      ),
    );

  document.getElementById("regWidgetText").textContent = allClosed
    ? "Registration is now closed."
    : active
      ? `${active.name} closes ${fmtLong(istEnd(active.end))}`
      : `Registration opens ${fmtLong(istStart(PRICING_PHASES[0].start))}`;

  tickPricingCountdown();
}
function tickPricingCountdown() {
  document.querySelectorAll(".price-countdown").forEach((el) => {
    const diff = istEnd(el.dataset.end) - new Date();
    if (diff <= 0) {
      el.textContent = "";
      return;
    }
    const d = Math.floor(diff / 864e5),
      h = Math.floor((diff % 864e5) / 36e5);
    el.textContent = `Ends in ${d}d ${h}h`;
  });
}
renderPricing();
setInterval(tickPricingCountdown, 60000);

// ===== Hero free-pass badge =====
// Pulls its date/countdown straight from PRICING_PHASES[0] so the hero
// badge can never drift out of sync with the pricing table.
function renderFreePassBadge() {
  const label = document.getElementById("fpLabel");
  if (!label) return;
  const phase = PRICING_PHASES[0];
  label.textContent = `Free Visitor Pass · until ${fmtLong(istEnd(phase.end))}`;
  tickFreePassCountdown();
}
function tickFreePassCountdown() {
  const el = document.getElementById("fpCountdown");
  if (!el) return;
  const diff = istEnd(PRICING_PHASES[0].end) - new Date();
  if (diff <= 0) {
    el.textContent = "";
    return;
  }
  const d = Math.floor(diff / 864e5),
    h = Math.floor((diff % 864e5) / 36e5);
  el.textContent = `· ${d}d ${h}h left`;
}
renderFreePassBadge();
setInterval(tickFreePassCountdown, 60000);

// ===== FAQ =====
const FAQ = [
  [
    "How do I register?",
    "Choose a ticket tier above and complete the registration form. You will receive confirmation and a calendar invite by email within minutes.",
  ],
  [
    "What is included in my ticket?",
    "All passes include keynotes, sessions and exhibition access. Standard and VIP add workshops, meals and priority demo seating. See the pricing table for full details.",
  ],
  [
    "Can I transfer my registration?",
    "Yes. Transfers to another person are free up to 7 days before the event — just email us with the new attendee details.",
  ],
  [
    "Are refunds available?",
    "Full refunds are available up to 60 days before the event, and 50% up to 30 days before. After that, you may transfer your pass instead.",
  ],
  [
    "How do I become a sponsor or exhibitor?",
    "Email hello@indiamushroomdays.in for the sponsorship pack. Booth space on the exhibition floor is limited and allocated first-come.",
  ],
  [
    "Is the venue accessible?",
    "Yes — the Agri-Tech Convention Centre is fully wheelchair accessible with step-free routes, accessible restrooms and reserved seating.",
  ],
  [
    "Will sessions be recorded?",
    "Keynotes and selected sessions are recorded and shared with all registered attendees within two weeks of the event.",
  ],
  [
    "Do international attendees get visa support?",
    "Yes. After registering, request an official invitation letter to support your Indian e-Visa or visa application.",
  ],
  [
    "Are meals provided?",
    "Standard and VIP passes include lunch on all three days. Early Bird includes the welcome reception only.",
  ],
  [
    "Is there a student rate?",
    "Verified students receive 40% off Early Bird pricing. Email us with proof of enrolment for a discount code.",
  ],
  [
    "Can I bring a group?",
    "Groups of five or more receive 15% off. Contact us before registering to arrange group billing.",
  ],
  [
    "What language are sessions in?",
    "All main-stage sessions are in English, with live Hindi and Marathi interpretation available on headsets.",
  ],
  [
    "Where can I park?",
    "Free on-site parking is available, plus partner-hotel shuttles every 30 minutes during event hours.",
  ],
  [
    "Is there a dress code?",
    "Smart casual. The terrace evening for VIP guests is also smart casual.",
  ],
  [
    "How do I contact the organisers?",
    "Email hello@indiamushroomdays.in or call +91 20 1234 5678, Monday to Friday, 9am–6pm IST.",
  ],
];
document.getElementById("faqs").innerHTML = FAQ.map(
  (f, i) => `
 <div class="faq-item"><button class="faq-q" aria-expanded="false" onclick="toggleFaq(this)">${f[0]}<span class="ico">+</span></button>
 <div class="faq-a"><p>${f[1]}</p></div></div>`,
).join("");
function toggleFaq(b) {
  const open = b.getAttribute("aria-expanded") === "true";
  b.setAttribute("aria-expanded", !open);
  const a = b.nextElementSibling;
  a.style.maxHeight = open ? 0 : a.scrollHeight + "px";
}
