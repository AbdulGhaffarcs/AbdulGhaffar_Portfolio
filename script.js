/* ============================================================
   ABDUL GHAFFAR · Portfolio shared JS
   Theme system, terminal, easter eggs, mobile nav
   ============================================================ */

/* ---------- THEME SYSTEM ----------
   Order of precedence:
   1. Saved preference in localStorage
   2. System preference (prefers-color-scheme)
   3. Default: dark
*/
(function initTheme() {
  const stored = (() => { try { return localStorage.getItem('ag-theme'); } catch (e) { return null; } })();
  let theme;
  if (stored === 'light' || stored === 'dark') {
    theme = stored;
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    theme = 'light';
  } else {
    theme = 'dark';
  }
  document.documentElement.setAttribute('data-theme', theme);
})();

function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('ag-theme', next); } catch (e) {}
  if (typeof showToast === 'function') showToast('theme: ' + next);
}

/* ---------- LIVE CLOCK ---------- */
function updateClock() {
  const el = document.getElementById('liveclock');
  if (!el) return;
  const opts = {
    timeZone: 'Asia/Karachi', hour12: false,
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  };
  el.textContent = new Intl.DateTimeFormat('en-GB', opts).format(new Date());
}

/* ---------- MOBILE NAV ---------- */
function initMobileNav() {
  const tog = document.getElementById('navtoggle');
  const links = document.getElementById('navlinks');
  if (!tog || !links) return;
  tog.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}

/* ---------- REVEAL ON SCROLL ---------- */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const siblings = Array.from(e.target.parentNode.querySelectorAll('.reveal'));
        const idx = siblings.indexOf(e.target);
        e.target.style.transitionDelay = (Math.max(0, idx) * 70) + 'ms';
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}

/* ---------- TOAST ---------- */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  if (!toast || !toastMsg) return;
  toastMsg.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

/* ============================================================
   TERMINAL
   ============================================================ */
const TERM_INTRO = [
  { delay: 200, html: null /* prompt + whoami */ },
  { delay: 350, html: '<span class="out">abdul-ghaffar — cs student / frontend / ml</span>' },
  { delay: 250, html: null /* prompt + cat status.txt */ },
  { delay: 400, html: '<span class="ok">●</span> <span class="out">available for opportunities · 2026</span>' },
  { delay: 300, html: '<span class="ok">●</span> <span class="out">building threat-detection api · in progress</span>' },
  { delay: 300, html: '<span class="ok">●</span> <span class="out">currently learning · llm fine-tuning</span>' },
  { delay: 300, html: 'hint /* prompt + dim help */' }
];

