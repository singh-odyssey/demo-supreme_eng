const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
    });
  });
}

const revealNodes = document.querySelectorAll(".reveal, .reveal-delay");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealNodes.forEach((node) => observer.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("show"));
}

const counters = document.querySelectorAll("[data-counter]");
let countersStarted = false;

const startCounters = () => {
  if (countersStarted) return;
  countersStarted = true;

  counters.forEach((counter) => {
    const target = Number(counter.dataset.counter || 0);
    const duration = 1400;
    const start = performance.now();

    const tick = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      counter.textContent = Math.floor(progress * target).toString();

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  });
};

const heroStats = document.querySelector(".hero-stats");
if (heroStats && "IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startCounters();
          counterObserver.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  counterObserver.observe(heroStats);
} else {
  startCounters();
}

const productCards = document.querySelectorAll(".product-card");

productCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 8;
    const rotateX = (0.5 - (y / rect.height)) * 8;

    card.style.transform = `translateY(-8px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});
