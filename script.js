/* =========================================================
   SKILLBRIDGE — script.js
   1. Data: pain points + careers/skills + roadmap content
   2. Nav (mobile toggle, sticky, smooth scroll, close-on-click)
   3. Scroll reveal
   4. Pain point cards render
   5. Skill assessment (career select, skill levels, analyze, reset)
   6. Roadmap accordion
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollReveal();
  renderPainPoints();
  initAssessment();
  initRoadmapAccordion();
  renderRoadmapDefaults();
});

/* ---------------------------------------------------------
   1. DATA
--------------------------------------------------------- */

const PAIN_POINTS = [
  { icon: 'fa-compass', title: 'Career uncertainty', text: 'Not sure which career path actually fits your interests and strengths.' },
  { icon: 'fa-circle-question', title: '"What should I learn?"', text: 'Constant confusion about which skill to pick up next.' },
  { icon: 'fa-layer-group', title: 'Information overload', text: 'Too many blogs, videos and opinions with no clear direction.' },
  { icon: 'fa-list-ul', title: 'Too many course choices', text: 'Every platform has a hundred courses — which one is actually worth it?' },
  { icon: 'fa-clipboard-question', title: 'Unclear skill requirements', text: 'Job listings rarely spell out what "skilled" really means.' },
  { icon: 'fa-magnifying-glass-chart', title: 'Skill-gap confusion', text: 'Hard to tell how far you are from being job-ready.' },
  { icon: 'fa-user-slash', title: 'Lack of personalized guidance', text: 'Generic advice that doesn\'t account for your current level.' },
  { icon: 'fa-hourglass-half', title: 'Difficulty prioritizing skills', text: 'Not sure which skill to focus on first for the biggest impact.' },
  { icon: 'fa-briefcase', title: 'Lack of practical experience', text: 'Plenty of theory, but few real projects to show for it.' },
  { icon: 'fa-face-flushed', title: 'Internship anxiety', text: 'Worried about applying without feeling truly prepared.' },
];

// Each skill has a required proficiency level for the career (1-4 scale)
// 1 = Beginner, 2 = Intermediate-, 3 = Intermediate+, 4 = Advanced required
const CAREERS = {
  'data-analyst': {
    label: 'Data Analyst',
    skills: [
      { key: 'excel', name: 'Excel', required: 3 },
      { key: 'sql', name: 'SQL', required: 3 },
      { key: 'python', name: 'Python', required: 2 },
      { key: 'statistics', name: 'Statistics', required: 3 },
      { key: 'powerbi', name: 'Power BI', required: 3 },
      { key: 'dataviz', name: 'Data Visualization', required: 3 },
    ],
    build: ['Data Cleaning Project', 'Sales Dashboard', 'Customer Analysis Report', 'Portfolio Project'],
  },
  'software-developer': {
    label: 'Software Developer',
    skills: [
      { key: 'html', name: 'HTML', required: 2 },
      { key: 'css', name: 'CSS', required: 2 },
      { key: 'javascript', name: 'JavaScript', required: 3 },
      { key: 'git', name: 'Git', required: 2 },
      { key: 'programming', name: 'Programming Fundamentals', required: 3 },
      { key: 'dsa', name: 'Data Structures', required: 3 },
    ],
    build: ['Personal Portfolio Site', 'To-Do App with Git History', 'REST API Project', 'Open Source Contribution'],
  },
  'cybersecurity-analyst': {
    label: 'Cybersecurity Analyst',
    skills: [
      { key: 'networking', name: 'Networking', required: 3 },
      { key: 'linux', name: 'Linux', required: 3 },
      { key: 'python', name: 'Python', required: 2 },
      { key: 'security-fundamentals', name: 'Security Fundamentals', required: 3 },
      { key: 'siem', name: 'SIEM', required: 3 },
      { key: 'threat-analysis', name: 'Threat Analysis', required: 3 },
    ],
    build: ['Home Lab Network Setup', 'Vulnerability Assessment Report', 'SIEM Alert Triage Log', 'CTF Write-ups'],
  },
  'cloud-engineer': {
    label: 'Cloud Engineer',
    skills: [
      { key: 'linux', name: 'Linux', required: 3 },
      { key: 'networking', name: 'Networking', required: 2 },
      { key: 'cloud-provider', name: 'AWS / Azure', required: 3 },
      { key: 'cloud-fundamentals', name: 'Cloud Fundamentals', required: 3 },
      { key: 'security', name: 'Security', required: 2 },
      { key: 'automation', name: 'Automation', required: 3 },
    ],
    build: ['Deploy a 3-Tier App on Cloud', 'Infrastructure-as-Code Project', 'CI/CD Pipeline', 'Cost-Optimization Case Study'],
  },
  'ai-ml-engineer': {
    label: 'AI / ML Engineer',
    skills: [
      { key: 'python', name: 'Python', required: 3 },
      { key: 'statistics', name: 'Statistics', required: 3 },
      { key: 'linear-algebra', name: 'Linear Algebra', required: 2 },
      { key: 'machine-learning', name: 'Machine Learning', required: 3 },
      { key: 'data-processing', name: 'Data Processing', required: 3 },
      { key: 'model-evaluation', name: 'Model Evaluation', required: 3 },
    ],
    build: ['Classification Model Project', 'Data Pipeline & Cleaning Project', 'Model Evaluation Notebook', 'End-to-End ML Portfolio'],
  },
  'ui-ux-designer': {
    label: 'UI/UX Designer',
    skills: [
      { key: 'ui-design', name: 'UI Design', required: 3 },
      { key: 'ux-research', name: 'UX Research', required: 2 },
      { key: 'wireframing', name: 'Wireframing', required: 3 },
      { key: 'prototyping', name: 'Prototyping', required: 3 },
      { key: 'figma', name: 'Figma', required: 3 },
      { key: 'design-systems', name: 'Design Systems', required: 2 },
    ],
    build: ['App Redesign Case Study', 'User Research Report', 'Interactive Prototype', 'Design System Library'],
  },
};

