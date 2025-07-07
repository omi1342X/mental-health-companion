document.addEventListener("DOMContentLoaded", () => {
  // Meditation timer
  let timerInterval;
  let timeLeft = 5 * 60; // Default 5 minutes in seconds
  let isTimerRunning = false;
  let isBreathingActive = false;
  let breathingInterval;

  // Timer elements
  const minutesDisplay = document.getElementById("meditation-minutes");
  const secondsDisplay = document.getElementById("meditation-seconds");
  const startTimerBtn = document.getElementById("start-timer");
  const pauseTimerBtn = document.getElementById("pause-timer");
  const resetTimerBtn = document.getElementById("reset-timer");
  const timePresets = document.querySelectorAll(".time-preset");

  // Breathing elements
  const startBreathingBtn = document.getElementById("start-breathing");
  const stopBreathingBtn = document.getElementById("stop-breathing");
  const breathingCircle = document.querySelector(".breathing-circle");
  const breathingText = document.querySelector(".breathing-text");
  const breathingPattern = document.getElementById("breathing-pattern");

  // Meditation tabs
  const meditationTabs = document.querySelectorAll(".meditation-tab");
  meditationTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs
      meditationTabs.forEach((t) => t.classList.remove("active"));

      // Add active class to clicked tab
      tab.classList.add("active");

      // Hide all tab contents
      document
        .querySelectorAll(".meditation-tab-content")
        .forEach((content) => {
          content.classList.remove("active");
        });

      // Show selected tab content
      const tabId = tab.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");
    });
  });

  // Program cards
  const programCards = document.querySelectorAll(".program-card");
  programCards.forEach((card) => {
    card.addEventListener("click", () => {
      const program = card.getAttribute("data-program");
      openProgramModal(program);
    });
  });

  // Time presets
  timePresets.forEach((preset) => {
    preset.addEventListener("click", () => {
      const minutes = parseInt(preset.getAttribute("data-minutes"));
      timeLeft = minutes * 60;
      updateTimerDisplay();
    });
  });

  // Timer controls
  if (startTimerBtn) {
    startTimerBtn.addEventListener("click", startTimer);
  }

  if (pauseTimerBtn) {
    pauseTimerBtn.addEventListener("click", pauseTimer);
  }

  if (resetTimerBtn) {
    resetTimerBtn.addEventListener("click", resetTimer);
  }

  // Breathing controls
  if (startBreathingBtn) {
    startBreathingBtn.addEventListener("click", startBreathing);
  }

  if (stopBreathingBtn) {
    stopBreathingBtn.addEventListener("click", stopBreathing);
  }

  // Sound controls
  const soundCards = document.querySelectorAll(".sound-card");
  soundCards.forEach((card) => {
    const playBtn = card.querySelector(".btn-play-sound");
    const volumeSlider = card.querySelector(".volume-slider");

    playBtn.addEventListener("click", () => {
      // In a real app, you would play the sound here
      playBtn.innerHTML = playBtn.innerHTML.includes("pause")
        ? '<i class="fas fa-play"></i>'
        : '<i class="fas fa-pause"></i>';
    });

    volumeSlider.addEventListener("input", (e) => {
      // In a real app, you would adjust volume here
      console.log(`Volume set to ${e.target.value}%`);
    });
  });

  // Mixer controls
  const mixerSliders = document.querySelectorAll(".mixer-slider");
  mixerSliders.forEach((slider) => {
    const volumeDisplay = slider.nextElementSibling;

    slider.addEventListener("input", (e) => {
      volumeDisplay.textContent = `${e.target.value}%`;
    });
  });

  // Mixer presets
  const mixerPresets = document.querySelectorAll(".mixer-preset");
  mixerPresets.forEach((preset) => {
    preset.addEventListener("click", () => {
      const presetType = preset.getAttribute("data-preset");
      applyMixerPreset(presetType);
    });
  });

  // Initialize timer display
  updateTimerDisplay();

  // Initialize meditation chart
  updateMeditationChart();
});

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById("meditation-minutes").textContent = minutes
    .toString()
    .padStart(2, "0");
  document.getElementById("meditation-seconds").textContent = seconds
    .toString()
    .padStart(2, "0");
}

