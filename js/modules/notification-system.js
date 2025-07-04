// Notification System Module - Displays animated notifications
class NotificationSystem {
  constructor() {
    this.container = document.getElementById("notification-container");
    this.notifications = [];
    this.maxNotifications = 3;

    this.init();
  }

  init() {
    this.listenForEvents();
    this.setupContainer();
  }

  setupContainer() {
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.id = "notification-container";
      this.container.className = "notification-container";
      document.body.appendChild(this.container);
    }
  }

  listenForEvents() {
    document.addEventListener("showNotification", (e) => {
      const { message, type } = e.detail;
      this.show(message, type);
    });
  }

  show(message, type = "info", duration = 4000) {
    const notification = this.createNotification(message, type);

    // Add to notifications array
    this.notifications.push(notification);

    // Add to DOM
    this.container.appendChild(notification);

    // Trigger entrance animation
    setTimeout(() => {
      notification.classList.add("notification-show");
    }, 10);

    // Auto remove after duration
    setTimeout(() => {
      this.remove(notification);
    }, duration);

    // Limit number of notifications
    if (this.notifications.length > this.maxNotifications) {
      const oldestNotification = this.notifications.shift();
      this.remove(oldestNotification);
    }
  }

  createNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;

    const icon = this.getIconForType(type);
    const color = this.getColorForType(type);

    notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon" style="color: ${color}">
                    ${icon}
                </div>
                <div class="notification-message">
                    <p>${message}</p>
                </div>
                <button class="notification-close" aria-label="Close notification">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="notification-progress" style="background: ${color}"></div>
        `;

    // Add close button event listener
    const closeBtn = notification.querySelector(".notification-close");
    closeBtn.addEventListener("click", () => {
      this.remove(notification);
    });

    return notification;
  }

  getIconForType(type) {
    const icons = {
      success: ``,
      error: ``,
      warning: ``,
      info: ``,
    };

    return icons[type] || icons.info;
  }

  getColorForType(type) {
    const colors = {
      success: "#28a745",
      error: "#dc3545",
      warning: "#ffc107",
      info: "#17a2b8",
    };

    return colors[type] || colors.info;
  }

  remove(notification) {
    if (!notification || !notification.parentNode) return;

    // Add exit animation
    notification.classList.add("notification-hide");

    // Remove from DOM after animation
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }

      // Remove from notifications array
      const index = this.notifications.indexOf(notification);
      if (index > -1) {
        this.notifications.splice(index, 1);
      }
    }, 300);
  }

  // Utility methods for different notification types
  success(message, duration) {
    this.show(message, "success", duration);
  }

  error(message, duration) {
    this.show(message, "error", duration);
  }

  warning(message, duration) {
    this.show(message, "warning", duration);
  }

  info(message, duration) {
    this.show(message, "info", duration);
  }

  // Clear all notifications
  clearAll() {
    this.notifications.forEach((notification) => {
      this.remove(notification);
    });
  }
}

// Initialize notification system when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new NotificationSystem();
});
