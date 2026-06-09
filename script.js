const root = document.documentElement;
const storageKey = "portfolio-theme";
const toggle = document.querySelector("[data-theme-toggle]");
const year = document.getElementById("year");

function setTheme(theme) {
  root.dataset.theme = theme;
  try {
    localStorage.setItem(storageKey, theme);
  } catch {}
  toggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
}

let storedTheme = null;
try {
  storedTheme = localStorage.getItem(storageKey);
} catch {}
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
setTheme(storedTheme || systemTheme);

toggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
});

year.textContent = new Date().getFullYear();
