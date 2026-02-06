// ===================================
// Intersection Observer for Project Transitions
// ===================================

let currentProjectIndex = 0;
const totalProjects = 4;

// Get all project sections
const projectSections = document.querySelectorAll('.project-section');
const leftPanel = document.getElementById('leftPanel');
const projectTitle = document.getElementById('projectTitle');
const projectDescriptor = document.getElementById('projectDescriptor');
const techStack = document.getElementById('techStack');
const projectButton = document.getElementById('projectButton');
const projectCounter = document.getElementById('projectCounter');

// Initialize with first project
function initializeFirstProject() {
    if (projectSections.length > 0) {
        const firstProject = projectSections[0];
        updateLeftPanel(firstProject, 0);
    }
}

// Update left panel content with smooth transitions
function updateLeftPanel(section, index) {
    const color = section.dataset.color;
    const title = section.dataset.title;
    const descriptor = section.dataset.descriptor;
    const stack = section.dataset.stack.split(',');
    const link = section.dataset.link;

    // Update background color
    leftPanel.style.backgroundColor = color;

    // Update counter
    const displayIndex = String(index + 1).padStart(2, '0');
    const displayTotal = String(totalProjects).padStart(2, '0');
    projectCounter.textContent = `${displayIndex} / ${displayTotal}`;

    // Trigger content fade out
    const elements = [projectTitle, projectDescriptor, techStack, projectButton];
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
    });

    // Update content after brief delay
    setTimeout(() => {
        projectTitle.textContent = title;
        projectDescriptor.textContent = descriptor;
        projectButton.href = link;

        // Update tech stack
        techStack.innerHTML = '';
        stack.forEach(tech => {
            const tag = document.createElement('span');
            tag.className = 'tech-tag';
            tag.textContent = tech.trim();
            techStack.appendChild(tag);
        });

        // Trigger content fade in
        elements.forEach((el, i) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, i * 50);
        });
    }, 200);

    // Note: Logo contrast is now handled via CSS mix-blend-mode where applicable
}

// Calculate brightness from hex color
function getBrightness(hexColor) {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
}

// Intersection Observer for project sections
const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const section = entry.target;
            const index = parseInt(section.dataset.project);

            if (index !== currentProjectIndex) {
                currentProjectIndex = index;
                updateLeftPanel(section, index);
            }
        }
    });
}, observerOptions);

// Observe all project sections
projectSections.forEach(section => {
    observer.observe(section);
});

// ===================================
// Mobile Header Auto-hide
// ===================================

let lastScrollTop = 0;
const header = document.querySelector('.global-header');
let scrollTimeout;

function handleScroll() {
    // Only apply on mobile
    if (window.innerWidth <= 768) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                header.classList.add('hidden');
            } else {
                // Scrolling up
                header.classList.remove('hidden');
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }, 100);
    } else {
        header.classList.remove('hidden');
    }
}

window.addEventListener('scroll', handleScroll, { passive: true });

// ===================================
// Smooth Scroll Enhancement
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Only prevent default and scroll if the current href is an internal anchor
        if (href && href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
        // If href is no longer a hash (e.g. updated by JS), let the default navigation happen
    });
});

// ===================================
// Performance: Reduce animations on low-end devices
// ===================================

if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.documentElement.style.setProperty('--transition-slow', '0.4s cubic-bezier(0.4, 0, 0.2, 1)');
}

// ===================================
// Initialize
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initializeFirstProject();

    // Preload images for smoother experience
    projectSections.forEach(section => {
        const images = section.querySelectorAll('img');
        images.forEach(img => {
            const preloadImg = new Image();
            preloadImg.src = img.src;
        });
    });
});

// ===================================
// Resize Handler
// ===================================

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate on resize if needed
        handleScroll();
    }, 250);
}, { passive: true });
