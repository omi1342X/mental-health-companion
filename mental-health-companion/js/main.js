// Dark Mode Toggle
document.addEventListener("DOMContentLoaded", () => {
  // Check for saved dark mode preference
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }

  // Set up dark mode toggle
  const darkModeToggle = document.querySelector(".dark-mode-toggle");
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark-mode")
      );
    });
  }

  // Set up modal close buttons
  const closeButtons = document.querySelectorAll(".close-modal");
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".modal").style.display = "none";
    });
  });

  // Close modal when clicking outside
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  });

  // Set current year in footer
  const yearElement = document.querySelector("#current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});

// Navigation active link highlighting
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-links a");

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href");
    if (currentPage === linkPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});
