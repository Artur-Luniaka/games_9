// Game Detail Controller Module - Handles game detail page functionality
const GameDetailController = {
  currentImageIndex: 0,
  images: [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=450&fit=crop",
  ],

  init() {
    GameDetailController.setupGalleryEvents();
    GameDetailController.setupTabEvents();
    GameDetailController.setupPurchaseEvents();
    GameDetailController.updateCartCount();
  },

  setupGalleryEvents() {
    const thumbnails = document.querySelectorAll(".thumbnail");
    const mainImage = document.querySelector(".main-image");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");

    thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener("click", () => {
        GameDetailController.switchImage(index);
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        GameDetailController.navigateImage(-1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        GameDetailController.navigateImage(1);
      });
    }

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        GameDetailController.navigateImage(-1);
      } else if (e.key === "ArrowRight") {
        GameDetailController.navigateImage(1);
      }
    });
  },

  switchImage(index) {
    const mainImage = document.querySelector(".main-image");
    const thumbnails = document.querySelectorAll(".thumbnail");

    if (mainImage && thumbnails[index]) {
      mainImage.src = GameDetailController.images[index];
      GameDetailController.currentImageIndex = index;

      // Update active thumbnail
      thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle("active", i === index);
      });
    }
  },

  navigateImage(direction) {
    const newIndex =
      (GameDetailController.currentImageIndex +
        direction +
        GameDetailController.images.length) %
      GameDetailController.images.length;
    GameDetailController.switchImage(newIndex);
  },

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
  },

  setupPurchaseEvents() {
    const addToCartBtn = document.getElementById("add-to-cart-btn");
    const buyNowBtn = document.getElementById("buy-now-btn");

    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        GameDetailController.addToCart();
      });
    }

    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", () => {
        GameDetailController.buyNow();
      });
    }
  },

  addToCart() {
    const gameData = {
      id: "cyberpunk-2077",
      title: "Cyberpunk 2077",
      price: "39.99",
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=200&fit=crop",
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
    GameDetailController.updateCartCount();

    // Show notification
    GameDetailController.showNotification(
      "Cyberpunk 2077 added to cart!",
      "success"
    );
  },

  buyNow() {
    // Add to cart first
    GameDetailController.addToCart();

    // Redirect to cart page
    setTimeout(() => {
      window.location.href = "cart.html";
    }, 500);
  },

  updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("nexusCart") || "[]");
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartCounters = document.querySelectorAll(".cart-count");
    cartCounters.forEach((counter) => {
      counter.textContent = totalItems;
      counter.style.display = totalItems > 0 ? "block" : "none";
    });
  },

  showNotification(message, type = "info") {
    // Dispatch custom event for notification system
    const event = new CustomEvent("showNotification", {
      detail: { message, type },
    });
    document.dispatchEvent(event);
  },
};

// Initialize game detail controller when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  GameDetailController.init();
});
