const sidebar = /** @type {HTMLElement} */ (document.querySelector(".sidebar"));
const hamburger = /** @type {HTMLElement} */ (document.querySelector(".hamburger"));

hamburger.addEventListener("click", () => {
  const open = sidebar.classList.toggle("open");
  hamburger.textContent = open ? "✕" : "☰";
});

// Bidirectional hover highlight between home-content links and sidebar links
document.querySelectorAll("#home-content a[href]").forEach((link) => {
  const sidebarLink = document.querySelector(
    `.sidebar-body a[href="${link.getAttribute("href")}"]`
  );
  if (!sidebarLink) return;
  link.addEventListener("mouseenter", () => sidebarLink.classList.add("hovered"));
  link.addEventListener("mouseleave", () => sidebarLink.classList.remove("hovered"));
});

document.querySelectorAll(".sidebar-body a[href]").forEach((sidebarLink) => {
  const homeLink = document.querySelector(`#home-content a[href="${sidebarLink.getAttribute("href")}"]`);
  if (!homeLink) return;
  sidebarLink.addEventListener("mouseenter", () => homeLink.classList.add("hovered"));
  sidebarLink.addEventListener("mouseleave", () => homeLink.classList.remove("hovered"));
});
