/** VS Code–style file icons (SVG) */
window.FileIcons = (function () {
  const base = (paths, color) =>
    `<svg class="file-icon-svg" viewBox="0 0 16 16" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">${paths}</svg>`;

  const icons = {
    folder: base(
      '<path fill="#C5C5C5" d="M14 4H8.5L7 2.5H2v9h12V4z"/>',
      '#C5C5C5'
    ),
    'folder-open': base(
      '<path fill="#C5C5C5" d="M2 3.5v9h12V6H7.5L6 4.5H2V3.5zm1 1h3.3L8 6.5h6.5v5.5H3V4.5z"/>',
      '#C5C5C5'
    ),
    readme: base(
      '<path fill="#519ABA" d="M14 2H4.5L3 3.5H2v10h12V2z"/><path fill="#1e1e1e" d="M5 6h6v1H5V6zm0 2h6v1H5V8zm0 2h4v1H5v-1z"/>',
      '#519ABA'
    ),
    md: base(
      '<path fill="#519ABA" d="M13 2H6L5 3H2v10h11V2z"/><path fill="#1e1e1e" d="M4 6h7v1H4V6zm0 2h5v1H4V8zm0 2h6v1H4v-1z"/>',
      '#519ABA'
    ),
    json: base(
      '<path fill="#CBCB41" d="M13 2H3v12h10V2z"/><path fill="#1e1e1e" d="M5 5h1v6H5V5zm5 0h1v6h-1V5zM7 6h2v1H7V6zm0 3h2v1H7V9z"/>',
      '#CBCB41'
    ),
    cpp: base(
      '<path fill="#659AD2" d="M13 2H3v12h10V2z"/><path fill="#1e1e1e" d="M6 5l2 4-2 4h1.5l1-2 1 2H10l-2-4 2-4H8.5l-1 2-1-2H6z"/>',
      '#659AD2'
    ),
    sh: base(
      '<path fill="#4EC9B0" d="M13 2H3v12h10V2z"/><path fill="#1e1e1e" d="M5 6h6v1H5V6zm0 2h4v1H5V8zm0 2h5v1H5v-1z"/>',
      '#4EC9B0'
    ),
    toml: base(
      '<path fill="#9CDCFE" d="M13 2H3v12h10V2z"/><path fill="#1e1e1e" d="M5 5h6v1H5V5zm0 2h4v1H5V7zm0 2h5v1H5V9z"/>',
      '#9CDCFE'
    ),
    bib: base(
      '<path fill="#CE9178" d="M13 2H3v12h10V2z"/><path fill="#1e1e1e" d="M5 5h6v1H5V5zm0 2h6v1H5V7zm0 2h4v1H5V9z"/>',
      '#CE9178'
    ),
    flux: base(
      '<path fill="#C586C0" d="M13 2H3v12h10V2z"/><path fill="#1e1e1e" d="M6 5h4v1H6V5zm0 2h3v1H6V7zm0 2h5v1H6V9z"/>',
      '#C586C0'
    ),
    default: base(
      '<path fill="#C5C5C5" d="M13 2H3v12h10V2z"/><path fill="#1e1e1e" d="M5 6h6v1H5V6zm0 2h4v1H5V8z"/>',
      '#C5C5C5'
    ),
  };

  function resolve(path, isFolder, open) {
    if (isFolder) return open ? icons['folder-open'] : icons.folder;
    const name = path.split('/').pop().toLowerCase();
    if (name === 'readme.md') return icons.readme;
    const ext = name.includes('.') ? name.split('.').pop() : '';
    return icons[ext] || icons.default;
  }

  return { get: resolve, html: (path, isFolder, open) => `<span class="file-icon">${resolve(path, isFolder, open)}</span>` };
})();
