// Game Detail Controller Module - Handles game detail page functionality
class GameDetailController {
  constructor() {
    this.gameData = null;
    this.currentImageIndex = 0;
    this.images = [];
    this.init();
  }

  async init() {
    await this.loadGameData();
    this.setupTabEvents();
    this.setupPurchaseEvents();
    this.updateCartCount();
  }

  async loadGameData() {
    try {
      // Get game ID from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const gameId = urlParams.get("id");

      if (!gameId) {
        this.showError("Game ID not found");
        return;
      }

      // Load games data
      const response = await fetch("assets/data/games.json");
      const data = await response.json();

      // Find the game by ID
      this.gameData = data.featured_games.find((game) => game.id === gameId);

      if (!this.gameData) {
        this.showError("Game not found");
        return;
      }

      // Set up images array (using the main game image for now)
      this.images = [`assets/public/${this.gameData.image}`];

      // Update page content
      this.updatePageContent();
    } catch (error) {
      console.error("Error loading game data:", error);
      this.showError("Failed to load game data");
    }
  }

  updatePageContent() {
    // Update page title
    document.title = `${this.gameData.title} - NexusGaming Store`;

    // Update breadcrumb
    document.getElementById("game-title-breadcrumb").textContent =
      this.gameData.title;

    // Update hero section
    document.getElementById("game-title").textContent = this.gameData.title;
    document.getElementById("game-developer").textContent =
      this.gameData.developer;
    document.getElementById("game-release").textContent =
      this.gameData.release_date;

    // Update rating
    const stars = this.generateStars(this.gameData.rating);
    document.getElementById("game-stars").textContent = stars;
    document.getElementById(
      "game-rating-text"
    ).textContent = `${this.gameData.rating}/5`;

    // Update prices
    if (this.gameData.discount > 0) {
      document.getElementById(
        "original-price"
      ).textContent = `$${this.gameData.price}`;
      const discountedPrice = (
        parseFloat(this.gameData.price) *
        (1 - this.gameData.discount / 100)
      ).toFixed(2);
      document.getElementById(
        "current-price"
      ).textContent = `$${discountedPrice}`;
      document.getElementById(
        "discount-badge"
      ).textContent = `-${this.gameData.discount}%`;
      document.getElementById("discount-badge").style.display = "block";
    } else {
      document.getElementById("original-price").style.display = "none";
      document.getElementById(
        "current-price"
      ).textContent = `$${this.gameData.price}`;
      document.getElementById("discount-badge").style.display = "none";
    }

    // Update main image
    const mainImage = document.getElementById("main-image");
    mainImage.src = this.images[0];
    mainImage.alt = this.gameData.title;

    // Update description
    document.getElementById("game-description").textContent =
      this.gameData.description;

    // Update features
    this.updateFeatures();

    // Update specifications
    this.updateSpecifications();

    // Update system requirements
    this.updateSystemRequirements();
  }

  updateFeatures() {
    const featuresList = document.getElementById("features-list");
    featuresList.innerHTML = this.gameData.features
      .map((feature) => `<li>${feature}</li>`)
      .join("");
  }

  updateSpecifications() {
    document.getElementById("game-genre").textContent = this.gameData.genre;
    document.getElementById("game-platforms").textContent = Array.isArray(
      this.gameData.platforms
    )
      ? this.gameData.platforms.join(", ")
      : this.gameData.platforms;
    document.getElementById("game-release-date").textContent =
      this.gameData.release_date;
    document.getElementById("game-developer-spec").textContent =
      this.gameData.developer;
    document.getElementById("game-publisher").textContent =
      this.gameData.publisher;
  }

