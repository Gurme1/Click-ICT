/**
 * ClickICT — Professional UI Components
 * ─────────────────────────────────────
 * 1. Dark Mode 2.0  (system-aware + high-contrast)
 * 2. Accordion Containers
 * 3. Micro-interactions (Pro-Tip tooltips, step-complete animations, card ripple)
 * 4. Interactive Code Playground (Monaco Editor with textarea fallback)
 */

/* ══════════════════════════════════════════
   1. DARK MODE 2.0
══════════════════════════════════════════ */
const ThemeManager = (() => {
  const STORAGE_KEY = 'clickict_theme';
  const themes = [
    { id: 'auto',          label: '🌗 Auto (System)',    icon: '🌗' },
    { id: 'light',         label: '☀️ Light Mode',       icon: '☀️' },
    { id: 'dark',          label: '🌙 Dark Mode',        icon: '🌙' },
    { id: 'high-contrast', label: '⬛ High Contrast',    icon: '⬛' },
  ];

  let panelOpen = false;

  function applyTheme(themeId) {
    const root = document.documentElement;
    if (themeId === 'auto') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', themeId);
    }
    localStorage.setItem(STORAGE_KEY, themeId);
    updateToggleBtn(themeId);
    updateActiveOption(themeId);
  }

  function getCurrentTheme() {
    return localStorage.getItem(STORAGE_KEY) || 'auto';
  }

  function getThemeIcon(themeId) {
    const t = themes.find(t => t.id === themeId);
    return t ? t.icon : '🌗';
  }

  function updateToggleBtn(themeId) {
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) btn.innerHTML = `${getThemeIcon(themeId)} <span>Theme</span>`;
  }

  function updateActiveOption(themeId) {
    document.querySelectorAll('.theme-option').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.theme === themeId);
    });
  }

  function buildUI() {
    // Toggle button
    const btn = document.createElement('button');
    btn.id = 'theme-toggle-btn';
    btn.className = 'theme-toggle-btn';
    btn.setAttribute('aria-label', 'Toggle theme');
    btn.setAttribute('aria-expanded', 'false');
    document.body.appendChild(btn);

    // Panel
    const panel = document.createElement('div');
    panel.id = 'theme-panel';
    panel.className = 'theme-panel';
    panel.setAttribute('role', 'menu');
    panel.setAttribute('aria-label', 'Theme options');

    themes.forEach(t => {
      const opt = document.createElement('button');
      opt.className = 'theme-option';
      opt.dataset.theme = t.id;
      opt.textContent = t.label;
      opt.setAttribute('role', 'menuitem');
      opt.addEventListener('click', () => {
        applyTheme(t.id);
        closePanel();
      });
      panel.appendChild(opt);
    });

    document.body.appendChild(panel);

    // Toggle panel
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      panelOpen = !panelOpen;
      panel.classList.toggle('open', panelOpen);
      btn.setAttribute('aria-expanded', panelOpen);
    });

    // Close on outside click
    document.addEventListener('click', () => closePanel());
    panel.addEventListener('click', e => e.stopPropagation());
  }

  function closePanel() {
    panelOpen = false;
    const panel = document.getElementById('theme-panel');
    const btn   = document.getElementById('theme-toggle-btn');
    if (panel) panel.classList.remove('open');
    if (btn)   btn.setAttribute('aria-expanded', 'false');
  }

  function init() {
    buildUI();
    const saved = getCurrentTheme();
    applyTheme(saved);

    // Watch system preference changes
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', () => {
      if (getCurrentTheme() === 'auto') applyTheme('auto');
    });
  }

  return { init, applyTheme };
})();


