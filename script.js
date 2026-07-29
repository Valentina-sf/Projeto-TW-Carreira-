/*
   CARREIRA+ — script.js
   Busca os dados do JSON, renderiza os cards e controla o menu, tema e quiz.
*/

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

/* ---------- Dados de reserva, usados caso o fetch falhe ---------- */
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
  roadmapsDetailed: {
    frontend: [
      { number: "01", title: "HTML e CSS", description: "Estruture e estilize páginas com semântica e responsividade.", icon: "code" },
      { number: "02", title: "JavaScript", description: "Adicione interatividade e manipulação do DOM.", icon: "code" },
      { number: "03", title: "React", description: "Construa interfaces modernas com componentes e estado.", icon: "code" },
    ],
    backend: [
      { number: "01", title: "Lógica e APIs", description: "Entenda regras de negócio e comunicação entre sistemas.", icon: "server" },
      { number: "02", title: "Banco de dados", description: "Modelagem, consultas e persistência de dados.", icon: "database" },
      { number: "03", title: "Arquitetura", description: "Estruture aplicações com segurança e escalabilidade.", icon: "server" },
    ],
    devops: [
      { number: "01", title: "Linux e shell", description: "Domine o ambiente de execução e automações básicas.", icon: "cloud" },
      { number: "02", title: "Containers", description: "Aprenda Docker e isolamento de ambientes.", icon: "cloud" },
      { number: "03", title: "CI/CD", description: "Implemente deploys automatizados e pipelines.", icon: "cloud" },
    ],
  },
  quiz: {
    questions: [
      {
        question: "Qual tarefa te dá mais satisfação?",
        options: [
          { text: "Criar telas bonitas e interativas", area: "frontend" },
          { text: "Resolver a lógica por trás de um sistema", area: "backend" },
          { text: "Automatizar processos e infraestrutura", area: "devops" },
          { text: "Analisar números e encontrar padrões", area: "dados" },
          { text: "Encontrar falhas e proteger sistemas", area: "ciberseguranca" },
        ],
      },
      {
        question: "Como você prefere resolver um problema?",
        options: [
          { text: "Ajustando até a interface ficar perfeita", area: "frontend" },
          { text: "Estruturando dados e regras de negócio", area: "backend" },
          { text: "Montando um pipeline que resolve de vez", area: "devops" },
          { text: "Cruzando informações até achar a resposta", area: "dados" },
          { text: "Pensando como um invasor pensaria", area: "ciberseguranca" },
        ],
      },
      {
        question: "O que mais te chama atenção em um projeto?",
        options: [
          { text: "A experiência de quem vai usar", area: "frontend" },
          { text: "Como as informações são processadas", area: "backend" },
          { text: "Como o sistema roda sem cair", area: "devops" },
          { text: "O que os dados podem revelar", area: "dados" },
          { text: "Os riscos e vulnerabilidades envolvidos", area: "ciberseguranca" },
        ],
      },
      {
        question: "Qual dessas ferramentas mais desperta seu interesse?",
        options: [
          { text: "React, CSS e design de interfaces", area: "frontend" },
          { text: "Bancos de dados e APIs", area: "backend" },
          { text: "Docker, Linux e nuvem", area: "devops" },
          { text: "Planilhas, SQL e dashboards", area: "dados" },
          { text: "Firewalls e testes de invasão", area: "ciberseguranca" },
        ],
      },
      {
        question: "Em um time de tecnologia, você seria a pessoa que...",
        options: [
          { text: "Deixa tudo bonito e fácil de usar", area: "frontend" },
          { text: "Garante que as regras do sistema façam sentido", area: "backend" },
          { text: "Cuida pra nada quebrar em produção", area: "devops" },
          { text: "Traz números pra embasar decisões", area: "dados" },
          { text: "Protege a empresa de ataques", area: "ciberseguranca" },
        ],
      },
    ],
    areas: {
      frontend: { title: "Front-end", description: "Você curte dar vida às interfaces e se preocupa com a experiência de quem usa o produto. HTML, CSS, JavaScript e frameworks como React são o seu próximo passo.", icon: "code" },
      backend: { title: "Back-end", description: "Você gosta de resolver a lógica por trás dos sistemas. Bancos de dados, APIs e linguagens de servidor combinam com o seu perfil.", icon: "server" },
      devops: { title: "DevOps", description: "Você tem perfil de quem gosta de automatizar, integrar e manter tudo rodando sem falhas. Linux, nuvem e containers são ótimos pontos de partida.", icon: "cloud" },
      dados: { title: "Dados", description: "Você tem faro para encontrar padrões e transformar números em decisões. SQL, análise de dados e estatística vão te abrir portas.", icon: "database" },
      ciberseguranca: { title: "Cibersegurança", description: "Você pensa como quem protege — e como quem ataca. Redes, sistemas operacionais e testes de invasão são o caminho ideal pra você.", icon: "shield" },
    },
  },
};

