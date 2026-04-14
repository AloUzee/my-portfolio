// Admin Authentication
const ADMIN_PASSWORD_HASH = '48433b19d4cf3958b6f40338a6eb616dec641477bb4de7904f5ab4859cd95e06'

// DOM Elements
const loginBox = document.getElementById('loginBox');
const adminPanel = document.getElementById('adminPanel');
const passwordInput = document.getElementById('passwordInput');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');
const projectForm = document.getElementById('projectForm');
const projectsList = document.getElementById('projectsList');
const jsonExport = document.getElementById('jsonExport');
const totalCount = document.getElementById('totalCount');
const formTitle = document.getElementById('formTitle');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');

// Check if already logged in
if (sessionStorage.getItem('adminLoggedIn') === 'true') {
  showAdminPanel();
}

// Login
loginBtn.addEventListener('click', async () => {
  const password = passwordInput.value;
  const hash = await sha256(password);
  
  if (hash === ADMIN_PASSWORD_HASH) {
    sessionStorage.setItem('adminLoggedIn', 'true');
    showAdminPanel();
  } else {
    loginError.style.display = 'block';
    setTimeout(() => {
      loginError.style.display = 'none';
    }, 3000);
  }
});

passwordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') loginBtn.click();
});

// SHA-256 Hash
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
// Show Admin Panel
function showAdminPanel() {
  loginBox.style.display = 'none';
  adminPanel.style.display = 'block';
  loadProjects();
}

// Load Projects
function loadProjects() {
  const stored = localStorage.getItem(DATA_KEY);
  let projects = stored ? JSON.parse(stored) : [];
  
  totalCount.textContent = projects.length;
  renderProjectsList(projects);
  updateJsonExport(projects);
}

// Render Projects List
function renderProjectsList(projects) {
  if (projects.length === 0) {
    projectsList.innerHTML = '<p style="color: #8892b0; text-align: center; padding: 40px;">No projects yet. Add your first project!</p>';
    return;
  }
  
  projectsList.innerHTML = projects.map((project, index) => `
    <div class="project-item">
      <div class="project-info">
        <h4>${project.title}</h4>
        <p>${project.description.substring(0, 100)}${project.description.length > 100 ? '...' : ''}</p>
      </div>
      <div class="btn-group">
        <button class="btn-edit" onclick="editProject(${index})">✏️ Edit</button>
        <button class="btn-delete" onclick="deleteProject(${index})">🗑️ Delete</button>
      </div>
    </div>
  `).join('');
}

// Edit Project
window.editProject = function(index) {
  const stored = localStorage.getItem(DATA_KEY);
  let projects = stored ? JSON.parse(stored) : [];
  const project = projects[index];
  
  document.getElementById('editIndex').value = index;
  document.getElementById('projectTitle').value = project.title;
  document.getElementById('projectDesc').value = project.description;
  document.getElementById('projectTech').value = project.tech.join(', ');
  document.getElementById('projectImage').value = project.image || '';  document.getElementById('projectLive').value = project.liveUrl || '';
  document.getElementById('projectGithub').value = project.githubUrl || '';
  
  formTitle.textContent = '✏️ Edit Project';
  saveBtn.textContent = '💾 Update Project';
  cancelBtn.style.display = 'inline-block';
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Delete Project
window.deleteProject = function(index) {
  if (!confirm('Are you sure you want to delete this project?')) return;
  
  let projects = JSON.parse(localStorage.getItem(DATA_KEY)) || [];
  projects.splice(index, 1);
  localStorage.setItem(DATA_KEY, JSON.stringify(projects));
  
  loadProjects();
  
  // Also update main page if open
  window.opener && window.opener.location.reload();
};

// Save Project
projectForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const editIndex = document.getElementById('editIndex').value;
  const techStack = document.getElementById('projectTech').value.split(',').map(t => t.trim()).filter(t => t);
  
  const project = {
    id: Date.now(),
    title: document.getElementById('projectTitle').value,
    description: document.getElementById('projectDesc').value,
    tech: techStack,
    image: document.getElementById('projectImage').value || '🚀',
    liveUrl: document.getElementById('projectLive').value || '#',
    githubUrl: document.getElementById('projectGithub').value || '#'
  };
  
  let projects = JSON.parse(localStorage.getItem(DATA_KEY)) || [];
  
  if (editIndex !== '') {
    projects[parseInt(editIndex)] = project;
  } else {
    projects.push(project);
  }
  
  localStorage.setItem(DATA_KEY, JSON.stringify(projects));  
  // Reset form
  projectForm.reset();
  document.getElementById('editIndex').value = '';
  formTitle.textContent = '➕ Add New Project';
  saveBtn.textContent = '💾 Save Project';
  cancelBtn.style.display = 'none';
  
  loadProjects();
  
  // Show success message
  alert('Project saved successfully!');
});

// Cancel Edit
cancelBtn.addEventListener('click', () => {
  projectForm.reset();
  document.getElementById('editIndex').value = '';
  formTitle.textContent = '➕ Add New Project';
  saveBtn.textContent = '💾 Save Project';
  cancelBtn.style.display = 'none';
});

// Update JSON Export
function updateJsonExport(projects) {
  jsonExport.value = JSON.stringify(projects, null, 2);
}

// Copy JSON
document.getElementById('copyJsonBtn').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(jsonExport.value);
    alert('JSON copied to clipboard!');
  } catch (err) {
    jsonExport.select();
    document.execCommand('copy');
    alert('JSON copied to clipboard!');
  }
});

// Import JSON
document.getElementById('importJsonBtn').addEventListener('click', () => {
  try {
    const projects = JSON.parse(jsonExport.value);
    if (!Array.isArray(projects)) {
      throw new Error('Invalid format');
    }
    localStorage.setItem(DATA_KEY, JSON.stringify(projects));
    loadProjects();
    alert('Data imported successfully!');    
    // Update main page if open
    window.opener && window.opener.location.reload();
  } catch (err) {
    alert('Error: Invalid JSON format');
  }
});

// Clear All
document.getElementById('clearAllBtn').addEventListener('click', () => {
  if (!confirm('Are you sure you want to delete ALL projects?')) return;
  
  localStorage.removeItem(DATA_KEY);
  loadProjects();
  
  // Update main page if open
  window.opener && window.opener.location.reload();
});
