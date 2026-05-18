/* ---- SETTINGS STATE ---- */
let settings = {
  theme: 'light',
  particleDensity: 30,
  animations: true,
  blur: true
};

try {
  const saved = JSON.parse(localStorage.getItem('bozcorp_settings'));
  if (saved) settings = { ...settings, ...saved };
} catch (e) {}

function saveSettings() {
  try { localStorage.setItem('bozcorp_settings', JSON.stringify(settings)); } catch(e) {}
}

applyTheme(settings.theme);
applyBlur(settings.blur);
if (!settings.animations) document.body.classList.add('no-anim');

function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  document.getElementById('btnDark').classList.toggle('active', t === 'dark');
  document.getElementById('btnLight').classList.toggle('active', t === 'light');
}

function applyBlur(b) {
  document.documentElement.setAttribute('data-blur', b ? 'true' : 'false');
}

/* ---- LANGUAGE ---- */
let currentLang = localStorage.getItem('bozcorp_lang') || 'tr';
const LANG_CODES = { tr:'TR', en:'EN', ru:'RU', zh:'ZH', de:'DE' };

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('bozcorp_lang', lang);
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;

  document.getElementById('langBtn').textContent = LANG_CODES[lang] || lang.toUpperCase();

  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.lang === lang);
  });

  i18nApply();

  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    el.placeholder = i18nGet(el.getAttribute('data-i18n-ph'));
  });

  renderGrid();
}

document.getElementById('langBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  document.getElementById('langDropdown').classList.toggle('open');
});

document.querySelectorAll('.lang-option').forEach(opt => {
  opt.addEventListener('click', () => {
    applyLang(opt.dataset.lang);
    document.getElementById('langDropdown').classList.remove('open');
  });
});

document.addEventListener('click', () => {
  document.getElementById('langDropdown').classList.remove('open');
});

/* ---- SETTINGS PANEL ---- */
const settingsBtn     = document.getElementById('settingsBtn');
const settingsPanel   = document.getElementById('settingsPanel');
const settingsOverlay = document.getElementById('settingsOverlay');
const settingsClose   = document.getElementById('settingsClose');

function openSettings()  { settingsPanel.classList.add('open');    settingsOverlay.classList.add('open'); }
function closeSettings() { settingsPanel.classList.remove('open'); settingsOverlay.classList.remove('open'); }

settingsBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  settingsPanel.classList.contains('open') ? closeSettings() : openSettings();
});
settingsClose.addEventListener('click', closeSettings);
settingsOverlay.addEventListener('click', closeSettings);

document.getElementById('btnDark').addEventListener('click', () => {
  settings.theme = 'dark'; applyTheme('dark'); saveSettings();
});
document.getElementById('btnLight').addEventListener('click', () => {
  settings.theme = 'light'; applyTheme('light'); saveSettings();
});

const densitySlider = document.getElementById('particleDensity');
const densityVal    = document.getElementById('densityVal');
densitySlider.value = settings.particleDensity;
densityVal.textContent = settings.particleDensity;
densitySlider.addEventListener('input', () => {
  const v = parseInt(densitySlider.value);
  densityVal.textContent = v;
  settings.particleDensity = v;
  saveSettings();
  initParticles(v);
});

const animToggle = document.getElementById('animToggle');
animToggle.checked = settings.animations;
animToggle.addEventListener('change', () => {
  settings.animations = animToggle.checked;
  document.body.classList.toggle('no-anim', !settings.animations);
  saveSettings();
});

const blurToggle = document.getElementById('blurToggle');
blurToggle.checked = settings.blur;
blurToggle.addEventListener('change', () => {
  settings.blur = blurToggle.checked;
  applyBlur(settings.blur);
  saveSettings();
});

/* ---- MOBILE NAV ---- */
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu   = document.getElementById('mobileMenu');

mobileToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

document.addEventListener('click', (e) => {
  if (!mobileMenu.contains(e.target) && e.target !== mobileToggle) {
    mobileMenu.classList.remove('open');
  }
});

/* ---- DOWNLOAD MAP ---- */
let downloadMap = {};
fetch("downloads.json")
  .then(res => res.json())
  .then(data => { downloadMap = data; })
  .catch(() => {});

function getDownloadLink(projectName) {
  return downloadMap[projectName] ? `availableDownloads/${downloadMap[projectName]}` : null;
}

