// Checkout Controller Module - Handles checkout functionality without using 'this'
const CheckoutController = {
  cartItems: [],
  taxRate: 0.08,
  discountThreshold: 100,
  discountRate: 0.1,
  isProcessing: false,

  init() {
    CheckoutController.loadCart();
    CheckoutController.renderOrderSummary();
    CheckoutController.setupFormValidation();
    CheckoutController.setupEventListeners();

    // Redirect if cart is empty
    if (CheckoutController.cartItems.length === 0) {
      CheckoutController.showNotification("Your cart is empty", "warning");
      setTimeout(() => {
        window.location.href = "cart.html";
      }, 2000);
    }
  },

  loadCart() {
    const savedCart = localStorage.getItem("nexusCart");
    CheckoutController.cartItems = savedCart ? JSON.parse(savedCart) : [];
  },

  renderOrderSummary() {
    const orderItems = document.getElementById("order-items");
    const subtotalElement = document.getElementById("subtotal");
    const taxElement = document.getElementById("tax");
    const discountElement = document.getElementById("discount");
    const totalElement = document.getElementById("total");
    const discountRow = document.getElementById("discount-row");

    if (!orderItems) return;

    // Render order items
    const itemsHTML = CheckoutController.cartItems
      .map(
        (item) => `
            <div class="order-item">
                <div class="order-item-image">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                </div>
                <div class="order-item-details">
                    <h4 class="order-item-title">${item.title}</h4>
                    <div class="order-item-price">$${item.price}</div>
                    <div class="order-item-quantity">Quantity: ${item.quantity}</div>
                </div>
            </div>
        `
      )
      .join("");

    orderItems.innerHTML = itemsHTML;

    // Calculate totals
    const subtotal = CheckoutController.cartItems.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );
    const tax = subtotal * CheckoutController.taxRate;
    const discount =
      subtotal >= CheckoutController.discountThreshold
        ? subtotal * CheckoutController.discountRate
        : 0;
    const total = subtotal + tax - discount;

    // Update summary
    if (subtotalElement)
      subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (discountElement) {
      discountElement.textContent =
        discount > 0 ? `-$${discount.toFixed(2)}` : "-$0.00";
    }
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
    if (discountRow) {
      discountRow.style.display = discount > 0 ? "flex" : "none";
    }
  },

  setupFormValidation() {
    const form = document.getElementById("checkout-form");
    const nameInput = document.getElementById("customer-name");
    const emailInput = document.getElementById("customer-email");
    const phoneInput = document.getElementById("customer-phone");

    // Real-time validation
    if (nameInput) {
      nameInput.addEventListener("input", () => {
        CheckoutController.validateName(nameInput);
      });
    }

    if (emailInput) {
      emailInput.addEventListener("input", () => {
        CheckoutController.validateEmail(emailInput);
      });
    }

    if (phoneInput) {
      phoneInput.addEventListener("input", () => {
        CheckoutController.validatePhone(phoneInput);
      });
    }

    // Form submission
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        CheckoutController.handleFormSubmission();
      });
    }
  },

  validateName(input) {
    const name = input.value.trim();
    const errorElement = document.getElementById("name-error");

    if (name.length === 0) {
      CheckoutController.showFieldError(
        input,
        errorElement,
        "Name is required"
      );
      return false;
    } else if (name.length < 2) {
      CheckoutController.showFieldError(
        input,
        errorElement,
        "Name must be at least 2 characters"
      );
      return false;
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
      CheckoutController.showFieldError(
        input,
        errorElement,
        "Name can only contain letters and spaces"
      );
      return false;
    } else {
      CheckoutController.showFieldSuccess(input, errorElement);
      return true;
    }
  },

  validateEmail(input) {
    const email = input.value.trim();
    const errorElement = document.getElementById("email-error");

    // Manual email validation without HTML5
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (email.length === 0) {
      CheckoutController.showFieldError(
        input,
        errorElement,
        "Email is required"
      );
      return false;
    } else if (!emailRegex.test(email)) {
      CheckoutController.showFieldError(
        input,
        errorElement,
        "Please enter a valid email address"
      );
      return false;
    } else {
      CheckoutController.showFieldSuccess(input, errorElement);
      return true;
    }
  },

  validatePhone(input) {
    const phone = input.value.trim();
    const errorElement = document.getElementById("phone-error");

    if (phone.length === 0) {
      CheckoutController.showFieldSuccess(input, errorElement);
      return true; // Phone is optional
    }

    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;

    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""))) {
      CheckoutController.showFieldError(
        input,
        errorElement,
        "Please enter a valid phone number"
      );
      return false;
    } else {
      CheckoutController.showFieldSuccess(input, errorElement);
      return true;
    }
  },

  showFieldError(input, errorElement, message) {
    input.classList.remove("success");
    input.classList.add("error");
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = "flex";
    }
  },

  showFieldSuccess(input, errorElement) {
    input.classList.remove("error");
    input.classList.add("success");
    if (errorElement) {
      errorElement.textContent = "";
      errorElement.style.display = "none";
    }
  },

  handleFormSubmission() {
    const nameInput = document.getElementById("customer-name");
    const emailInput = document.getElementById("customer-email");
    const phoneInput = document.getElementById("customer-phone");
    const notesInput = document.getElementById("order-notes");

    // Validate all required fields
    const isNameValid = CheckoutController.validateName(nameInput);
    const isEmailValid = CheckoutController.validateEmail(emailInput);
    const isPhoneValid = CheckoutController.validatePhone(phoneInput);

    if (!isNameValid || !isEmailValid || !isPhoneValid) {
      CheckoutController.showNotification(
        "Please fix the errors in the form",
        "error"
      );
      return;
    }

    // Collect form data
    const formData = {
      customerName: nameInput.value.trim(),
      customerEmail: emailInput.value.trim(),
      customerPhone: phoneInput.value.trim(),
      orderNotes: notesInput ? notesInput.value.trim() : "",
      orderItems: CheckoutController.cartItems,
      orderTotal: CheckoutController.calculateOrderTotal(),
      orderDate: new Date().toISOString(),
      orderId: CheckoutController.generateOrderId(),
    };

    // Process order
    CheckoutController.processOrder(formData);
  },

  calculateOrderTotal() {
    const subtotal = CheckoutController.cartItems.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );
    const tax = subtotal * CheckoutController.taxRate;
    const discount =
      subtotal >= CheckoutController.discountThreshold
        ? subtotal * CheckoutController.discountRate
        : 0;
    return subtotal + tax - discount;
  },

  generateOrderId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `NEXUS-${timestamp}-${random}`.toUpperCase();
  },

  processOrder(orderData) {
    if (CheckoutController.isProcessing) return;

    CheckoutController.isProcessing = true;
    CheckoutController.showProcessingModal();

    // Simulate order processing
    let progress = 0;
    const progressFill = document.getElementById("progress-fill");
    const progressText = document.getElementById("progress-text");

    const processingSteps = [
      { progress: 20, message: "Validating order..." },
      { progress: 40, message: "Processing payment..." },
      { progress: 60, message: "Preparing download..." },
      { progress: 80, message: "Generating license keys..." },
      { progress: 100, message: "Order completed!" },
    ];

    let currentStep = 0;

    const processStep = () => {
      if (currentStep < processingSteps.length) {
        const step = processingSteps[currentStep];
        progress = step.progress;

        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `${progress}%`;

        // Update processing message
        const processingMessage = document.querySelector(".processing-message");
        if (processingMessage) {
          processingMessage.textContent = step.message;
        }

        currentStep++;
        setTimeout(processStep, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
      } else {
        // Order completed
        setTimeout(() => {
          CheckoutController.completeOrder(orderData);
        }, 1000);
      }
    };

    processStep();
  },

  showProcessingModal() {
    const modal = document.getElementById("processing-modal");
    if (modal) {
      modal.style.display = "flex";
    }
  },

  hideProcessingModal() {
    const modal = document.getElementById("processing-modal");
    if (modal) {
      modal.style.display = "none";
    }
  },

  completeOrder(orderData) {
    CheckoutController.hideProcessingModal();
    CheckoutController.isProcessing = false;

    // Clear cart
    localStorage.removeItem("nexusCart");

    // Show success message
    CheckoutController.showNotification(
      "Order completed successfully!",
      "success"
    );

    // Store order in localStorage for demo purposes
    const orders = JSON.parse(localStorage.getItem("nexusOrders") || "[]");
    orders.push(orderData);
    localStorage.setItem("nexusOrders", JSON.stringify(orders));

    // Redirect to success page or show order confirmation
    setTimeout(() => {
      // For demo, redirect to home page
      window.location.href = "index.html";
    }, 2000);
  },

  setupEventListeners() {
    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && CheckoutController.isProcessing) {
        // Allow canceling processing with Escape
        if (confirm("Are you sure you want to cancel the order?")) {
          CheckoutController.hideProcessingModal();
          CheckoutController.isProcessing = false;
        }
      }
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

// Initialize checkout controller when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  CheckoutController.init();
});
