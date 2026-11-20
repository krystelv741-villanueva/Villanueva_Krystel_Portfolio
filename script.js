/* Shared behaviour for all pages. Each part runs only on pages that have its elements. */

const htmlEl = document.documentElement;
const pageName = document.body.dataset.page;

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    document.getElementById('toast-message').textContent = message;
    toast.classList.remove('translate-y-24', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-24', 'opacity-0');
    }, 2800);
}

function copyText(value, label) {
    const tempInput = document.createElement('input');
    tempInput.value = value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(`Copied ${label}: ${value}`);
}

function handleContactSubmit(e) {
    e.preventDefault();
    showToast('Thank you! Your message for Ma. Krystel A. Villanueva has been recorded.');
    e.target.reset();
}

function updateClock() {
    const clockEl = document.getElementById('live-clock');
    if (!clockEl) return;
    const timeStr = new Date().toLocaleTimeString('en-PH', {
        timeZone: 'Asia/Manila',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    clockEl.textContent = `POLA, ORIENTAL MINDORO // ${timeStr} PH`;
}

function highlightNav() {
    document.querySelectorAll('[data-nav]').forEach(link => {
        const active = link.dataset.nav === pageName;
        link.classList.toggle('bg-ink', active);
        link.classList.toggle('text-paper', active);
        link.classList.toggle('dark:bg-darkInk', active);
        link.classList.toggle('dark:text-darkPaper', active);
        link.classList.toggle('hover:bg-slate', !active);
        link.classList.toggle('dark:hover:bg-darkSlate', !active);
    });
}

/* Theme toggle (Porcelain / Midnight), remembered between pages */
const themeToggle = document.getElementById('theme-toggle');
const themeLabel = document.getElementById('theme-label');

function applySavedTheme() {
    const isDark = localStorage.getItem('theme') === 'dark';
    htmlEl.classList.toggle('dark', isDark);
    if (themeLabel) themeLabel.textContent = isDark ? 'PORCELAIN' : 'MIDNIGHT';
}

applySavedTheme();

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        htmlEl.classList.toggle('dark');
        const isDark = htmlEl.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeLabel.textContent = isDark ? 'PORCELAIN' : 'MIDNIGHT';
        showToast(isDark ? 'Switched to Midnight Navy Edition' : 'Switched to Porcelain White Edition');
    });
}

/* Portfolio data, list, filters and project pop-up */
const PORTFOLIO_PROJECTS = [
    {
        id: "01",
        title: "Personal Portfolio Website",
        category: "web",
        categoryLabel: "WEB DEVELOPMENT • HTML & CSS",
        year: "2026",
        summary: "A multi-page website with a homepage, about page, portfolio, and contact form, styled with one external stylesheet.",
        role: "Designer & Developer",
        stack: "HTML, CSS",
        impact: "Clean multi-page navigation & unified styling",
        details: "Structured semantic HTML across four dedicated sections—Homepage, About Me, Portfolio, and Contact—styled consistently through a single external stylesheet for readable typography, clear layout hierarchy, and user-friendly navigation.",
        accentPattern: "grid"
    },
    {
        id: "02",
        title: "Capstone Project",
        category: "web",
        categoryLabel: "WEB DEVELOPMENT • TEAMWORK & WEB DESIGN",
        year: "SHS",
        summary: "A group project that solved a real problem for our school. I helped with planning, design, and testing.",
        role: "Planning, Web Design & Testing",
        stack: "Teamwork, Web Design",
        impact: "Solved a real operational need for our school",
        details: "Collaborated closely with group members during Senior High School at Pola Catholic School Inc. Contributed to system planning, clean user interface design, and thorough functional testing to ensure reliability for student and school users.",
        accentPattern: "lines"
    },
    {
        id: "03",
        title: "Programming Exercises",
        category: "programming",
        categoryLabel: "PROGRAMMING • C & C#",
        year: "2026",
        summary: "Console programs that practice loops, arrays, and conditions, such as number patterns, totals, and menus.",
        role: "Student Programmer",
        stack: "C, C#",
        impact: "Core algorithmic logic & console I/O mastery",
        details: "Developed structured console applications in C and C# focused on foundational programming logic: nested loops for generating number patterns, array iteration for calculating totals, and conditional branching for interactive user menus.",
        accentPattern: "bars"
    }
];

const projectListEl = document.getElementById('project-list');
const filterBtns = document.querySelectorAll('.filter-btn');

function renderProjects(filter = 'all') {
    if (!projectListEl) return;
    const filtered = filter === 'all'
        ? PORTFOLIO_PROJECTS
        : PORTFOLIO_PROJECTS.filter(p => p.category === filter);

    projectListEl.innerHTML = filtered.map(project => `
        <article onclick="openProjectModal('${project.id}')"
            class="group py-7 sm:py-9 px-2 sm:px-4 -mx-2 sm:-mx-4 rounded-xl hover:bg-slate/70 dark:hover:bg-darkSlate/70 transition-all duration-300 cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div class="md:col-span-2 flex items-center gap-4 font-mono text-xs opacity-60">
                <span class="text-accent font-semibold">${project.id}</span>
                <span>/</span>
                <span>${project.year}</span>
            </div>
            <div class="min-w-0 md:col-span-5">
                <h3 class="font-display font-bold text-2xl sm:text-3xl tracking-tight group-hover:translate-x-2 transition-transform duration-300 break-words">
                    ${project.title}
                </h3>
            </div>
            <div class="min-w-0 md:col-span-4">
                <span class="font-mono text-[11px] uppercase tracking-wider opacity-50 block mb-1">${project.categoryLabel}</span>
                <p class="text-sm opacity-80 line-clamp-2">${project.summary}</p>
            </div>
            <div class="md:col-span-1 flex md:justify-end">
                <span class="w-10 h-10 rounded-full border border-ink/20 dark:border-white/20 flex items-center justify-center font-mono text-sm group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all">
                    ↗
                </span>
            </div>
        </article>
    `).join('');
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
            b.classList.remove('bg-ink', 'text-paper', 'dark:bg-darkInk', 'dark:text-darkPaper');
            b.classList.add('border', 'border-ink/15', 'dark:border-white/15');
        });
        btn.classList.add('bg-ink', 'text-paper', 'dark:bg-darkInk', 'dark:text-darkPaper');
        btn.classList.remove('border', 'border-ink/15', 'dark:border-white/15');
        renderProjects(btn.dataset.filter);
    });
});

