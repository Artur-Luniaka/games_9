// Header Loader Module
const headerLoader = {
  async loadHeader() {
    try {
      const response = await fetch("components/header.html");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const headerHtml = await response.text();

      const headerPlaceholder = document.getElementById("header-placeholder");
      if (headerPlaceholder) {
        headerPlaceholder.innerHTML = headerHtml;
        this.initializeHeader();
      }
    } catch (error) {
      console.error("Error loading header:", error);
      this.loadFallbackHeader();
    }
  },

  loadFallbackHeader() {
    const headerPlaceholder = document.getElementById("header-placeholder");
    if (headerPlaceholder) {
      headerPlaceholder.innerHTML = `
                <header class="site-header">
                    <div class="header-container">
                        <a href="./" class="logo">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                            </svg>
                            <span>RewardTheSkillPlay.com</span>
                        </a>
                        <nav class="nav-menu">
                            <a href="./" class="nav-link">Home</a>
                            <a href="catalog.html" class="nav-link">Catalog</a>
                            <button type="button" class="nav-link" id="contact-link-fallback">Contact</button>
                        </nav>
                        <div class="header-actions">
                            <a href="cart.html" class="cart-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
                                    <path d="M20 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                                <span class="cart-count" id="header-cart-count">0</span>
                            </a>
                            <div class="burger-menu" id="burger-menu">
                                <div class="burger-line"></div>
                                <div class="burger-line"></div>
                                <div class="burger-line"></div>
                            </div>
                        </div>
                    </div>
                    <nav class="mobile-nav" id="mobile-nav">
                        <div class="nav-menu">
                            <a href="./" class="nav-link">Home</a>
                            <a href="catalog.html" class="nav-link">Catalog</a>
                            <button type="button" class="nav-link" id="contact-link-fallback-mobile">Contact</button>
                        </div>
                    </nav>
                </header>
            `;
      this.initializeHeader();
    }
  },

  initializeHeader() {
    this.updateCartCount();
    this.initializeBurgerMenu();
    this.initializeCartIcon();
    this.initializeContactButtons();
  },

  updateCartCount() {
    const cartCount = document.getElementById("header-cart-count");
    if (cartCount) {
      const cart = JSON.parse(localStorage.getItem("nexusCart") || "[]");
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

      if (totalItems > 0) {
        cartCount.textContent = totalItems;
        cartCount.classList.add("show");
      } else {
        cartCount.classList.remove("show");
      }
    }
  },

  initializeBurgerMenu() {
    const burgerMenu = document.getElementById("burger-menu");
    const mobileNav = document.getElementById("mobile-nav");

    if (burgerMenu && mobileNav) {
      burgerMenu.addEventListener("click", () => {
        burgerMenu.classList.toggle("active");
        mobileNav.classList.toggle("active");
      });

      // Close mobile menu when clicking on a link
      const mobileLinks = mobileNav.querySelectorAll(".nav-link");
      mobileLinks.forEach((link) => {
        link.addEventListener("click", () => {
          burgerMenu.classList.remove("active");
          mobileNav.classList.remove("active");
        });
      });
    }
  },

  initializeCartIcon() {
    const cartIcon = document.querySelector(".cart-icon");
    if (cartIcon) {
      cartIcon.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "cart.html";
      });
    }
  },

  initializeContactButtons() {
    // Setup contact buttons in fallback header
    const contactButtons = [
      document.getElementById("contact-link-fallback"),
      document.getElementById("contact-link-fallback-mobile"),
    ];

    contactButtons.forEach((button) => {
      if (button && !button.hasAttribute("data-contact-initialized")) {
        button.setAttribute("data-contact-initialized", "true");
        button.addEventListener("click", (e) => {
          e.preventDefault();
          if (window.openContactModal) {
            window.openContactModal();
          } else {
            console.warn("openContactModal function not available");
          }
        });
      }
    });
  },
};

// Load header when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  headerLoader.loadHeader();
});

// Listen for cart updates
document.addEventListener("cartUpdated", () => {
  headerLoader.updateCartCount();
});

// Export for use in other modules
window.headerLoader = headerLoader;
