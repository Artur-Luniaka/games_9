// Cookie Bar (универсальный модуль)
(function () {
  const LS_KEY = "cookieConsentAccepted";
  if (localStorage.getItem(LS_KEY)) return;

  function createBar() {
    if (document.getElementById("cookie-bar")) return;
    const bar = document.createElement("div");
    bar.className = "cookie-bar";
    bar.id = "cookie-bar";
    bar.innerHTML = `
      <span class="cookie-bar__text">
        We use cookies to ensure you get the best experience on our website. By continuing to browse, you accept our use of cookies.
      </span>
      <button class="cookie-bar__btn" id="cookie-bar-accept">Accept</button>
    `;
    document.body.appendChild(bar);
    document.getElementById("cookie-bar-accept").onclick = function () {
      localStorage.setItem(LS_KEY, "1");
      bar.style.opacity = "0";
      setTimeout(() => bar.remove(), 350);
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createBar);
  } else {
    createBar();
  }
})();