/* ══════════════════════════════════════════
   2. ACCORDION CONTAINERS
══════════════════════════════════════════ */
const AccordionManager = (() => {
  function initAll() {
    document.querySelectorAll('.accordion-header').forEach(header => {
      // Avoid double-init
      if (header.dataset.accordionInit) return;
      header.dataset.accordionInit = '1';

      const body = header.nextElementSibling;
      if (!body || !body.classList.contains('accordion-body')) return;

      // Add chevron icon if not present
      if (!header.querySelector('.accordion-icon')) {
        const icon = document.createElement('span');
        icon.className = 'accordion-icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = '▾';
        header.appendChild(icon);
      }

      header.setAttribute('role', 'button');
      header.setAttribute('tabindex', '0');
      header.setAttribute('aria-expanded', 'false');

      const toggle = () => {
        const isOpen = body.classList.contains('open');

        // Close all siblings in same group
        const group = header.closest('.accordion-group');
        if (group) {
          group.querySelectorAll('.accordion-body.open').forEach(b => {
            b.classList.remove('open');
            b.previousElementSibling.classList.remove('open');
            b.previousElementSibling.setAttribute('aria-expanded', 'false');
          });
        }

        if (!isOpen) {
          body.classList.add('open');
          header.classList.add('open');
          header.setAttribute('aria-expanded', 'true');
        }
      };

      header.addEventListener('click', toggle);
      header.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });
    });
  }

  /**
   * Programmatically create an accordion section and inject it into a container.
   * @param {HTMLElement} container
   * @param {Array<{title, badge, content, icon, open}>} items
   */
  function create(container, items) {
    const group = document.createElement('div');
    group.className = 'accordion-group';

    items.forEach((item, i) => {
      const acc = document.createElement('div');
      acc.className = 'accordion';

      const header = document.createElement('div');
      header.className = 'accordion-header' + (item.open ? ' open' : '');

      const title = document.createElement('div');
      title.className = 'accordion-title';
      title.innerHTML = `${item.icon || '📌'} ${item.title}`;

      if (item.badge) {
        const badge = document.createElement('span');
        badge.className = 'accordion-badge';
        badge.textContent = item.badge;
        title.appendChild(badge);
      }

      const icon = document.createElement('span');
      icon.className = 'accordion-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = '▾';

      header.appendChild(title);
      header.appendChild(icon);

      const body = document.createElement('div');
      body.className = 'accordion-body' + (item.open ? ' open' : '');

      const inner = document.createElement('div');
      inner.className = 'accordion-body-inner';
      inner.innerHTML = item.content;

      body.appendChild(inner);
      acc.appendChild(header);
      acc.appendChild(body);
      group.appendChild(acc);
    });

    container.appendChild(group);
    initAll();
  }

  return { initAll, create };
})();