/* ---------- Busca os dados em dados.json ---------- */
async function loadData() {
  try {
    const response = await fetch("./dados.json");
    if (!response.ok) throw new Error("Falha ao carregar dados.json");
    return await response.json();
  } catch (error) {
    console.warn("Não foi possível buscar dados.json, usando dados locais de reserva.", error);
    return FALLBACK_DATA;
  }
}

/* ---------- Renderiza as etapas do roadmap no hero ---------- */
function renderRoadmapSteps(steps, containerId = "roadmapCard") {
  const container = document.getElementById(containerId);
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

/* ---------- Abas dos roadmaps (Front-end / Back-end / DevOps) ---------- */
function setupRoadmapTabs(roadmapsDetailed) {
  const tabsWrapper = document.getElementById("roadmapTabs");
  if (!tabsWrapper || !roadmapsDetailed) return;

  const tabs = tabsWrapper.querySelectorAll(".roadmap-tab");

  function selectTab(area) {
    tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.roadmap === area));
    renderRoadmapSteps(roadmapsDetailed[area], "roadmapDetail");
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => selectTab(tab.dataset.roadmap));
  });

  selectTab(tabs[0].dataset.roadmap);
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

/* ---------- Quiz "Descubra qual área combina com você" ---------- */
function setupQuiz(quizData) {
  const startBtn = document.getElementById("startQuizBtn");
  const quizEl = document.getElementById("quiz");
  const questionsEl = document.getElementById("quizQuestions");
  const resultEl = document.getElementById("quizResult");
  const retryBtn = document.getElementById("retryQuizBtn");

  if (!startBtn || !quizEl || !questionsEl || !resultEl || !quizData) return;

  const questions = quizData.questions;
  const areas = quizData.areas;

  let currentQuestion = 0;
  let scores = {};

  function resetScores() {
    scores = Object.keys(areas).reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
  }

  function renderQuestion() {
    const question = questions[currentQuestion];
    const progressPercent = Math.round((currentQuestion / questions.length) * 100);

    questionsEl.innerHTML = `
      <div class="quiz__progress">
        <div class="quiz__progress-bar">
          <div class="quiz__progress-fill" style="width: ${progressPercent}%"></div>
        </div>
        <span class="quiz__progress-label">${currentQuestion + 1} de ${questions.length}</span>
      </div>
      <div class="quiz-question">
        <p class="quiz-question__title">${question.question}</p>
        <div class="quiz-question__options">
          ${question.options
            .map(
              (option, index) => `
              <button type="button" class="quiz-option" data-area="${option.area}" data-index="${index}">
                <span class="quiz-option__bullet"></span>
                ${option.text}
              </button>`
            )
            .join("")}
        </div>
      </div>
    `;

    questionsEl.querySelectorAll(".quiz-option").forEach((btn) => {
      btn.addEventListener("click", () => handleAnswer(btn.dataset.area));
    });
  }

  function handleAnswer(area) {
    scores[area] = (scores[area] || 0) + 1;
    currentQuestion += 1;

    if (currentQuestion < questions.length) {
      renderQuestion();
    } else {
      showResult();
    }
  }

  function showResult() {
    const winnerKey = Object.keys(scores).reduce((best, key) =>
      scores[key] > scores[best] ? key : best
    , Object.keys(scores)[0]);

    const winner = areas[winnerKey];

    questionsEl.innerHTML = "";
    questionsEl.hidden = true;
    resultEl.hidden = false;

    document.getElementById("quizResultIcon").innerHTML = ICONS[winner.icon] ?? "";
    document.getElementById("quizResultTitle").textContent = winner.title;
    document.getElementById("quizResultDesc").textContent = winner.description;
    document.getElementById("quizResultLink").href = "#carreiras";
  }

  function startQuiz() {
    resetScores();
    currentQuestion = 0;
    questionsEl.hidden = false;
    resultEl.hidden = true;
    quizEl.hidden = false;
    renderQuestion();
    quizEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  startBtn.addEventListener("click", startQuiz);
  retryBtn?.addEventListener("click", startQuiz);
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

/* ---------- Alternância de tema claro/escuro ---------- */
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
  renderRoadmapSteps(data.roadmapSteps || FALLBACK_DATA.roadmapSteps);
  renderCareers(data.careers || FALLBACK_DATA.careers);
  setupQuiz(data.quiz || FALLBACK_DATA.quiz);
  setupRoadmapTabs(data.roadmapsDetailed || FALLBACK_DATA.roadmapsDetailed);

  setupMobileMenu();
  setupThemeToggle();
  setupActiveNavOnScroll();
  setupFooterYear();
}

document.addEventListener("DOMContentLoaded", init);