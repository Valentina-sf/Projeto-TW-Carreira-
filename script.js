/* ==========================================================================
   CARREIRA+ — script.js
   Responsável por:
   1) Buscar os dados (roadmap + carreiras) do data.json via fetch
   2) Renderizar os cards dinamicamente no DOM
   3) Controlar o menu mobile, o tema claro/escuro e o link de nav ativo
   ========================================================================== */

/* ---------- Ícones usados nos cards (SVG em string) ---------- */
const ICONS = {
  code: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 4L3 12L8 20M16 4L21 12L16 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  laptop: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 5h16v10H4z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    <path d="M2 19h20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  chart: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 20V10M12 20V4M20 20v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  server: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="6" rx="1.5" stroke="currentColor" stroke-width="2"/>
    <rect x="3" y="14" width="18" height="6" rx="1.5" stroke="currentColor" stroke-width="2"/>
    <path d="M7 7h.01M7 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  cloud: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 18a4.5 4.5 0 0 1-.6-8.96A5.5 5.5 0 0 1 17.3 8.2 4 4 0 0 1 17 18H7Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
  </svg>`,
  database: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="12" cy="5" rx="8" ry="3" stroke="currentColor" stroke-width="2"/>
    <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" stroke="currentColor" stroke-width="2"/>
    <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" stroke="currentColor" stroke-width="2"/>
  </svg>`,
  shield: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
  </svg>`,
};

/* ---------- Dados de reserva, usados caso o fetch falhe (ex: ao abrir o
   arquivo direto no navegador, sem servidor local, o fetch de JSON é
   bloqueado pelo protocolo file://) ---------- */
const FALLBACK_DATA = {
  roadmapSteps: [
    { number: "01", title: "Fundamentos", description: "Lógica, Programação, Git, Linux...", icon: "code" },
    { number: "02", title: "Desenvolvimento", description: "HTML, CSS, JS, Frameworks...", icon: "laptop" },
    { number: "03", title: "Especialização", description: "Tecnologias avançadas, práticas e projetos reais.", icon: "chart" },
  ],
  careers: [
    { name: "Front-end", icon: "code" },
    { name: "Back-end", icon: "server" },
    { name: "DevOps", icon: "cloud" },
    { name: "Dados", icon: "database" },
    { name: "Cibersegurança", icon: "shield" },
  ],
};

/* ---------- Busca os dados em data.json ---------- */
async function loadData() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error("Falha ao carregar data.json");
    return await response.json();
  } catch (error) {
    console.warn("Não foi possível buscar data.json, usando dados locais de reserva.", error);
    return FALLBACK_DATA;
  }
}

/* ---------- Renderiza as etapas do roadmap no hero ---------- */
function renderRoadmapSteps(steps) {
  const container = document.getElementById("roadmapCard");
  if (!container) return;

  container.innerHTML = steps
    .map(
      (step) => `
      <li class="roadmap-step">
        <span class="roadmap-step__number">${step.number}</span>
        <div class="roadmap-step__body">
          <div>
            <p class="roadmap-step__title">${step.title}</p>
            <p class="roadmap-step__desc">${step.description}</p>
          </div>
          <span class="roadmap-step__icon">${ICONS[step.icon] ?? ""}</span>
        </div>
      </li>`
    )
    .join("");
}

/* ---------- Renderiza os cards de carreiras em alta ---------- */
function renderCareers(careers) {
  const grid = document.getElementById("careersGrid");
  if (!grid) return;

  grid.innerHTML = careers
    .map(
      (career) => `
      <a href="#roadmaps" class="career-card">
        <span class="career-card__icon">${ICONS[career.icon] ?? ""}</span>
        <span class="career-card__name">${career.name}</span>
      </a>`
    )
    .join("");
}

/* ---------- Menu mobile ---------- */
function setupMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  if (!menuToggle || !nav) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("[data-nav-link]").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuToggle.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- Alternância de tema claro/escuro (com persistência) ---------- */
function setupThemeToggle() {
  const root = document.documentElement;
  const toggleBtn = document.getElementById("themeToggle");
  if (!toggleBtn) return;

  const savedTheme = localStorageSafeGet("carreiraplus-theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);

  toggleBtn.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", current);
    localStorageSafeSet("carreiraplus-theme", current);
  });
}

/* Helpers para localStorage que não quebram caso o navegador bloqueie
   (ex: modo de navegação anônima com storage restrito) */
function localStorageSafeGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function localStorageSafeSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignora silenciosamente */
  }
}

/* ---------- Marca o link de navegação ativo conforme a seção visível ---------- */
function setupActiveNavOnScroll() {
  const links = document.querySelectorAll("[data-nav-link]");
  const sections = Array.from(links)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!("IntersectionObserver" in window) || sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        links.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === id);
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------- Atualiza o ano do rodapé automaticamente ---------- */
function setupFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ---------- Inicialização ---------- */
async function init() {
  const data = await loadData();
  renderRoadmapSteps(data.roadmapSteps);
  renderCareers(data.careers);

  setupMobileMenu();
  setupThemeToggle();
  setupActiveNavOnScroll();
  setupFooterYear();
}

document.addEventListener("DOMContentLoaded", init);