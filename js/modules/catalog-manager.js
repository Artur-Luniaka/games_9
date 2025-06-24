// Catalog Manager Module - New Design with Genre Filters and Load More
class CatalogManager {
  constructor() {
    this.gamesData = [];
    this.filteredGames = [];
    this.displayedGames = [];
    this.currentGenre = "all";
    this.gamesPerPage = 6;
    this.currentPage = 1;

    this.init();
  }

  async init() {
    try {
      await this.loadGamesData();
      this.setupEventListeners();
      this.renderGames();
      this.updateLoadMoreButton();
    } catch (error) {
      console.error("Error initializing catalog manager:", error);
    }
  }

  async loadGamesData() {
    try {
      const response = await fetch("assets/data/games.json");
      const data = await response.json();
      this.gamesData = data.featured_games;
      this.filteredGames = [...this.gamesData];
      this.displayedGames = this.filteredGames.slice(0, this.gamesPerPage);
    } catch (error) {
      console.error("Error loading games data:", error);
      this.gamesData = [];
      this.filteredGames = [];
      this.displayedGames = [];
    }
  }

  setupEventListeners() {
    // Genre filter buttons
    document.querySelectorAll(".genre-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const genre = e.currentTarget.dataset.genre;
        this.filterByGenre(genre);
      });
    });

    // Load more button
    const loadMoreBtn = document.getElementById("load-more-btn");
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        this.loadMoreGames();
      });
    }
  }

  filterByGenre(genre) {
    // Update active button
    document.querySelectorAll(".genre-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelector(`[data-genre="${genre}"]`).classList.add("active");

    // Filter games
    this.currentGenre = genre;
    this.currentPage = 1;

    if (genre === "all") {
      this.filteredGames = [...this.gamesData];
    } else {
      this.filteredGames = this.gamesData.filter(
        (game) => game.genre === genre
      );
    }

    // Update displayed games
    this.displayedGames = this.filteredGames.slice(0, this.gamesPerPage);

    // Render first, then update load more button
    this.renderGames();
    this.updateLoadMoreButton();
  }

  loadMoreGames() {
    const startIndex = this.currentPage * this.gamesPerPage;
    const endIndex = startIndex + this.gamesPerPage;
    const newGames = this.filteredGames.slice(startIndex, endIndex);

    this.displayedGames = [...this.displayedGames, ...newGames];
    this.currentPage++;

    this.renderGames();
    this.updateLoadMoreButton();
  }

  updateLoadMoreButton() {
    const loadMoreContainer = document.getElementById("load-more-container");
    if (!loadMoreContainer) return;

    const totalPages = Math.ceil(this.filteredGames.length / this.gamesPerPage);

    if (
      this.currentPage >= totalPages ||
      this.filteredGames.length <= this.gamesPerPage
    ) {
      loadMoreContainer.style.display = "none";
    } else {
      loadMoreContainer.style.display = "block";
    }
  }

  renderGames() {
    const gamesGrid = document.getElementById("games-grid");
    const gamesCount = document.getElementById("games-count");
    const loadingSpinner = document.getElementById("loading-spinner");
    const noResults = document.getElementById("no-results");

    if (!gamesGrid) return;

    // Update count
    if (gamesCount) {
      gamesCount.textContent = this.filteredGames.length;
    }

    // Show/hide loading and no results
    if (loadingSpinner) loadingSpinner.style.display = "none";
    if (noResults) noResults.style.display = "none";

    if (this.filteredGames.length === 0) {
      gamesGrid.innerHTML = "";
      if (noResults) noResults.style.display = "block";
      return;
    }

    // Render games
    const gamesHTML = this.displayedGames
      .map(
        (game, index) => `
            <div class="game-card" data-game-id="${
              game.id
            }" style="animation-delay: ${index * 0.1}s">
                <div class="game-image-container">
                    <img src="assets/public/${game.image}" alt="${
          game.title
        }" class="game-image">
                    <div class="game-overlay">
                        <div class="game-actions">
                            <button class="quick-view-btn" data-game-id="${
                              game.id
                            }">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                View
                            </button>
                            <button class="add-to-cart-btn" data-game-id="${
                              game.id
                            }">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 12l2 2 4-4"></path>
                                    <path d="M21 12c-1 0-4-1-4-4s3-4 4-4 4 3 4 4-3 4-4 4z"></path>
                                    <path d="M3 12c1 0 4-1 4-4s-3-4-4-4-4 3-4 4 3 4 4 4z"></path>
                                </svg>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                    ${
                      game.discount
                        ? `<div class="discount-badge">-${game.discount}%</div>`
                        : ""
                    }
                </div>
                
                <div class="game-info">
                    <div class="game-header">
                        <h3 class="game-title">${game.title}</h3>
                        <div class="game-rating">
                            <span class="stars">
                                ${this.generateStars(game.rating)}
                            </span>
                            <span class="rating-text">(${game.rating})</span>
                        </div>
                    </div>
                    
                    <p class="game-description">${game.description.substring(
                      0,
                      100
                    )}${game.description.length > 100 ? "..." : ""}</p>
                    
                    <div class="game-meta">
                        <span class="game-genre">${game.genre}</span>
                        <span class="game-platforms">${
                          Array.isArray(game.platforms)
                            ? game.platforms.join(", ")
                            : game.platforms
                        }</span>
                    </div>
                    
                    <div class="game-footer">
                        <div class="game-price">
                            ${
                              game.discount
                                ? `<span class="original-price">$${
                                    game.price
                                  }</span>
                                 <span class="discounted-price">$${(
                                   parseFloat(game.price) *
                                   (1 - game.discount / 100)
                                 ).toFixed(2)}</span>`
                                : `<span class="current-price">$${game.price}</span>`
                            }
                        </div>
                        <button class="buy-now-btn" data-game-id="${
                          game.id
                        }">Buy Now</button>
                    </div>
                </div>
            </div>
        `
      )
      .join("");

    gamesGrid.innerHTML = gamesHTML;

    // Add event listeners to new game cards
    this.setupGameCardEvents();
  }

  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      "★".repeat(fullStars) + (hasHalfStar ? "☆" : "") + "☆".repeat(emptyStars)
    );
  }

  setupGameCardEvents() {
    // Game card click - navigate to game details
    document.querySelectorAll(".game-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        // Don't navigate if clicking on buttons
        if (
          e.target.closest(".quick-view-btn") ||
          e.target.closest(".add-to-cart-btn") ||
          e.target.closest(".buy-now-btn")
        ) {
          return;
        }

        const gameId = card.dataset.gameId;
        this.navigateToGameDetails(gameId);
      });
    });

    // View buttons - navigate to game details
    document.querySelectorAll(".quick-view-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const gameId = btn.dataset.gameId;
        this.navigateToGameDetails(gameId);
      });
    });

    // Add to cart buttons
    document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const gameId = btn.dataset.gameId;
        this.addToCart(gameId);
      });
    });

    // Buy now buttons
    document.querySelectorAll(".buy-now-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const gameId = btn.dataset.gameId;
        this.buyNow(gameId);
      });
    });
  }

  navigateToGameDetails(gameId) {
    // Navigate to game detail page
    window.location.href = `game-detail.html?id=${gameId}`;
  }

  openQuickView(gameId) {
    const game = this.gamesData.find((g) => g.id === gameId);
    if (!game) return;

    // Dispatch custom event for quick view modal
    const event = new CustomEvent("openQuickView", { detail: { game } });
    document.dispatchEvent(event);
  }

  addToCart(gameId) {
    const game = this.gamesData.find((g) => g.id === gameId);
    if (!game) return;

    // Get current cart from localStorage
    let cart = JSON.parse(localStorage.getItem("nexusCart") || "[]");

    // Check if game already in cart
    const existingItem = cart.find((item) => item.id === gameId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: game.id,
        title: game.title,
        price: game.discount
          ? (parseFloat(game.price) * (1 - game.discount / 100)).toFixed(2)
          : game.price,
        image: `assets/public/${game.image}`,
        quantity: 1,
      });
    }

    // Save to localStorage
    localStorage.setItem("nexusCart", JSON.stringify(cart));

    // Update header cart count
    this.updateCartCount();

    // Show notification
    this.showNotification(`${game.title} added to cart!`, "success");
  }

  buyNow(gameId) {
    const game = this.gamesData.find((g) => g.id === gameId);
    if (!game) return;

    // Add to cart first
    this.addToCart(gameId);

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
}

// Initialize catalog manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new CatalogManager();
});
