/* ============================================================
   Memories — gallery data, masonry render/filter, lightbox,
   and the front-end upload flow.
   Mirrors the data-array pattern used for SPK/SESS/FAQ in app.js.
   ============================================================ */

/* ---------- Shared page chrome ----------
   index.html gets this from app.js, but app.js also drives the
   scroll-canvas hero that only exists there — so this page carries
   its own copy of the page-agnostic bits (nav shadow, back-to-top,
   reveal-on-scroll, stat count-up). */
addEventListener('scroll', () => {
  document.getElementById('nav')?.classList.toggle('scrolled', scrollY > 40);
  document.getElementById('toTop')?.classList.toggle('show', scrollY > 600);
}, { passive: true });
document.getElementById('toTop').onclick = () => scrollTo({ top: 0, behavior: 'smooth' });

const revealIO = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) e.target.classList.add('in');
}), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

const countIO = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const b = e.target, t = +b.dataset.count;
  let n = 0; const step = t / 40;
  const iv = setInterval(() => { n += step; if (n >= t) { n = t; clearInterval(iv); } b.textContent = Math.floor(n).toLocaleString(); }, 25);
  countIO.unobserve(b);
}), { threshold: .5 });
document.querySelectorAll('[data-count]').forEach(b => countIO.observe(b));

/* ---------- Gallery data ----------
   w/h set the editorial aspect ratio of each tile (masonry rhythm),
   independent of the source file's real dimensions — images are
   cropped with object-fit:cover to fit. feature:true gets the
   large serif year-stamp treatment (the page's one visual flourish). */
const frame = n => `frames/frame${String(n).padStart(3, '0')}.jpg`;

