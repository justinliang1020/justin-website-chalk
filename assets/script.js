const sidebarLinks = document.querySelectorAll(".sidebar a");
const iframe = /** @type {HTMLElement} */ (
  document.querySelector("main iframe")
);
const homeContent = /** @type {HTMLElement} */ (
  document.getElementById("home-content")
);

const sidebar = /** @type {HTMLElement} */ (document.querySelector(".sidebar"));
const hamburger = /** @type {HTMLElement} */ (
  document.querySelector(".hamburger")
);

const closeMenu = () => {
  sidebar.classList.remove("open");
  hamburger.textContent = "☰";
};

/** @param {string} identifier */
const activate = (identifier) => {
  // !identifier handles the empty-string case: pressing back from a hash to root
  // fires hashchange with location.hash === "", not "/"
  const isHome = !identifier || identifier === "/";
  const target = isHome
    ? document.querySelector('.sidebar a[href="/"]')
    : document.querySelector(`.sidebar a[href="${identifier}"]`) || sidebarLinks[0];

  sidebarLinks.forEach((l) => l.classList.remove("active"));

  if (target) {
    target.classList.add("active");
  }

  if (isHome) {
    homeContent.style.display = "";
    iframe.style.display = "none";
  } else {
    // Show iframe synchronously — deferring to the load event causes a race:
    // if the user navigates home before the iframe finishes loading, the load
    // callback fires after activate("/") and incorrectly hides home content.
    homeContent.style.display = "none";
    iframe.style.display = "";
    //@ts-ignore
    iframe.src = target.dataset.src;
  }
};

sidebarLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    closeMenu();
    if (link.getAttribute("href") === "/") {
      e.preventDefault();
      history.pushState({}, "", "/");
      activate("/");
    }
  });
});

window.addEventListener("hashchange", () => activate(location.hash));
window.addEventListener("popstate", () => activate(location.hash || "/"));
activate(location.hash || "/");

hamburger.addEventListener("click", () => {
  const open = sidebar.classList.toggle("open");
  hamburger.textContent = open ? "✕" : "☰";
});