const LEVELS = [
  { value: 0, label: 'None' },
  { value: 1, label: 'Beginner' },
  { value: 2, label: 'Intermediate' },
  { value: 3, label: 'Advanced' },
];

// GROW stage is the same for every career
const GROW_STEPS = ['Build your CV', 'Create your portfolio', 'Apply for internships', 'Prepare for interviews'];

// Holds the user's chosen level for each skill key, per current career
let currentCareerId = 'data-analyst';
let userLevels = {};

/* ---------------------------------------------------------
   2. NAV
--------------------------------------------------------- */
function initNav () {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 12);
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------------------------------------------------
   3. SCROLL REVEAL
--------------------------------------------------------- */
function initScrollReveal () {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in-view'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(el => observer.observe(el));
}

/* ---------------------------------------------------------
   4. PAIN POINTS
--------------------------------------------------------- */
function renderPainPoints () {
  const grid = document.getElementById('painGrid');
  const frag = document.createDocumentFragment();

  PAIN_POINTS.forEach(point => {
    const card = document.createElement('div');
    card.className = 'pain-card reveal';
    card.innerHTML = `
      <div class="pain-icon"><i class="fa-solid ${point.icon}" aria-hidden="true"></i></div>
      <h3>${point.title}</h3>
      <p>${point.text}</p>
    `;
    frag.appendChild(card);
  });

  grid.appendChild(frag);
  // Newly injected reveal items need observing too
  initScrollReveal();
}

/* ---------------------------------------------------------
   5. SKILL ASSESSMENT
--------------------------------------------------------- */
function initAssessment () {
  const careerSelect = document.getElementById('careerSelect');
  const skillList = document.getElementById('skillList');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const resetBtn = document.getElementById('resetBtn');
  const errorEl = document.getElementById('assessmentError');

  // Populate career dropdown
  Object.entries(CAREERS).forEach(([id, data]) => {
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = data.label;
    careerSelect.appendChild(opt);
  });
  careerSelect.value = currentCareerId;

  renderSkillControls(currentCareerId, skillList);

  careerSelect.addEventListener('change', () => {
    currentCareerId = careerSelect.value;
    userLevels = {};
    errorEl.textContent = '';
    hideResults();
    renderSkillControls(currentCareerId, skillList);
  });

  analyzeBtn.addEventListener('click', () => {
    const skills = CAREERS[currentCareerId].skills;
    const answeredAll = skills.every(s => userLevels[s.key] !== undefined);

    if (!answeredAll) {
      errorEl.textContent = 'Please rate every skill before analyzing — pick a level for each one above.';
      return;
    }
    errorEl.textContent = '';
    runAnalysis();
  });

  resetBtn.addEventListener('click', () => {
    userLevels = {};
    errorEl.textContent = '';
    hideResults();
    renderSkillControls(currentCareerId, skillList);
    document.getElementById('careerSelect').focus();
  });
}

function renderSkillControls (careerId, container) {
  container.innerHTML = '';
  const { skills } = CAREERS[careerId];
  const frag = document.createDocumentFragment();

  skills.forEach(skill => {
    const row = document.createElement('div');
    row.className = 'skill-row';
    row.innerHTML = `
      <span class="skill-name">${skill.name}</span>
      <div class="level-group" role="radiogroup" aria-label="${skill.name} level"></div>
    `;
    const group = row.querySelector('.level-group');

    LEVELS.forEach(level => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'level-btn';
      btn.textContent = level.label;
      btn.dataset.level = level.value;
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', 'false');
      btn.addEventListener('click', () => {
        userLevels[skill.key] = level.value;
        group.querySelectorAll('.level-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
      });
      group.appendChild(btn);
    });

    frag.appendChild(row);
  });

  container.appendChild(frag);
}