/* ---- PROJECT DATA ---- */
const projects = [
  {
    titleKey: "proj_fluxo_title",
    descKey:  "proj_fluxo_desc",
    logo: "assets/fluxologo.png",
    version: "v5.3.0 Beta",
    images: ["assets/fluxo1.png"],
    github: "https://github.com/Berat-365/FluxoExtension",
    link: "https://microsoftedge.microsoft.com/addons/detail/fluxo/hinnlpbncenpbjbgcefgljjbdlilcdhj?hl=tr-TR",
    download: false,
    page: "fluxo.html",
    colors: ["#6ae99a", "#5bbbd7", "#5db5ea"]
  },
  {
    titleKey: "proj_nexus_title",
    descKey:  "proj_nexus_desc",
    logo: "assets/riseofnexuslogo.png",
    version: "v1.0.0",
    images: ["assets/nexus1.png", "assets/nexus2.png"],
    github: "#",
    link: null,
    download: true,
    downloadUrl: "availableDownloads/Shadow Protocol: Rise of NEXUS",
    colors: ["#71b8fb", "#ea5d5d"]
  },
  {
    titleKey: "proj_imageforge_title",
    descKey:  "proj_imageforge_desc",
    logo: "assets/imageforgelogo.png",
    version: "v1.0.0",
    images: ["assets/imageforge1.png", "assets/imageforge2.png", "assets/imageforge3.png"],
    github: "#",
    link: null,
    download: true,
    downloadUrl: "availableDownloads/Image Forge",
    colors: ["#0051ff", "#5dc2ea"]
  },
  {
    titleKey: "proj_pageguard_title",
    descKey:  "proj_pageguard_desc",
    logo: "assets/pageguardlogo.png",
    version: "v1.0.0",
    images: ["assets/pageguard1.png", "assets/pageguard2.png", "assets/pageguard3.png"],
    github: "#",
    link: null,
    download: true,
    downloadUrl: "availableDownloads/Page Guard",
    colors: ["#2b2b2b", "#440e0e"]
  }
];

/* ---- GRID RENDER ---- */
const grid = document.getElementById("grid");

function renderGrid() {
  grid.innerHTML = "";

  projects.forEach((p, i) => {
    const title = i18nGet(p.titleKey);
    const desc  = i18nGet(p.descKey);

    const card = document.createElement("div");
    card.className = "card reveal";
    card.style.setProperty('--c1', p.colors[0]);
    card.style.setProperty('--c2', p.colors[p.colors.length - 1]);
    card.style.transitionDelay = `${i * 0.08}s`;
    if (p.page) card.setAttribute('data-page', p.page);

    card.innerHTML = `
      <div class="card-overlay"></div>
      <div class="card-spotlight"></div>
      <div class="card-content">
        <div class="logo-wrap" title="Resmi büyütmek için tıkla">
          <img src="${p.logo}" alt="${title}">
        </div>
        <h3>${title}</h3>
        <p>${desc}</p>
      </div>
    `;

    card.querySelector('.logo-wrap').addEventListener('click', (e) => {
      e.stopPropagation();
      openZoom(p.logo, title);
    });

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');
    });

    card.addEventListener("click", () => {
      if (p.page) { pageLeave(p.page); return; }
      openModal(p);
    });

    grid.appendChild(card);
  });

  grid.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ---- IMAGE ZOOM LIGHTBOX ---- */
const imgZoom      = document.getElementById('imgZoom');
const imgZoomImg   = document.getElementById('imgZoomImg');
const imgZoomClose = document.getElementById('imgZoomClose');

function openZoom(src, alt) {
  imgZoomImg.src = src;
  imgZoomImg.alt = alt || '';
  imgZoom.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeZoom() {
  imgZoom.classList.remove('active');
  document.body.style.overflow = '';
}

imgZoomClose.addEventListener('click', closeZoom);
imgZoom.addEventListener('click', (e) => {
  if (e.target === imgZoom || e.target === imgZoomImg) closeZoom();
});

/* ---- MODAL ---- */
const modal      = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");

function openModal(p) {
  const title = i18nGet(p.titleKey);
  const desc  = i18nGet(p.descKey);

  document.getElementById("m-logo").src = p.logo;
  document.getElementById("m-title").textContent = title;
  document.getElementById("m-version").textContent = p.version;
  document.getElementById("m-desc").textContent = desc;

  const imgBox  = document.getElementById("m-images");
  const linkBox = document.getElementById("m-links");
  imgBox.innerHTML  = "";
  linkBox.innerHTML = "";

  p.images.forEach(src => {
    const el = document.createElement("img");
    el.src = src;
    el.alt = title;
    el.addEventListener('click', () => openZoom(src, title));
    imgBox.appendChild(el);
  });

  document.getElementById("m-logo").style.cursor = 'zoom-in';
  document.getElementById("m-logo").onclick = () => openZoom(p.logo, title);

  if (p.github && p.github !== "#") {
    linkBox.innerHTML += `<a href="${p.github}" target="_blank" rel="noopener">${i18nGet('modal_github')}</a>`;
  }
  if (p.link) {
    linkBox.innerHTML += `<a href="${p.link}" target="_blank" rel="noopener">${i18nGet('modal_store')}</a>`;
  }
  if (p.download) {
    const dl = p.downloadUrl || getDownloadLink(title);
    if (dl) {
      linkBox.innerHTML += `<a class="download" href="${dl}" download>${i18nGet('modal_download')}</a>`;
    } else {
      linkBox.innerHTML += `<a class="download" href="#">${i18nGet('modal_download')}</a>`;
    }
  }

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeZoom(); closeModal(); }
});

