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

// Tracks whether we intend to show the iframe. Cleared when navigating home so
// a late-firing load event doesn't incorrectly replace home content.
let pendingIframe = false;

/** @param {string} identifier */
const activate = (identifier) => {
  // !identifier handles the empty-string case: pressing back from a hash to root
  // fires hashchange with location.hash === "", not "/"
  const isHome = !identifier || identifier === "/";
  const target = isHome
    ? document.querySelector('.sidebar a[href="/"]')
    : document.querySelector(`.sidebar a[href="${identifier}"]`) ||
      sidebarLinks[0];

  sidebarLinks.forEach((l) => l.classList.remove("active"));

  if (target) {
    target.classList.add("active");
  }

  if (isHome) {
    pendingIframe = false;
    homeContent.style.display = "";
    iframe.style.display = "none";
  } else {
    // Hide while the new src loads to avoid flashing stale content.
    // The load handler below reveals it once ready.
    pendingIframe = true;
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

// Reveal the iframe once the new src has loaded.
// Checking homeContent guards the race where the user navigates home
// before the iframe finishes loading — in that case, don't show the iframe.
iframe.addEventListener("load", () => {
  if (pendingIframe) {
    homeContent.style.display = "none";
    iframe.style.display = "";
    pendingIframe = false;
  }
});

document.querySelectorAll("#home-content a[href]").forEach((link) => {
  const sidebarLink = document.querySelector(
    `.sidebar-body a[href="${link.getAttribute("href")}"]`
  );
  if (!sidebarLink) return;
  link.addEventListener("mouseenter", () => sidebarLink.classList.add("hovered"));
  link.addEventListener("mouseleave", () => sidebarLink.classList.remove("hovered"));
});

hamburger.addEventListener("click", () => {
  const open = sidebar.classList.toggle("open");
  hamburger.textContent = open ? "✕" : "☰";
});
