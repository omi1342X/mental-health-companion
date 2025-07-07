// Mood tracking functionality
const moodButtons = document.querySelectorAll(".mood-options button");
const moodResponse = document.getElementById("mood-response");
let moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];

moodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const moodValue = parseInt(button.getAttribute("data-mood"));
    const today = new Date().toISOString().split("T")[0];

    // Check if there's already an entry for today
    const existingEntryIndex = moodHistory.findIndex(
      (entry) => entry.date === today
    );

    if (existingEntryIndex !== -1) {
      moodHistory[existingEntryIndex].mood = moodValue;
    } else {
      moodHistory.push({ date: today, mood: moodValue });
    }

    localStorage.setItem("moodHistory", JSON.stringify(moodHistory));

    // Show response based on mood
    showMoodResponse(moodValue);
    updateMoodChart();
  });
});

function showMoodResponse(moodValue) {
  const responses = [
    {
      mood: 1,
      message:
        "I'm sorry you're struggling today. Remember, it's okay to not be okay. Would you like to try a breathing exercise or see some resources that might help?",
      emoji: "❤️",
    },
    {
      mood: 2,
      message:
        "It sounds like you're having a tough day. Maybe a short walk or journaling could help process these feelings.",
      emoji: "🤗",
    },
    {
      mood: 3,
      message:
        "Some days are just okay, and that's perfectly fine. Maybe try a small self-care activity to boost your mood.",
      emoji: "✨",
    },
    {
      mood: 4,
      message:
        "Glad to hear you're doing well! Keep up whatever is working for you.",
      emoji: "👍",
    },
    {
      mood: 5,
      message: "Wonderful! It's great to see you're feeling fantastic today!",
      emoji: "🎉",
    },
  ];

  const response = responses.find((r) => r.mood === moodValue);
  moodResponse.innerHTML = `<p>${response.message} ${response.emoji}</p>`;
  moodResponse.style.display = "block";

  // Also suggest activities based on mood
  suggestActivities(moodValue);
}

// Journal functionality
const journalEntry = document.getElementById("journal-entry");
const saveJournalBtn = document.getElementById("save-journal");
const journalPrompts = [
  "What are you grateful for today?",
  "What was the highlight of your day?",
  "What's something you're looking forward to?",
  "Write about a challenge you're facing and how you might approach it.",
  "Describe something that made you smile recently.",
];
const currentPrompt = document.getElementById("current-prompt");
const newPromptBtn = document.getElementById("new-prompt");

newPromptBtn.addEventListener("click", () => {
  const randomPrompt =
    journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
  currentPrompt.textContent = randomPrompt;
});

saveJournalBtn.addEventListener("click", () => {
  const entry = journalEntry.value.trim();
  if (entry) {
    const today = new Date().toISOString().split("T")[0];
    let journals = JSON.parse(localStorage.getItem("journals")) || [];

    // Check if there's already an entry for today
    const existingEntryIndex = journals.findIndex((j) => j.date === today);

    if (existingEntryIndex !== -1) {
      journals[existingEntryIndex].entry = entry;
    } else {
      journals.push({ date: today, entry });
    }

    localStorage.setItem("journals", JSON.stringify(journals));
    alert("Journal entry saved successfully!");
    journalEntry.value = "";
  } else {
    alert("Please write something before saving.");
  }
});

// Activity suggestions
const activityContainer = document.getElementById("activity-suggestions");

