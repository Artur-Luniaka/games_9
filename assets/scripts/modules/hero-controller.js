// Hero Controller Module - NexusGaming Hub
class NexusHeroController {
  constructor() {
    this.currentSlide = 1;
    this.totalSlides = 3;
    this.slideInterval = 3000; // 3 seconds
    this.intervalId = null;
    this.isAnimating = false;
    this.heroSection = null;
    this.slides = [];
    this.actionButtons = [];
    this.init();
  }

  init() {
    this.heroSection = document.getElementById("hero-section");
    if (!this.heroSection) {
      console.warn("Hero section not found");
      return;
    }

    this.setupSlides();
    this.setupActionButtons();
    this.startSlideShow();
    this.setupIntersectionObserver();
    this.addParallaxEffect();
  }

  setupSlides() {
    this.slides = this.heroSection.querySelectorAll(".hero-slide");

    if (this.slides.length === 0) {
      console.warn("No slides found in hero section");
      return;
    }

    // Initialize first slide
    this.slides.forEach((slide, index) => {
      slide.style.zIndex = index === 0 ? 2 : 1;
    });

    // Add slide transition effects
    this.slides.forEach((slide) => {
      slide.addEventListener("transitionend", () => {
        this.isAnimating = false;
      });
    });
  }

  setupActionButtons() {
    this.actionButtons = this.heroSection.querySelectorAll(".action-btn");

    this.actionButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        this.handleActionButtonClick(e);
      });

      // Add hover effects
      button.addEventListener("mouseenter", () => {
        this.addButtonHoverEffect(button);
      });

      button.addEventListener("mouseleave", () => {
        this.removeButtonHoverEffect(button);
      });
    });
  }

  handleActionButtonClick(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const action = button.getAttribute("data-action");

    // Add click animation
    this.addButtonClickEffect(button);

    // Handle different actions
    switch (action) {
      case "explore":
        this.navigateToCatalog();
        break;
      case "deals":
        this.navigateToDeals();
        break;
      case "newsletter":
        this.openNewsletterModal();
        break;
      default:
        console.log("Unknown action:", action);
    }
  }

  addButtonClickEffect(button) {
    button.style.transform = "scale(0.95)";
    button.style.transition = "transform 0.1s ease";

    setTimeout(() => {
      button.style.transform = "";
      button.style.transition = "";
    }, 100);
  }

  addButtonHoverEffect(button) {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    button.style.setProperty("--mouse-x", `${x}px`);
    button.style.setProperty("--mouse-y", `${y}px`);
  }

  removeButtonHoverEffect(button) {
    button.style.removeProperty("--mouse-x");
    button.style.removeProperty("--mouse-y");
  }

  navigateToCatalog() {
    // Add transition effect
    this.heroSection.style.opacity = "0";
    this.heroSection.style.transform = "translateY(-20px)";

    setTimeout(() => {
      window.location.href = "catalog.html";
    }, 300);
  }

  navigateToDeals() {
    // Add transition effect
    this.heroSection.style.opacity = "0";
    this.heroSection.style.transform = "translateY(-20px)";

    setTimeout(() => {
      window.location.href = "deals.html";
    }, 300);
  }

  openNewsletterModal() {
    // Create and show newsletter modal
    this.createNewsletterModal();
  }

  createNewsletterModal() {
    const modal = document.createElement("div");
    modal.className = "newsletter-modal";
    modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close" aria-label="Close modal">×</button>
                <h2>Join Our Gaming Community</h2>
                <p>Get exclusive deals, gaming news, and updates delivered to your inbox.</p>
                <form class="modal-form">
                    <div class="input-group">
                        <input type="email" placeholder="Enter your email" required>
                        <button type="submit">Subscribe</button>
                    </div>
                </form>
            </div>
        `;

    // Add modal styles
    const style = document.createElement("style");
    style.textContent = `
            .newsletter-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: modalFadeIn 0.3s ease-out;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
            }
            
            .modal-content {
                position: relative;
                background: var(--white);
                padding: var(--spacing-2xl);
                border-radius: var(--radius-lg);
                max-width: 500px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: modalSlideIn 0.3s ease-out;
            }
            
            .modal-close {
                position: absolute;
                top: var(--spacing-md);
                right: var(--spacing-md);
                background: none;
                border: none;
                font-size: var(--font-size-2xl);
                cursor: pointer;
                color: var(--text-secondary);
                transition: color var(--transition-normal);
            }
            
            .modal-close:hover {
                color: var(--primary-color);
            }
            
            .modal-form {
                margin-top: var(--spacing-xl);
            }
            
            .modal-form .input-group {
                display: flex;
                gap: var(--spacing-sm);
            }
            
            .modal-form input {
                flex: 1;
                padding: var(--spacing-md);
                border: 2px solid var(--background-light);
                border-radius: var(--radius-md);
                font-size: var(--font-size-base);
            }
            
            .modal-form button {
                padding: var(--spacing-md) var(--spacing-lg);
                background: var(--primary-color);
                color: var(--white);
                border: none;
                border-radius: var(--radius-md);
                cursor: pointer;
                font-weight: 600;
                transition: all var(--transition-normal);
            }
            
            .modal-form button:hover {
                background: var(--secondary-color);
                transform: translateY(-2px);
            }
            
            @keyframes modalFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes modalSlideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;

    document.head.appendChild(style);
    document.body.appendChild(modal);

    // Setup modal events
    const closeBtn = modal.querySelector(".modal-close");
    const overlay = modal.querySelector(".modal-overlay");
    const form = modal.querySelector(".modal-form");

    closeBtn.addEventListener("click", () => this.closeModal(modal));
    overlay.addEventListener("click", () => this.closeModal(modal));

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleNewsletterSubmit(e, modal);
    });

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeModal(modal);
      }
    });
  }

  closeModal(modal) {
    modal.style.animation = "modalFadeOut 0.3s ease-out";
    setTimeout(() => {
      document.body.removeChild(modal);
    }, 300);
  }

  async handleNewsletterSubmit(event, modal) {
    const form = event.target;
    const input = form.querySelector('input[type="email"]');
    const email = input.value.trim();

    if (!this.validateEmail(email)) {
      this.showModalError("Please enter a valid email address");
      return;
    }

    try {
      // Simulate subscription
      await this.subscribeToNewsletter(email);
      this.showModalSuccess("Successfully subscribed!");
      setTimeout(() => {
        this.closeModal(modal);
      }, 2000);
    } catch (error) {
      this.showModalError("Failed to subscribe. Please try again.");
    }
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async subscribeToNewsletter(email) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const subscribers = JSON.parse(
          localStorage.getItem("newsletterSubscribers") || "[]"
        );
        if (!subscribers.includes(email)) {
          subscribers.push(email);
          localStorage.setItem(
            "newsletterSubscribers",
            JSON.stringify(subscribers)
          );
        }
        resolve();
      }, 1000);
    });
  }

  showModalSuccess(message) {
    this.showModalNotification(message, "success");
  }

  showModalError(message) {
    this.showModalNotification(message, "error");
  }

  showModalNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `modal-notification ${type}`;
    notification.textContent = message;

    const modal = document.querySelector(".newsletter-modal .modal-content");
    modal.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  startSlideShow() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, this.slideInterval);
  }

  stopSlideShow() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  nextSlide() {
    if (this.isAnimating) return;

    this.isAnimating = true;
    const nextSlideIndex = this.currentSlide % this.totalSlides;

    // Remove active class from current slide
    const currentSlide = this.heroSection.querySelector(
      `[data-slide="${this.currentSlide}"]`
    );
    if (currentSlide) {
      currentSlide.classList.remove("active");
    }

    // Add active class to next slide
    const nextSlide = this.heroSection.querySelector(
      `[data-slide="${nextSlideIndex + 1}"]`
    );
    if (nextSlide) {
      nextSlide.classList.add("active");
    }

    this.currentSlide = nextSlideIndex + 1;
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Hero section is visible, start slideshow
            this.startSlideShow();
          } else {
            // Hero section is not visible, stop slideshow
            this.stopSlideShow();
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    observer.observe(this.heroSection);
  }

  addParallaxEffect() {
    window.addEventListener("scroll", () => {
      if (!this.heroSection) return;

      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;

      this.heroSection.style.transform = `translateY(${rate}px)`;
    });
  }

  // Public methods
  pauseSlideShow() {
    this.stopSlideShow();
  }

  resumeSlideShow() {
    this.startSlideShow();
  }

  goToSlide(slideNumber) {
    if (slideNumber < 1 || slideNumber > this.totalSlides) return;

    this.stopSlideShow();
    this.currentSlide = slideNumber;

    // Update all slides
    this.slides.forEach((slide, index) => {
      if (index + 1 === slideNumber) {
        slide.classList.add("active");
      } else {
        slide.classList.remove("active");
      }
    });

    // Resume slideshow after a delay
    setTimeout(() => {
      this.startSlideShow();
    }, 5000);
  }

  // Cleanup method
  destroy() {
    this.stopSlideShow();
    // Remove event listeners and clean up
  }
}

// Initialize hero controller when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.nexusHeroController = new NexusHeroController();
});

// Export for use in other modules
export default NexusHeroController;
