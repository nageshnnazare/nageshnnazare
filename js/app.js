/**
 * VS Code-style profile showcase
 */
(function () {
  'use strict';

  const P = window.PROFILE;
  const Icons = window.FileIcons;

  let editor = null;
  let openTabs = ['about.md'];
  let activeTab = 'about.md';
  let typingAbort = null;
  let splitsInitialized = false;
  let activeView = 'explorer';
  let typedFiles = new Set();
  let typedMdFiles = new Set();
  let aiScriptStarted = false;
  let mdViewMode = 'preview'; // 'preview' | 'source'

  const layoutState = {
    activity: true,
    sidebar: true,
    panel: true,
    ai: true,
  };

  /** Flat file paths in explorer tree order */
  function flattenFileTree(nodes, out = []) {
    nodes.forEach((node) => {
      if (node.children) flattenFileTree(node.children, out);
      else if (node.path) out.push(node.path);
    });
    return out;
  }

  const FILE_TREE_ORDER = flattenFileTree(P.fileTree);

  const LAYOUT_ICON_ON = {
    sidebar: 'codicon-layout-sidebar-left',
    panel: 'codicon-layout-panel',
    ai: 'codicon-layout-sidebar-right',
    activity: 'codicon-layout-activitybar-left',
  };

  const LAYOUT_ICON_OFF = {
    sidebar: 'codicon-layout-sidebar-left-off',
    panel: 'codicon-layout-panel-off',
    ai: 'codicon-layout-sidebar-right-off',
    activity: 'codicon-layout-activitybar-left',
  };

  const LANG_MAP = {
    markdown: 'markdown',
    json: 'json',
    toml: 'ini',
    cpp: 'cpp',
    shell: 'shell',
    plaintext: 'plaintext',
  };

  const isMarkdown = (path) => path.endsWith('.md');

  function shouldTypeEffect(path, options = {}) {
    if (isMarkdown(path)) return false;
    if (options.noType || options.skipType) return false;
    if (typedFiles.has(path) && !options.forceType) return false;
    return true;
  }

  function shouldTypeMarkdown(path, options = {}) {
    if (!isMarkdown(path)) return false;
    if (mdViewMode !== 'preview') return false;
    if (options.noType || options.skipType) return false;
    if (typedMdFiles.has(path)) return false;
    return true;
  }

  function updateLayoutIcons() {
    Object.keys(LAYOUT_ICON_ON).forEach((key) => {
      const icon = document.querySelector(`.layout-btn[data-layout="${key}"] .layout-icon`);
      if (!icon) return;
      const on = layoutState[key];
      icon.className = `codicon layout-icon ${on ? LAYOUT_ICON_ON[key] : LAYOUT_ICON_OFF[key]}`;
    });
  }

  function applyLayoutClasses() {
    document.body.classList.toggle('layout-off-activity', !layoutState.activity);
    document.body.classList.toggle('layout-off-sidebar', !layoutState.sidebar);
    document.body.classList.toggle('layout-off-panel', !layoutState.panel);
    document.body.classList.toggle('layout-off-ai', !layoutState.ai);

    document.querySelectorAll('.layout-btn[data-layout]').forEach((btn) => {
      const key = btn.dataset.layout;
      const on = layoutState[key];
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    updateLayoutIcons();
    setTimeout(() => editor?.layout(), 80);
  }

  function toggleLayout(key) {
    if (!(key in layoutState)) return;
    layoutState[key] = !layoutState[key];

    if (key === 'sidebar' && layoutState.sidebar) {
      setActivityView(activeView === 'agent' ? 'explorer' : activeView);
    }
    if (key === 'ai' && layoutState.ai) {
      document.getElementById('ai-panel')?.classList.remove('compact-hidden');
    }

    applyLayoutClasses();
  }

  function initLayoutControls() {
    document.querySelectorAll('.layout-btn[data-layout]').forEach((btn) => {
      btn.addEventListener('click', () => toggleLayout(btn.dataset.layout));
    });

    document.addEventListener('keydown', (e) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      if (e.key === 'b') {
        e.preventDefault();
        toggleLayout('sidebar');
      }
      if (e.key === 'j') {
        e.preventDefault();
        toggleLayout('panel');
      }
    });

    applyLayoutClasses();
  }

  function fileIconHtml(path, isFolder, folderOpen) {
    return Icons.html(path, isFolder, folderOpen);
  }

  if (typeof marked !== 'undefined') {
    marked.setOptions({ gfm: true, breaks: false });
  }

  /* ─── Welcome ─── */
  function runWelcome() {
    const overlay = document.getElementById('welcome');
    const bar = document.getElementById('welcome-bar');
    let p = 0;
    const iv = setInterval(() => {
      p += 4;
      bar.style.width = `${Math.min(p, 100)}%`;
      if (p >= 100) {
        clearInterval(iv);
        setTimeout(() => overlay.classList.add('hidden'), 400);
      }
    }, 60);
  }

  /* ─── File tree ─── */
  function renderTree(nodes, depth = 0) {
    return nodes
      .map((node) => {
        const indent = depth * 12 + 8;
        if (node.children) {
          return `
            <div class="tree-folder" data-folder="${node.name}">
              <div class="tree-item" style="padding-left:${indent}px" data-action="toggle">
                <span class="tree-chevron">▼</span>
                ${fileIconHtml(node.name, true)}
                <span class="tree-label">${node.name}</span>
              </div>
              <div class="tree-children">${renderTree(node.children, depth + 1)}</div>
            </div>`;
        }
        const active = activeTab === node.path ? ' active' : '';
        return `
          <div class="tree-item${active}" style="padding-left:${indent + 16}px" data-path="${node.path}">
            ${fileIconHtml(node.path)}
            <span class="tree-label">${node.name}</span>
          </div>`;
      })
      .join('');
  }

  function bindTree() {
    const tree = document.getElementById('file-tree');
    tree.innerHTML = renderTree(P.fileTree);

    tree.querySelectorAll('[data-path]').forEach((el) => {
      el.addEventListener('click', () => openFile(el.dataset.path));
    });

    tree.querySelectorAll('[data-action="toggle"]').forEach((el) => {
      el.addEventListener('click', (e) => {
        const folder = el.closest('.tree-folder');
        const children = folder.querySelector('.tree-children');
        const chev = el.querySelector('.tree-chevron');
        const open = children.classList.toggle('collapsed');
        chev.classList.toggle('collapsed');
        const iconSpan = el.querySelector('.file-icon');
        if (iconSpan) {
          iconSpan.outerHTML = fileIconHtml(folder.dataset.folder, true, !open);
        }
        e.stopPropagation();
      });
    });
  }

  /* ─── Tabs ─── */
  function renderTabs() {
    const bar = document.getElementById('tab-bar');
    bar.innerHTML = openTabs
      .map((path) => {
        const name = path.split('/').pop();
        const active = path === activeTab ? ' active' : '';
        return `
          <div class="tab${active}" data-path="${path}">
            ${fileIconHtml(path)}
            <span class="tab-name">${name}</span>
            <button class="tab-close" data-close="${path}" type="button" aria-label="Close">×</button>
          </div>`;
      })
      .join('');

    bar.querySelectorAll('.tab').forEach((tab) => {
      tab.addEventListener('click', (e) => {
        if (e.target.closest('.tab-close')) return;
        openFile(tab.dataset.path, { noType: true });
      });
    });

    bar.querySelectorAll('.tab-close').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeTab(btn.dataset.close);
      });
    });
  }

  function closeTab(path) {
    const idx = openTabs.indexOf(path);
    if (idx === -1) return;
    openTabs.splice(idx, 1);
    if (activeTab === path) {
      activeTab = openTabs[Math.max(0, idx - 1)] || 'about.md';
      if (!openTabs.includes(activeTab)) openTabs.push(activeTab);
      showEditorContent(activeTab);
    }
    if (openTabs.length === 0) {
      openTabs = ['about.md'];
      activeTab = 'about.md';
      showEditorContent('about.md');
    }
    renderTabs();
    bindTree();
  }

  /* ─── Markdown preview ─── */
  function renderMarkdownPreview(content) {
    const el = document.getElementById('markdown-preview');
    if (typeof marked !== 'undefined') {
      el.innerHTML = marked.parse(content);
    } else {
      el.innerHTML = `<pre>${escapeHtml(content)}</pre>`;
    }
    el.querySelectorAll('a[href]').forEach((a) => {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    });
  }

  function updateMdViewTabs() {
    document.querySelectorAll('.md-view-tab').forEach((btn) => {
      const on = btn.dataset.mdView === mdViewMode;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }

  function setMarkdownView(mode) {
    if (mode !== 'preview' && mode !== 'source') return;
    mdViewMode = mode;
    updateMdViewTabs();
    if (isMarkdown(activeTab)) {
      cancelTyping();
      applyMarkdownView(activeTab, { noType: mode === 'source' });
    }
  }

  function applyMarkdownView(path, options = {}) {
    const file = P.files[path];
    if (!file || !isMarkdown(path)) return;

    const preview = document.getElementById('markdown-preview');
    const monacoEl = document.getElementById('monaco-editor');
    const toolbar = document.getElementById('editor-toolbar');

    toolbar.classList.add('visible');

    if (editor) {
      editor.updateOptions({ readOnly: true });
      monaco.editor.setModelLanguage(editor.getModel(), 'markdown');
      editor.setValue(file.content);
    }

    if (mdViewMode === 'preview') {
      preview.classList.remove('hidden');
      monacoEl.classList.add('hidden');
      document.getElementById('status-lang').textContent = 'Markdown Preview';

      if (shouldTypeMarkdown(path, options)) {
        typeMarkdownPreview(path, file.content, file.typeDelay || 14);
      } else {
        preview.classList.remove('is-typing');
        renderMarkdownPreview(file.content);
        updateCursorStatus(true);
      }
    } else {
      preview.classList.add('hidden');
      preview.classList.remove('is-typing');
      monacoEl.classList.remove('hidden');
      document.getElementById('status-lang').textContent = 'Markdown';
      setTimeout(() => {
        editor?.layout();
        updateCursorStatus();
      }, 50);
    }
  }

  function typeMarkdownPreview(path, text, delay) {
    cancelTyping();
    const state = { cancelled: false };
    typingAbort = state;
    typedMdFiles.add(path);

    const preview = document.getElementById('markdown-preview');
    preview.classList.add('is-typing');
    document.getElementById('status-cursor').textContent = 'Typing…';

    let i = 0;
    if (editor) editor.setValue('');

    function tick() {
      if (state.cancelled) return;
      const chunk = Math.min(4, text.length - i);
      i += chunk;
      const slice = text.slice(0, i);
      renderMarkdownPreview(slice);
      if (editor) {
        editor.setValue(slice);
        editor.revealLine(editor.getModel().getLineCount());
      }
      preview.scrollTop = preview.scrollHeight;

      if (i < text.length) {
        setTimeout(tick, delay + Math.random() * 6);
      } else {
        typingAbort = null;
        preview.classList.remove('is-typing');
        updateCursorStatus(true);
      }
    }
    tick();
  }

  function setEditorMode(path) {
    const md = isMarkdown(path);
    const preview = document.getElementById('markdown-preview');
    const monacoEl = document.getElementById('monaco-editor');
    const toolbar = document.getElementById('editor-toolbar');

    if (md) {
      applyMarkdownView(path);
    } else {
      preview.classList.add('hidden');
      monacoEl.classList.remove('hidden');
      toolbar.classList.remove('visible');
      const lang = getLang(path);
      document.getElementById('status-lang').textContent =
        lang.charAt(0).toUpperCase() + lang.slice(1);
    }
    setTimeout(() => editor?.layout(), 50);
  }

  function initMarkdownViewTabs() {
    document.querySelectorAll('.md-view-tab').forEach((btn) => {
      btn.addEventListener('click', () => setMarkdownView(btn.dataset.mdView));
    });

    document.addEventListener('keydown', (e) => {
      if (!isMarkdown(activeTab)) return;
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        setMarkdownView('preview');
      }
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.altKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        setMarkdownView('source');
      }
    });
  }

  function getLang(path) {
    const f = P.files[path];
    return LANG_MAP[f?.lang] || 'plaintext';
  }

  function showEditorContent(path, options = {}) {
    const file = P.files[path];
    if (!file) return;

    cancelTyping();
    const full = file.content;

    document.getElementById('bc-file').textContent = path;
    setEditorMode(path);

    if (isMarkdown(path)) {
      applyMarkdownView(path, options);
      return;
    }

    if (!editor) return;

    const lang = getLang(path);
    editor.updateOptions({ readOnly: false });
    monaco.editor.setModelLanguage(editor.getModel(), lang);

    if (shouldTypeEffect(path, options)) {
      editor.setValue('');
      typedFiles.add(path);
      typeIntoEditor(full, file.typeDelay || 14, () => {
        editor.updateOptions({ readOnly: true });
        updateCursorStatus();
      });
    } else {
      editor.setValue(full);
      editor.updateOptions({ readOnly: true });
      updateCursorStatus();
    }
  }

  function cancelTyping() {
    if (typingAbort) {
      typingAbort.cancelled = true;
      typingAbort = null;
    }
  }

  function typeIntoEditor(text, delay, onDone) {
    const state = { cancelled: false };
    typingAbort = state;
    let i = 0;
    const model = editor.getModel();

    function tick() {
      if (state.cancelled) return;
      const chunk = Math.min(3, text.length - i);
      i += chunk;
      model.setValue(text.slice(0, i));
      editor.revealLine(model.getLineCount());
      updateCursorStatus();
      if (i < text.length) {
        setTimeout(tick, delay + Math.random() * 8);
      } else {
        typingAbort = null;
        onDone?.();
      }
    }
    tick();
  }

  function updateCursorStatus(preview) {
    const el = document.getElementById('status-cursor');
    const prev = document.getElementById('markdown-preview');
    if (prev?.classList.contains('is-typing')) {
      el.textContent = 'Typing…';
      return;
    }
    if (preview || (isMarkdown(activeTab) && mdViewMode === 'preview')) {
      el.textContent = 'Preview';
      return;
    }
    if (!editor) return;
    const pos = editor.getPosition();
    if (pos) el.textContent = `Ln ${pos.lineNumber}, Col ${pos.column}`;
  }

  function openFile(path, options = {}) {
    if (!P.files[path]) return;
    if (!openTabs.includes(path)) {
      openTabs.push(path);
      sortTabsByTreeOrder();
    }
    activeTab = path;
    renderTabs();
    bindTree();
    showEditorContent(path, options);

    if (activeView === 'search') setActivityView('explorer');
  }

  function sortTabsByTreeOrder() {
    openTabs.sort((a, b) => {
      const ia = FILE_TREE_ORDER.indexOf(a);
      const ib = FILE_TREE_ORDER.indexOf(b);
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    });
  }

  /* ─── Monaco ─── */
  function initMonaco() {
    require(['vs/editor/editor.main'], () => {
      monaco.editor.defineTheme('profileDark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '6A9955' },
          { token: 'keyword', foreground: '569CD6' },
          { token: 'string', foreground: 'CE9178' },
          { token: 'number', foreground: 'B5CEA8' },
        ],
        colors: {
          'editor.background': '#1e1e1e',
          'editor.lineHighlightBackground': '#2a2d2e',
          'editorLineNumber.foreground': '#858585',
          'editor.selectionBackground': '#264f78',
        },
      });

      editor = monaco.editor.create(document.getElementById('monaco-editor'), {
        value: '',
        language: 'markdown',
        theme: 'profileDark',
        fontFamily: "'JetBrains Mono', Consolas, monospace",
        fontSize: 14,
        lineHeight: 22,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        readOnly: true,
        automaticLayout: true,
        padding: { top: 12 },
        renderLineHighlight: 'all',
        smoothScrolling: true,
        wordWrap: 'on',
      });

      editor.onDidChangeCursorPosition(() => updateCursorStatus());
      openFile('about.md');
    });
  }

  /* ─── Splits ─── */
  function initSplits() {
    if (splitsInitialized || typeof Split === 'undefined') return;
    splitsInitialized = true;

    const centerCol = document.getElementById('center-column');
    const bottomPanel = document.getElementById('bottom-panel');
    const editorWrap = bottomPanel.previousElementSibling;

    Split(['#sidebar', '#split-center-ai'], {
      sizes: [18, 82],
      minSize: [160, 360],
      gutterSize: 5,
      cursor: 'col-resize',
      onDragEnd: () => editor?.layout(),
    });

    Split([centerCol, '#ai-panel'], {
      sizes: [68, 32],
      minSize: [300, 220],
      gutterSize: 5,
      cursor: 'col-resize',
      onDragEnd: () => editor?.layout(),
    });

    Split([editorWrap, '#bottom-panel'], {
      direction: 'vertical',
      sizes: [70, 30],
      minSize: [180, 90],
      gutterSize: 5,
      cursor: 'row-resize',
      onDragEnd: () => editor?.layout(),
    });
  }

  /* ─── Interactive terminal ─── */
  const TERM_COMMANDS = {
    help: {
      desc: 'Show available commands',
      run: () => `Available commands:

  help              Show this message
  clear             Clear the terminal
  ls                List workspace files
  cat <file>        Print file contents (raw)
  open <file>       Open file in editor / preview
  whoami            Print current user
  pwd               Print working directory
  git log           Show recent commits
  benchmark         Run performance benchmark
  gcc --version     Show compiler version
  uname -a          Show system info
  echo <text>       Print text

Press Tab to autocomplete commands and file paths.`,
    },
    clear: { desc: 'Clear terminal', run: () => ({ clear: true }) },
    whoami: { desc: 'Print user', run: () => 'nagesh@jarvis' },
    pwd: { desc: 'Print directory', run: () => '/home/nagesh/profile.workspace' },
    ls: {
      desc: 'List files',
      run: () => Object.keys(P.files).sort().join('\n'),
    },
    'git log': {
      desc: 'Recent commits',
      run: () =>
        'a3f91c2 perf: attribute system — 7%+ across 21 designs\n' +
        '8b2e104 fix: timer update MT scaling on 16-core\n' +
        'c1d0a88 feat: fusion compiler non-physical flow',
    },
    'git log --oneline -3': {
      desc: 'Recent commits (oneline)',
      run: () =>
        'a3f91c2 perf: attribute system — 7%+ across 21 designs\n' +
        '8b2e104 fix: timer update MT scaling on 16-core\n' +
        'c1d0a88 feat: fusion compiler non-physical flow',
    },
    'gcc --version': { desc: 'Compiler version', run: () => 'gcc (GCC) 13.2.0' },
    'gcc --version | head -1': { desc: 'Compiler version', run: () => 'gcc (GCC) 13.2.0' },
    'uname -a': {
      desc: 'System info',
      run: () => 'Linux eda-build 6.8.0 #1 SMP x86_64 GNU/Linux',
    },
    benchmark: {
      desc: 'Run benchmark',
      run: () => {
        const lines = ['=== Timer Update Benchmark ===', 'Designs: 21 | Cores: 16', ''];
        for (let i = 1; i <= 5; i++) {
          lines.push(`design_${String(i).padStart(2, '0')}: ${(7 + (i % 9)).toFixed(2)}% baseline improvement`);
        }
        lines.push('…', '', 'Aggregate: 6.5%+ (16-core), motivating designs 25-30%');
        return lines.join('\n');
      },
    },
    './benchmark.sh': { desc: 'Run benchmark script', run: () => TERM_COMMANDS.benchmark.run() },
    './benchmark.sh 2>/dev/null | tail -3': {
      desc: 'Benchmark tail',
      run: () =>
        'design_20: 12.00% baseline improvement\n\nAggregate: 6.5%+ (16-core), motivating designs 25-30%',
    },
    'cat about.md | head -3': {
      desc: 'Preview about file',
      run: () => '# About\n\n> R&D Software Engineer · 7+ years · Bengaluru',
    },
  };

  function initTerminal() {
    const output = document.getElementById('terminal-output');
    const input = document.getElementById('terminal-input');
    const ghost = document.getElementById('term-ghost');
    const suggestList = document.getElementById('term-suggestions');

    const COMMAND_NAMES = Object.keys(TERM_COMMANDS).sort((a, b) => b.length - a.length);
    const FILE_PATHS = Object.keys(P.files).sort();
    let tabCycleIdx = -1;
    let tabCycleBase = '';

    function getCompletions(line) {
      const trimmed = line.trimStart();
      if (!trimmed) return COMMAND_NAMES;

      const spaceIdx = trimmed.indexOf(' ');
      if (spaceIdx === -1) {
        return sortMatches(COMMAND_NAMES.filter((c) => c.startsWith(trimmed)));
      }

      const cmd = trimmed.slice(0, spaceIdx);
      const arg = trimmed.slice(spaceIdx + 1);

      if (cmd === 'cat' || cmd === 'open') {
        return sortMatches(
          FILE_PATHS.filter((f) => f.startsWith(arg)).map((f) => `${cmd} ${f}`)
        );
      }

      const full = COMMAND_NAMES.filter((c) => c.startsWith(trimmed));
      return (full.length ? full : COMMAND_NAMES.filter((c) => c.startsWith(cmd))).sort(
        (a, b) => a.length - b.length
      );
    }

    function sortMatches(arr) {
      return arr.sort((a, b) => a.length - b.length);
    }

    function updateGhost() {
      const val = input.value;
      const matches = getCompletions(val);
      if (!matches.length || !val) {
        ghost.textContent = '';
        return;
      }
      const pick = matches[0];
      if (pick.length > val.length && pick.startsWith(val)) {
        ghost.textContent = val + pick.slice(val.length);
      } else {
        ghost.textContent = '';
      }
    }

    function updateSuggestList() {
      const val = input.value;
      const matches = getCompletions(val).slice(0, 8);
      if (!val || matches.length <= 1) {
        suggestList.hidden = true;
        suggestList.innerHTML = '';
        return;
      }
      suggestList.hidden = false;
      suggestList.innerHTML = matches
        .map((m, i) => {
          const desc = TERM_COMMANDS[m]?.desc || (m.includes(' ') ? 'file' : '');
          return `<li role="option" data-idx="${i}">${escapeHtml(m)}${desc ? `<span class="suggest-desc">${escapeHtml(desc)}</span>` : ''}</li>`;
        })
        .join('');

      suggestList.querySelectorAll('li').forEach((li, i) => {
        li.addEventListener('mousedown', (e) => {
          e.preventDefault();
          input.value = matches[i];
          suggestList.hidden = true;
          updateGhost();
          input.focus();
        });
      });
    }

    function applyCompletion(value) {
      input.value = value;
      tabCycleBase = value;
      updateGhost();
      updateSuggestList();
    }

    function writeln(text, className = 'term-out') {
      const div = document.createElement('div');
      div.className = `term-line ${className}`;
      div.textContent = text;
      output.appendChild(div);
      output.scrollTop = output.scrollHeight;
    }

    function printPrompt(cmd) {
      const div = document.createElement('div');
      div.className = 'term-line';
      div.innerHTML =
        `<span class="term-prompt">nagesh@jarvis:<span class="path">~/profile.workspace</span>$ </span>` +
        `<span class="term-cmd">${escapeHtml(cmd)}</span>`;
      output.appendChild(div);
      output.scrollTop = output.scrollHeight;
    }

    function runCommand(raw) {
      const trimmed = raw.trim();
      if (!trimmed) return;

      printPrompt(trimmed);

      if (trimmed.startsWith('echo ')) {
        writeln(trimmed.slice(5).replace(/^["']|["']$/g, ''));
        return;
      }

      if (trimmed.startsWith('cat ')) {
        const path = trimmed.slice(4).trim();
        const f = P.files[path];
        if (!f) {
          writeln(`cat: ${path}: No such file`, 'term-err');
          return;
        }
        writeln(f.content);
        return;
      }

      if (trimmed.startsWith('open ')) {
        const path = trimmed.slice(5).trim();
        if (!P.files[path]) {
          writeln(`open: ${path}: No such file`, 'term-err');
          return;
        }
        openFile(path);
        activatePanel('terminal');
        writeln(`Opened ${path} in editor`);
        return;
      }

      const handler = TERM_COMMANDS[trimmed];
      if (handler) {
        const result = handler.run();
        if (result && result.clear) {
          output.innerHTML = '';
          return;
        }
        if (result) writeln(result);
        return;
      }

      writeln(`command not found: ${trimmed}. Type 'help' for available commands.`, 'term-err');
    }

    writeln('Welcome to profile.workspace — zsh integrated terminal');
    writeln("Type 'help' for commands · Tab to autocomplete", 'term-hint');

    input.addEventListener('input', () => {
      tabCycleIdx = -1;
      tabCycleBase = input.value;
      updateGhost();
      updateSuggestList();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const val = input.value;
        const matches = getCompletions(val);
        if (!matches.length) return;

        if (ghost.textContent && tabCycleIdx < 0 && matches[0].startsWith(val)) {
          applyCompletion(matches[0]);
          tabCycleIdx = 0;
          return;
        }

        if (tabCycleBase !== val) {
          tabCycleIdx = 0;
          tabCycleBase = val;
        } else {
          tabCycleIdx = (tabCycleIdx + 1) % matches.length;
        }
        applyCompletion(matches[tabCycleIdx]);
        return;
      }

      if (e.key === 'ArrowRight' && ghost.textContent) {
        e.preventDefault();
        applyCompletion(ghost.textContent);
        return;
      }

      if (e.key === 'Escape') {
        suggestList.hidden = true;
        ghost.textContent = '';
        return;
      }

      if (e.key === 'Enter') {
        suggestList.hidden = true;
        const val = input.value;
        input.value = '';
        ghost.textContent = '';
        tabCycleIdx = -1;
        runCommand(val);
      }
    });

    document.getElementById('pane-terminal').addEventListener('click', () => input.focus());
    setTimeout(() => input.focus(), 2000);
  }

  function activatePanel(name) {
    document.querySelectorAll('.panel-tab').forEach((t) => {
      t.classList.toggle('active', t.dataset.panel === name);
    });
    document.querySelectorAll('.panel-pane').forEach((p) => {
      p.classList.toggle('active', p.id === `pane-${name}`);
    });
    editor?.layout();
  }

  /* ─── AI Agent ─── */
  function parseAgentMarkdown(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/\n/g, '<br>');
  }

  async function runAiScript() {
    if (aiScriptStarted) return;
    aiScriptStarted = true;
    const container = document.getElementById('ai-messages');

    for (const msg of P.aiScript) {
      await sleep(msg.role === 'user' ? 600 : 400);

      if (msg.role === 'user') {
        appendAiMsg(container, 'user', msg.text);
      } else {
        const typing = showAiTyping(container);
        await sleep(msg.delay || 1000);
        typing.remove();
        await streamAgentReply(container, msg.text);
      }
    }
  }

  function showAiTyping(container) {
    const typing = document.createElement('div');
    typing.className = 'ai-msg agent';
    typing.innerHTML =
      '<div class="ai-msg-header"><span class="ai-avatar agent">A</span><span class="ai-name">Agent</span></div>' +
      '<div class="ai-typing"><span></span><span></span><span></span></div>';
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
    return typing;
  }

  function appendAiMsg(container, role, text) {
    const div = document.createElement('div');
    div.className = `ai-msg ${role}`;
    const avatar = role === 'user' ? 'U' : 'A';
    const name = role === 'user' ? 'You' : 'Agent';
    div.innerHTML =
      `<div class="ai-msg-header"><span class="ai-avatar ${role}">${avatar}</span><span class="ai-name">${name}</span></div>` +
      `<div class="ai-bubble">${role === 'user' ? escapeHtml(text) : parseAgentMarkdown(text)}</div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  async function streamAgentReply(container, text) {
    const div = document.createElement('div');
    div.className = 'ai-msg agent';
    div.innerHTML =
      '<div class="ai-msg-header"><span class="ai-avatar agent">A</span><span class="ai-name">Agent</span></div>' +
      '<div class="ai-bubble"></div>';
    container.appendChild(div);
    const bubble = div.querySelector('.ai-bubble');

    for (let i = 0; i < text.length; i++) {
      bubble.innerHTML = parseAgentMarkdown(text.slice(0, i + 1));
      container.scrollTop = container.scrollHeight;
      await sleep(10 + Math.random() * 8);
    }
    bubble.innerHTML = parseAgentMarkdown(text);
    container.scrollTop = container.scrollHeight;
  }

  function initAiInput() {
    const input = document.getElementById('ai-input');
    const send = document.getElementById('ai-send');
    const container = document.getElementById('ai-messages');

    const replies = [
      'I specialize in **low-level systems** — C/C++17, multi-threaded EDA tools, and production debugging with ASan/TSan. Open **experience/synopsys.md** for recent wins.',
      'Check **projects/cynide** for my AoT compiler work, or the **lldb** PR in **projects/lldb.cpp**.',
      'Reach me at **nageshnnazare.official@gmail.com** — see **contact.json** for links.',
    ];
    let replyIdx = 0;

    async function handleSend() {
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      appendAiMsg(container, 'user', text);
      const typing = showAiTyping(container);
      await sleep(800);
      typing.remove();
      await streamAgentReply(container, replies[replyIdx % replies.length]);
      replyIdx++;
    }

    send.addEventListener('click', handleSend);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });
  }

  /* ─── Activity bar (responsive views) ─── */
  function setActivityView(view) {
    activeView = view;

    document.querySelectorAll('.activity-item[data-view]').forEach((b) => {
      b.classList.toggle('active', b.dataset.view === view);
    });

    document.querySelectorAll('.sidebar-view').forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.sidebar === view);
    });

    const sidebar = document.getElementById('sidebar');
    const aiPanel = document.getElementById('ai-panel');

    sidebar.classList.remove('collapsed');

    if (view === 'account' || view === 'settings') {
      return;
    }

    if (view === 'agent') {
      layoutState.ai = true;
      applyLayoutClasses();
      aiPanel.classList.add('focused');
      aiPanel.classList.remove('compact-hidden');
      sidebar.classList.add('collapsed-on-agent');
      setTimeout(() => aiPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
      if (!aiScriptStarted) runAiScript();
    } else {
      aiPanel.classList.remove('focused');
      sidebar.classList.remove('collapsed-on-agent');
    }

    if (view === 'explorer' || view === 'search' || view === 'git') {
      sidebar.classList.remove('collapsed');
    }

    if (window.matchMedia('(max-width: 900px)').matches) {
      if (view === 'agent') {
        sidebar.classList.add('collapsed');
      }
    }

    editor?.layout();
  }

  function initActivityBar() {
    document.querySelectorAll('.activity-item[data-view]').forEach((btn) => {
      btn.addEventListener('click', () => setActivityView(btn.dataset.view));
    });

    window.matchMedia('(max-width: 900px)').addEventListener('change', (e) => {
      const ai = document.getElementById('ai-panel');
      if (e.matches && activeView !== 'agent') {
        ai.classList.add('compact-hidden');
      } else {
        ai.classList.remove('compact-hidden');
      }
    });

    if (window.matchMedia('(max-width: 900px)').matches) {
      document.getElementById('ai-panel').classList.add('compact-hidden');
    }
  }

  /* ─── Search ─── */
  function initSearch() {
    const input = document.getElementById('search-input');
    const results = document.getElementById('search-results');

    function doSearch(q) {
      const query = q.trim().toLowerCase();
      if (!query) {
        results.innerHTML = '<p class="search-empty">Type to search across profile files</p>';
        return;
      }
      const hits = Object.entries(P.files).filter(([path, file]) => {
        return (
          path.toLowerCase().includes(query) ||
          file.content.toLowerCase().includes(query)
        );
      });

      if (!hits.length) {
        results.innerHTML = '<p class="search-empty">No results</p>';
        return;
      }

      results.innerHTML = hits
        .map(([path]) => {
          const name = path.split('/').pop();
          return `<button type="button" class="search-hit" data-path="${path}">${fileIconHtml(path)}<span>${name}</span><small>${path}</small></button>`;
        })
        .join('');

      results.querySelectorAll('.search-hit').forEach((btn) => {
        btn.addEventListener('click', () => {
          openFile(btn.dataset.path);
          setActivityView('explorer');
        });
      });
    }

    input.addEventListener('input', () => doSearch(input.value));
    doSearch('');
  }

  /* ─── Panel tabs & misc ─── */
  function initPanelTabs() {
    document.querySelectorAll('.panel-tab').forEach((tab) => {
      tab.addEventListener('click', () => activatePanel(tab.dataset.panel));
    });
  }

  function initProblems() {
    document.getElementById('problems-list').innerHTML = `
      <div class="problem-item"><span class="problem-icon info">ℹ</span> projects/lldb.cpp — PR #177160 open on llvm/llvm-project</div>
      <div class="problem-item"><span class="problem-icon warn">⚠</span> experience/synopsys.md — validate 32-core regression suite</div>
      <div class="problem-item"><span class="problem-icon info">ℹ</span> Type <code>help</code> in terminal for commands</div>`;
    document.querySelector('.panel-tab[data-panel="problems"] .badge').textContent = '3';
    document.getElementById('status-problems').textContent = '⚠ 1 ○ 2';
  }

  function initOutput() {
    document.getElementById('output-log').innerHTML = `[Info] Workspace: profile.workspace
[Info] Loaded ${Object.keys(P.files).length} profile files
[Info] Markdown files open in Preview mode
[Info] Terminal ready — type 'help'
[Done] Showcase ready`;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function boot() {
    runWelcome();
    bindTree();
    renderTabs();
    initPanelTabs();
    initProblems();
    initOutput();
    initActivityBar();
    initSearch();
    initAiInput();
    initTerminal();
    initMarkdownViewTabs();
    initLayoutControls();

    window.addEventListener('resize', () => editor?.layout());

    initMonaco();
    setTimeout(initSplits, 800);
    setTimeout(runAiScript, 2500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
