/* =========================================================
   PORTFOLIO SCRIPT
   Three small features. The page still works without them:
   links still jump to sections, and figures open in a new tab.

   1. Phone menu: open and close it with the "Menu" button
   2. Highlight the menu link for the section you are reading
   3. Figure viewer: open figures large, step through with
      the arrow keys, close with Esc
   ========================================================= */


/* ---------- 1. Phone menu ---------- */
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.getElementById("site-nav");

function setMenu(open) {
  navToggle.setAttribute("aria-expanded", String(open));
  siteNav.classList.toggle("is-open", open);
}

navToggle.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  setMenu(!isOpen);
});

// Close the menu after choosing a section
siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});

// Close the menu with the Esc key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
    setMenu(false);
    navToggle.focus();
  }
});


/* ---------- 2. Highlight the current section ---------- */
const navLinks = [...siteNav.querySelectorAll("a")];

// An IntersectionObserver tells us when a section crosses a thin
// band across the middle of the screen.
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    // In the hero (id "top") no link matches, so none is highlighted
    navLinks.forEach((link) => {
      const matches = link.getAttribute("href") === "#" + entry.target.id;
      if (matches) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  });
}, { rootMargin: "-45% 0px -50% 0px" });

sectionObserver.observe(document.getElementById("top"));
navLinks.forEach((link) => {
  const section = document.querySelector(link.getAttribute("href"));
  if (section) sectionObserver.observe(section);
});


/* ---------- 3. Figure viewer ---------- */
const viewer = document.getElementById("lightbox");
const viewerImg = document.getElementById("lightbox-img");
const viewerCaption = document.getElementById("lightbox-caption");
const viewerCount = document.getElementById("lightbox-count");

let currentFigures = [];   // the figures in the gallery you opened
let currentIndex = 0;
let lastFocused = null;    // where focus returns when the viewer closes

function showFigure(index) {
  // wrap around: after the last figure comes the first
  currentIndex = (index + currentFigures.length) % currentFigures.length;
  const link = currentFigures[currentIndex];
  const img = link.querySelector("img");
  const caption = link.closest("figure").querySelector("figcaption");

  viewerImg.src = link.getAttribute("href");
  viewerImg.alt = img.alt;
  viewerCaption.textContent = caption ? caption.textContent : "";
  viewerCount.textContent = `Figure ${currentIndex + 1} of ${currentFigures.length}`;
}

document.querySelectorAll(".gallery").forEach((gallery) => {
  const figures = [...gallery.querySelectorAll("a.zoom")];
  figures.forEach((link, index) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();          // stay on the page instead of opening the file
      lastFocused = link;
      currentFigures = figures;
      showFigure(index);
      viewer.showModal();
    });
  });
});

// Previous / Next / Close buttons
viewer.addEventListener("click", (event) => {
  const stepButton = event.target.closest("[data-step]");
  if (stepButton) showFigure(currentIndex + Number(stepButton.dataset.step));
  if (event.target.closest("[data-close]")) viewer.close();
  // a click on the dark backdrop (outside the content) also closes it
  if (event.target === viewer) viewer.close();
});

// Arrow keys step through figures (Esc closing is built into <dialog>)
viewer.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") showFigure(currentIndex + 1);
  if (event.key === "ArrowLeft") showFigure(currentIndex - 1);
});

// Put keyboard focus back on the figure that was opened
viewer.addEventListener("close", () => {
  if (lastFocused) lastFocused.focus();
});