const GALLERY = [
  { id: 'm01', src: frame(2), thumb: frame(2), alt: 'Dr. Anneke van Dijk speaking on stage at the opening keynote, 2025', caption: 'Dr. Anneke van Dijk opens with the Dutch yield model', year: 2025, category: 'Keynotes', w: 4, h: 5, feature: true },
  { id: 'm02', src: frame(5), thumb: frame(5), alt: "RoboPick's autonomous harvesting arm demonstrated to a crowd on the exhibition floor, 2025", caption: "RoboPick's harvesting arm draws a crowd on the floor", year: 2025, category: 'Exhibition', w: 1, h: 1 },
  { id: 'm03', src: frame(8), thumb: frame(8), alt: 'Attendees mixing substrate by hand at a hands-on workshop table, 2025', caption: 'Hands-on substrate mixing, table by table', year: 2025, category: 'Workshops', w: 16, h: 9 },
  { id: 'm04', src: frame(11), thumb: frame(11), alt: 'A first-time exhibitor accepting the Highest Yield award on stage, 2025', caption: 'Highest Yield goes to a first-time exhibitor', year: 2025, category: 'Awards', w: 3, h: 4 },
  { id: 'm05', src: frame(14), thumb: frame(14), alt: 'Buyers and growers talking on the terrace during the evening networking session, 2025', caption: 'Buyer–grower matchmaking on the terrace', year: 2025, category: 'Networking', w: 5, h: 4 },
  { id: 'm06', src: frame(17), thumb: frame(17), alt: 'A panel of cold-chain experts answering audience questions, 2025', caption: 'Cold-chain panel runs twenty minutes over', year: 2025, category: 'Keynotes', w: 9, h: 16 },
  { id: 'm07', src: frame(20), thumb: frame(20), alt: 'A grower testing a climate sensor display at the ClimaGrow exhibition booth, 2025', caption: 'A grower tests sensors at the ClimaGrow booth', year: 2025, category: 'Exhibition', w: 16, h: 10, feature: true },
  { id: 'm08', src: frame(23), thumb: frame(23), alt: 'Workshop participants inspecting a substrate sample under light, 2025', caption: 'Checking colonisation under the inspection lamp', year: 2025, category: 'Workshops', w: 4, h: 3 },
  { id: 'm09', src: frame(26), thumb: frame(26), alt: 'The full Grower Awards stage line-up applauding winners, 2025', caption: 'The full Grower Awards line-up, 2025', year: 2025, category: 'Awards', w: 2, h: 3 },

  { id: 'm10', src: frame(29), thumb: frame(29), alt: 'Prof. S. Iyer presenting substrate science research to a packed hall, 2024', caption: 'Standing room only for the substrate science keynote', year: 2024, category: 'Keynotes', w: 4, h: 5 },
  { id: 'm11', src: frame(32), thumb: frame(32), alt: 'Rows of compost and packaging suppliers along the exhibition hall, 2024', caption: 'Compost suppliers line the exhibition hall', year: 2024, category: 'Exhibition', w: 1, h: 1 },
  { id: 'm12', src: frame(35), thumb: frame(35), alt: 'A cold-chain logistics workshop running past its scheduled end time, 2024', caption: 'Cold-chain workshop runs past closing time', year: 2024, category: 'Workshops', w: 16, h: 9, feature: true },
  { id: 'm13', src: frame(38), thumb: frame(38), alt: 'Winners holding the Grower Awards trophy on stage, mid-applause, 2024', caption: 'The Grower Awards stage, mid-applause', year: 2024, category: 'Awards', w: 3, h: 4 },
  { id: 'm14', src: frame(3), thumb: frame(3), alt: 'Attendees networking on the lawn outside the venue after dark, 2024', caption: 'Evening networking spills onto the lawn', year: 2024, category: 'Networking', w: 5, h: 4 },
  { id: 'm15', src: frame(6), thumb: frame(6), alt: 'Lars Bakker demonstrating RoboPick controls during a technical keynote, 2024', caption: 'Lars Bakker walks through the RoboPick controls', year: 2024, category: 'Keynotes', w: 9, h: 16 },
  { id: 'm16', src: frame(9), thumb: frame(9), alt: 'A visitor examining packaged mushrooms at an export-readiness exhibition stand, 2024', caption: 'Export-readiness, explained in one small booth', year: 2024, category: 'Exhibition', w: 16, h: 10 },
  { id: 'm17', src: frame(12), thumb: frame(12), alt: 'Hands-on tunnel climate tuning during a workshop session, 2024', caption: 'Tunnel climate tuning, hands on the dials', year: 2024, category: 'Workshops', w: 4, h: 3 },
  { id: 'm18', src: frame(15), thumb: frame(15), alt: 'A finance panel discussing farm expansion loans on the main stage, 2024', caption: 'NABARD on financing your next tunnel', year: 2024, category: 'Awards', w: 2, h: 3 },

  { id: 'm19', src: frame(18), thumb: frame(18), alt: "India Mushroom Days' first keynote, livestreamed to forty partner farms, 2023", caption: 'The first IMD keynote, livestreamed to 40 farms', year: 2023, category: 'Keynotes', w: 4, h: 5, feature: true },
  { id: 'm20', src: frame(21), thumb: frame(21), alt: 'Early exhibition floor with a handful of founding suppliers, 2023', caption: 'The exhibition floor, in its first and smallest form', year: 2023, category: 'Exhibition', w: 1, h: 1 },
  { id: 'm21', src: frame(24), thumb: frame(24), alt: "IMD's original hands-on tunnel climate workshop, 2023", caption: 'Tunnel climate tuning, the original session', year: 2023, category: 'Workshops', w: 16, h: 9 },
  { id: 'm22', src: frame(27), thumb: frame(27), alt: "India Mushroom Days' first awards ceremony, held in a half-finished hall, 2023", caption: "IMD's first awards ceremony, half-built hall and all", year: 2023, category: 'Awards', w: 3, h: 4 },
  { id: 'm23', src: frame(30), thumb: frame(30), alt: 'Early arrivals chatting before the very first session began, 2023', caption: 'Early arrivals, before the first session even started', year: 2023, category: 'Networking', w: 5, h: 4 },
  { id: 'm24', src: frame(33), thumb: frame(33), alt: 'Founding organisers addressing a small first-edition audience, 2023', caption: 'Founding remarks to a room of eighty growers', year: 2023, category: 'Keynotes', w: 9, h: 16 },
  { id: 'm25', src: frame(36), thumb: frame(36), alt: 'A single climate-control prototype on display at the first exhibition floor, 2023', caption: 'One prototype, the seed of the exhibition floor', year: 2023, category: 'Exhibition', w: 16, h: 10 },
  { id: 'm26', src: frame(39), thumb: frame(39), alt: 'Attendees taking notes during the first substrate workshop, 2023', caption: 'Notebooks out for the first substrate session', year: 2023, category: 'Workshops', w: 4, h: 3 },
  { id: 'm27', src: frame(1), thumb: frame(1), alt: 'A toast on the lawn marking the close of the first edition, 2023', caption: 'Closing the first edition with a toast on the lawn', year: 2023, category: 'Networking', w: 2, h: 3 },
];

/* Uploaded photos live alongside GALLERY without mutating the
   source config — same shape, just appended at render time. */
let UPLOADED = [];
const liveSet = () => [...UPLOADED, ...GALLERY];

/* ---------- Render + filter ---------- */
const galEl = document.getElementById('gallery');
const emptyEl = document.getElementById('memEmpty');
const countEl = document.getElementById('memCount');
let filterYear = 'all';
let filterCat = 'all';
let currentList = [];

