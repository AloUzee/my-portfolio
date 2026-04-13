const PASS_HASH = "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918";
let projects = [];

document.addEventListener('DOMContentLoaded', async () => {
  if (sessionStorage.getItem('adminAuth') === 'true') showPanel();

  document.getElementById('loginBtn').addEventListener('click', checkLogin);
  document.getElementById('passInput').addEventListener('keypress', e => e.key === 'Enter' && checkLogin());
  document.getElementById('saveBtn').addEventListener('click', saveProject);
  document.getElementById('clearBtn').addEventListener('click', clearForm);
  document.getElementById('copyBtn').addEventListener('click', copyJSON);

  await loadAdminData();
});

async function checkLogin() {
  const input = document.getElementById('passInput').value;
  const hash = await sha256(input);
  if (hash === PASS_HASH) {
    sessionStorage.setItem('adminAuth', 'true');
    showPanel();
  } else {
    const err = document.getElementById('loginError');
    err.style.display = 'block';
    setTimeout(() => err.style.display = 'none', 2500);
  }
}

function showPanel() {
  document.getElementById('loginBox').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'block';
}

async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function loadAdminData() {
  try {
    const res = await fetch('./projects.json?t=' + Date.now());
    if (res.ok) projects = await res.json();
  } catch(e) { projects = []; }
  renderList();
  updateJSONOutput();
}

function renderList() {
  const list = document.getElementById('itemList');
  if (projects.length === 0) {
    list.innerHTML = '<p style="opacity:0.6; padding:12px;">Список пуст</p>';
    return;
  }
  list.innerHTML = projects.map((p, i) => `
    <div class="item">
      <span>${p.title}</span>
      <div class="row" style="margin:0; gap:6px;">
        <button onclick="editProject(${i})" aria-label="Редактировать">✏️</button>
        <button onclick="deleteProject(${i})" aria-label="Удалить">🗑️</button>
      </div>
    </div>
  `).join('');
}

window.editProject = function(index) {
  const p = projects[index];
  document.getElementById('editId').value = index;
  document.getElementById('title').value = p.title;
  document.getElementById('desc').value = p.description;
  document.getElementById('tags').value = p.tags.join(', ');
  document.getElementById('imgUrl').value = p.image;
  document.getElementById('link').value = p.link;
  document.getElementById('saveBtn').textContent = '💾 Сохранить изменения';
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.deleteProject = function(index) {
  if (confirm('Удалить этот проект?')) {
    projects.splice(index, 1);
    renderList();
    updateJSONOutput();
    if (document.getElementById('editId').value == index) clearForm();
  }
};

function saveProject() {
  const title = document.getElementById('title').value.trim();
  if (!title) { alert('Введите название проекта'); return; }

  const newProj = {
    id: Date.now(),
    title,
    description: document.getElementById('desc').value.trim(),
    tags: document.getElementById('tags').value.split(',').map(t => t.trim()).filter(Boolean),
    image: document.getElementById('imgUrl').value.trim() || 'https://placehold.co/600x400/2563eb/ffffff?text=Project',
    link: document.getElementById('link').value.trim() || '#'
  };

  const editId = document.getElementById('editId').value;
  if (editId !== '') {
    projects[parseInt(editId)] = { ...projects[parseInt(editId)], ...newProj };
  } else {
    projects.push(newProj);
  }

  clearForm();
  renderList();
  updateJSONOutput();
}

function clearForm() {
  document.getElementById('editId').value = '';
  ['title','desc','tags','imgUrl','link'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('saveBtn').textContent = '➕ Добавить проект';
}

function updateJSONOutput() {
  document.getElementById('jsonOutput').value = JSON.stringify(projects, null, 2);
}

async function copyJSON() {
  const text = document.getElementById('jsonOutput').value;
  try {
    await navigator.clipboard.writeText(text);
    showToast();
  } catch {
    // Fallback для старых браузеров/iOS
    const ta = document.getElementById('jsonOutput');
    ta.select();
    document.execCommand('copy');
    showToast();
  }
}

function showToast() {
  const t = document.getElementById('toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}
