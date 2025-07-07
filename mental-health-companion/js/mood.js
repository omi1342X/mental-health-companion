document.addEventListener("DOMContentLoaded", () => {
  // Initialize mood tracking
  let moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];
  let selectedMood = null;
  let selectedTags = [];

  // Mood selection
  const moodOptions = document.querySelectorAll(".mood-option");
  moodOptions.forEach((option) => {
    option.addEventListener("click", () => {
      // Remove active class from all options
      moodOptions.forEach((opt) => opt.classList.remove("active"));

      // Add active class to clicked option
      option.classList.add("active");
      selectedMood = parseInt(option.getAttribute("data-mood"));

      // Show mood response section
      document.getElementById("mood-response").style.display = "block";

      // Generate response based on mood
      generateMoodResponse(selectedMood);
    });
  });

  // Tag selection
  const moodTags = document.querySelectorAll(".mood-tag");
  moodTags.forEach((tag) => {
    tag.addEventListener("click", () => {
      tag.classList.toggle("active");
      const tagValue = tag.getAttribute("data-tag");

      if (tag.classList.contains("active")) {
        selectedTags.push(tagValue);
      } else {
        selectedTags = selectedTags.filter((t) => t !== tagValue);
      }
    });
  });

  // Save mood
  const saveMoodBtn = document.getElementById("save-mood");
  if (saveMoodBtn) {
    saveMoodBtn.addEventListener("click", () => {
      if (!selectedMood) {
        alert("Please select how you are feeling first.");
        return;
      }

      const note = document.getElementById("mood-note").value.trim();
      const today = new Date().toISOString().split("T")[0];

      // Check if there's already an entry for today
      const existingEntryIndex = moodHistory.findIndex(
        (entry) => entry.date === today
      );

      if (existingEntryIndex !== -1) {
        // Update existing entry
        moodHistory[existingEntryIndex] = {
          date: today,
          mood: selectedMood,
          tags: selectedTags,
          note: note,
        };
      } else {
        // Add new entry
        moodHistory.push({
          date: today,
          mood: selectedMood,
          tags: selectedTags,
          note: note,
        });
      }

      // Save to localStorage
      localStorage.setItem("moodHistory", JSON.stringify(moodHistory));

      // Update UI
      updateMoodChart();
      showMoodInsights();

      // Show confirmation
      alert("Your mood has been saved successfully!");
    });
  }

  // Time filters
  const timeFilters = document.querySelectorAll(".time-filter");
  timeFilters.forEach((filter) => {
    filter.addEventListener("click", () => {
      // Remove active class from all filters
      timeFilters.forEach((f) => f.classList.remove("active"));

      // Add active class to clicked filter
      filter.classList.add("active");

      // Get time range
      const timeRange = parseInt(filter.getAttribute("data-range"));

      // Update chart with filtered data
      updateMoodChart(timeRange);
    });
  });

  // Initialize chart if we have data
  if (moodHistory.length > 0) {
    updateMoodChart();
    showMoodInsights();
  }
});

function generateMoodResponse(moodValue) {
  const moodResponse = document.getElementById("mood-response");
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
  moodResponse.innerHTML = `
        <h3>We're here for you</h3>
        <p>${response.message} ${response.emoji}</p>
        <div class="suggested-actions">
            <button onclick="location.href='meditation.html'">Try a Breathing Exercise</button>
            <button onclick="location.href='journal.html'">Write in Your Journal</button>
            <button onclick="location.href='resources.html'">View Resources</button>
        </div>
    `;
}

function updateMoodChart(timeRange = 7) {
  let moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];

  // Sort by date (newest first)
  moodHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Get most recent entries based on time range
  let filteredHistory = moodHistory;
  if (timeRange !== "all") {
    filteredHistory = moodHistory.slice(0, timeRange);
  }

  // Reverse to show chronological order
  filteredHistory = filteredHistory.reverse();

  // Prepare data for chart
  const dates = filteredHistory.map((entry) => {
    const date = new Date(entry.date);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });

  const moods = filteredHistory.map((entry) => entry.mood);

  // Get chart canvas
  const ctx = document.getElementById("moodChart").getContext("2d");

  // If chart already exists, destroy it first
  if (window.moodChartInstance) {
    window.moodChartInstance.destroy();
  }

  // Create new chart
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
      responsive: true,
      maintainAspectRatio: false,
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

function showMoodInsights() {
  const moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];
  if (moodHistory.length < 3) return;

  // Calculate average mood
  const totalMood = moodHistory.reduce((sum, entry) => sum + entry.mood, 0);
  const averageMood = (totalMood / moodHistory.length).toFixed(1);

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

  // Get mood label
  const moodLabels = {
    1: "Struggling",
    2: "Down",
    3: "Okay",
    4: "Good",
    5: "Great",
  };

  // Add insights to mood response section
  const insights = document.createElement("div");
  insights.id = "mood-insights";
  insights.innerHTML = `
        <h3>Your Mood Insights</h3>
        <div class="insight">
            <p><strong>Average Mood:</strong> ${averageMood}/5</p>
        </div>
        <div class="insight">
            <p><strong>Most Common Mood:</strong> ${
              moodLabels[mostCommonMood]
            }</p>
        </div>
        ${
          averageMood < 3
            ? '<div class="insight"><p>Consider trying more self-care activities when you feel down.</p></div>'
            : ""
        }
    `;

  const moodResponse = document.getElementById("mood-response");
  if (moodResponse) {
    const existingInsights = document.getElementById("mood-insights");
    if (existingInsights) {
      moodResponse.replaceChild(insights, existingInsights);
    } else {
      moodResponse.appendChild(insights);
    }
  }
}