function renderGallery() {
  currentList = liveSet().filter(g =>
    (filterYear === 'all' || String(g.year) === filterYear) &&
    (filterCat === 'all' || g.category === filterCat)
  );

  galEl.innerHTML = currentList.map((g, i) => `
    <figure class="mem-tile reveal in" data-i="${i}" tabindex="0" role="button"
      aria-label="Open photo: ${escapeAttr(g.caption)}, ${g.year}">
      <div class="ph" style="--ar:${g.w}/${g.h}">
        <img src="${g.thumb}" alt="${escapeAttr(g.alt)}" loading="lazy" decoding="async">
      </div>
      ${g.feature ? `<span class="mem-stamp serif">'${String(g.year).slice(2)}</span>` : ''}
      <figcaption>
        <span class="mem-cat">${escapeAttr(g.category)}</span>
        <strong>${escapeAttr(g.caption)}</strong>
        <span class="mem-year">${g.year}</span>
      </figcaption>
    </figure>`).join('');

  emptyEl.hidden = currentList.length > 0;
  countEl.textContent = currentList.length
    ? `Showing ${currentList.length} photo${currentList.length === 1 ? '' : 's'}`
    : '';

  galEl.querySelectorAll('.mem-tile').forEach(tile => {
    tile.addEventListener('click', () => openLightbox(+tile.dataset.i));
    tile.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(+tile.dataset.i); }
    });
  });
}

function escapeAttr(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

document.getElementById('yearFilters').addEventListener('click', e => {
  const b = e.target.closest('.filt'); if (!b) return;
  document.querySelectorAll('#yearFilters .filt').forEach(x => x.classList.remove('active'));
  b.classList.add('active'); filterYear = b.dataset.yr; renderGallery();
});
document.getElementById('catFilters').addEventListener('click', e => {
  const b = e.target.closest('.filt'); if (!b) return;
  document.querySelectorAll('#catFilters .filt').forEach(x => x.classList.remove('active'));
  b.classList.add('active'); filterCat = b.dataset.cat; renderGallery();
});

renderGallery();

/* ---------- Lightbox ---------- */
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCaption = document.getElementById('lbCaption');
const lbMeta = document.getElementById('lbMeta');
let lbIndex = 0;
let lastFocused = null;

function openLightbox(i) {
  lbIndex = i;
  lastFocused = document.activeElement;
  paintLightbox();
  lb.hidden = false;
  requestAnimationFrame(() => lb.classList.add('show'));
  document.addEventListener('keydown', onLbKeydown);
  document.getElementById('lbClose').focus();
}
function paintLightbox() {
  const g = currentList[lbIndex];
  if (!g) return;
  lbImg.src = g.src; lbImg.alt = g.alt;
  lbCaption.textContent = g.caption;
  lbMeta.textContent = `${g.category} · ${g.year}`;
}
function closeLightbox() {
  lb.classList.remove('show');
  document.removeEventListener('keydown', onLbKeydown);
  setTimeout(() => { lb.hidden = true; }, 250);
  lastFocused?.focus();
}
function lbStep(dir) {
  lbIndex = (lbIndex + dir + currentList.length) % currentList.length;
  paintLightbox();
}
function onLbKeydown(e) {
  if (e.key === 'Escape') closeLightbox();
  else if (e.key === 'ArrowRight') lbStep(1);
  else if (e.key === 'ArrowLeft') lbStep(-1);
  else if (e.key === 'Tab') {
    const focusables = [...lb.querySelectorAll('button')];
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
}
document.getElementById('lbClose').onclick = closeLightbox;
document.getElementById('lbPrev').onclick = () => lbStep(-1);
document.getElementById('lbNext').onclick = () => lbStep(1);
lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });

/* ---------- Upload flow ---------- */
const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const errorsEl = document.getElementById('uploadErrors');
const previewGrid = document.getElementById('previewGrid');
const uploadFields = document.getElementById('uploadFields');
const successEl = document.getElementById('uploadSuccess');
let pending = []; // { key, file, url, caption, year, w, h }

dropzone.addEventListener('click', () => fileInput.click());
dropzone.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
});
['dragover', 'dragenter'].forEach(evt =>
  dropzone.addEventListener(evt, e => { e.preventDefault(); dropzone.classList.add('drag'); }));
['dragleave', 'drop'].forEach(evt =>
  dropzone.addEventListener(evt, () => dropzone.classList.remove('drag')));
dropzone.addEventListener('drop', e => {
  e.preventDefault();
  handleFiles(e.dataTransfer.files);
});
fileInput.addEventListener('change', () => { handleFiles(fileInput.files); fileInput.value = ''; });

function handleFiles(fileList) {
  const errors = [];
  [...fileList].forEach(file => {
    if (!ACCEPTED.includes(file.type)) {
      const ext = (file.name.split('.').pop() || 'unknown').toUpperCase();
      errors.push(`"${file.name}" is a ${ext} file — we can only add JPG, PNG, WEBP or GIF photos. Re-export it as one of those and try again.`);
      return;
    }
    if (file.size > MAX_BYTES) {
      const mb = (file.size / (1024 * 1024)).toFixed(1);
      errors.push(`"${file.name}" is ${mb}MB — that's over our 8MB limit per photo. Compress it or export a smaller version and try again.`);
      return;
    }
    const key = `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const url = URL.createObjectURL(file);
    const entry = { key, file, url, caption: '', year: '2026' };
    pending.push(entry);

    // Read true dimensions so the masonry tile gets an honest aspect ratio.
    const probe = new Image();
    probe.onload = () => { entry.w = probe.naturalWidth; entry.h = probe.naturalHeight; };
    probe.src = url;
  });
  renderErrors(errors);
  renderPreviews();
}

function renderErrors(errors) {
  errorsEl.innerHTML = errors.map(msg => `<div class="upload-err">${escapeAttr(msg)}</div>`).join('');
}

function renderPreviews() {
  previewGrid.innerHTML = pending.map(p => `
    <div class="preview-card" data-key="${p.key}">
      <button type="button" class="pv-remove" aria-label="Remove this photo from the upload list">✕</button>
      <div class="pv-img"><img src="${p.url}" alt=""></div>
      <input type="text" class="pv-caption" placeholder="Caption (optional)"
        aria-label="Caption for this photo" value="${escapeAttr(p.caption)}">
      <select class="pv-year" aria-label="Edition year for this photo">
        <option value="2026"${p.year === '2026' ? ' selected' : ''}>2026</option>
        <option value="2025"${p.year === '2025' ? ' selected' : ''}>2025</option>
        <option value="2024"${p.year === '2024' ? ' selected' : ''}>2024</option>
        <option value="2023"${p.year === '2023' ? ' selected' : ''}>2023</option>
      </select>
    </div>`).join('');

  uploadFields.hidden = pending.length === 0;
  successEl.hidden = true;

  previewGrid.querySelectorAll('.preview-card').forEach(card => {
    const key = card.dataset.key;
    card.querySelector('.pv-remove').onclick = () => {
      const p = pending.find(x => x.key === key);
      if (p) URL.revokeObjectURL(p.url);
      pending = pending.filter(x => x.key !== key);
      renderPreviews();
    };
    card.querySelector('.pv-caption').oninput = e => {
      const p = pending.find(x => x.key === key); if (p) p.caption = e.target.value;
    };
    card.querySelector('.pv-year').onchange = e => {
      const p = pending.find(x => x.key === key); if (p) p.year = e.target.value;
    };
  });
}

document.getElementById('addToGallery').addEventListener('click', async () => {
  if (!pending.length) return;
  const category = document.getElementById('upCat').value;

  const newEntries = pending.map((p, i) => ({
    id: `up-${p.key}`,
    src: p.url,
    thumb: p.url,
    alt: p.caption || `Photo contributed by an attendee, ${p.year}`,
    caption: p.caption || 'Contributed by an attendee',
    year: +p.year,
    category,
    w: p.w || 4,
    h: p.h || 3,
  }));

  UPLOADED = [...newEntries, ...UPLOADED];

  // Fire the (stubbed) backend call. In this front-end build the gallery
  // already shows the photos via object URLs, so we don't block on it.
  uploadFiles(pending.map(p => p.file)).catch(() => {});

  pending = [];
  renderPreviews();
  renderErrors([]);
  successEl.hidden = false;
  setTimeout(() => { successEl.hidden = true; }, 4000);
  renderGallery();
});

/* ---------- Backend stub ----------
   Front-end only: photos are added to the live gallery via local
   object URLs (no localStorage/sessionStorage involved — state lives
   for the page session only). This is the seam where real persistence
   would plug in.

   To wire this up for real: request a presigned upload URL (S3 or your
   CMS's media endpoint) per file, PUT the file directly to that URL,
   then POST the resulting public URL + caption/year/category to your
   gallery API so it's persisted for other visitors. */
async function uploadFiles(files) {
  // Example shape — replace with your actual endpoints:
  //
  // for (const file of files) {
  //   const { uploadUrl, publicUrl } = await fetch('/api/uploads/sign', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ filename: file.name, type: file.type }),
  //   }).then(r => r.json());
  //
  //   await fetch(uploadUrl, { method: 'PUT', body: file });
  //
  //   await fetch('/api/gallery', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ src: publicUrl }),
  //   });
  // }
  return Promise.resolve();
}
