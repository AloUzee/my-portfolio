// Portfolio Data (встроено для работы на GitHub Pages)
const defaultProjects = [
  {
    id: 1,
    title: "PIK-R SMAN 1 Mengwi",
    description: "PIK-R (Pusat Informasi dan Konseling Remaja) adalah wadah pembinaan dan pelayanan bagi remaja yang dibentuk untuk memberikan informasi, edukasi, serta layanan konseling.",
    tech: ["HTML", "CSS", "JavaScript"],
    image: "🏫",
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    id: 2,
    title: "GameSmiths Studio",
    description: "GameSmiths adalah studio game developer yang fokus di platform Roblox. Kami merupakan tim rintisan yang fokus untuk membuat game-game Roblox yang seru dan berkualitas.",
    tech: ["Roblox", "Lua", "Game Design"],
    image: "🎮",
    liveUrl: "#",
    githubUrl: "#"
  },
  {
    id: 3,
    title: "WhatsApp Clone",
    description: "Proyek ini adalah replika visual dari antarmuka aplikasi WhatsApp, yang dibangun menggunakan HTML, CSS, dan JavaScript.",
    tech: ["HTML", "CSS", "JavaScript"],
    image: "💬",
    liveUrl: "#",
    githubUrl: "#"
  }
];

// Load projects
function loadProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;
  
  // Get projects from localStorage or use default
  let projects = JSON.parse(localStorage.getItem('portfolio_projects')) || defaultProjects;
  
  // Update counter
  const projectCount = document.getElementById('projectCount');
  if (projectCount) {
    animateCounter(projectCount, 0, projects.length, 1000);
  }
  
  // Render projects
  if (projects.length === 0) {
    grid.innerHTML = '<p style="text-align: center; color: #8892b0; grid-column: 1/-1; padding: 40px;">No projects yet. Add some via admin panel!</p>';
    return;
  }  
  grid.innerHTML = projects.map(project => `
    <div class="project-card">
      <div class="project-image">${project.image || '🚀'}</div>
      <div class="project-content">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-tech">
          ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
        <div class="project-links">
          ${project.liveUrl && project.liveUrl !== '#' ? `<a href="${project.liveUrl}" class="link-live" target="_blank">Live Demo</a>` : ''}
          ${project.githubUrl && project.githubUrl !== '#' ? `<a href="${project.githubUrl}" class="link-github" target="_blank">GitHub</a>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

// Animate counter
function animateCounter(element, start, end, duration) {
  const range = end - start;
  const increment = end > start ? 1 : -1;
  const stepTime = Math.abs(Math.floor(duration / range));
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    element.textContent = current;
    if (current === end) {
      clearInterval(timer);
    }
  }, stepTime);
}

// Mobile menu
function initMobileMenu() {
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
    
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });  }
}

// Smooth scroll
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Set year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  
  loadProjects();
  initMobileMenu();
  initSmoothScroll();
});