/* ---- NAVBAR SCROLL ---- */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.style.borderBottomColor = window.scrollY > 20 ? "var(--border-hover)" : "var(--border)";
}, { passive: true });

/* ---- CURSOR GLOW ---- */
const glow = document.getElementById("cursorGlow");
document.addEventListener("mousemove", (e) => {
  glow.style.left    = e.clientX + "px";
  glow.style.top     = e.clientY + "px";
  glow.style.opacity = "1";
}, { passive: true });
document.addEventListener("mouseleave", () => { glow.style.opacity = "0"; });

/* ---- PARTICLES ---- */
const canvas = document.getElementById("bg");
const ctx    = canvas.getContext("2d");
let particles = [];

function initParticles(count) {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      r:  Math.random() * 2 + 0.5,
      o:  Math.random() * 0.3 + 0.05
    });
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  particles.forEach(p => {
    p.x += p.dx; p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? `rgba(225,29,72,${p.o})` : `rgba(225,29,72,${p.o * 0.6})`;
    ctx.fill();
  });
}

initParticles(settings.particleDensity);
animate();
window.addEventListener("resize", () => { initParticles(settings.particleDensity); }, { passive: true });

/* ---- REVEAL ---- */
const revealEls = document.querySelectorAll(".reveal");
const observer  = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

/* ---- SKILL BARS ---- */
const skillItems    = document.querySelectorAll('.skill-item');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const pct  = entry.target.dataset.pct;
      const fill = entry.target.querySelector('.skill-fill');
      setTimeout(() => { fill.style.width = pct + '%'; }, 100);
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
skillItems.forEach(el => skillObserver.observe(el));

/* ---- PAGE TRANSITION ---- */
const pt = document.getElementById('pageTransition');

function pageLeave(href) {
  pt.classList.remove('exit');
  pt.classList.add('enter');
  setTimeout(() => { window.location.href = href; }, 420);
}

document.querySelectorAll('a[href="changelog.html"]').forEach(a => {
  a.addEventListener('click', e => { e.preventDefault(); pageLeave('changelog.html'); });
});

const navTopluluk = document.getElementById('navTopluluk');
if (navTopluluk) navTopluluk.addEventListener('click', e => { e.preventDefault(); pageLeave('topluluk.html'); });

const mobChangelog = document.getElementById('mobChangelog');
if (mobChangelog) mobChangelog.addEventListener('click', e => { e.preventDefault(); pageLeave('changelog.html'); });

const mobTopluluk = document.getElementById('mobTopluluk');
if (mobTopluluk) mobTopluluk.addEventListener('click', e => { e.preventDefault(); pageLeave('topluluk.html'); });

window.addEventListener('pageshow', () => {
  pt.classList.remove('enter');
  pt.classList.add('exit');
  setTimeout(() => { pt.classList.remove('exit'); }, 460);
});

/* ---- CONTACT FORM ---- */
const EMAILJS_SERVICE_ID  = 'service_f4qj0md';
const EMAILJS_TEMPLATE_ID = 'template_720hbfc';
const EMAILJS_PUBLIC_KEY  = 'aq-zHpAOGx4vIhf5o';

const formSubmit = document.getElementById('formSubmit');
const submitText = document.getElementById('submitText');
const formMsg    = document.getElementById('formMsg');

if (formSubmit) {
  formSubmit.addEventListener('click', async () => {
    const name  = document.getElementById('f-name').value.trim();
    const email = document.getElementById('f-email').value.trim();
    const msg   = document.getElementById('f-msg').value.trim();

    formMsg.textContent = '';
    formMsg.className = 'form-feedback';

    if (!name || !email || !msg) {
      formMsg.textContent = i18nGet('contact_fill');
      formMsg.className = 'form-feedback error';
      return;
    }

    formSubmit.disabled = true;
    submitText.textContent = i18nGet('contact_sending');

    try {
      if (typeof emailjs === 'undefined') throw new Error('EmailJS yüklenmedi');
      emailjs.init(EMAILJS_PUBLIC_KEY);
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name:  name,
        from_email: email,
        message:    msg
      });
      formMsg.textContent = i18nGet('contact_success');
      formMsg.className = 'form-feedback success';
      document.getElementById('f-name').value  = '';
      document.getElementById('f-email').value = '';
      document.getElementById('f-msg').value   = '';
    } catch (err) {
      formMsg.textContent = i18nGet('contact_error');
      formMsg.className = 'form-feedback error';
    } finally {
      formSubmit.disabled = false;
      submitText.textContent = i18nGet('contact_send');
    }
  });
}

/* ---- INIT ---- */
applyLang(currentLang);