// Footer Loader Module
const footerLoader = {
  async loadFooter() {
    try {
      const response = await fetch("components/footer.html");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const footerHtml = await response.text();

      const footerPlaceholder = document.getElementById("footer-placeholder");
      if (footerPlaceholder) {
        footerPlaceholder.innerHTML = footerHtml;
        this.initializeFooter();
      }
    } catch (error) {
      console.error("Error loading footer:", error);
      this.loadFallbackFooter();
    }
  },

  loadFallbackFooter() {
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (footerPlaceholder) {
      footerPlaceholder.innerHTML = `
                <footer class="site-footer">
                    <div class="footer-container">
                        <div class="footer-content">
                            <div class="footer-section">
                                <h3>About NexusGaming</h3>
                                <p>Your premier destination for PC and Xbox games. We offer the latest titles, exclusive deals, and exceptional customer service.</p>
                                <div class="social-links">
                                    <a href="#" class="social-link">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                        </svg>
                                    </a>
                                    <a href="#" class="social-link">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                                        </svg>
                                    </a>
                                    <a href="#" class="social-link">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                            <rect x="2" y="9" width="4" height="12"></rect>
                                            <circle cx="4" cy="4" r="2"></circle>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                            <div class="footer-section">
                                <h3>Quick Links</h3>
                                <div class="footer-links">
                                    <a href="catalog.html" class="footer-link">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M9 12l2 2 4-4"></path>
                                            <path d="M21 12c-1 0-4-1-4-4s3-4 4-4 4 3 4 4-3 4-4 4z"></path>
                                            <path d="M3 12c1 0 4-1 4-4s-3-4-4-4-4 3-4 4 3 4 4 4z"></path>
                                        </svg>
                                        Browse Games
                                    </a>
                                    <a href="contact.html" class="footer-link">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                            <polyline points="22,6 12,13 2,6"></polyline>
                                        </svg>
                                        Contact Us
                                    </a>
                                    <a href="cart.html" class="footer-link">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
                                            <path d="M20 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>
                                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                        </svg>
                                        Shopping Cart
                                    </a>
                                </div>
                            </div>
                            <div class="footer-section">
                                <h3>Newsletter</h3>
                                <p>Stay updated with the latest game releases and exclusive offers.</p>
                                <form class="newsletter-form" id="footer-newsletter-form">
                                    <input type="email" class="newsletter-input" placeholder="Enter your email" required>
                                    <button type="submit" class="newsletter-btn">Subscribe</button>
                                </form>
                            </div>
                        </div>
                        <div class="footer-bottom">
                            <p>&copy; 2024 NexusGaming Store. All rights reserved.</p>
                            <div class="footer-bottom-links">
                                <a href="privacy-spectra.html" class="footer-bottom-link">Privacy Policy</a>
                                <a href="terms-constellation.html" class="footer-bottom-link">Terms of Service</a>
                                <a href="refund-aurora.html" class="footer-bottom-link">Refund Policy</a>
                                <a href="shipping-zenith.html" class="footer-bottom-link">Shipping Info</a>
                            </div>
                        </div>
                    </div>
                </footer>
            `;
      this.initializeFooter();
    }
  },

  initializeFooter() {
    this.initializeNewsletterForm();
    this.initializeSocialLinks();
  },

  initializeNewsletterForm() {
    const newsletterForm = document.getElementById("footer-newsletter-form");
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        this.handleNewsletterSubscription(email);
      });
    }
  },

  handleNewsletterSubscription(email) {
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.showNotification("Please enter a valid email address", "error");
      return;
    }

    // Simulate subscription
    this.showNotification(
      "Thank you for subscribing to our newsletter!",
      "success"
    );
    document.getElementById("footer-newsletter-form").reset();
  },

  initializeSocialLinks() {
    const socialLinks = document.querySelectorAll(".social-link");
    socialLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        this.showNotification("Social media links coming soon!", "info");
      });
    });
  },

  showNotification(message, type = "info") {
    if (window.notificationSystem) {
      window.notificationSystem.show(message, type);
    } else {
      alert(message);
    }
  },
};

// Load footer when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  footerLoader.loadFooter();
});

// Export for use in other modules
window.footerLoader = footerLoader;

// Scroll to Top Button
(function setupScrollToTopLogic() {
  const btn = document.getElementById("scroll-to-top-btn");
  if (!btn) return;

  function getFirstSectionOffset() {
    // Находим первую секцию main > section или просто первый section
    const main = document.querySelector("main");
    let firstSection = main
      ? main.querySelector("section")
      : document.querySelector("section");
    if (firstSection) {
      const rect = firstSection.getBoundingClientRect();
      return rect.top + window.scrollY + rect.height;
    }
    return 400; // fallback
  }

  function onScroll() {
    const triggerOffset = getFirstSectionOffset();
    if (window.scrollY > triggerOffset) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
