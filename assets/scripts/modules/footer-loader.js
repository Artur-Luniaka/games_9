// Footer Loader Module - NexusGaming Hub
class NexusFooterLoader {
  constructor() {
    this.footerContainer = document.getElementById("footer-container");
    this.footerPath = "components/footer.html";
    this.isLoaded = false;
    this.init();
  }

  async init() {
    try {
      await this.loadFooter();
      this.setupEventListeners();
      this.initializeFooterBehavior();
    } catch (error) {
      console.error("Failed to load footer:", error);
      this.createFallbackFooter();
    }
  }

  async loadFooter() {
    const response = await fetch(this.footerPath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const footerHTML = await response.text();
    this.footerContainer.innerHTML = footerHTML;
    this.isLoaded = true;
  }

  setupEventListeners() {
    // Newsletter form
    const newsletterForm = document.getElementById("footer-newsletter-form");
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", (e) => {
        this.handleNewsletterSubmit(e);
      });
    }

    // Social links
    const socialLinks = document.querySelectorAll(".social-link");
    socialLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        this.handleSocialLinkClick(e);
      });
    });

    // Footer links
    const footerLinks = document.querySelectorAll(".footer-links a");
    footerLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        this.handleFooterLinkClick(e);
      });
    });

    // Payment icons
    const paymentIcons = document.querySelectorAll(".payment-icon");
    paymentIcons.forEach((icon) => {
      icon.addEventListener("click", (e) => {
        this.handlePaymentIconClick(e);
      });
    });
  }

  async handleNewsletterSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const input = form.querySelector('input[type="email"]');
    const email = input.value.trim();

    if (!this.validateEmail(email)) {
      this.showNewsletterError("Please enter a valid email address");
      return;
    }

    try {
      // Simulate newsletter subscription
      await this.subscribeToNewsletter(email);
      this.showNewsletterSuccess("Successfully subscribed to newsletter!");
      input.value = "";
      form.classList.add("success");

      setTimeout(() => {
        form.classList.remove("success");
      }, 3000);
    } catch (error) {
      this.showNewsletterError("Failed to subscribe. Please try again.");
    }
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async subscribeToNewsletter(email) {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Store in localStorage for demo purposes
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

  showNewsletterSuccess(message) {
    this.showNotification(message, "success");
  }

  showNewsletterError(message) {
    this.showNotification(message, "error");
  }

  showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `footer-notification ${type}`;
    notification.textContent = message;

    const footer = document.querySelector(".site-footer");
    footer.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.opacity = "1";
      notification.style.transform = "translateY(0)";
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateY(-20px)";
      setTimeout(() => {
        footer.removeChild(notification);
      }, 300);
    }, 3000);
  }

  handleSocialLinkClick(event) {
    event.preventDefault();
    const link = event.currentTarget;
    const platform = link.getAttribute("aria-label").toLowerCase();

    // Add click animation
    link.style.transform = "scale(0.9) rotate(5deg)";
    setTimeout(() => {
      link.style.transform = "";
    }, 200);

    // Simulate social media navigation
    console.log(`Navigating to ${platform}...`);
    // In a real implementation, this would navigate to actual social media profiles
  }

  handleFooterLinkClick(event) {
    const link = event.currentTarget;
    const href = link.getAttribute("href");

    // Add click animation
    link.style.transform = "translateX(10px)";
    setTimeout(() => {
      link.style.transform = "";
    }, 200);

    // Check if it's an external link
    if (href.startsWith("http")) {
      window.open(href, "_blank");
    } else {
      // Internal navigation
      window.location.href = href;
    }
  }

  handlePaymentIconClick(event) {
    const icon = event.currentTarget;

    // Add click animation
    icon.style.transform = "scale(1.2)";
    setTimeout(() => {
      icon.style.transform = "";
    }, 200);

    // Show payment method info
    this.showPaymentInfo(icon);
  }

  showPaymentInfo(icon) {
    const paymentMethods = {
      visa: "Visa - Secure payment processing",
      mastercard: "Mastercard - Worldwide acceptance",
      paypal: "PayPal - Fast and secure checkout",
    };

    const methodName = this.getPaymentMethodName(icon);
    const info = paymentMethods[methodName] || "Secure payment method";

    this.showNotification(info, "info");
  }

  getPaymentMethodName(icon) {
    // Extract payment method name from SVG or class
    const svgContent = icon.innerHTML;
    if (svgContent.includes("visa")) return "visa";
    if (svgContent.includes("mastercard")) return "mastercard";
    if (svgContent.includes("paypal")) return "paypal";
    return "unknown";
  }

  initializeFooterBehavior() {
    // Add entrance animation
    const footer = document.querySelector(".site-footer");
    if (footer) {
      footer.style.opacity = "0";
      footer.style.transform = "translateY(20px)";

      setTimeout(() => {
        footer.style.transition = "all 0.8s ease-out";
        footer.style.opacity = "1";
        footer.style.transform = "translateY(0)";
      }, 200);
    }

    // Initialize social links animation
    this.initializeSocialLinksAnimation();

    // Add scroll-triggered animations
    this.setupScrollAnimations();
  }

  initializeSocialLinksAnimation() {
    const socialLinks = document.querySelectorAll(".social-link");
    socialLinks.forEach((link, index) => {
      link.style.animationDelay = `${index * 0.1}s`;
    });
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    // Observe footer sections
    const footerSections = document.querySelectorAll(".footer-section");
    footerSections.forEach((section) => {
      observer.observe(section);
    });
  }

  createFallbackFooter() {
    const fallbackHTML = `
            <footer class="site-footer">
                <div class="footer-container">
                    <div class="footer-content">
                        <div class="footer-section">
                            <h3 class="footer-title">NexusGaming</h3>
                            <p class="footer-description">
                                Your premier destination for PC and Xbox gaming excellence.
                            </p>
                        </div>
                        <div class="footer-section">
                            <h3 class="footer-title">Quick Links</h3>
                            <ul class="footer-links">
                                <li><a href="catalog.html">Games</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="footer-bottom">
                        <div class="footer-bottom-content">
                            <p class="copyright">
                                © 2024 NexusGaming Hub. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        `;

    this.footerContainer.innerHTML = fallbackHTML;
    this.isLoaded = true;
  }

  // Public method to refresh footer content
  refreshFooter() {
    this.loadFooter();
  }
}

// Initialize footer loader when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.nexusFooterLoader = new NexusFooterLoader();
});

// Export for use in other modules
export default NexusFooterLoader;
