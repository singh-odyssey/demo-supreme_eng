const loadComponents = async () => {
  let includeNodes = Array.from(document.querySelectorAll("[data-include]"));

  while (includeNodes.length > 0) {
    await Promise.all(
      includeNodes.map(async (node) => {
        const source = node.getAttribute("data-include");
        if (!source) return;

        try {
          const response = await fetch(source);
          if (!response.ok) {
            throw new Error(`Failed to load ${source}: ${response.status}`);
          }

          node.innerHTML = await response.text();
        } catch (error) {
          console.error(error);
        } finally {
          node.removeAttribute("data-include");
        }
      })
    );

    includeNodes = Array.from(document.querySelectorAll("[data-include]"));
  }
};

const initNavigation = () => {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (menuToggle && mainNav) {
    const isMobileNav = () => window.matchMedia("(max-width: 760px)").matches;

    menuToggle.addEventListener("click", () => {
      mainNav.classList.toggle("open");
    });

    const submenuTriggers = mainNav.querySelectorAll("[data-submenu-trigger]");
    submenuTriggers.forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        if (!isMobileNav()) return;

        const parentItem = trigger.closest(".has-dropdown, .has-submenu");
        if (!parentItem) return;

        event.preventDefault();
        parentItem.classList.toggle("open");
      });
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (isMobileNav() && link.hasAttribute("data-submenu-trigger")) {
          return;
        }

        mainNav.classList.remove("open");

        mainNav
          .querySelectorAll(".has-dropdown.open, .has-submenu.open")
          .forEach((node) => node.classList.remove("open"));
      });
    });

    window.addEventListener("resize", () => {
      if (isMobileNav()) return;

      mainNav
        .querySelectorAll(".has-dropdown.open, .has-submenu.open")
        .forEach((node) => node.classList.remove("open"));
    });
  }
};

const initReveal = () => {
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
};

const initCounters = () => {
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
};

const initCardTilt = () => {
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
};

const initReviewsSlider = () => {
  const slider = document.querySelector(".reviews-slider");
  if (!slider) return;

  const track = slider.querySelector(".reviews-slider-track");
  if (!track) return;

  const slides = Array.from(track.querySelectorAll(".review-slide"));
  if (slides.length <= 1) return;

  const prevBtn = slider.querySelector(".reviews-arrow-prev");
  const nextBtn = slider.querySelector(".reviews-arrow-next");

  let currentIndex = 0;
  let intervalId = null;
  const intervalMs = Number(slider.dataset.interval || 4500);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const getVisibleCount = () => {
    const visible = Number(getComputedStyle(slider).getPropertyValue("--reviews-visible").trim());
    return Number.isFinite(visible) && visible > 0 ? visible : 1;
  };

  const getStepSize = () => {
    const firstSlide = slides[0];
    if (!firstSlide) return 0;
    const slideWidth = firstSlide.getBoundingClientRect().width;
    const trackStyles = getComputedStyle(track);
    const gap = Number.parseFloat(trackStyles.gap || trackStyles.columnGap || "0") || 0;
    return slideWidth + gap;
  };

  const getMaxIndex = () => Math.max(slides.length - getVisibleCount(), 0);

  const updateArrowState = () => {
    const maxIndex = getMaxIndex();
    const disabled = maxIndex === 0;

    if (prevBtn) prevBtn.disabled = disabled;
    if (nextBtn) nextBtn.disabled = disabled;
  };

  const goToSlide = (index) => {
    const maxIndex = getMaxIndex();
    if (maxIndex === 0) {
      currentIndex = 0;
      track.style.transform = "translateX(0px)";
      updateArrowState();
      return;
    }

    if (index < 0) {
      currentIndex = maxIndex;
    } else if (index > maxIndex) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    const step = getStepSize();
    track.style.transform = `translateX(-${currentIndex * step}px)`;
    updateArrowState();
  };

  const stopAutoplay = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  const startAutoplay = () => {
    if (prefersReducedMotion) return;
    if (getMaxIndex() === 0) return;
    stopAutoplay();
    intervalId = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, intervalMs);
  };

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      goToSlide(currentIndex - 1);
      startAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      goToSlide(currentIndex + 1);
      startAutoplay();
    });
  }

  slider.addEventListener("mouseenter", stopAutoplay);
  slider.addEventListener("mouseleave", startAutoplay);

  window.addEventListener("resize", () => {
    goToSlide(currentIndex);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplay();
      return;
    }

    startAutoplay();
  });

  goToSlide(0);
  startAutoplay();
};

const applyLazyLoadingToImages = (root) => {
  if (!root || typeof root.querySelectorAll !== "function") return;

  root.querySelectorAll("img").forEach((image) => {
    if (!image.hasAttribute("loading")) {
      image.setAttribute("loading", "lazy");
    }

    if (!image.hasAttribute("decoding")) {
      image.setAttribute("decoding", "async");
    }
  });
};

const initImageLazyLoading = () => {
  applyLazyLoadingToImages(document);

  if (!("MutationObserver" in window) || !document.body) return;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;

        if (node.tagName === "IMG") {
          if (!node.hasAttribute("loading")) {
            node.setAttribute("loading", "lazy");
          }
          if (!node.hasAttribute("decoding")) {
            node.setAttribute("decoding", "async");
          }
          return;
        }

        applyLazyLoadingToImages(node);
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

const initPage = async () => {
  await loadComponents();
  initImageLazyLoading();
  initNavigation();
  initReveal();
  initCounters();
  initCardTilt();
  initReviewsSlider();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPage);
} else {
  initPage();
}
