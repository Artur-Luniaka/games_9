// Hero Controller Module
const heroController = {
  currentSlide: 0,
  slides: [
    {
      id: 1,
      background: "assets/public/hero-bg1.jpg",
    },
    {
      id: 2,
      background: "assets/public/hero-bg2.jpg",
    },
    {
      id: 3,
      background: "assets/public/hero-bg3.jpg",
    },
  ],
  slideInterval: null,

  initialize() {
    this.setupSlides();
    this.startSlideShow();
    this.initializeParallax();
    this.initializeAnimations();
  },

  setupSlides() {
    const heroBackground = document.querySelector(".hero-background");
    if (!heroBackground) return;

    // Clear existing slides
    const existingSlides = heroBackground.querySelectorAll(".hero-slide");
    existingSlides.forEach((slide) => slide.remove());

    // Create slides from data
    this.slides.forEach((slide, index) => {
      const slideElement = document.createElement("div");
      slideElement.className = `hero-slide ${index === 0 ? "active" : ""}`;
      slideElement.dataset.slide = slide.id;
      slideElement.style.backgroundImage = `url('${slide.background}')`;
      heroBackground.appendChild(slideElement);
    });
  },

  startSlideShow() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  },

  nextSlide() {
    const slides = document.querySelectorAll(".hero-slide");
    if (slides.length === 0) return;

    // Remove active class from current slide
    slides[this.currentSlide].classList.remove("active");

    // Move to next slide
    this.currentSlide = (this.currentSlide + 1) % slides.length;

    // Add active class to new slide
    slides[this.currentSlide].classList.add("active");
  },

  initializeParallax() {
    const heroSection = document.querySelector(".hero-section");
    const heroContent = document.querySelector(".hero-content");
    if (!heroSection || !heroContent) return;
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      if (heroContent) {
        heroContent.style.transform = `translateY(${rate}px)`;
      }
    });
  },

  initializeAnimations() {
    const buttons = document.querySelectorAll(".hero-content .action-btn");
    buttons.forEach((button, index) => {
      button.style.animationDelay = `${0.8 + index * 0.1}s`;
    });
  },

  pauseSlideShow() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  },

  resumeSlideShow() {
    if (!this.slideInterval) {
      this.startSlideShow();
    }
  },

  goToSlide(slideIndex) {
    const slides = document.querySelectorAll(".hero-slide");
    if (slideIndex < 0 || slideIndex >= slides.length) return;

    // Remove active class from current slide
    slides[this.currentSlide].classList.remove("active");

    // Set new slide
    this.currentSlide = slideIndex;

    // Add active class to new slide
    slides[this.currentSlide].classList.add("active");
  },
};

// Функция для прокрутки к секции Live Game Showcase
function scrollToShowcase() {
  const showcaseSection = document.querySelector(".live-showcase-section");
  if (showcaseSection) {
    showcaseSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  heroController.initialize();
});

// Pause slideshow when page is not visible
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    heroController.pauseSlideShow();
  } else {
    heroController.resumeSlideShow();
  }
});

// Export for use in other modules
window.heroController = heroController;
window.scrollToShowcase = scrollToShowcase;