/* ══════════════════════════════════════════
   3. MICRO-INTERACTIONS
══════════════════════════════════════════ */
const MicroInteractions = (() => {

  /** Card mouse-tracking radial highlight */
  function initCardRipple() {
    document.querySelectorAll('.feature-card, .post-card, .content-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
        const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
        card.style.setProperty('--mx', x);
        card.style.setProperty('--my', y);
      });
    });
  }

  /** Step-complete toggle */
  function initStepItems() {
    document.querySelectorAll('.step-item').forEach(step => {
      if (step.dataset.stepInit) return;
      step.dataset.stepInit = '1';

      step.addEventListener('click', () => {
        if (step.classList.contains('completed')) {
          step.classList.remove('completed');
          const check = step.querySelector('.step-check');
          if (check) check.textContent = '';
        } else {
          step.classList.add('completing');
          setTimeout(() => {
            step.classList.remove('completing');
            step.classList.add('completed');
            const check = step.querySelector('.step-check');
            if (check) check.textContent = '✓';
          }, 400);
        }
      });
    });
  }

  /** Pro-Tip tooltip — auto-build from data-tip attribute */
  function initProTips() {
    document.querySelectorAll('[data-tip]').forEach(el => {
      if (el.dataset.tipInit) return;
      el.dataset.tipInit = '1';

      el.classList.add('pro-tip');

      // Wrap text in span if not already structured
      if (!el.querySelector('.pro-tip-icon')) {
        const icon = document.createElement('span');
        icon.className = 'pro-tip-icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = '!';
        el.insertBefore(icon, el.firstChild);
      }

      const bubble = document.createElement('span');
      bubble.className = 'pro-tip-bubble';
      bubble.setAttribute('role', 'tooltip');
      bubble.textContent = el.dataset.tip;
      el.appendChild(bubble);
    });
  }

  function init() {
    initCardRipple();
    initStepItems();
    initProTips();

    // Re-run on dynamic content
    const observer = new MutationObserver(() => {
      initCardRipple();
      initStepItems();
      initProTips();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  return { init, initStepItems, initProTips };
})();


/* ══════════════════════════════════════════
   4. CODE PLAYGROUND
══════════════════════════════════════════ */
const CodePlayground = (() => {

  const STARTER_CODE = {
    javascript: `// ClickICT — JavaScript Playground 🚀
// Barreessaa fi filadhu ▶ Run

function greet(name) {
  return "Baga nagaan dhufte, " + name + "! 👋";
}

console.log(greet("ClickICT"));
console.log("2 + 2 =", 2 + 2);

// Array example
const topics = ["Kompitara", "Bilbila", "AI", "Teeknoloojii"];
topics.forEach((t, i) => console.log(i + 1 + ". " + t));
`,
    html: `<!-- ClickICT — HTML Playground -->
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 20px; background: #f8fafc; }
    h1   { color: #2563eb; }
    .card { background: white; padding: 16px; border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-top: 12px; }
  </style>
</head>
<body>
  <h1>Baga nagaan dhufte! 👋</h1>
  <div class="card">
    <p>Kana barreessaa HTML keessatti hojjedha.</p>
  </div>
</body>
</html>`,
    python: `# ClickICT — Python Playground 🐍
# (Simulated output — runs in browser)

def greet(name):
    return f"Baga nagaan dhufte, {name}! 👋"

print(greet("ClickICT"))
print("2 + 2 =", 2 + 2)

topics = ["Kompitara", "Bilbila", "AI", "Teeknoloojii"]
for i, t in enumerate(topics, 1):
    print(f"{i}. {t}")
`,
  };

  let monacoEditor = null;
  let currentLang  = 'javascript';
  let monacoLoaded = false;

  /** Intercept console for output display */
  function captureConsole(outputEl) {
    const original = { log: console.log, error: console.error, warn: console.warn, info: console.info };

    function write(text, cls) {
      const line = document.createElement('span');
      line.className = 'output-line ' + (cls || '');
      line.textContent = text;
      outputEl.appendChild(line);
      outputEl.scrollTop = outputEl.scrollHeight;
    }

    console.log   = (...a) => { original.log(...a);   write(a.map(String).join(' ')); };
    console.error = (...a) => { original.error(...a); write('✖ ' + a.map(String).join(' '), 'output-error'); };
    console.warn  = (...a) => { original.warn(...a);  write('⚠ ' + a.map(String).join(' '), 'output-warn'); };
    console.info  = (...a) => { original.info(...a);  write('ℹ ' + a.map(String).join(' '), 'output-info'); };

    return () => Object.assign(console, original);
  }

  function runCode(code, lang, outputEl) {
    outputEl.innerHTML = '';

    if (lang === 'html') {
      // Open in new tab
      const win = window.open('', '_blank');
      if (win) {
        win.document.write(code);
        win.document.close();
        const line = document.createElement('span');
        line.className = 'output-line output-success';
        line.textContent = '✔ HTML preview opened in new tab.';
        outputEl.appendChild(line);
      } else {
        const line = document.createElement('span');
        line.className = 'output-line output-warn';
        line.textContent = '⚠ Pop-up blocked. Allow pop-ups to preview HTML.';
        outputEl.appendChild(line);
      }
      return;
    }

    if (lang === 'python') {
      // Simulated Python output
      const lines = code.split('\n');
      const restore = captureConsole(outputEl);
      lines.forEach(line => {
        const m = line.match(/^print\((.+)\)$/);
        if (m) {
          try {
            // Evaluate simple print expressions via JS
            const expr = m[1]
              .replace(/f"([^"]+)"/g, (_, s) => '`' + s.replace(/\{([^}]+)\}/g, '${$1}') + '`')
              .replace(/f'([^']+)'/g, (_, s) => '`' + s.replace(/\{([^}]+)\}/g, '${$1}') + '`');
            // eslint-disable-next-line no-new-func
            const result = new Function('return ' + expr)();
            console.log(result);
          } catch (e) {
            console.log(m[1].replace(/['"]/g, ''));
          }
        }
      });
      restore();
      return;
    }

    // JavaScript
    const restore = captureConsole(outputEl);
    try {
      // eslint-disable-next-line no-new-func
      new Function(code)();
      if (outputEl.children.length === 0) {
        const line = document.createElement('span');
        line.className = 'output-line output-success';
        line.textContent = '✔ Code ran successfully (no output).';
        outputEl.appendChild(line);
      }
    } catch (err) {
      const line = document.createElement('span');
      line.className = 'output-line output-error';
      line.textContent = '✖ ' + err.message;
      outputEl.appendChild(line);
    } finally {
      restore();
    }
  }

  function getCode() {
    if (monacoEditor) return monacoEditor.getValue();
    const ta = document.getElementById('playground-textarea');
    return ta ? ta.value : '';
  }

  function setCode(code) {
    if (monacoEditor) {
      monacoEditor.setValue(code);
    } else {
      const ta = document.getElementById('playground-textarea');
      if (ta) ta.value = code;
    }
  }

  function loadMonaco(callback) {
    if (monacoLoaded) { callback(); return; }

    // Load Monaco from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js';
    script.onload = () => {
      window.require.config({
        paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' }
      });
      window.require(['vs/editor/editor.main'], () => {
        monacoLoaded = true;
        callback();
      });
    };
    script.onerror = () => {
      // Monaco failed to load — fallback textarea already shown
      console.warn('Monaco Editor CDN unavailable. Using fallback editor.');
    };
    document.head.appendChild(script);
  }

  function initMonaco(hostEl, lang) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
      (document.documentElement.getAttribute('data-theme') !== 'light' &&
       window.matchMedia('(prefers-color-scheme: dark)').matches);

    monacoEditor = window.monaco.editor.create(hostEl, {
      value: STARTER_CODE[lang] || STARTER_CODE.javascript,
      language: lang === 'python' ? 'python' : lang,
      theme: isDark ? 'vs-dark' : 'vs-dark', // always dark for code editor
      fontSize: 14,
      lineHeight: 22,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      automaticLayout: true,
      fontFamily: "'Cascadia Code', 'Fira Code', Consolas, monospace",
      fontLigatures: true,
      padding: { top: 12, bottom: 12 },
      renderLineHighlight: 'gutter',
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
    });

    // Hide fallback textarea
    const ta = document.getElementById('playground-textarea');
    if (ta) ta.style.display = 'none';
  }

  function buildPlayground(container) {
    container.innerHTML = `
      <div class="playground-wrapper">
        <div class="playground-header">
          <h2>🧪 Code Playground</h2>
          <div class="playground-controls">
            <select class="playground-lang-select" id="playground-lang" aria-label="Select language">
              <option value="javascript">JavaScript</option>
              <option value="html">HTML</option>
              <option value="python">Python (simulated)</option>
            </select>
            <button class="playground-reset-btn" id="playground-reset" aria-label="Reset code">↺ Reset</button>
            <button class="playground-run-btn"   id="playground-run"   aria-label="Run code">▶ Run</button>
          </div>
        </div>
        <div class="playground-container">
          <div class="playground-tabs">
            <button class="playground-tab active" data-tab="editor">Editor</button>
            <button class="playground-tab"        data-tab="output">Output</button>
          </div>
          <div class="playground-editor-wrap" id="playground-editor-wrap">
            <div id="monaco-editor-host"></div>
            <textarea
              id="playground-textarea"
              class="playground-textarea"
              spellcheck="false"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              aria-label="Code editor"
            >${STARTER_CODE.javascript}</textarea>
          </div>
          <div class="playground-output-wrap" id="playground-output-wrap" style="display:none;">
            <div class="playground-output-header">
              <span class="playground-output-label">
                <span class="playground-output-dot"></span> Output
              </span>
              <button class="playground-clear-btn" id="playground-clear">Clear</button>
            </div>
            <div id="playground-output" aria-live="polite" aria-label="Code output"></div>
          </div>
        </div>
        <p style="margin-top:0.75rem; font-size:0.8rem; color:var(--text-muted); text-align:center;">
          💡 JavaScript runs in your browser. HTML opens a preview tab. Python output is simulated.
        </p>
      </div>`;

    const runBtn    = container.querySelector('#playground-run');
    const resetBtn  = container.querySelector('#playground-reset');
    const clearBtn  = container.querySelector('#playground-clear');
    const langSel   = container.querySelector('#playground-lang');
    const outputEl  = container.querySelector('#playground-output');
    const tabs      = container.querySelectorAll('.playground-tab');
    const editorWrap = container.querySelector('#playground-editor-wrap');
    const outputWrap = container.querySelector('#playground-output-wrap');

    // Tab switching
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        if (tab.dataset.tab === 'editor') {
          editorWrap.style.display = '';
          outputWrap.style.display = 'none';
        } else {
          editorWrap.style.display = 'none';
          outputWrap.style.display = '';
        }
      });
    });

    // Language change
    langSel.addEventListener('change', () => {
      currentLang = langSel.value;
      setCode(STARTER_CODE[currentLang] || '');
      if (monacoEditor && window.monaco) {
        const model = monacoEditor.getModel();
        window.monaco.editor.setModelLanguage(model, currentLang === 'python' ? 'python' : currentLang);
      }
    });

    // Run
    runBtn.addEventListener('click', () => {
      runBtn.classList.add('running');
      runBtn.textContent = 'Running…';

      // Switch to output tab
      tabs.forEach(t => t.classList.remove('active'));
      container.querySelector('[data-tab="output"]').classList.add('active');
      editorWrap.style.display = 'none';
      outputWrap.style.display = '';

      setTimeout(() => {
        runCode(getCode(), currentLang, outputEl);
        runBtn.classList.remove('running');
        runBtn.innerHTML = '▶ Run';
      }, 300);
    });

    // Reset
    resetBtn.addEventListener('click', () => {
      setCode(STARTER_CODE[currentLang] || '');
      outputEl.innerHTML = '';
    });

    // Clear output
    clearBtn.addEventListener('click', () => { outputEl.innerHTML = ''; });

    // Try loading Monaco
    const monacoHost = container.querySelector('#monaco-editor-host');
    loadMonaco(() => {
      if (window.monaco && monacoHost) {
        initMonaco(monacoHost, currentLang);
      }
    });
  }

  function init() {
    const containers = document.querySelectorAll('[data-playground]');
    containers.forEach(c => buildPlayground(c));
  }

  return { init, buildPlayground };
})();


/* ══════════════════════════════════════════
   BOOTSTRAP ALL COMPONENTS
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  AccordionManager.initAll();
  MicroInteractions.init();
  CodePlayground.init();
});