function runAnalysis () {
  const career = CAREERS[currentCareerId];
  const skills = career.skills;

  const strengths = [];
  const gaps = [];
  const recommendations = [];
  let totalScore = 0;
  let totalPossible = 0;

  const barsData = skills.map(skill => {
    const userLevel = userLevels[skill.key];
    const required = skill.required;
    totalPossible += required;
    totalScore += Math.min(userLevel, required);

    const pct = Math.round((Math.min(userLevel, required) / required) * 100);
    const status = userLevel >= required ? 'strong' : (userLevel === 0 ? 'missing' : 'improve');

    if (status === 'strong') {
      strengths.push(skill.name);
    } else {
      gaps.push(skill.name);
      if (status === 'missing') {
        recommendations.push(`Learn the basics of ${skill.name}`);
      } else {
        recommendations.push(`Strengthen your ${skill.name} to reach a confident level`);
      }
    }

    return { name: skill.name, pct, status };
  });

  const readiness = Math.round((totalScore / totalPossible) * 100);

  // Always add two general next steps based on the career's project track
  recommendations.push(`Build a project: ${career.build[Math.min(1, career.build.length - 1)]}`);
  recommendations.push('Create or update your portfolio with this work');

  displayResults({
    careerLabel: career.label,
    readiness,
    strengths,
    gaps,
    bars: barsData,
    recommendations,
  });

  // Personalize the roadmap Learn/Build stages based on gaps
  updateRoadmapForCareer(career, gaps);
}

function displayResults ({ careerLabel, readiness, strengths, gaps, bars, recommendations }) {
  const panel = document.getElementById('resultPanel');
  panel.hidden = false;

  document.getElementById('resultCareer').textContent = careerLabel;
  document.getElementById('readinessPct').textContent = `${readiness}%`;

  // Ring animation
  const ring = document.getElementById('ringFill');
  const circumference = 326.7; // 2 * PI * 52
  const offset = circumference - (circumference * readiness) / 100;
  ring.style.stroke = readiness >= 70 ? 'var(--green-600)' : readiness >= 40 ? '#dba428' : '#d9714f';
  // Reset then animate on next frame
  ring.style.transition = 'none';
  ring.style.strokeDashoffset = circumference;
  requestAnimationFrame(() => {
    ring.style.transition = 'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)';
    ring.style.strokeDashoffset = offset;
  });

  // Strengths / gaps
  const strengthsList = document.getElementById('strengthsList');
  const gapsList = document.getElementById('gapsList');
  strengthsList.innerHTML = strengths.length
    ? strengths.map(s => `<li><i class="fa-solid fa-circle-check" style="color:var(--green-600); margin-right:8px;"></i>${s}</li>`).join('')
    : '<li>None yet — every skill still needs work.</li>';
  gapsList.innerHTML = gaps.length
    ? gaps.map(g => `<li><i class="fa-solid fa-circle-exclamation" style="color:#d98c1f; margin-right:8px;"></i>${g}</li>`).join('')
    : '<li>None — you meet the bar on every skill!</li>';

  // Bars
  const barsContainer = document.getElementById('resultBars');
  barsContainer.innerHTML = bars.map(b => `
    <div class="result-bar-row">
      <span class="rb-name">${b.name}</span>
      <div class="result-bar-track"><div class="result-bar-fill" data-pct="${b.pct}" style="background:${
        b.status === 'strong' ? 'linear-gradient(90deg,var(--blue-600),var(--green-600))' : b.status === 'missing' ? '#e5a1a1' : '#f0c987'
      }"></div></div>
      <span class="rb-pct">${b.pct}%</span>
    </div>
  `).join('');

  requestAnimationFrame(() => {
    barsContainer.querySelectorAll('.result-bar-fill').forEach(fill => {
      fill.style.width = `${fill.dataset.pct}%`;
    });
  });

  // Recommendations
  const recsList = document.getElementById('recsList');
  recsList.innerHTML = recommendations.map(r => `<li>${r}</li>`).join('');

  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideResults () {
  const panel = document.getElementById('resultPanel');
  panel.hidden = true;
}

/* ---------------------------------------------------------
   6. ROADMAP
--------------------------------------------------------- */
function renderRoadmapDefaults () {
  const career = CAREERS[currentCareerId];
  updateRoadmapForCareer(career, career.skills.map(s => s.name));
}

function updateRoadmapForCareer (career, gapNames) {
  const learnList = document.getElementById('learnList');
  const buildList = document.getElementById('buildList');
  const growList = document.getElementById('growList');

  const learnItems = gapNames.length ? gapNames : career.skills.map(s => s.name);

  learnList.innerHTML = learnItems.map(name => `<li>${name}</li>`).join('');
  buildList.innerHTML = career.build.map(item => `<li>${item}</li>`).join('');
  growList.innerHTML = GROW_STEPS.map(item => `<li>${item}</li>`).join('');
}

function initRoadmapAccordion () {
  const stages = document.querySelectorAll('.roadmap-stage');
  stages.forEach(stage => {
    stage.addEventListener('click', () => {
      const isOpen = stage.getAttribute('aria-expanded') === 'true';
      stage.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}
