// Header Loader Module - NexusGaming Hub
class NexusHeaderLoader {
  constructor() {
    this.headerContainer = document.getElementById("header-container");
    this.headerPath = "components/header.html";
    this.isLoaded = false;
    this.init();
  }

  async init() {
    try {
      await this.loadHeader();
      this.setupEventListeners();
      this.initializeHeaderBehavior();
    } catch (error) {
      console.error("Failed to load header:", error);
      this.createFallbackHeader();
    }
  }

  async loadHeader() {
    const response = await fetch(this.headerPath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const headerHTML = await response.text();
    this.headerContainer.innerHTML = headerHTML;
    this.isLoaded = true;
  }

  setupEventListeners() {
    // Mobile menu toggle
    const mobileToggle = document.getElementById("mobile-menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");

    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener("click", () => {
        this.toggleMobileMenu(mobileToggle, mobileMenu);
      });
    }

    // Cart button
    const cartButton = document.getElementById("cart-button");
    if (cartButton) {
      cartButton.addEventListener("click", () => {
        this.handleCartClick();
      });
    }

    // Navigation links
    const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        this.handleNavLinkClick(e);
      });
    });

    // Scroll behavior
    window.addEventListener("scroll", () => {
      this.handleScroll();
    });
  }

  toggleMobileMenu(toggle, menu) {
    const isActive = toggle.classList.contains("active");

    if (isActive) {
      toggle.classList.remove("active");
      menu.classList.remove("active");
      document.body.style.overflow = "";
    } else {
      toggle.classList.add("active");
      menu.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  handleCartClick() {
    // Navigate to cart page or open cart modal
    window.location.href = "cart.html";
  }

  handleNavLinkClick(event) {
    const link = event.currentTarget;
    const href = link.getAttribute("href");

    // Close mobile menu if open
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileToggle = document.getElementById("mobile-menu-toggle");

    if (mobileMenu && mobileMenu.classList.contains("active")) {
      this.toggleMobileMenu(mobileToggle, mobileMenu);
    }

    // Add click animation
    link.style.transform = "scale(0.95)";
    setTimeout(() => {
      link.style.transform = "";
    }, 150);
  }

  handleScroll() {
    const header = document.querySelector(".site-header");
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Hero section transparency effect
    const heroSection = document.getElementById("hero-section");
    if (heroSection && scrollTop < heroSection.offsetHeight) {
      const opacity = 1 - scrollTop / heroSection.offsetHeight;
      header.style.background = `rgba(255, 255, 255, ${opacity * 0.95})`;
    }
  }

  initializeHeaderBehavior() {
    // Initialize cart count
    this.updateCartCount();

    // Add entrance animation
    const header = document.querySelector(".site-header");
    if (header) {
      header.style.opacity = "0";
      header.style.transform = "translateY(-20px)";

      setTimeout(() => {
        header.style.transition = "all 0.6s ease-out";
        header.style.opacity = "1";
        header.style.transform = "translateY(0)";
      }, 100);
    }

    // Add body padding for fixed header
    document.body.style.paddingTop = "80px";
  }

  updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    if (cartCount) {
      const cart = this.getCartFromStorage();
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

      cartCount.textContent = totalItems;

      if (totalItems > 0) {
        cartCount.classList.add("updated");
        setTimeout(() => {
          cartCount.classList.remove("updated");
        }, 300);
      }
    }
  }

  getCartFromStorage() {
    try {
      const cartData = localStorage.getItem("nexusGamingCart");
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error("Error reading cart from storage:", error);
      return [];
    }
  }

  createFallbackHeader() {
    const fallbackHTML = `
            <header class="site-header">
                <div class="header-container">
                    <div class="header-logo">
                        <a href="./" class="logo-link">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                          </svg>
                          <span class="logo-text">RewardTheSkillPlay.com</span>
                        </a>
                    </div>
                    <nav class="header-navigation">
                        <ul class="nav-list">
                            <li><a href="./" class="nav-link">Home</a></li>
                            <li><a href="catalog.html" class="nav-link">Games</a></li>
                            <li><a href="#" class="nav-link" id="contact-link-fallback">Contact</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        `;

    this.headerContainer.innerHTML = fallbackHTML;
    this.isLoaded = true;
  }

  // Public method to update cart count from other modules
  refreshCartCount() {
    this.updateCartCount();
  }
}

// Initialize header loader when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new NexusHeaderLoader();

  function assignContactModalHandlers() {
    [
      document.getElementById("contact-link"),
      document.getElementById("contact-link-mobile"),
    ].forEach((btn) => {
      if (btn) {
        btn.onclick = function (e) {
          e.preventDefault();
          if (window.openContactModal) window.openContactModal();
        };
      }
    });
  }
  assignContactModalHandlers();
  setTimeout(assignContactModalHandlers, 500);
});

// Export for use in other modules
export default NexusHeaderLoader;
