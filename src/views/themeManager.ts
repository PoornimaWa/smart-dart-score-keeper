
// the page theme between light and dark and persist preference. 

export function toggleTheme(): void {
  const body = document.body;
  body.classList.toggle("dark-mode");
  const currentTheme = body.classList.contains("dark-mode") ? "dark" : "light";
  try {
    localStorage.setItem("theme", currentTheme);
  } catch (e) {
    // localStorage may be unavailable in some environments — ignore persistence failure.
    
    console.warn("Could not persist theme preference:", e);
  }
  body.setAttribute("data-theme", currentTheme);
}

// Load saved theme from localStorage or follow system preference as a fallback. 
export function loadTheme(): void {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.body.classList.add("dark-mode");
      document.body.setAttribute("data-theme", "dark");
      return;
    }
    if (saved === "light") {
      document.body.classList.remove("dark-mode");
      document.body.setAttribute("data-theme", "light");
      return;
    }
  } catch (e) {
    

    console.warn("Unable to read theme from storage:", e);
  }

  // Fallback to system preference if available
  try {
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      document.body.classList.add("dark-mode");
      document.body.setAttribute("data-theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      document.body.setAttribute("data-theme", "light");
    }
  } catch {
  }
}