function startTimer() {
  if (isTimerRunning) return;

  isTimerRunning = true;
  document.getElementById("start-timer").disabled = true;
  document.getElementById("pause-timer").disabled = false;

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      document.getElementById("start-timer").disabled = false;
      document.getElementById("pause-timer").disabled = true;

      // Play ending bell
      const endingBell = document.getElementById("ending-bell").value;
      if (endingBell !== "0") {
        console.log(`Playing ${endingBell} sound`);
      }

      alert("Meditation session complete!");

      // Save session to history
      saveMeditationSession("timer", Math.floor(timeLeft / 60));
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  document.getElementById("start-timer").disabled = false;
  document.getElementById("pause-timer").disabled = true;
}

function resetTimer() {
  pauseTimer();
  timeLeft = 5 * 60; // Reset to 5 minutes
  updateTimerDisplay();
}

function startBreathing() {
  if (isBreathingActive) return;

  isBreathingActive = true;
  document.getElementById("start-breathing").disabled = true;
  document.getElementById("stop-breathing").disabled = false;

  const pattern = document.getElementById("breathing-pattern").value;
  let inhale, hold, exhale, pause;

  switch (pattern) {
    case "4-7-8":
      inhale = 4;
      hold = 7;
      exhale = 8;
      pause = 0;
      break;
    case "4-4-4":
      inhale = 4;
      hold = 4;
      exhale = 4;
      pause = 0;
      break;
    case "4-4-6-2":
      inhale = 4;
      hold = 4;
      exhale = 6;
      pause = 2;
      break;
    default:
      inhale = 4;
      hold = 7;
      exhale = 8;
      pause = 0;
  }

  let cycleTime = 0;
  const totalCycleTime = inhale + hold + exhale + pause;

  breathingInterval = setInterval(() => {
    cycleTime = (cycleTime + 1) % totalCycleTime;

    if (cycleTime < inhale) {
      // Inhale phase
      breathingText.textContent = "Breathe In";
      const scale = 1 + 0.5 * (cycleTime / inhale);
      breathingCircle.style.transform = `scale(${scale})`;
    } else if (cycleTime < inhale + hold) {
      // Hold phase
      breathingText.textContent = "Hold";
    } else if (cycleTime < inhale + hold + exhale) {
      // Exhale phase
      breathingText.textContent = "Breathe Out";
      const scale = 1.5 - 0.5 * ((cycleTime - inhale - hold) / exhale);
      breathingCircle.style.transform = `scale(${scale})`;
    } else {
      // Pause phase
      breathingText.textContent = "Pause";
    }
  }, 1000);
}

function stopBreathing() {
  clearInterval(breathingInterval);
  isBreathingActive = false;
  breathingText.textContent = "Breathe In";
  breathingCircle.style.transform = "scale(1)";
  document.getElementById("start-breathing").disabled = false;
  document.getElementById("stop-breathing").disabled = true;
}

