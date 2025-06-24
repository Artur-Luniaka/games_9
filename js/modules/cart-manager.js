// Cart Manager Module - Handles cart functionality
class CartManager {
  constructor() {
    this.cartItems = [];
    this.taxRate = 0.08; // 8% tax rate
    this.discountThreshold = 100; // Discount threshold in dollars
    this.discountRate = 0.1; // 10% discount
    this.init();
  }

  init() {
    this.loadCart();
    this.renderCart();
    this.setupEventListeners();
    this.updateCartCount();
  }

  loadCart() {
    const savedCart = localStorage.getItem("nexusCart");
    this.cartItems = savedCart ? JSON.parse(savedCart) : [];
  }

  saveCart() {
    localStorage.setItem("nexusCart", JSON.stringify(this.cartItems));
  }

  renderCart() {
    const cartItemsList = document.getElementById("cart-items-list");
    const emptyCart = document.getElementById("empty-cart");
    const cartCount = document.getElementById("cart-count");

    if (!cartItemsList) return;

    if (this.cartItems.length === 0) {
      cartItemsList.style.display = "none";
      if (emptyCart) emptyCart.style.display = "block";
      if (cartCount) cartCount.textContent = "0 items";
      this.updateSummary();
      return;
    }

    cartItemsList.style.display = "block";
    if (emptyCart) emptyCart.style.display = "none";

    const totalItems = this.cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    if (cartCount)
      cartCount.textContent = `${totalItems} item${
        totalItems !== 1 ? "s" : ""
      }`;

    const cartHTML = this.cartItems
      .map(
        (item, index) => `
            <div class="cart-item" data-item-id="${
              item.id
            }" style="animation-delay: ${index * 0.1}s">
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
    this.updateSummary();
  }

  updateSummary() {
    const subtotalElement = document.getElementById("subtotal");
    const taxElement = document.getElementById("tax");
    const discountElement = document.getElementById("discount");
    const discountItem = document.getElementById("discount-item");
    const totalElement = document.getElementById("total");
    const checkoutBtn = document.getElementById("checkout-btn");

    const subtotal = this.cartItems.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );
    const tax = subtotal * this.taxRate;
    const discount =
      subtotal >= this.discountThreshold ? subtotal * this.discountRate : 0;
    const total = subtotal + tax - discount;

    if (subtotalElement)
      subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;

    if (discountElement && discountItem) {
      if (discount > 0) {
        discountElement.textContent = `-$${discount.toFixed(2)}`;
        discountItem.style.display = "flex";
      } else {
        discountItem.style.display = "none";
      }
    }

    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;

    if (checkoutBtn) {
      checkoutBtn.disabled = this.cartItems.length === 0;
    }
  }

  updateQuantity(itemId, change) {
    const item = this.cartItems.find((item) => item.id === itemId);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
      this.removeItem(itemId);
    } else {
      item.quantity = newQuantity;
      this.saveCart();
      this.renderCart();
      this.updateCartCount();
    }
  }

  removeItem(itemId) {
    const item = this.cartItems.find((item) => item.id === itemId);
    if (!item) return;

    this.cartItems = this.cartItems.filter((item) => item.id !== itemId);
    this.saveCart();
    this.renderCart();
    this.updateCartCount();
    this.showNotification(`${item.title} removed from cart`, "info");
  }

  updateCartCount() {
    const totalItems = this.cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    const cartCounters = document.querySelectorAll(".cart-count");
    cartCounters.forEach((counter) => {
      counter.textContent = totalItems;
      counter.style.display = totalItems > 0 ? "block" : "none";
    });
  }

  setupEventListeners() {
    // Quantity controls
    document.addEventListener("click", (e) => {
      if (e.target.closest(".decrease-btn")) {
        const itemId = e.target.closest(".decrease-btn").dataset.itemId;
        this.updateQuantity(itemId, -1);
      }

      if (e.target.closest(".increase-btn")) {
        const itemId = e.target.closest(".increase-btn").dataset.itemId;
        this.updateQuantity(itemId, 1);
      }

      if (e.target.closest(".remove-item-btn")) {
        const itemId = e.target.closest(".remove-item-btn").dataset.itemId;
        this.removeItem(itemId);
      }
    });

    // Checkout button
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        this.proceedToCheckout();
      });
    }
  }

  proceedToCheckout() {
    if (this.cartItems.length === 0) {
      this.showNotification("Your cart is empty", "error");
      return;
    }

    // For now, just show a success message
    this.showNotification("Proceeding to checkout...", "success");

    // In a real application, you would redirect to a checkout page
    // window.location.href = "checkout.html";

    // For demo purposes, clear the cart after a delay
    setTimeout(() => {
      this.clearCart();
      this.showNotification("Order completed successfully!", "success");
    }, 2000);
  }

  clearCart() {
    this.cartItems = [];
    this.saveCart();
    this.renderCart();
    this.updateCartCount();
  }

  showNotification(message, type = "info") {
    // Dispatch custom event for notification system
    const event = new CustomEvent("showNotification", {
      detail: { message, type },
    });
    document.dispatchEvent(event);
  }

  getCartTotal() {
    return this.cartItems.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );
  }

  getCartItemCount() {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  hasItems() {
    return this.cartItems.length > 0;
  }
}

// Initialize cart manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new CartManager();
});
