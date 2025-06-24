// Cart Manager Module - Handles cart functionality without using 'this'
const CartManager = {
  cartItems: [],
  taxRate: 0.08, // 8% tax rate
  discountThreshold: 100, // Discount threshold in dollars
  discountRate: 0.1, // 10% discount

  init() {
    CartManager.loadCart();
    CartManager.renderCart();
    CartManager.setupEventListeners();
    CartManager.updateCartCount();
  },

  loadCart() {
    const savedCart = localStorage.getItem("nexusCart");
    CartManager.cartItems = savedCart ? JSON.parse(savedCart) : [];
  },

  saveCart() {
    localStorage.setItem("nexusCart", JSON.stringify(CartManager.cartItems));
  },

  renderCart() {
    const cartItemsList = document.getElementById("cart-items-list");
    const emptyCart = document.getElementById("empty-cart");
    const cartCount = document.getElementById("cart-count");

    if (!cartItemsList) return;

    if (CartManager.cartItems.length === 0) {
      cartItemsList.style.display = "none";
      if (emptyCart) emptyCart.style.display = "block";
      if (cartCount) cartCount.textContent = "0 items";
      CartManager.updateSummary();
      return;
    }

    cartItemsList.style.display = "block";
    if (emptyCart) emptyCart.style.display = "none";

    const totalItems = CartManager.cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    if (cartCount)
      cartCount.textContent = `${totalItems} item${
        totalItems !== 1 ? "s" : ""
      }`;

    const cartHTML = CartManager.cartItems
      .map(
        (item, index) => `
            <div class="cart-item" data-item-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                </div>
                
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.title}</h3>
                    <div class="cart-item-price">$${item.price}</div>
                </div>
                
                <div class="cart-item-quantity">
                    <div class="quantity-controls">
                        <button class="quantity-btn decrease-btn" data-item-id="${
                          item.id
                        }" ${item.quantity <= 1 ? "disabled" : ""}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn increase-btn" data-item-id="${
                          item.id
                        }">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="cart-item-actions">
                    <div class="cart-item-total">$${(
                      parseFloat(item.price) * item.quantity
                    ).toFixed(2)}</div>
                    <button class="remove-item-btn" data-item-id="${item.id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                        </svg>
                        Remove
                    </button>
                </div>
            </div>
        `
      )
      .join("");

    cartItemsList.innerHTML = cartHTML;
    CartManager.updateSummary();
  },

  updateSummary() {
    const subtotalElement = document.getElementById("subtotal");
    const taxElement = document.getElementById("tax");
    const discountElement = document.getElementById("discount");
    const totalElement = document.getElementById("total");
    const checkoutBtn = document.getElementById("checkout-btn");

    const subtotal = CartManager.cartItems.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );
    const tax = subtotal * CartManager.taxRate;
    const discount =
      subtotal >= CartManager.discountThreshold
        ? subtotal * CartManager.discountRate
        : 0;
    const total = subtotal + tax - discount;

    if (subtotalElement)
      subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (discountElement) {
      discountElement.textContent =
        discount > 0 ? `-$${discount.toFixed(2)}` : "-$0.00";
      discountElement.parentElement.style.display =
        discount > 0 ? "flex" : "none";
    }
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;

    if (checkoutBtn) {
      checkoutBtn.disabled = CartManager.cartItems.length === 0;
    }
  },

  updateQuantity(itemId, change) {
    const item = CartManager.cartItems.find((item) => item.id === itemId);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
      CartManager.removeItem(itemId);
    } else {
      item.quantity = newQuantity;
      CartManager.saveCart();
      CartManager.renderCart();
      CartManager.updateCartCount();
    }
  },

  removeItem(itemId) {
    CartManager.cartItems = CartManager.cartItems.filter(
      (item) => item.id !== itemId
    );
    CartManager.saveCart();
    CartManager.renderCart();
    CartManager.updateCartCount();
    CartManager.showNotification("Item removed from cart", "info");
  },

  updateCartCount() {
    const totalItems = CartManager.cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const cartCounters = document.querySelectorAll(".cart-count");
    cartCounters.forEach((counter) => {
      counter.textContent = totalItems;
      counter.style.display = totalItems > 0 ? "block" : "none";
    });
  },

  setupEventListeners() {
    // Quantity controls
    document.addEventListener("click", (e) => {
      if (e.target.closest(".decrease-btn")) {
        const itemId = e.target.closest(".decrease-btn").dataset.itemId;
        CartManager.updateQuantity(itemId, -1);
      }

      if (e.target.closest(".increase-btn")) {
        const itemId = e.target.closest(".increase-btn").dataset.itemId;
        CartManager.updateQuantity(itemId, 1);
      }

      if (e.target.closest(".remove-item-btn")) {
        const itemId = e.target.closest(".remove-item-btn").dataset.itemId;
        CartManager.removeItem(itemId);
      }
    });

    // Checkout button
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        CartManager.proceedToCheckout();
      });
    }

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        // Clear cart confirmation
        if (CartManager.cartItems.length > 0) {
          if (confirm("Are you sure you want to clear your cart?")) {
            CartManager.clearCart();
          }
        }
      }
    });
  },

  proceedToCheckout() {
    if (CartManager.cartItems.length === 0) {
      CartManager.showNotification("Your cart is empty", "warning");
      return;
    }

    // Redirect to checkout page
    window.location.href = "checkout.html";
  },

  clearCart() {
    CartManager.cartItems = [];
    CartManager.saveCart();
    CartManager.renderCart();
    CartManager.updateCartCount();
    CartManager.showNotification("Cart cleared", "info");
  },

  showNotification(message, type = "info") {
    // Dispatch custom event for notification system
    const event = new CustomEvent("showNotification", {
      detail: { message, type },
    });
    document.dispatchEvent(event);
  },

  // Utility functions
  getCartTotal() {
    return CartManager.cartItems.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );
  },

  getCartItemCount() {
    return CartManager.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  },

  hasItems() {
    return CartManager.cartItems.length > 0;
  },
};

// Initialize cart manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  CartManager.init();
});
