document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  initTheme();
  loadProjects();
});

function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  document.getElementById('themeToggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

async function loadProjects() {
  const grid = document.getElementById('projectsGrid');
  const loader = document.getElementById('loader');
  const error = document.getElementById('error');

  try {
    // Cache-busting чтобы всегда брать актуальную версию с сервера
    const res = await fetch(`./projects.json?t=${Date.now()}`);
    if (!res.ok) throw new Error('Не удалось загрузить данные');
    const projects = await res.json();
    loader.classList.add('hidden');
    renderProjects(projects);
  } catch (err) {
    loader.classList.add('hidden');
    error.textContent = `Ошибка: ${err.message}. Убедитесь, что projects.json загружен в репозиторий.`;
    error.classList.remove('hidden');
  }
}

function renderProjects(projects) {
  const grid = document.getElementById('projectsGrid');
  if (projects.length === 0) {
    grid.innerHTML = '<p style="text-align:center; opacity:0.6; padding:40px;">Проектов пока нет. Добавьте их через админ-панель.</p>';
    return;
  }
  grid.innerHTML = projects.map(p => `
    <article class="card">
      <img src="${p.image}" alt="${p.title}" loading="lazy">
      <div class="card-content">
        <h3>${p.title}</h3>
        <div class="tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        <p>${p.description}</p>
        <a href="${p.link}" class="btn" target="_blank" rel="noopener">Открыть проект</a>
      </div>
    </article>
  `).join('');
}