function openProgramModal(program) {
  const modal = document.getElementById("program-modal");
  const title = document.getElementById("program-title");
  const description = document.querySelector(".program-description");
  const sessionList = document.querySelector(".session-list");

  // In a real app, you would fetch program data from a database
  const programs = {
    mindfulness: {
      title: "Mindfulness Meditation",
      description:
        "A 10-session program to cultivate present-moment awareness and reduce stress.",
      sessions: [
        {
          title: "1. Introduction to Mindfulness",
          duration: "5 min",
          description: "Learn the basics of mindfulness meditation",
        },
        {
          title: "2. The Breath as an Anchor",
          duration: "7 min",
          description: "Focus on your breathing",
        },
        {
          title: "3. Body Awareness",
          duration: "10 min",
          description: "Scan through your body",
        },
        {
          title: "4. Dealing with Distractions",
          duration: "12 min",
          description: "Gently return your focus",
        },
        {
          title: "5. Observing Thoughts",
          duration: "15 min",
          description: "Notice without judgment",
        },
      ],
    },
    sleep: {
      title: "Sleep Meditation",
      description:
        "A 7-session program to help you relax and fall asleep more easily.",
      sessions: [
        {
          title: "1. Relaxing the Body",
          duration: "10 min",
          description: "Progressive muscle relaxation",
        },
        {
          title: "2. Quieting the Mind",
          duration: "12 min",
          description: "Letting go of thoughts",
        },
        {
          title: "3. Guided Imagery",
          duration: "15 min",
          description: "Peaceful scene visualization",
        },
      ],
    },
    anxiety: {
      title: "Anxiety Relief",
      description: "A 5-session program to help manage anxiety and stress.",
      sessions: [
        {
          title: "1. Grounding Techniques",
          duration: "5 min",
          description: "Connect with the present moment",
        },
        {
          title: "2. Calming the Nervous System",
          duration: "8 min",
          description: "Activate relaxation response",
        },
        {
          title: "3. Letting Go of Worry",
          duration: "10 min",
          description: "Release anxious thoughts",
        },
      ],
    },
    focus: {
      title: "Focus & Concentration",
      description: "An 8-session program to improve focus and mental clarity.",
      sessions: [
        {
          title: "1. Attention Training",
          duration: "5 min",
          description: "Sharpen your focus",
        },
        {
          title: "2. Mindful Work",
          duration: "8 min",
          description: "Stay present with tasks",
        },
        {
          title: "3. Overcoming Distractions",
          duration: "10 min",
          description: "Maintain concentration",
        },
      ],
    },
  };

  const selectedProgram = programs[program] || programs["mindfulness"];

  // Update modal content
  title.textContent = selectedProgram.title;
  description.innerHTML = `<p>${selectedProgram.description}</p>`;

  // Create session list
  sessionList.innerHTML = selectedProgram.sessions
    .map(
      (session, index) => `
        <div class="session-item ${
          index < 2 ? "completed" : index === 2 ? "current" : ""
        }">
            <div class="session-info">
                <h4>${session.title}</h4>
                <p>${session.duration} • ${session.description}</p>
            </div>
            <button class="btn-play">
                <i class="fas fa-play"></i>
            </button>
        </div>
    `
    )
    .join("");

  // Add event listeners to play buttons
  document.querySelectorAll(".session-item .btn-play").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const sessionTitle = button
        .closest(".session-item")
        .querySelector("h4").textContent;
      alert(`Starting ${sessionTitle}`);

      // In a real app, you would start the guided session
      // For now, we'll just start the timer with the session duration
      const duration = parseInt(
        button.closest(".session-item").querySelector("p").textContent
      );
      timeLeft = duration * 60;
      updateTimerDisplay();
      startTimer();
    });
  });

  // Show modal
  modal.style.display = "flex";
}

function applyMixerPreset(presetType) {
  // In a real app, you would adjust the mixer sliders based on the preset
  const tracks = document.querySelectorAll(".mixer-track");

  tracks.forEach((track) => {
    const sound = track.getAttribute("data-sound");
    const slider = track.querySelector(".mixer-slider");
    const volumeDisplay = track.querySelector(".track-volume");

    let volume = 0;

    switch (presetType) {
      case "relax":
        if (sound === "rain") volume = 70;
        if (sound === "ocean") volume = 30;
        if (sound === "forest") volume = 50;
        break;
      case "focus":
        if (sound === "white-noise") volume = 60;
        if (sound === "singing-bowl") volume = 20;
        break;
      case "sleep":
        if (sound === "rain") volume = 40;
        if (sound === "ocean") volume = 50;
        break;
      case "meditate":
        if (sound === "singing-bowl") volume = 80;
        break;
    }

    slider.value = volume;
    volumeDisplay.textContent = `${volume}%`;
  });
}

function saveMeditationSession(type, duration) {
  let history = JSON.parse(localStorage.getItem("meditationHistory")) || [];

  history.push({
    date: new Date().toISOString(),
    type: type,
    duration: duration,
  });

  localStorage.setItem("meditationHistory", JSON.stringify(history));
  updateMeditationChart();
}

function updateMeditationChart() {
  // In a real app, you would use actual meditation history data
  // For demo purposes, we'll use sample data

  const ctx = document.getElementById("meditationChart").getContext("2d");

  // If chart already exists, destroy it first
  if (window.meditationChartInstance) {
    window.meditationChartInstance.destroy();
  }

  // Create new chart with sample data
  window.meditationChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Meditation Minutes",
          data: [10, 15, 5, 20, 12, 8, 15],
          backgroundColor: "rgba(108, 99, 255, 0.6)",
          borderColor: "rgba(108, 99, 255, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
