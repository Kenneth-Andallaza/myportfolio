const root = document.documentElement;
const storageKey = "portfolio-theme";
const toggle = document.querySelector("[data-theme-toggle]");
const year = document.getElementById("year");
const themeColor = document.querySelector('meta[name="theme-color"]');
const galleryModal = document.querySelector("[data-gallery-modal]");
const galleryOpen = document.querySelector("[data-gallery-open]");
const galleryClose = document.querySelector("[data-gallery-close]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const lightboxPrev = document.querySelector("[data-lightbox-prev]");
const lightboxNext = document.querySelector("[data-lightbox-next]");
const lightboxItems = Array.from(document.querySelectorAll("[data-lightbox-item] img"));
const themeColors = {
  light: "#f4efe5",
  dark: "#07111d",
};
let activeLightboxIndex = 0;

function setTheme(theme) {
  root.dataset.theme = theme;
  try {
    localStorage.setItem(storageKey, theme);
  } catch {}
  if (themeColor) {
    themeColor.setAttribute("content", themeColors[theme] || themeColors.light);
  }
  if (toggle) {
    toggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }
}

let storedTheme = null;
try {
  storedTheme = localStorage.getItem(storageKey);
} catch {}

const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
setTheme(storedTheme || systemTheme);

if (toggle) {
  toggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  });
}

if (year) {
  year.textContent = new Date().getFullYear();
}

function setPageScroll(isLocked) {
  document.body.style.overflow = isLocked ? "hidden" : "";
}

function showLightboxImage(index) {
  if (!lightboxImage || !lightboxCaption || lightboxItems.length === 0) return;

  activeLightboxIndex = (index + lightboxItems.length) % lightboxItems.length;
  const image = lightboxItems[activeLightboxIndex];
  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = image.alt;
}

function openLightbox(index) {
  if (!lightbox) return;
  showLightboxImage(index);
  lightbox.hidden = false;
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.hidden = true;
  lightboxImage.src = "";
}

function moveLightbox(direction) {
  showLightboxImage(activeLightboxIndex + direction);
}

if (galleryModal && galleryOpen) {
  galleryOpen.addEventListener("click", () => {
    galleryModal.showModal();
    setPageScroll(true);
  });

  galleryModal.addEventListener("close", () => {
    closeLightbox();
    setPageScroll(false);
  });

  galleryModal.addEventListener("click", (event) => {
    if (event.target === galleryModal) {
      galleryModal.close();
    }
  });

  galleryModal.addEventListener("cancel", (event) => {
    if (lightbox && !lightbox.hidden) {
      event.preventDefault();
      closeLightbox();
    }
  });
}

if (galleryModal && galleryClose) {
  galleryClose.addEventListener("click", () => {
    galleryModal.close();
  });
}

lightboxItems.forEach((image, index) => {
  const item = image.parentElement;
  if (!item) return;

  item.setAttribute("role", "button");
  item.setAttribute("tabindex", "0");
  item.setAttribute("aria-label", `Open image ${index + 1}`);

  item.addEventListener("click", () => {
    openLightbox(index);
  });

  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(index);
    }
  });
});

if (lightbox && lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

if (lightboxPrev) {
  lightboxPrev.addEventListener("click", () => moveLightbox(-1));
}

if (lightboxNext) {
  lightboxNext.addEventListener("click", () => moveLightbox(1));
}

document.addEventListener("keydown", (event) => {
  if (!lightbox || lightbox.hidden) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    moveLightbox(-1);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    moveLightbox(1);
  }
});
