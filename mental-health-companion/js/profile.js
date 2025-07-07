document.addEventListener("DOMContentLoaded", () => {
  // Avatar upload
  const changeAvatarBtn = document.getElementById("change-avatar");
  const avatarModal = document.getElementById("avatar-modal");
  const saveAvatarBtn = document.getElementById("save-avatar");

  if (changeAvatarBtn) {
    changeAvatarBtn.addEventListener("click", () => {
      avatarModal.style.display = "flex";
    });
  }

  // Avatar upload area
  const uploadArea = document.getElementById("upload-area");
  const avatarUpload = document.getElementById("avatar-upload");

  if (uploadArea) {
    uploadArea.addEventListener("click", () => {
      avatarUpload.click();
    });

    avatarUpload.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          uploadArea.innerHTML = `
                        <img src="${event.target.result}" alt="Uploaded Avatar" style="max-width: 100%; border-radius: 5px;">
                        <p>Click to change</p>
                    `;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Avatar selection
  const avatarSelects = document.querySelectorAll(".avatar-select");
  avatarSelects.forEach((select) => {
    select.addEventListener("click", () => {
      avatarSelects.forEach((s) => (s.style.borderColor = "transparent"));
      select.style.borderColor = "var(--primary)";
    });
  });

  // Save avatar
  if (saveAvatarBtn) {
    saveAvatarBtn.addEventListener("click", () => {
      // In a real app, you would save the avatar to the server
      // For demo, we'll just show a confirmation
      alert("Profile picture updated successfully!");
      avatarModal.style.display = "none";
    });
  }

  // Goal management
  const addGoalBtn = document.getElementById("add-goal");
  const goalModal = document.getElementById("goal-modal");
  const saveGoalBtn = document.getElementById("save-goal");

  if (addGoalBtn) {
    addGoalBtn.addEventListener("click", () => {
      document.getElementById("goal-modal-title").textContent = "Add New Goal";
      goalModal.style.display = "flex";
    });
  }

  // Edit goal buttons
  document.querySelectorAll(".btn-edit-goal").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      document.getElementById("goal-modal-title").textContent = "Edit Goal";

      // In a real app, you would populate the form with existing goal data
      goalModal.style.display = "flex";
    });
  });

  // Save goal
  if (saveGoalBtn) {
    saveGoalBtn.addEventListener("click", () => {
      const title = document.getElementById("goal-title").value;
      const category = document.getElementById("goal-category").value;

      if (!title) {
        alert("Please enter a goal title");
        return;
      }

      // In a real app, you would save the goal to the server
      alert(`Goal "${title}" saved successfully!`);
      goalModal.style.display = "none";
    });
  }

  // Profile settings form
  const saveSettingsBtn = document.getElementById("save-settings");
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener("click", () => {
      const newPassword = document.getElementById("new-password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      if (newPassword && newPassword !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      // In a real app, you would save the settings to the server
      alert("Settings saved successfully!");
    });
  }

  // Initialize charts
  initializeProfileCharts();
});

function initializeProfileCharts() {
  // Mood History Chart
  const moodCtx = document.getElementById("moodHistoryChart").getContext("2d");
  window.moodHistoryChart = new Chart(moodCtx, {
    type: "line",
    data: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
      ],
      datasets: [
        {
          label: "Monthly Average Mood",
          data: [3.2, 3.5, 3.8, 4.1, 4.0, 4.2, 4.3, 4.1, 4.2, 4.4],
          backgroundColor: "rgba(108, 99, 255, 0.2)",
          borderColor: "rgba(108, 99, 255, 1)",
          borderWidth: 2,
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          min: 1,
          max: 5,
        },
      },
    },
  });

  // Meditation History Chart
  const meditationCtx = document
    .getElementById("meditationHistoryChart")
    .getContext("2d");
  window.meditationHistoryChart = new Chart(meditationCtx, {
    type: "bar",
    data: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
      ],
      datasets: [
        {
          label: "Monthly Meditation Minutes",
          data: [120, 150, 180, 200, 220, 250, 240, 260, 280, 300],
          backgroundColor: "rgba(255, 101, 132, 0.6)",
          borderColor: "rgba(255, 101, 132, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });

  // Journal History Chart
  const journalCtx = document
    .getElementById("journalHistoryChart")
    .getContext("2d");
  window.journalHistoryChart = new Chart(journalCtx, {
    type: "bar",
    data: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
      ],
      datasets: [
        {
          label: "Monthly Journal Entries",
          data: [3, 4, 5, 6, 7, 8, 7, 9, 10, 12],
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });

  // Activity History Chart
  const activityCtx = document
    .getElementById("activityHistoryChart")
    .getContext("2d");
  window.activityHistoryChart = new Chart(activityCtx, {
    type: "bar",
    data: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
      ],
      datasets: [
        {
          label: "Monthly Activities Completed",
          data: [2, 3, 4, 5, 6, 7, 6, 8, 9, 12],
          backgroundColor: "rgba(255, 159, 64, 0.6)",
          borderColor: "rgba(255, 159, 64, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}