function termPrompt() {
  return '<span class="user">abdul</span><span class="at">@</span><span class="host">notebook</span><span class="at">:</span><span class="path">~/portfolio</span><span class="prompt">$</span> ';
}
function termMakeLine(html) {
  const d = document.createElement('div');
  d.className = 'term-line';
  d.innerHTML = html;
  return d;
}
function escapeHTML(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function bootTerminal() {
  const termBody = document.getElementById('term-body');
  if (!termBody || termBody.dataset.booted) return;
  termBody.dataset.booted = '1';

  const seq = [
    { delay: 200, html: termPrompt() + '<span class="key">whoami</span>' },
    { delay: 350, html: '<span class="out">abdul-ghaffar — cs student / ml × security</span>' },
    { delay: 250, html: termPrompt() + '<span class="key">cat status.txt</span>' },
    { delay: 400, html: '<span class="ok">●</span> <span class="out">focus: AI security · ML for threat detection</span>' },
    { delay: 300, html: '<span class="ok">●</span> <span class="out">building: phishing detection (RF + Gemini hybrid)</span>' },
    { delay: 300, html: '<span class="ok">●</span> <span class="out">learning: prompt injection · adversarial ML</span>' },
    { delay: 300, html: '<span class="ok">●</span> <span class="out">open to: research / internships · 2026</span>' },
    { delay: 300, html: termPrompt() + '<span class="dim">help</span> <span class="dim">— or try `security`</span>' }
  ];
  let t = 0;
  seq.forEach((line, i) => {
    t += line.delay;
    setTimeout(() => {
      termBody.appendChild(termMakeLine(line.html));
      if (i === seq.length - 1) addInputRow();
      termBody.scrollTop = termBody.scrollHeight;
    }, t);
  });
}

const COMMANDS = {
  help: () => [
    '<span class="dim">available commands:</span>',
    '  <span class="key">whoami</span>      &nbsp;&nbsp;— who is abdul',
    '  <span class="key">about</span>       &nbsp;&nbsp;— short bio',
    '  <span class="key">security</span>    &nbsp;— ai security focus &amp; interests',
    '  <span class="key">skills</span>      &nbsp;— technical stack',
    '  <span class="key">projects</span>    &nbsp;— list projects',
    '  <span class="key">contact</span>     &nbsp;— how to reach me',
    '  <span class="key">education</span>   — academic background',
    '  <span class="key">socials</span>     &nbsp;— github / linkedin',
    '  <span class="key">goto</span> <span class="dim">&lt;page&gt;</span>  — navigate (about, skills, projects, education, contact)',
    '  <span class="key">theme</span>       &nbsp;&nbsp;— toggle light / dark',
    '  <span class="key">date</span>        &nbsp;&nbsp;— current time (PKT)',
    '  <span class="key">echo</span> <span class="dim">&lt;text&gt;</span>  — print back',
    '  <span class="key">sudo</span> <span class="dim">&lt;cmd&gt;</span>   — try it 😏',
    '  <span class="key">matrix</span>      &nbsp;&nbsp;— ¯\\_(ツ)_/¯',
    '  <span class="key">clear</span>       &nbsp;&nbsp;— clear screen',
    '  <span class="key">exit</span>        &nbsp;&nbsp;— close terminal'
  ],
  whoami: () => ['<span class="out">abdul-ghaffar — cs student, sukkur iba · ml × security</span>'],
  about: () => [
    '<span class="out">CS student at Sukkur IBA (2023–2027), 6th semester.</span>',
    '<span class="out">Focus: AI security — ML for threat detection + LLM red-teaming.</span>',
    '<span class="dim">→ <a href="about.html" style="color:var(--phosphor);text-decoration:underline;">read more on /about</a></span>'
  ],
  skills: () => [
    '<span class="ok">▸ ml-sec</span>    Python · Scikit-learn · LLM integration · adversarial ML',
    '<span class="ok">▸ frontend</span>  React · JS ES6+ · Firebase · responsive UI',
    '<span class="ok">▸ tooling</span>   Node · Express · REST · Git · Linux',
    '<span class="dim">→ <a href="skills.html" style="color:var(--phosphor);text-decoration:underline;">full stack on /skills</a></span>'
  ],
  projects: () => [
    '<span class="dim">selected experiments:</span>',
    '  <span class="key">001</span> ★ ml-powered phishing/url threat detection  <span class="dim">[mar 2026]</span>',
    '  <span class="key">002</span> ★ niarad — safe llm deployment &amp; rag      <span class="dim">[2026]</span>',
    '  <span class="key">003</span>   connect — real-time chat (firebase)        <span class="dim">[jan 2026]</span>',
    '<span class="dim">→ <a href="projects.html" style="color:var(--phosphor);text-decoration:underline;">details on /projects</a></span>'
  ],
  security: () => [
    '<span class="ok">▸ AI Security — what I\'m focused on</span>',
    '',
    '<span class="dim">currently exploring:</span>',
    '  ▸ <span class="key">prompt injection</span> &amp; LLM jailbreaks',
    '  ▸ <span class="key">adversarial examples</span> (FGSM, PGD, transferability)',
    '  ▸ <span class="key">ML for malware/phishing</span> detection',
    '  ▸ <span class="key">model robustness</span> &amp; red-teaming',
    '  ▸ <span class="key">privacy-preserving ML</span>',
    '',
    '<span class="dim">currently building:</span>',
    '  ▸ ML-powered phishing &amp; URL threat detection (RF + Gemini hybrid)',
    '  ▸ Niarad — safe LLM deployment with guardrails &amp; multi-stage routing',
    '',
    '<span class="dim">next up:</span>',
    '  ▸ prompt injection test harness',
    '  ▸ adversarial example demo (FGSM on CIFAR-10)',
    '  ▸ LLM-based security log analysis',
    '',
    '<span class="dim">→ <a href="contact.html" style="color:var(--phosphor);text-decoration:underline;">collaborate? /contact</a></span>'
  ],
  contact: () => [
    'email   : <a href="mailto:abghaffar360@gmail.com" style="color:var(--phosphor);text-decoration:underline;">abghaffar360@gmail.com</a>',
    'phone   : +92 310 358 8834',
    'github  : @abdulghaffarcs',
    'linkedin: @abdulghaffarcs',
    '<span class="dim">→ <a href="contact.html" style="color:var(--phosphor);text-decoration:underline;">/contact</a></span>'
  ],
  education: () => [
    '<span class="ok">BSCS · Sukkur IBA University</span>',
    'aug 2023 → may 2027  <span class="dim">[currently 6th sem]</span>',
    'focus: software engineering, ML, infosec',
    '<span class="dim">→ <a href="education.html" style="color:var(--phosphor);text-decoration:underline;">/education</a></span>'
  ],
  socials: () => [
    '<a href="https://github.com/abdulghaffarcs" target="_blank" style="color:var(--phosphor);text-decoration:underline;">github.com/abdulghaffarcs ↗</a>',
    '<a href="https://linkedin.com/in/abdulghaffarcs" target="_blank" style="color:var(--phosphor);text-decoration:underline;">linkedin.com/in/abdulghaffarcs ↗</a>'
  ],
  goto: (args) => {
    const map = {
      home: 'index.html', '/': 'index.html',
      about: 'about.html',
      skills: 'skills.html',
      stack: 'skills.html',
      projects: 'projects.html', work: 'projects.html',
      education: 'education.html', edu: 'education.html',
      contact: 'contact.html'
    };
    const key = (args[0] || '').toLowerCase();
    if (!key) return ['<span class="err">usage: goto &lt;page&gt;</span>', '<span class="dim">// pages: home, about, skills, projects, education, contact</span>'];
    if (map[key]) {
      setTimeout(() => { window.location.href = map[key]; }, 400);
      return ['<span class="ok">▸ navigating to /' + key + '...</span>'];
    }
    return ['<span class="err">page not found: ' + escapeHTML(key) + '</span>'];
  },
  theme: () => { toggleTheme(); return ['<span class="ok">▸ theme toggled</span>']; },
  date: () => {
    const opts = { timeZone: 'Asia/Karachi', hour12: false, weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return ['<span class="out">' + new Intl.DateTimeFormat('en-GB', opts).format(new Date()) + ' PKT</span>'];
  },
  clear: () => { const tb = document.getElementById('term-body'); tb.innerHTML = ''; addInputRow(); return null; },
  exit:  () => ['<span class="dim">// you can\'t actually exit a portfolio. nice try.</span>'],
  sudo:  () => [
    '<span class="err">[sudo] password for abdul:</span> <span class="dim">******</span>',
    '<span class="err">Sorry, user abdul is not in the sudoers file. This incident will be reported.</span>',
    '<span class="dim">// (just kidding. nothing was reported.)</span>'
  ],
  echo:  (args) => ['<span class="out">' + escapeHTML(args.join(' ') || '') + '</span>'],
  ls:    () => ['<span class="path">about.md</span>  <span class="path">stack.json</span>  <span class="path">projects/</span>  <span class="path">edu.log</span>  <span class="path">contact.sh</span>'],
  matrix: () => { runMatrix(); return ['<span class="ok">▸ entering the matrix...</span>']; },
  coffee: () => ['<span class="out">☕ refilled. productivity +20%.</span>'],
  vim: () => ['<span class="err">e37: no write since last change</span>', '<span class="dim">// you know how to exit this.</span>'],
  ':q': () => ['<span class="out">// nice. one of us.</span>'],
  ':wq': () => ['<span class="out">// even better.</span>'],
  emacs: () => ['<span class="err">// we don\'t do that here.</span>']
};

function runCmd(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  if (trimmed === 'rm -rf /') return [
    '<span class="err">⚠ are you sure?</span>',
    '<span class="dim">// just kidding. read-only filesystem.</span>'
  ];
  const [cmd, ...args] = trimmed.split(/\s+/);
  const lower = cmd.toLowerCase();
  if (COMMANDS[lower]) return COMMANDS[lower](args);
  return ['<span class="err">command not found: ' + escapeHTML(cmd) + '</span>', '<span class="dim">// try `help`</span>'];
}

const termHistory = [];
let termHistIdx = -1;

function addInputRow() {
  const termBody = document.getElementById('term-body');
  if (!termBody) return;
  const row = document.createElement('div');
  row.className = 'term-input-row term-line';
  row.innerHTML = termPrompt() + '<input class="term-input" id="term-input" autocomplete="off" spellcheck="false" autocapitalize="off" /><span class="fake-cursor"></span>';
  termBody.appendChild(row);
  const input = row.querySelector('input');
  input.focus();
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value;
      row.innerHTML = termPrompt() + '<span class="out">' + escapeHTML(val) + '</span>';
      if (val.trim()) { termHistory.unshift(val); termHistIdx = -1; }
      const out = runCmd(val);
      if (out !== null) {
        out.forEach(l => termBody.appendChild(termMakeLine(l)));
        addInputRow();
      }
      termBody.scrollTop = termBody.scrollHeight;
    } else if (e.key === 'ArrowUp') {
      if (termHistory.length && termHistIdx < termHistory.length - 1) {
        termHistIdx++; input.value = termHistory[termHistIdx];
        setTimeout(() => input.setSelectionRange(input.value.length, input.value.length), 0);
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (termHistIdx > 0) { termHistIdx--; input.value = termHistory[termHistIdx]; }
      else { termHistIdx = -1; input.value = ''; }
      e.preventDefault();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const val = input.value.toLowerCase();
      const matches = Object.keys(COMMANDS).filter(c => c.startsWith(val));
      if (matches.length === 1) input.value = matches[0];
    }
  });
}