const modal = document.getElementById('project-modal');
const modalCard = document.getElementById('project-modal-card');

function generateProceduralVisual(pattern) {
    if (pattern === 'lines') {
        return `<svg class="w-full h-full opacity-80" viewBox="0 0 400 200">
            <rect x="60" y="40" width="80" height="120" rx="8" fill="none" stroke="currentColor" stroke-width="1.2"/>
            <rect x="160" y="40" width="80" height="120" rx="8" fill="none" stroke="#0055FF" stroke-width="1.5"/>
            <rect x="260" y="40" width="80" height="120" rx="8" fill="none" stroke="currentColor" stroke-width="1.2"/>
        </svg>`;
    } else if (pattern === 'bars') {
        return `<svg class="w-full h-full opacity-80" viewBox="0 0 400 200">
            <path d="M40 150 L100 110 L160 130 L220 60 L280 85 L360 35" fill="none" stroke="#0055FF" stroke-width="2.5"/>
            <line x1="40" y1="160" x2="360" y2="160" stroke="currentColor" stroke-width="1" opacity="0.4"/>
        </svg>`;
    }
    return `<svg class="w-full h-full opacity-80" viewBox="0 0 400 200">
        <defs><pattern id="g" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" stroke-width="0.6" opacity="0.3"/></pattern></defs>
        <rect width="400" height="200" fill="url(#g)"/>
        <rect x="130" y="55" width="140" height="90" rx="10" fill="none" stroke="#0055FF" stroke-width="2"/>
    </svg>`;
}

function openProjectModal(id) {
    const project = PORTFOLIO_PROJECTS.find(p => p.id === id);
    if (!project || !modal) return;

    document.getElementById('modal-index').textContent = project.id;
    document.getElementById('modal-category').textContent = project.categoryLabel;
    document.getElementById('modal-title').textContent = project.title;
    document.getElementById('modal-summary').textContent = project.summary;
    document.getElementById('modal-role').textContent = project.role;
    document.getElementById('modal-stack').textContent = project.stack;
    document.getElementById('modal-impact').textContent = project.impact;
    document.getElementById('modal-details').textContent = project.details;
    document.getElementById('modal-visual').innerHTML = generateProceduralVisual(project.accentPattern);

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    requestAnimationFrame(() => {
        modal.classList.remove('opacity-0');
        modalCard.classList.remove('scale-95');
        modalCard.classList.add('scale-100');
    });
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    if (!modal) return;
    modal.classList.add('opacity-0');
    modalCard.classList.remove('scale-100');
    modalCard.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
    }, 250);
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeProjectModal();
    });
}
document.addEventListener('keydown', (e) => {
    if (modal && e.key === 'Escape' && !modal.classList.contains('hidden')) closeProjectModal();
});

/* Home page hero: small grid of marks that turn toward the cursor */
const canvas = document.getElementById('kinetic-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let mouse = { x: -100, y: -100 };

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    }

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('touchmove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
    }, { passive: true });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = -100;
        mouse.y = -100;
    });

    function animateGrid() {
        const rect = canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);
        const isDark = htmlEl.classList.contains('dark');

        const cols = 10;
        const rows = 5;
        const spacingX = rect.width / (cols + 1);
        const spacingY = rect.height / (rows + 1);

        for (let i = 1; i <= cols; i++) {
            for (let j = 1; j <= rows; j++) {
                const x = i * spacingX;
                const y = j * spacingY;
                const dx = mouse.x - x;
                const dy = mouse.y - y;
                const dist = Math.hypot(dx, dy);
                const maxDist = 45;

                ctx.save();
                ctx.translate(x, y);
                if (dist < maxDist) {
                    ctx.rotate(Math.atan2(dy, dx));
                    ctx.strokeStyle = '#0055FF';
                    ctx.lineWidth = 2;
                } else {
                    ctx.strokeStyle = isDark ? 'rgba(248,250,252,0.35)' : 'rgba(10,25,47,0.35)';
                    ctx.lineWidth = 1.2;
                }
                ctx.beginPath();
                ctx.moveTo(-4, 0);
                ctx.lineTo(4, 0);
                ctx.stroke();
                ctx.restore();
            }
        }
        requestAnimationFrame(animateGrid);
    }

    window.addEventListener('load', () => {
        resizeCanvas();
        animateGrid();
    });
    window.addEventListener('resize', resizeCanvas);
}

/* Startup */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
highlightNav();
renderProjects('all');
updateClock();
setInterval(updateClock, 1000);
