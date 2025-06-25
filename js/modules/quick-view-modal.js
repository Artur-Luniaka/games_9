// Quick View Modal Module - Displays detailed game information
class QuickViewModal {
  constructor() {
    this.modal = document.getElementById("quick-view-modal");
    this.overlay = document.querySelector(".modal-overlay");
    this.content = document.querySelector(".modal-content");
    this.closeBtn = document.querySelector(".modal-close");
    this.contentPlaceholder = document.getElementById(
      "modal-content-placeholder"
    );

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.listenForOpenEvents();
  }

  setupEventListeners() {
    // Close modal on overlay click
    if (this.overlay) {
      this.overlay.addEventListener("click", () => {
        this.closeModal();
      });
    }

    // Close modal on close button click
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => {
        this.closeModal();
      });
    }

    // Close modal on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen()) {
        this.closeModal();
      }
    });

    // Prevent modal content clicks from closing modal
    if (this.content) {
      this.content.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }
  }

  listenForOpenEvents() {
    document.addEventListener("openQuickView", (e) => {
      const { game } = e.detail;
      this.openModal(game);
    });
  }

  openModal(game) {
    if (!this.modal || !this.contentPlaceholder) return;

    this.renderGameContent(game);
    this.modal.style.display = "flex";

    // Add animation classes
    setTimeout(() => {
      this.modal.classList.add("modal-open");
    }, 10);

    // Prevent body scroll
    document.body.style.overflow = "hidden";
  }

  closeModal() {
    if (!this.modal) return;

    this.modal.classList.remove("modal-open");

    setTimeout(() => {
      this.modal.style.display = "none";
      // Re-enable body scroll
      document.body.style.overflow = "";
    }, 300);
  }

  isOpen() {
    return this.modal && this.modal.style.display === "flex";
  }

  renderGameContent(game) {
    if (!this.contentPlaceholder) return;

    const contentHTML = `
            <div class="quick-view-content">
                <div class="game-media">
                    <div class="game-image-gallery">
                        <img src="${game.image}" alt="${
      game.title
    }" class="main-game-image">
                        <div class="game-thumbnails">
                            ${this.generateThumbnails(game)}
                        </div>
                    </div>
                </div>
                
                <div class="game-details">
                    <div class="game-header">
                        <h2 class="game-title">${game.title}</h2>
                        <div class="game-meta">
                            <span class="game-developer">by ${
                              game.developer
                            }</span>
                            <span class="game-release">Released ${this.formatDate(
                              game.releaseDate
                            )}</span>
                        </div>
                    </div>
                    
                    <div class="game-rating-section">
                        <div class="rating-display">
                            <div class="stars-large">
                                ${this.generateStars(game.rating)}
                            </div>
                            <span class="rating-number">${game.rating}/5</span>
                        </div>
                        <span class="rating-count">${
                          game.reviewCount
                        } reviews</span>
                    </div>
                    
                    <div class="game-description-full">
                        <p>${game.description}</p>
                    </div>
                    
                    <div class="game-specs">
                        <div class="spec-item">
                            <span class="spec-label">Genre:</span>
                            <span class="spec-value">${game.genre}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Platforms:</span>
                            <span class="spec-value">${game.platforms}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">ESRB Rating:</span>
                            <span class="spec-value">${game.esrbRating}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Features:</span>
                            <div class="features-list">
                                ${game.features
                                  .map(
                                    (feature) =>
                                      `<span class="feature-tag">${feature}</span>`
                                  )
                                  .join("")}
                            </div>
                        </div>
                    </div>
                    
                    <div class="game-requirements">
                        <h4>System Requirements</h4>
                        <div class="requirements-grid">
                            <div class="req-section">
                                <h5>Minimum</h5>
                                <ul>
                                    ${game.systemRequirements.minimum
                                      .map((req) => `<li>${req}</li>`)
                                      .join("")}
                                </ul>
                            </div>
                            <div class="req-section">
                                <h5>Recommended</h5>
                                <ul>
                                    ${game.systemRequirements.recommended
                                      .map((req) => `<li>${req}</li>`)
                                      .join("")}
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="game-actions">
                        <div class="price-section">
                            ${
                              game.discount
                                ? `<div class="price-display">
                                    <span class="original-price-large">$${
                                      game.price
                                    }</span>
                                    <span class="discounted-price-large">$${(
                                      parseFloat(game.price) *
                                      (1 - game.discount / 100)
                                    ).toFixed(2)}</span>
                                    <span class="discount-badge-large">-${
                                      game.discount
                                    }%</span>
                                </div>`
                                : `<div class="price-display">
                                    <span class="current-price-large">$${game.price}</span>
                                </div>`
                            }
                        </div>
                        
                        <div class="action-buttons">
                            <button class="add-to-cart-large" data-game-id="${
                              game.id
                            }">
                                Add to Cart
                            </button>
                            <button class="buy-now-large" data-game-id="${
                              game.id
                            }">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

    this.contentPlaceholder.innerHTML = contentHTML;
    this.setupModalEvents();
  }

  generateThumbnails(game) {
    // For now, we'll use the main image multiple times
    // In a real app, you'd have multiple images
    const thumbnails = [game.image, game.image, game.image];

    return thumbnails
      .map(
        (img, index) => `
            <div class="thumbnail-item ${
              index === 0 ? "active" : ""
            }" data-image="${img}">
                <img src="${img}" alt="${game.title} thumbnail ${index + 1}">
            </div>
        `
      )
      .join("");
  }

  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      "★".repeat(fullStars) + (hasHalfStar ? "☆" : "") + "☆".repeat(emptyStars)
    );
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  setupModalEvents() {
    // Thumbnail clicks
    document.querySelectorAll(".thumbnail-item").forEach((thumb) => {
      thumb.addEventListener("click", () => {
        const imageSrc = thumb.dataset.image;
        const mainImage = document.querySelector(".main-game-image");

        if (mainImage) {
          mainImage.src = imageSrc;
        }

        // Update active thumbnail
        document
          .querySelectorAll(".thumbnail-item")
          .forEach((t) => t.classList.remove("active"));
        thumb.classList.add("active");
      });
    });

    // Add to cart button
    const addToCartBtn = document.querySelector(".add-to-cart-large");
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        const gameId = addToCartBtn.dataset.gameId;
        this.addToCart(gameId);
      });
    }

    // Buy now button
    const buyNowBtn = document.querySelector(".buy-now-large");
    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", () => {
        const gameId = buyNowBtn.dataset.gameId;
        this.buyNow(gameId);
      });
    }
  }

  addToCart(gameId) {
    // Get game data from the modal
    const gameTitle = document.querySelector(".game-title")?.textContent;

    // Get current cart from localStorage
    let cart = JSON.parse(localStorage.getItem("nexusCart") || "[]");

    // Check if game already in cart
    const existingItem = cart.find((item) => item.id === gameId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      // Get price from modal
      const priceElement = document.querySelector(
        ".discounted-price-large, .current-price-large"
      );
      const price = priceElement
        ? priceElement.textContent.replace("$", "")
        : "0";

      cart.push({
        id: gameId,
        title: gameTitle || "Unknown Game",
        price: price,
        image: document.querySelector(".main-game-image")?.src || "",
        quantity: 1,
      });
    }

    // Save to localStorage
    localStorage.setItem("nexusCart", JSON.stringify(cart));

    // Update header cart count
    this.updateCartCount();

    // Show notification
    this.showNotification(`${gameTitle} added to cart!`, "success");
  }

  buyNow(gameId) {
    // Add to cart first
    this.addToCart(gameId);

    // Close modal and redirect to cart
    this.closeModal();
    setTimeout(() => {
      window.location.href = "cart.html";
    }, 300);
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
}

// Initialize quick view modal when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new QuickViewModal();
});
