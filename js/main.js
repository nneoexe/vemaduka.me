// ========== Mobile nav toggle ==========
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});

// ========== Typing effect ==========
const tagline = document.querySelector(".hero-tagline");
const fullText = tagline.dataset.text;
let charIndex = 0;

function typeChar() {
  if (charIndex < fullText.length) {
    tagline.textContent += fullText[charIndex];
    charIndex++;
    setTimeout(typeChar, 35 + Math.random() * 25);
  } else {
    tagline.classList.add("typed");
  }
}
setTimeout(typeChar, 600);

// ========== Floating particles ==========
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  const hero = document.getElementById("hero");
  canvas.width = hero.offsetWidth;
  canvas.height = hero.offsetHeight;
}

function createParticles() {
  particles = [];
  const count = Math.floor((canvas.width * canvas.height) / 12000);
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  particles.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = isLight
      ? `rgba(109, 74, 255, ${p.opacity * 0.5})`
      : `rgba(167, 139, 250, ${p.opacity})`;
    ctx.fill();
    p.x += p.speedX;
    p.y += p.speedY;
    if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
  });
  requestAnimationFrame(drawParticles);
}

resizeCanvas();
createParticles();
drawParticles();
window.addEventListener("resize", () => { resizeCanvas(); createParticles(); });

// ========== Tilt effect on project cards ==========
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// ========== Project filtering ==========
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const projectsGrid = document.querySelector(".projects-grid");
const carouselPrev = document.querySelector(".carousel-prev");
const carouselNext = document.querySelector(".carousel-next");

function updateCarouselBtns() {
  if (!projectsGrid.classList.contains("carousel-mode")) {
    carouselPrev.classList.add("carousel-hidden");
    carouselNext.classList.add("carousel-hidden");
    return;
  }
  carouselPrev.classList.toggle("carousel-hidden", projectsGrid.scrollLeft <= 0);
  carouselNext.classList.toggle("carousel-hidden",
    projectsGrid.scrollLeft + projectsGrid.clientWidth >= projectsGrid.scrollWidth - 2);
}

function scrollCarousel(direction) {
  const card = projectsGrid.querySelector(".project-card:not(.hidden)");
  if (!card) return;
  const scrollAmount = card.offsetWidth + 24;
  projectsGrid.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
}

carouselPrev.addEventListener("click", () => scrollCarousel(-1));
carouselNext.addEventListener("click", () => scrollCarousel(1));
projectsGrid.addEventListener("scroll", updateCarouselBtns);

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    if (filter === "all") {
      projectsGrid.classList.add("carousel-mode");
      projectCards.forEach((card) => card.classList.remove("hidden"));
      projectsGrid.scrollLeft = 0;
    } else {
      projectsGrid.classList.remove("carousel-mode");
      projectCards.forEach((card) => {
        if (card.dataset.tags === filter) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    }
    updateCarouselBtns();
  });
});

updateCarouselBtns();

// ========== Project modal ==========
const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalTag = document.getElementById("modalTag");
const modalDesc = document.getElementById("modalDesc");
const modalTech = document.getElementById("modalTech");
const modalGithub = document.getElementById("modalGithub");

document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("click", (e) => {
    if (e.target.closest(".project-link")) return;

    modalTitle.textContent = card.querySelector(".project-name").textContent;
    modalTag.textContent = card.querySelector(".project-tag").textContent;
    modalDesc.textContent = card.dataset.detail || card.querySelector(".project-desc").textContent;
    modalGithub.href = card.dataset.github || "#";

    modalTech.innerHTML = "";
    card.querySelectorAll(".project-tech li").forEach((li) => {
      const newLi = document.createElement("li");
      newLi.textContent = li.textContent;
      modalTech.appendChild(newLi);
    });

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  });
});

document.querySelector(".modal-close").addEventListener("click", () => {
  modal.classList.remove("active");
  document.body.style.overflow = "";
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("active")) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
});

// ========== Staggered scroll fade-in ==========
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -40px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

// Sections
document.querySelectorAll(".section").forEach((el) => {
  el.classList.add("fade-in");
  observer.observe(el);
});

// Stagger project cards, timeline items, now cards, skills categories
[".project-card", ".timeline-item", ".now-card", ".skills-category"].forEach((selector) => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add("fade-in", `stagger-${Math.min(i + 1, 8)}`);
    observer.observe(el);
  });
});

// ========== Animated skill bars on scroll ==========
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll(".skill-tag").forEach((tag, i) => {
        setTimeout(() => tag.classList.add("animate"), i * 80);
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll(".skills-category").forEach((cat) => {
  skillObserver.observe(cat);
});

// ========== Easter egg - Konami code ==========
const konamiCode = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a"
];
let konamiIndex = 0;
const easterEgg = document.getElementById("easterEgg");

document.addEventListener("keydown", (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      easterEgg.classList.add("active");
      konamiIndex = 0;
      setTimeout(() => easterEgg.classList.remove("active"), 3000);
    }
  } else {
    konamiIndex = 0;
  }
});

// ========== Active nav link on scroll ==========
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY + 100;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);

    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        link.style.color = "var(--accent-bright)";
      } else {
        link.style.color = "";
      }
    }
  });
});