function suggestActivities(moodValue) {
  let activities = [];

  if (moodValue <= 2) {
    activities = [
      {
        name: "Deep Breathing",
        description:
          "Try 4-7-8 breathing: Inhale for 4 seconds, hold for 7, exhale for 8.",
      },
      {
        name: "Gratitude List",
        description: "Write down 3 things you're grateful for right now.",
      },
      {
        name: "Gentle Stretch",
        description: "Stand up and stretch your arms overhead for 30 seconds.",
      },
      {
        name: "Nature Break",
        description:
          "Step outside for 5 minutes, even if just to your doorstep.",
      },
    ];
  } else if (moodValue === 3) {
    activities = [
      {
        name: "Quick Walk",
        description: "Take a 10-minute walk around your neighborhood.",
      },
      {
        name: "Favorite Song",
        description: "Listen to a song that always makes you feel good.",
      },
      {
        name: "Hydrate",
        description: "Drink a glass of water - dehydration can affect mood.",
      },
      {
        name: "Positive Affirmation",
        description:
          "Repeat to yourself: 'I am doing my best, and that is enough.'",
      },
    ];
  } else {
    activities = [
      {
        name: "Pay It Forward",
        description: "Do something kind for someone else today.",
      },
      {
        name: "Creative Outlet",
        description: "Draw, write, or create something just for fun.",
      },
      {
        name: "Learn Something New",
        description:
          "Watch a short tutorial on something you're curious about.",
      },
      {
        name: "Connect",
        description: "Reach out to a friend or family member to say hello.",
      },
    ];
  }

  activityContainer.innerHTML = "";
  activities.forEach((activity) => {
    const activityEl = document.createElement("div");
    activityEl.className = "activity";
    activityEl.innerHTML = `
            <h3>${activity.name}</h3>
            <p>${activity.description}</p>
        `;
    activityContainer.appendChild(activityEl);
  });
}

// Mood chart functionality
function updateMoodChart() {
  const ctx = document.getElementById("moodChart").getContext("2d");

  // Get last 7 days of mood data
  const recentMoods = moodHistory.slice(-7).reverse();
  const dates = recentMoods.map((entry) => entry.date);
  const moods = recentMoods.map((entry) => entry.mood);

  // If chart already exists, destroy it first
  if (window.moodChartInstance) {
    window.moodChartInstance.destroy();
  }

  window.moodChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Mood (1-5 scale)",
          data: moods,
          backgroundColor: "rgba(108, 99, 255, 0.2)",
          borderColor: "rgba(108, 99, 255, 1)",
          borderWidth: 2,
          tension: 0.1,
          pointBackgroundColor: "rgba(108, 99, 255, 1)",
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
          min: 1,
          max: 5,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  });
}
// Meditation Timer
let timerInterval;
let timeLeft = 5 * 60; // Default 5 minutes in seconds
let isTimerRunning = false;

const timeOptions = document.querySelectorAll(".time-option");
const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");
const startTimerBtn = document.getElementById("start-timer");
const pauseTimerBtn = document.getElementById("pause-timer");
const resetTimerBtn = document.getElementById("reset-timer");
const startGuidedBtn = document.getElementById("start-guided");

timeOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const minutes = parseInt(option.getAttribute("data-minutes"));
    timeLeft = minutes * 60;
    updateTimerDisplay();
  });
});

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  minutesDisplay.textContent = minutes.toString().padStart(2, "0");
  secondsDisplay.textContent = seconds.toString().padStart(2, "0");
}

function startTimer() {
  if (isTimerRunning) return;

  isTimerRunning = true;
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      alert("Meditation session complete!");
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
}

function resetTimer() {
  pauseTimer();
  timeLeft = 5 * 60; // Reset to 5 minutes
  updateTimerDisplay();
}

startTimerBtn.addEventListener("click", startTimer);
pauseTimerBtn.addEventListener("click", pauseTimer);
resetTimerBtn.addEventListener("click", resetTimer);

startGuidedBtn.addEventListener("click", () => {
  const guidedType = document.getElementById("guided-type").value;
  let message = "";

  switch (guidedType) {
    case "mindfulness":
      message =
        "Focus on your breath. Notice each inhale and exhale without judgment.";
      break;
    case "body-scan":
      message =
        "Slowly bring attention to each part of your body, from toes to head.";
      break;
    case "loving-kindness":
      message =
        'Repeat: "May I be happy. May I be healthy. May I be at peace."';
      break;
    case "sleep":
      message =
        "Imagine yourself in a peaceful place. Feel your body getting heavier.";
      break;
  }

  alert(
    `Begin your ${guidedType} meditation:\n\n${message}\n\nThe timer has started.`
  );
  startTimer();
});