function initTerminal() {
  const term = document.getElementById('terminal');
  if (!term) return;
  term.addEventListener('click', () => {
    const i = document.getElementById('term-input');
    if (i) i.focus();
  });
  setTimeout(bootTerminal, 700);
}

/* ============================================================
   KONAMI / MATRIX EASTER EGG
   ============================================================ */
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiPos = 0;
function initKonami() {
  document.addEventListener('keydown', (e) => {
    const expected = KONAMI[konamiPos];
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === expected) {
      konamiPos++;
      if (konamiPos === KONAMI.length) {
        konamiPos = 0;
        runMatrix();
      }
    } else {
      konamiPos = (key === KONAMI[0]) ? 1 : 0;
    }
    if (e.key === 'Escape') stopMatrix();
  });
}

let matrixRAF;
function runMatrix() {
  let overlay = document.getElementById('matrix');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'matrix';
    overlay.className = 'matrix-overlay';
    overlay.innerHTML = '<canvas id="matrix-canvas"></canvas><div class="matrix-hint">click anywhere or press ESC to exit · welcome, hacker.</div>';
    document.body.appendChild(overlay);
  }
  overlay.style.display = 'block';
  showToast('cheat code accepted — welcome.');
  const c = document.getElementById('matrix-canvas');
  const ctx = c.getContext('2d');
  function resize() { c.width = innerWidth; c.height = innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const fontSize = 16;
  const cols = Math.floor(c.width / fontSize);
  const drops = Array(cols).fill(1);
  function draw() {
    ctx.fillStyle = 'rgba(10,14,20,0.08)';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#6FE5A0';
    ctx.font = fontSize + 'px JetBrains Mono';
    for (let i = 0; i < drops.length; i++) {
      const text = chars.charAt(Math.floor(Math.random() * chars.length));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > c.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    matrixRAF = requestAnimationFrame(draw);
  }
  draw();
  overlay.addEventListener('click', stopMatrix, { once: true });
}
function stopMatrix() {
  cancelAnimationFrame(matrixRAF);
  const ov = document.getElementById('matrix');
  if (ov) ov.style.display = 'none';
}

/* ============================================================
   GLOBAL KEYBOARD SHORTCUTS
   ============================================================ */
function initShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Don't hijack when user is typing in an input
    const inField = document.activeElement && (
      document.activeElement.tagName === 'INPUT' ||
      document.activeElement.tagName === 'TEXTAREA'
    );
    if (e.key === '`' || e.key === '~') {
      const i = document.getElementById('term-input');
      if (i && document.activeElement !== i) {
        e.preventDefault();
        i.focus();
        const term = document.querySelector('.terminal');
        if (term) term.scrollIntoView({behavior:'smooth', block:'center'});
        showToast('terminal focused');
      }
    }
    // 't' to toggle theme (only outside fields)
    if (!inField && (e.key === 't' || e.key === 'T') && !e.metaKey && !e.ctrlKey && !e.altKey) {
      toggleTheme();
    }
  });
}

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  updateClock(); setInterval(updateClock, 1000);
  initMobileNav();
  initReveal();
  initTerminal();
  initKonami();
  initShortcuts();
  // wire up theme toggle button
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });
});
