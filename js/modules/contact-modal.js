// Contact Modal Module
const contactModal = {
  modal: null,
  overlay: null,
  closeBtn: null,
  form: null,
  nameInput: null,
  emailInput: null,
  phoneInput: null,
  messageInput: null,
  isInitialized: false,

  init() {
    if (this.isInitialized) return;

    // Create modal if it doesn't exist
    this.createModal();

    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setupModal());
    } else {
      this.setupModal();
    }
  },

  createModal() {
    // Check if modal already exists
    if (document.getElementById("contact-modal")) return;

    // Create modal HTML
    const modalHTML = `
      <div
        id="contact-modal"
        class="contact-modal"
        aria-modal="true"
        role="dialog"
        tabindex="-1"
        style="display: none"
      >
        <div class="modal-overlay" id="contact-modal-overlay"></div>
        <div class="modal-content contact-modal-content">
          <div class="modal-header">
            <h2 class="modal-title gradient-text">Contact Us</h2>
            <button
              class="modal-close"
              id="contact-modal-close"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
          <div class="contact-modal-scroll">
            <form
              class="contact-form"
              id="contact-form"
              autocomplete="off"
              novalidate
            >
              <div class="form-group">
                <label for="contact-name">Name</label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  required
                  placeholder="Your name"
                />
                <div class="form-error" id="contact-name-error"></div>
              </div>
              <div class="form-group">
                <label for="contact-email">Email</label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  required
                  placeholder="Your email"
                />
                <div class="form-error" id="contact-email-error"></div>
              </div>
              <div class="form-group">
                <label for="contact-phone">Phone</label>
                <input
                  type="tel"
                  id="contact-phone"
                  name="phone"
                  placeholder="Your phone (optional)"
                />
                <div class="form-error" id="contact-phone-error"></div>
              </div>
              <div class="form-group">
                <label for="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  placeholder="Your message"
                  rows="4"
                ></textarea>
                <div class="form-error" id="contact-message-error"></div>
              </div>
              <button type="submit" class="contact-submit-btn gradient-btn">
                Send Message
              </button>
            </form>
            <div class="contact-info-block">
              <h3>Contact Information</h3>
              <ul>
                <li>
                  <strong>Email:</strong>
                  support@nexusgaming.com
                </li>
                <li>
                  <strong>Phone:</strong>
                  +1 234 567 890
                </li>
                <li><strong>Address:</strong> 123 Game St, Cyber City, 10101</li>
              </ul>
            </div>
            <div class="contact-map-block">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.3056759492795!2d147.30816347531865!3d-42.87129727915501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xaa6e75a8a7cb0a73%3A0xa646305ba6b867b4!2s14%20Elphinstone%20Rd%2C%20Mount%20Stuart%20TAS%207000%2C%20Australia!5e0!3m2!1sen!2sau!4v1718389223400!5m2!1sen!2sau"
                style="
                  border: 0;
                  width: 100%;
                  height: 120px;
                  border-radius: 12px;
                  margin-top: 1rem;
                "
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="Our Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add modal to body
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  },

  setupModal() {
    // Get modal elements
    this.modal = document.getElementById("contact-modal");
    this.overlay = document.getElementById("contact-modal-overlay");
    this.closeBtn = document.getElementById("contact-modal-close");
    this.form = document.getElementById("contact-form");
    this.nameInput = document.getElementById("contact-name");
    this.emailInput = document.getElementById("contact-email");
    this.phoneInput = document.getElementById("contact-phone");
    this.messageInput = document.getElementById("contact-message");

    // Check if modal exists
    if (!this.modal) {
      console.warn("Contact modal not found in DOM");
      return;
    }

    // Setup event listeners
    this.setupEventListeners();

    // Setup form validation
    this.setupFormValidation();

    // Setup contact links
    this.setupContactLinks();

    // Add loader animation
    this.addLoaderAnimation();

    this.isInitialized = true;
    console.log("Contact modal initialized successfully");
  },

  setupEventListeners() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.closeModal());
    }

    if (this.overlay) {
      this.overlay.addEventListener("click", () => this.closeModal());
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal.classList.contains("open")) {
        this.closeModal();
      }
    });
  },

  setupFormValidation() {
    if (!this.form) return;

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!this.validate()) return;
      this.handleSubmit();
    });
  },

  setupContactLinks() {
    // Function to setup contact links
    const setupLinks = () => {
      const contactLinks = [
        document.getElementById("contact-link"),
        document.getElementById("contact-link-mobile"),
        document.getElementById("contact-link-fallback"),
        document.getElementById("contact-link-fallback-mobile"),
      ];

      contactLinks.forEach((link) => {
        if (link && !link.hasAttribute("data-contact-initialized")) {
          link.setAttribute("data-contact-initialized", "true");
          link.addEventListener("click", (e) => {
            e.preventDefault();
            this.openModal();
          });
        }
      });
    };

    // Setup links immediately
    setupLinks();

    // Setup links after a delay to catch dynamically loaded content
    setTimeout(setupLinks, 100);
    setTimeout(setupLinks, 500);
    setTimeout(setupLinks, 1000);

    // Also setup links when header is loaded
    document.addEventListener("headerLoaded", setupLinks);
  },

  openModal() {
    if (!this.modal) {
      console.error("Contact modal not found");
      return;
    }

    this.modal.classList.add("open");
    this.modal.style.display = "flex";
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      if (this.nameInput) this.nameInput.focus();
    }, 200);
  },

  closeModal() {
    if (!this.modal) return;

    this.modal.classList.remove("open");
    this.modal.style.display = "none";
    document.body.style.overflow = "";
    this.resetForm();
    this.clearErrors();
    this.restoreContent();
  },

  // Form validation helpers
  showError(input, message) {
    if (!input) return;
    const errorDiv = document.getElementById(input.id + "-error");
    if (errorDiv) errorDiv.textContent = message;
    input.setAttribute("aria-invalid", "true");
  },

  clearError(input) {
    if (!input) return;
    const errorDiv = document.getElementById(input.id + "-error");
    if (errorDiv) errorDiv.textContent = "";
    input.removeAttribute("aria-invalid");
  },

  clearErrors() {
    [
      this.nameInput,
      this.emailInput,
      this.phoneInput,
      this.messageInput,
    ].forEach((input) => {
      if (input) this.clearError(input);
    });
  },

  resetForm() {
    if (this.form) this.form.reset();
  },

  restoreContent() {
    if (!this.modal) return;
    const content = this.modal.querySelector(".modal-content");
    if (content && content.dataset.original) {
      content.innerHTML = content.dataset.original;
      delete content.dataset.original;
      // Re-setup form after restore
      this.setupFormValidation();
    }
  },

  validate() {
    let valid = true;
    this.clearErrors();

    if (!this.nameInput || !this.nameInput.value.trim()) {
      this.showError(this.nameInput, "Name is required");
      valid = false;
    }

    if (!this.emailInput || !this.emailInput.value.trim()) {
      this.showError(this.emailInput, "Email is required");
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(this.emailInput.value.trim())) {
      this.showError(this.emailInput, "Enter a valid email");
      valid = false;
    }

    if (
      this.phoneInput &&
      this.phoneInput.value.trim() &&
      !/^[\+\d\s\-\(\)]{7,}$/.test(this.phoneInput.value.trim())
    ) {
      this.showError(this.phoneInput, "Enter a valid phone number");
      valid = false;
    }

    if (!this.messageInput || !this.messageInput.value.trim()) {
      this.showError(this.messageInput, "Message is required");
      valid = false;
    }

    return valid;
  },

  handleSubmit() {
    if (!this.modal) return;

    // Save original content for restore
    const content = this.modal.querySelector(".modal-content");
    if (content && !content.dataset.original) {
      content.dataset.original = content.innerHTML;
    }

    // Show processing
    content.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2.5rem 1rem;">
        <div class="loader" style="margin-bottom:1.5rem;width:48px;height:48px;border:5px solid #ececf6;border-top:5px solid #6c63ff;border-radius:50%;animation:spin 1s linear infinite;"></div>
        <div style="font-size:1.2rem;color:#6c63ff;font-weight:600;">Sending your message...</div>
      </div>
    `;

    setTimeout(() => {
      content.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2.5rem 1rem;">
          <svg width="64" height="64" fill="none" viewBox="0 0 24 24" style="margin-bottom:1rem;"><circle cx="12" cy="12" r="10" fill="#eafaf1"/><path d="M8 12.5l3 3 5-5" stroke="#27ae60" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <div style="font-size:1.3rem;color:#27ae60;font-weight:700;margin-bottom:0.5rem;">Message sent!</div>
          <div style="font-size:1rem;color:#2d2d44;">Thank you for contacting us. Our team will get in touch with you soon.</div>
          <button class="contact-submit-btn gradient-btn" style="margin-top:2rem;min-width:120px;">Close</button>
        </div>
      `;

      // Setup close button in success message
      const closeBtn = content.querySelector(
        ".contact-submit-btn.gradient-btn"
      );
      if (closeBtn) {
        closeBtn.addEventListener("click", () => this.closeModal());
      }
    }, 1800);
  },

  addLoaderAnimation() {
    if (!document.querySelector("#contact-modal-loader-style")) {
      const style = document.createElement("style");
      style.id = "contact-modal-loader-style";
      style.textContent = `@keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}`;
      document.head.appendChild(style);
    }
  },
};

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  contactModal.init();
});

// Export for use in other modules
window.openContactModal = () => contactModal.openModal();