// Breathing Exercise
let breathingInterval;
let isBreathingActive = false;
const breathingCircle = document.getElementById("breathing-circle");
const breathingInstruction = document.getElementById("breathing-instruction");
const startBreathingBtn = document.getElementById("start-breathing");
const stopBreathingBtn = document.getElementById("stop-breathing");
const breathingPatternSelect = document.getElementById("breathing-pattern");

function startBreathing() {
  if (isBreathingActive) return;

  isBreathingActive = true;
  const pattern = breathingPatternSelect.value;
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
  }

  let cycleTime = 0;
  const totalCycleTime = inhale + hold + exhale + pause;

  breathingInterval = setInterval(() => {
    cycleTime = (cycleTime + 1) % totalCycleTime;

    if (cycleTime < inhale) {
      // Inhale phase
      breathingInstruction.textContent = "Breathe In";
      const scale = 1 + 0.5 * (cycleTime / inhale);
      breathingCircle.style.transform = `scale(${scale})`;
    } else if (cycleTime < inhale + hold) {
      // Hold phase
      breathingInstruction.textContent = "Hold";
    } else if (cycleTime < inhale + hold + exhale) {
      // Exhale phase
      breathingInstruction.textContent = "Breathe Out";
      const scale = 1.5 - 0.5 * ((cycleTime - inhale - hold) / exhale);
      breathingCircle.style.transform = `scale(${scale})`;
    } else {
      // Pause phase
      breathingInstruction.textContent = "Pause";
    }
  }, 1000);
}

function stopBreathing() {
  clearInterval(breathingInterval);
  isBreathingActive = false;
  breathingInstruction.textContent = "Breathe In";
  breathingCircle.style.transform = "scale(1)";
}

startBreathingBtn.addEventListener("click", startBreathing);
stopBreathingBtn.addEventListener("click", stopBreathing);

// Gratitude Journal
const gratitudeInputs = document.querySelectorAll(".gratitude-input");
const saveGratitudeBtn = document.getElementById("save-gratitude");
const gratitudeHistory = document.getElementById("gratitude-history");

function saveGratitude() {
  const entries = Array.from(gratitudeInputs)
    .map((input) => input.value.trim())
    .filter((val) => val);

  if (entries.length === 0) {
    alert("Please enter at least one gratitude item.");
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  let gratitudes = JSON.parse(localStorage.getItem("gratitudes")) || [];

  // Check if there's already an entry for today
  const existingEntryIndex = gratitudes.findIndex((g) => g.date === today);

  if (existingEntryIndex !== -1) {
    gratitudes[existingEntryIndex].entries = entries;
  } else {
    gratitudes.push({ date: today, entries });
  }

  localStorage.setItem("gratitudes", JSON.stringify(gratitudes));
  updateGratitudeHistory();

  // Clear inputs
  gratitudeInputs.forEach((input) => (input.value = ""));
}

function updateGratitudeHistory() {
  const gratitudes = JSON.parse(localStorage.getItem("gratitudes")) || [];
  gratitudeHistory.innerHTML = "";

  gratitudes
    .slice()
    .reverse()
    .forEach((item) => {
      const card = document.createElement("div");
      card.className = "gratitude-card";

      const dateHeader = document.createElement("h4");
      dateHeader.textContent = new Date(item.date).toLocaleDateString();

      const list = document.createElement("ul");
      item.entries.forEach((entry) => {
        const li = document.createElement("li");
        li.textContent = entry;
        list.appendChild(li);
      });

      card.appendChild(dateHeader);
      card.appendChild(list);
      gratitudeHistory.appendChild(card);
    });
}

saveGratitudeBtn.addEventListener("click", saveGratitude);

// Affirmations
const affirmationDisplay = document.getElementById("current-affirmation");
const newAffirmationBtn = document.getElementById("new-affirmation");
const saveAffirmationBtn = document.getElementById("save-affirmation");
const affirmationList = document.getElementById("affirmation-list");

const affirmations = [
  "I am worthy of love and respect.",
  "I choose to focus on what I can control.",
  "I am enough just as I am.",
  "My challenges help me grow.",
  "I am capable of achieving my goals.",
  "I choose to see the good in myself and others.",
  "I am resilient and can handle whatever comes my way.",
  "I deserve happiness and fulfillment.",
  "I am constantly growing and evolving.",
  "I trust myself to make good decisions.",
];

function showRandomAffirmation() {
  const randomIndex = Math.floor(Math.random() * affirmations.length);
  affirmationDisplay.textContent = affirmations[randomIndex];
}

function saveAffirmation() {
  const currentAffirmation = affirmationDisplay.textContent;
  let savedAffirmations =
    JSON.parse(localStorage.getItem("savedAffirmations")) || [];

  if (!savedAffirmations.includes(currentAffirmation)) {
    savedAffirmations.push(currentAffirmation);
    localStorage.setItem(
      "savedAffirmations",
      JSON.stringify(savedAffirmations)
    );
    updateAffirmationList();
  }
}

function updateAffirmationList() {
  const savedAffirmations =
    JSON.parse(localStorage.getItem("savedAffirmations")) || [];
  affirmationList.innerHTML = "";

  savedAffirmations.forEach((affirmation, index) => {
    const li = document.createElement("li");
    li.textContent = affirmation;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "×";
    deleteBtn.addEventListener("click", () => {
      savedAffirmations.splice(index, 1);
      localStorage.setItem(
        "savedAffirmations",
        JSON.stringify(savedAffirmations)
      );
      updateAffirmationList();
    });

    li.appendChild(deleteBtn);
    affirmationList.appendChild(li);
  });
}

newAffirmationBtn.addEventListener("click", showRandomAffirmation);
saveAffirmationBtn.addEventListener("click", saveAffirmation);

// Dark Mode Toggle
const darkModeToggle = document.createElement("button");
darkModeToggle.id = "dark-mode-toggle";
darkModeToggle.innerHTML = "🌓";
document.body.appendChild(darkModeToggle);

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark-mode")
  );
});

