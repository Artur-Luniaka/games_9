// Scroll to Top Button (универсальный модуль)
(function () {
  if (document.getElementById("scroll-to-top-btn")) return;
  function addBtn() {
    if (document.getElementById("scroll-to-top-btn")) return;
    const btn = document.createElement("button");
    btn.id = "scroll-to-top-btn";
    btn.innerHTML = `
      <span class="scroll-to-top-circle">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="8,20 16,12 24,20" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    `;
    document.body.appendChild(btn);
    setupLogic(btn);
  }

  function setupLogic(btn) {
    function getFirstSectionOffset() {
      const main = document.querySelector("main");
      let firstSection = main
        ? main.querySelector("section")
        : document.querySelector("section");
      if (firstSection) {
        const rect = firstSection.getBoundingClientRect();
        return rect.top + window.scrollY + rect.height;
      }
      return 400;
    }
    function onScroll() {
      const triggerOffset = getFirstSectionOffset();
      if (window.scrollY > triggerOffset) {
        btn.classList.add("show");
      } else {
        btn.classList.remove("show");
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addBtn);
  } else {
    addBtn();
  }
})();
