document.addEventListener("DOMContentLoaded", () => {
  // Modal elements
  const loginModal = document.getElementById("login-modal");
  const signupModal = document.getElementById("signup-modal");
  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");
  const showSignup = document.getElementById("show-signup");
  const showLogin = document.getElementById("show-login");

  // Form elements
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  // Open modals
  if (loginBtn)
    loginBtn.addEventListener(
      "click",
      () => (loginModal.style.display = "flex")
    );
  if (signupBtn)
    signupBtn.addEventListener(
      "click",
      () => (signupModal.style.display = "flex")
    );
  if (showSignup)
    showSignup.addEventListener("click", (e) => {
      e.preventDefault();
      loginModal.style.display = "none";
      signupModal.style.display = "flex";
    });
  if (showLogin)
    showLogin.addEventListener("click", (e) => {
      e.preventDefault();
      signupModal.style.display = "none";
      loginModal.style.display = "flex";
    });

  // Form submissions
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      // In a real app, you would authenticate with a server here
      console.log("Login attempt with:", email, password);

      // For demo purposes, just close the modal and update UI
      loginModal.style.display = "none";
      updateAuthUI(true);
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("signup-name").value;
      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;
      const confirm = document.getElementById("signup-confirm").value;

      if (password !== confirm) {
        alert("Passwords do not match!");
        return;
      }

      // In a real app, you would register with a server here
      console.log("Signup attempt with:", name, email, password);

      // For demo purposes, just close the modal and update UI
      signupModal.style.display = "none";
      updateAuthUI(true, name);
    });
  }

  // Check for logged in user on page load
  checkAuthStatus();
});

function checkAuthStatus() {
  // In a real app, you would check with your server or auth system
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userName = localStorage.getItem("userName") || "User";

  updateAuthUI(isLoggedIn, userName);
}

function updateAuthUI(isLoggedIn, userName = "User") {
  const authButtons = document.querySelector(".auth-buttons");
  const usernameDisplay = document.getElementById("username");

  if (isLoggedIn) {
    // Update UI for logged in state
    if (authButtons)
      authButtons.innerHTML = `
            <button id="logout-btn">Logout</button>
        `;

    if (usernameDisplay) usernameDisplay.textContent = userName;

    // Add logout event
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userName");
        updateAuthUI(false);
      });
    }

    // Store in localStorage for demo purposes
    localStorage.setItem("isLoggedIn", "true");
    if (userName !== "User") {
      localStorage.setItem("userName", userName);
    }
  } else {
    // Update UI for logged out state
    if (authButtons)
      authButtons.innerHTML = `
            <button id="login-btn">Login</button>
            <button id="signup-btn">Sign Up</button>
        `;

    if (usernameDisplay) usernameDisplay.textContent = "User";

    // Re-attach event listeners to new buttons
    const loginBtn = document.getElementById("login-btn");
    const signupBtn = document.getElementById("signup-btn");

    if (loginBtn)
      loginBtn.addEventListener("click", () => {
        document.getElementById("login-modal").style.display = "flex";
      });

    if (signupBtn)
      signupBtn.addEventListener("click", () => {
        document.getElementById("signup-modal").style.display = "flex";
      });
  }
}
