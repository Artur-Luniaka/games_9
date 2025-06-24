// Catalog Manager Module - Handles game filtering, searching, and display
class CatalogManager {
  constructor() {
    this.gamesData = [];
    this.filteredGames = [];
    this.currentFilters = {
      search: "",
      platform: "",
      genre: "",
      priceRange: "",
      rating: "",
    };
    this.currentSort = "name";

    this.init();
  }

  async init() {
    try {
      await this.loadGamesData();
      this.setupEventListeners();
      this.renderGames();
    } catch (error) {
      console.error("Error initializing catalog manager:", error);
    }
  }

  async loadGamesData() {
    try {
      const response = await fetch("data/games.json");
      const data = await response.json();
      this.gamesData = data.games;
      this.filteredGames = [...this.gamesData];
    } catch (error) {
      console.error("Error loading games data:", error);
      this.gamesData = [];
      this.filteredGames = [];
    }
  }

  setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById("game-search");
    const searchBtn = document.querySelector(".catalog-search-btn");

    searchInput.addEventListener("input", (e) => {
      this.currentFilters.search = e.target.value.toLowerCase();
      this.applyFilters();
    });

    searchBtn.addEventListener("click", () => {
      this.applyFilters();
    });

    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.applyFilters();
      }
    });

    // Filter dropdowns
    const filterSelects = [
      "platform-filter",
      "genre-filter",
      "price-filter",
      "rating-filter",
    ];

    filterSelects.forEach((filterId) => {
      const select = document.getElementById(filterId);
      if (select) {
        select.addEventListener("change", (e) => {
          const filterType = filterId.replace("-filter", "");
          this.currentFilters[filterType] = e.target.value;
          this.applyFilters();
        });
      }
    });

    // Sort functionality
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.currentSort = e.target.value;
        this.sortGames();
        this.renderGames();
      });
    }

    // Clear filters
    const clearFiltersBtn = document.getElementById("clear-filters");
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener("click", () => {
        this.clearAllFilters();
      });
    }

    // Reset search
    const resetSearchBtn = document.getElementById("reset-search");
    if (resetSearchBtn) {
      resetSearchBtn.addEventListener("click", () => {
        this.clearAllFilters();
      });
    }
  }

  applyFilters() {
    this.filteredGames = this.gamesData.filter((game) => {
      // Search filter
      if (this.currentFilters.search) {
        const searchTerm = this.currentFilters.search.toLowerCase();
        const matchesSearch =
          game.title.toLowerCase().includes(searchTerm) ||
          game.description.toLowerCase().includes(searchTerm) ||
          game.genre.toLowerCase().includes(searchTerm) ||
          game.developer.toLowerCase().includes(searchTerm);

        if (!matchesSearch) return false;
      }

      // Platform filter
      if (this.currentFilters.platform) {
        const platforms = this.currentFilters.platform.split(",");
        const gamePlatforms = game.platforms.split(",");
        const hasMatchingPlatform = platforms.some((platform) =>
          gamePlatforms.includes(platform.trim())
        );
        if (!hasMatchingPlatform) return false;
      }

      // Genre filter
      if (
        this.currentFilters.genre &&
        game.genre !== this.currentFilters.genre
      ) {
        return false;
      }

      // Price range filter
      if (this.currentFilters.priceRange) {
        const price = parseFloat(game.price);
        const [min, max] = this.currentFilters.priceRange
          .split("-")
          .map((p) => (p === "+" ? Infinity : parseFloat(p)));

        if (this.currentFilters.priceRange === "60+") {
          if (price < 60) return false;
        } else {
          if (price < min || price > max) return false;
        }
      }

      // Rating filter
      if (this.currentFilters.rating) {
        const minRating = parseFloat(this.currentFilters.rating);
        if (game.rating < minRating) return false;
      }

      return true;
    });

    this.sortGames();
    this.renderGames();
  }

  sortGames() {
    this.filteredGames.sort((a, b) => {
      switch (this.currentSort) {
        case "name":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        case "price-low":
          return parseFloat(a.price) - parseFloat(b.price);
        case "price-high":
          return parseFloat(b.price) - parseFloat(a.price);
        case "rating":
          return b.rating - a.rating;
        case "release":
          return new Date(b.releaseDate) - new Date(a.releaseDate);
        default:
          return 0;
      }
    });
  }

  clearAllFilters() {
    // Reset filter values
    this.currentFilters = {
      search: "",
      platform: "",
      genre: "",
      priceRange: "",
      rating: "",
    };

    // Reset form elements
    document.getElementById("game-search").value = "";
    document.getElementById("platform-filter").value = "";
    document.getElementById("genre-filter").value = "";
    document.getElementById("price-filter").value = "";
    document.getElementById("rating-filter").value = "";
    document.getElementById("sort-select").value = "name";

    // Reset data
    this.filteredGames = [...this.gamesData];
    this.currentSort = "name";
    this.sortGames();
    this.renderGames();
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
    const gamesHTML = this.filteredGames
      .map(
        (game, index) => `
            <div class="game-card" data-game-id="${
              game.id
            }" style="animation-delay: ${index * 0.1}s">
                <div class="game-image-container">
                    <img src="${game.image}" alt="${
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
                                Quick View
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
                        <span class="game-platforms">${game.platforms}</span>
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
    // Quick view buttons
    document.querySelectorAll(".quick-view-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const gameId = btn.dataset.gameId;
        this.openQuickView(gameId);
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
        image: game.image,
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