  updateSystemRequirements() {
    if (
      this.gameData.system_requirements &&
      this.gameData.system_requirements.minimum
    ) {
      const minimumReqs = document.getElementById("minimum-requirements");
      const reqs = this.gameData.system_requirements.minimum;

      minimumReqs.innerHTML = `
        <div class="req-item">
          <span class="req-label">OS:</span>
          <span class="req-value">${reqs.os}</span>
        </div>
        <div class="req-item">
          <span class="req-label">Processor:</span>
          <span class="req-value">${reqs.processor}</span>
        </div>
        <div class="req-item">
          <span class="req-label">Memory:</span>
          <span class="req-value">${reqs.memory}</span>
        </div>
        <div class="req-item">
          <span class="req-label">Graphics:</span>
          <span class="req-value">${reqs.graphics}</span>
        </div>
      `;
    }

    // For now, use minimum requirements for recommended as well
    if (
      this.gameData.system_requirements &&
      this.gameData.system_requirements.minimum
    ) {
      const recommendedReqs = document.getElementById(
        "recommended-requirements"
      );
      const reqs = this.gameData.system_requirements.minimum;

      recommendedReqs.innerHTML = `
        <div class="req-item">
          <span class="req-label">OS:</span>
          <span class="req-value">${reqs.os}</span>
        </div>
        <div class="req-item">
          <span class="req-label">Processor:</span>
          <span class="req-value">${reqs.processor}</span>
        </div>
        <div class="req-item">
          <span class="req-label">Memory:</span>
          <span class="req-value">${reqs.memory}</span>
        </div>
        <div class="req-item">
          <span class="req-label">Graphics:</span>
          <span class="req-value">${reqs.graphics}</span>
        </div>
      `;
    }
  }

  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      "★".repeat(fullStars) + (hasHalfStar ? "☆" : "") + "☆".repeat(emptyStars)
    );
  }

  setupTabEvents() {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetTab = button.dataset.tab;

        // Update active tab button
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        // Update active tab content
        tabContents.forEach((content) => {
          content.classList.remove("active");
          if (content.id === targetTab) {
            content.classList.add("active");
          }
        });
      });
    });
  }

  setupPurchaseEvents() {
    const addToCartBtn = document.getElementById("add-to-cart-btn");
    const buyNowBtn = document.getElementById("buy-now-btn");

    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        this.addToCart();
      });
    }

    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", () => {
        this.buyNow();
      });
    }
  }

  addToCart() {
    if (!this.gameData) return;

    const gameData = {
      id: this.gameData.id,
      title: this.gameData.title,
      price: this.gameData.discount
        ? (
            parseFloat(this.gameData.price) *
            (1 - this.gameData.discount / 100)
          ).toFixed(2)
        : this.gameData.price,
      image: `assets/public/${this.gameData.image}`,
      quantity: 1,
    };

    // Get current cart from localStorage
    let cart = JSON.parse(localStorage.getItem("nexusCart") || "[]");

    // Check if game already in cart
    const existingItem = cart.find((item) => item.id === gameData.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push(gameData);
    }

    // Save to localStorage
    localStorage.setItem("nexusCart", JSON.stringify(cart));

    // Update header cart count
    this.updateCartCount();

    // Dispatch cart updated event
    document.dispatchEvent(new CustomEvent("cartUpdated"));

    // Show notification
    this.showNotification(`${this.gameData.title} added to cart!`, "success");
  }

  buyNow() {
    // Add to cart first
    this.addToCart();

    // Redirect to cart page
    setTimeout(() => {
      window.location.href = "cart.html";
    }, 500);
  }

  updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("nexusCart") || "[]");
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartCounters = document.querySelectorAll(".cart-count");
    cartCounters.forEach((counter) => {
      counter.textContent = totalItems;
      counter.style.display = totalItems > 0 ? "block" : "none";
    });
  }

  showNotification(message, type = "info") {
    // Dispatch custom event for notification system
    const event = new CustomEvent("showNotification", {
      detail: { message, type },
    });
    document.dispatchEvent(event);
  }

  showError(message) {
    // Show error notification
    this.showNotification(message, "error");

    // Redirect to catalog after a delay
    setTimeout(() => {
      window.location.href = "catalog.html";
    }, 3000);
  }
}

// Initialize game detail controller when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new GameDetailController();
});