// Initialize all components
document.addEventListener("DOMContentLoaded", () => {
  // Previous initialization code...

  // Initialize new components
  updateTimerDisplay();
  updateGratitudeHistory();
  showRandomAffirmation();
  updateAffirmationList();

  // Check for saved dark mode preference
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }

  // Mood Insights
  if (moodHistory.length >= 3) {
    showMoodInsights();
  }
});

// Mood Insights
function showMoodInsights() {
  // Calculate average mood for the week
  const weeklyMoods = moodHistory.slice(-7).map((entry) => entry.mood);
  const averageMood =
    weeklyMoods.reduce((sum, mood) => sum + mood, 0) / weeklyMoods.length;

  // Count mood occurrences
  const moodCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  moodHistory.forEach((entry) => moodCounts[entry.mood]++);

  // Find most common mood
  let mostCommonMood = 3;
  let maxCount = 0;
  for (const mood in moodCounts) {
    if (moodCounts[mood] > maxCount) {
      maxCount = moodCounts[mood];
      mostCommonMood = parseInt(mood);
    }
  }

  // Add insights to mood response section
  const insights = document.createElement("div");
  insights.id = "mood-insights";
  insights.innerHTML = `
        <h3>Your Mood Insights</h3>
        <p>Weekly average: ${averageMood.toFixed(1)}/5</p>
        <p>Most common mood: ${getMoodLabel(mostCommonMood)}</p>
        ${
          averageMood < 3
            ? "<p>Consider trying more self-care activities when you feel down.</p>"
            : ""
        }
    `;

  moodResponse.appendChild(insights);
}

function getMoodLabel(moodValue) {
  const labels = {
    1: "Struggling",
    2: "Down",
    3: "Okay",
    4: "Good",
    5: "Great",
  };
  return labels[moodValue];
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  // Show a random journal prompt
  const randomPrompt =
    journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
  currentPrompt.textContent = randomPrompt;

  // Load default activities
  suggestActivities(3);

  // Initialize chart if we have data
  if (moodHistory.length > 0) {
    updateMoodChart();
  }
});
