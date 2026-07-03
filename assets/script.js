const links = document.querySelectorAll(".sidebar a");
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
  const isHome = !identifier || identifier === "/";
  const target = isHome
    ? document.querySelector('.sidebar a[href="/"]')
    : document.querySelector(`.sidebar a[href="${identifier}"]`) || links[0];

  links.forEach((l) => l.classList.remove("active"));

  if (target) {
    target.classList.add("active");
  }

  if (isHome) {
    homeContent.style.display = "";
    iframe.style.display = "none";
  } else {
    homeContent.style.display = "none";
    iframe.style.display = "";
    //@ts-ignore
    iframe.src = target.dataset.src;
  }
};

links.forEach((link) => {
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
