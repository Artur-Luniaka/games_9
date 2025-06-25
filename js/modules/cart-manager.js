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

      // Hide checkout section when cart is empty
      this.hideCheckout();

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

      // Check if cart is now empty and hide checkout section
      if (this.cartItems.length === 0) {
        this.hideCheckout();
      }
    } else {
      item.quantity = newQuantity;
      this.saveCart();
      this.renderCart();
      this.updateCartCount();

      // Dispatch cart updated event
      document.dispatchEvent(new CustomEvent("cartUpdated"));
    }
  }

  removeItem(itemId) {
    const item = this.cartItems.find((item) => item.id === itemId);
    if (!item) return;

    this.cartItems = this.cartItems.filter((item) => item.id !== itemId);
    this.saveCart();
    this.renderCart();
    this.updateCartCount();

    // Check if cart is now empty and hide checkout section
    if (this.cartItems.length === 0) {
      this.hideCheckout();
    }

    // Dispatch cart updated event
    document.dispatchEvent(new CustomEvent("cartUpdated"));

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

    // Show checkout section
    this.showCheckout();
  }

  clearCart() {
    this.cartItems = [];
    this.saveCart();
    this.renderCart();
    this.updateCartCount();

    // Dispatch cart updated event
    document.dispatchEvent(new CustomEvent("cartUpdated"));
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

  // Checkout functionality
  showCheckout() {
    const checkoutSection = document.getElementById("checkout-section");
    if (checkoutSection) {
      checkoutSection.style.display = "block";
      this.renderCheckoutItems();
      this.updateCheckoutSummary();
      this.setupCheckoutEventListeners();

      // Smooth scroll to checkout section
      checkoutSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  hideCheckout() {
    const checkoutSection = document.getElementById("checkout-section");
    if (checkoutSection) {
      checkoutSection.style.display = "none";
    }
  }

  renderCheckoutItems() {
    const checkoutItems = document.getElementById("checkout-items");
    if (!checkoutItems) return;

    const itemsHTML = this.cartItems
      .map(
        (item) => `
          <div class="checkout-item">
            <div class="checkout-item-image">
              <img src="${item.image}" alt="${item.title}" loading="lazy">
            </div>
            <div class="checkout-item-details">
              <div class="checkout-item-title">${item.title}</div>
              <div class="checkout-item-price">$${item.price}</div>
            </div>
            <div class="checkout-item-quantity">x${item.quantity}</div>
          </div>
        `
      )
      .join("");

    checkoutItems.innerHTML = itemsHTML;
  }

  updateCheckoutSummary() {
    const subtotalElement = document.getElementById("checkout-subtotal");
    const taxElement = document.getElementById("checkout-tax");
    const discountElement = document.getElementById("checkout-discount");
    const discountRow = document.getElementById("checkout-discount-row");
    const totalElement = document.getElementById("checkout-total");

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

    if (discountElement && discountRow) {
      if (discount > 0) {
        discountElement.textContent = `-$${discount.toFixed(2)}`;
        discountRow.style.display = "flex";
      } else {
        discountRow.style.display = "none";
      }
    }

    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
  }

  setupCheckoutEventListeners() {
    // Remove existing listeners to avoid duplication
    const closeCheckoutBtn = document.getElementById("close-checkout-btn");
    const checkoutForm = document.getElementById("checkout-form");

    if (closeCheckoutBtn) {
      // Remove old listeners by cloning the element
      const newCloseBtn = closeCheckoutBtn.cloneNode(true);
      closeCheckoutBtn.parentNode.replaceChild(newCloseBtn, closeCheckoutBtn);

      // Add new listener
      newCloseBtn.addEventListener("click", () => {
        this.hideCheckout();
      });
    }

    if (checkoutForm) {
      // Remove old listeners by cloning the element
      const newForm = checkoutForm.cloneNode(true);
      checkoutForm.parentNode.replaceChild(newForm, checkoutForm);

      // Add new listener
      newForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleCheckoutSubmission();
      });
    }
  }

  handleCheckoutSubmission() {
    const form = document.getElementById("checkout-form");
    const formData = new FormData(form);

    // Validate form
    const errors = this.validateCheckoutForm(formData);
    if (errors.length > 0) {
      this.displayCheckoutErrors(errors);
      return;
    }

    // Clear previous errors
    this.clearCheckoutErrors();

    // Simulate order processing
    const placeOrderBtn = document.getElementById("place-order-btn");
    if (placeOrderBtn) {
      placeOrderBtn.disabled = true;
      placeOrderBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spinning">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
        </svg>
        Processing...
      `;
    }

    // Simulate API call delay
    setTimeout(() => {
      this.processOrderSuccess(formData);
    }, 2000);
  }

  validateCheckoutForm(formData) {
    const errors = [];

    const name = formData.get("customerName")?.trim();
    const email = formData.get("customerEmail")?.trim();
    const country = formData.get("customerCountry");

    if (!name || name.length < 2) {
      errors.push({
        field: "name",
        message: "Please enter a valid name (at least 2 characters)",
      });
    }

    if (!email || !this.isValidEmail(email)) {
      errors.push({
        field: "email",
        message: "Please enter a valid email address",
      });
    }

    if (!country) {
      errors.push({ field: "country", message: "Please select your country" });
    }

    return errors;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  displayCheckoutErrors(errors) {
    errors.forEach((error) => {
      const errorElement = document.getElementById(`${error.field}-error`);
      if (errorElement) {
        errorElement.textContent = error.message;
      }
    });
  }

  clearCheckoutErrors() {
    const errorElements = document.querySelectorAll(".form-error");
    errorElements.forEach((element) => {
      element.textContent = "";
    });
  }

  processOrderSuccess(formData) {
    // Show success modal
    this.showOrderSuccessModal(formData);

    // Clear cart
    this.clearCart();

    // Hide checkout section
    this.hideCheckout();

    // Reset form
    const form = document.getElementById("checkout-form");
    if (form) {
      form.reset();
    }

    // Reset button
    const placeOrderBtn = document.getElementById("place-order-btn");
    if (placeOrderBtn) {
      placeOrderBtn.disabled = false;
      placeOrderBtn.innerHTML = `
        Place Order
      `;
    }

    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  showOrderSuccessModal(formData) {
    const customerName = formData.get("customerName");
    const customerEmail = formData.get("customerEmail");
    const orderTotal = this.getCartTotal();

    const modalHTML = `
      <div class="order-success-modal">
        <div class="modal-content">
          <div class="success-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22,4 12,14.01 9,11.01"></polyline>
            </svg>
          </div>
          <h2 class="success-title">Order Placed Successfully!</h2>
          <p class="success-message">
            Thank you for your purchase, <strong>${customerName}</strong>! 
            Your order has been confirmed and you will receive a confirmation email at <strong>${customerEmail}</strong>.
          </p>
          <div class="order-details">
            <div class="order-detail">
              <span class="detail-label">Order Total:</span>
              <span class="detail-value">$${orderTotal.toFixed(2)}</span>
            </div>
            <div class="order-detail">
              <span class="detail-label">Order Status:</span>
              <span class="detail-value status-confirmed">Confirmed</span>
            </div>
          </div>
          <div class="success-actions">
            <button class="continue-shopping-btn" onclick="window.location.href='catalog.html'">
              Continue Shopping
            </button>
            <button class="close-modal-btn" onclick="this.closest('.order-success-modal').remove()">
              Close
            </button>
          </div>
        </div>
      </div>
    `;

    // Add modal to page
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Add styles for modal
    const style = document.createElement("style");
    style.textContent = `
      .order-success-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .order-success-modal .modal-content {
        background: white;
        border-radius: 16px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        animation: slideInUp 0.3s ease;
      }
      
      @keyframes slideInUp {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      .success-icon {
        color: #27ae60;
        margin-bottom: 1rem;
      }
      
      .success-icon svg {
        animation: scaleIn 0.5s ease;
      }
      
      @keyframes scaleIn {
        from { transform: scale(0); }
        to { transform: scale(1); }
      }
      
      .success-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #23243a;
        margin-bottom: 1rem;
      }
      
      .success-message {
        color: #6e6b8c;
        line-height: 1.6;
        margin-bottom: 1.5rem;
      }
      
      .order-details {
        background: #f8fafd;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1.5rem;
      }
      
      .order-detail {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }
      
      .order-detail:last-child {
        margin-bottom: 0;
      }
      
      .detail-label {
        font-weight: 500;
        color: #6e6b8c;
      }
      
      .detail-value {
        font-weight: 600;
        color: #23243a;
      }
      
      .status-confirmed {
        color: #27ae60;
      }
      
      .success-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
      }
      
      .continue-shopping-btn,
      .close-modal-btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .continue-shopping-btn {
        background: linear-gradient(90deg, #3fd8c2 0%, #a18fff 50%, #ff7fd8 100%);
        color: white;
      }
      
      .continue-shopping-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 32px rgba(255, 127, 216, 0.16);
      }
      
      .close-modal-btn {
        background: #f8fafd;
        color: #6e6b8c;
        border: 1px solid #e0e6f7;
      }
      
      .close-modal-btn:hover {
        background: #e9e7fa;
        color: #23243a;
      }
      
      .spinning {
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize cart manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new CartManager();
});
