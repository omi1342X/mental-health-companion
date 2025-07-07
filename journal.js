document.addEventListener("DOMContentLoaded", () => {
  // Initialize journal
  let journals = JSON.parse(localStorage.getItem("journals")) || [];
  let promptedResponses =
    JSON.parse(localStorage.getItem("promptedResponses")) || [];
  let gratitudes = JSON.parse(localStorage.getItem("gratitudes")) || [];

  // Journal tabs
  const journalTabs = document.querySelectorAll(".journal-tab");
  journalTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs
      journalTabs.forEach((t) => t.classList.remove("active"));

      // Add active class to clicked tab
      tab.classList.add("active");

      // Hide all tab contents
      document.querySelectorAll(".journal-tab-content").forEach((content) => {
        content.classList.remove("active");
      });

      // Show selected tab content
      const tabId = tab.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");
    });
  });

  // Set current date
  const currentDate = document.getElementById("current-date");
  if (currentDate) {
    currentDate.textContent = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  // Journal prompts
  const journalPrompts = [
    "What are you grateful for today?",
    "What was the highlight of your day?",
    "What's something you're looking forward to?",
    "Write about a challenge you're facing and how you might approach it.",
    "Describe something that made you smile recently.",
    "What's a lesson you learned this week?",
    "How have you taken care of yourself today?",
    "What emotions have you felt today and why?",
    "Write about a recent accomplishment, no matter how small.",
    "What would make tomorrow a good day?",
  ];

  const currentPrompt = document.getElementById("current-prompt");
  const newPromptBtn = document.getElementById("new-prompt");

  if (newPromptBtn) {
    newPromptBtn.addEventListener("click", () => {
      const randomPrompt =
        journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
      currentPrompt.textContent = randomPrompt;
    });

    // Set initial prompt
    currentPrompt.textContent = journalPrompts[0];
  }

  // Save journal entry
  const saveJournalBtn = document.getElementById("save-journal");
  if (saveJournalBtn) {
    saveJournalBtn.addEventListener("click", () => {
      const entry = document.getElementById("journal-entry").value.trim();
      if (!entry) {
        alert("Please write something before saving.");
        return;
      }

      const today = new Date().toISOString().split("T")[0];

      // Check if there's already an entry for today
      const existingEntryIndex = journals.findIndex((j) => j.date === today);

      if (existingEntryIndex !== -1) {
        // Update existing entry
        journals[existingEntryIndex] = {
          date: today,
          entry: entry,
          type: "freeform",
        };
      } else {
        // Add new entry
        journals.push({
          date: today,
          entry: entry,
          type: "freeform",
        });
      }

      // Save to localStorage
      localStorage.setItem("journals", JSON.stringify(journals));

      // Update journal history
      updateJournalHistory();

      // Clear textarea
      document.getElementById("journal-entry").value = "";

      // Show confirmation
      alert("Journal entry saved successfully!");
    });
  }

  // Save prompted response
  const savePromptedBtn = document.getElementById("save-prompted");
  if (savePromptedBtn) {
    savePromptedBtn.addEventListener("click", () => {
      const prompt = document.getElementById("current-prompt").textContent;
      const response = document.getElementById("prompted-entry").value.trim();

      if (!response) {
        alert("Please write a response before saving.");
        return;
      }

      const today = new Date().toISOString().split("T")[0];

      // Check if there's already an entry for today
      const existingEntryIndex = promptedResponses.findIndex(
        (j) => j.date === today
      );

      if (existingEntryIndex !== -1) {
        // Update existing entry
        promptedResponses[existingEntryIndex] = {
          date: today,
          prompt: prompt,
          response: response,
          type: "prompted",
        };
      } else {
        // Add new entry
        promptedResponses.push({
          date: today,
          prompt: prompt,
          response: response,
          type: "prompted",
        });
      }

      // Save to localStorage
      localStorage.setItem(
        "promptedResponses",
        JSON.stringify(promptedResponses)
      );

      // Update journal history
      updateJournalHistory();

      // Clear textarea
      document.getElementById("prompted-entry").value = "";

      // Show confirmation
      alert("Your response has been saved!");
    });
  }

  // Save gratitude list
  const saveGratitudeBtn = document.getElementById("save-gratitude");
  if (saveGratitudeBtn) {
    saveGratitudeBtn.addEventListener("click", () => {
      const gratitudeInputs = document.querySelectorAll(".gratitude-input");
      const entries = Array.from(gratitudeInputs)
        .map((input) => input.value.trim())
        .filter((val) => val);

      if (entries.length === 0) {
        alert("Please enter at least one gratitude item.");
        return;
      }

      const today = new Date().toISOString().split("T")[0];

      // Check if there's already an entry for today
      const existingEntryIndex = gratitudes.findIndex((g) => g.date === today);

      if (existingEntryIndex !== -1) {
        // Update existing entry
        gratitudes[existingEntryIndex] = {
          date: today,
          entries: entries,
          type: "gratitude",
        };
      } else {
        // Add new entry
        gratitudes.push({
          date: today,
          entries: entries,
          type: "gratitude",
        });
      }

      // Save to localStorage
      localStorage.setItem("gratitudes", JSON.stringify(gratitudes));

      // Update journal history
      updateJournalHistory();

      // Clear inputs
      gratitudeInputs.forEach((input) => (input.value = ""));

      // Show confirmation
      alert("Gratitude list saved successfully!");
    });
  }

  // Journal history filters
  const historyType = document.getElementById("history-type");
  const historyTime = document.getElementById("history-time");

  if (historyType) {
    historyType.addEventListener("change", updateJournalHistory);
  }

  if (historyTime) {
    historyTime.addEventListener("change", updateJournalHistory);
  }

  // Initialize journal history
  updateJournalHistory();
  updateSentimentChart();
});

function updateJournalHistory() {
  const historyType = document.getElementById("history-type")?.value || "all";
  const historyTime = document.getElementById("history-time")?.value || "7";

  // Get all journal entries from localStorage
  let journals = JSON.parse(localStorage.getItem("journals")) || [];
  let promptedResponses =
    JSON.parse(localStorage.getItem("promptedResponses")) || [];
  let gratitudes = JSON.parse(localStorage.getItem("gratitudes")) || [];

  // Combine all entries
  let allEntries = [...journals, ...promptedResponses, ...gratitudes];

  // Filter by type
  if (historyType !== "all") {
    allEntries = allEntries.filter((entry) => entry.type === historyType);
  }

  // Sort by date (newest first)
  allEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Filter by time range
  if (historyTime !== "all") {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(historyTime));
    allEntries = allEntries.filter(
      (entry) => new Date(entry.date) >= cutoffDate
    );
  }

  // Display entries
  const entriesContainer = document.querySelector(".entries-container");
  if (entriesContainer) {
    entriesContainer.innerHTML = "";

    if (allEntries.length === 0) {
      entriesContainer.innerHTML =
        "<p>No entries found. Start journaling to see your history here.</p>";
      return;
    }

    allEntries.forEach((entry) => {
      const entryCard = document.createElement("div");
      entryCard.className = "journal-entry-card";

      const entryDate = new Date(entry.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      let entryContent = "";
      if (entry.type === "freeform") {
        entryContent = `<div class="entry-preview"><p>${entry.entry.substring(
          0,
          100
        )}...</p></div>`;
      } else if (entry.type === "prompted") {
        entryContent = `
                    <div class="entry-preview">
                        <p><strong>Prompt:</strong> ${entry.prompt}</p>
                        <p>${entry.response.substring(0, 100)}...</p>
                    </div>
                `;
      } else if (entry.type === "gratitude") {
        entryContent = `
                    <div class="entry-preview">
                        <ul>
                            ${entry.entries
                              .map((item) => `<li>${item}</li>`)
                              .join("")}
                        </ul>
                    </div>
                `;
      }

      entryCard.innerHTML = `
                <div class="entry-header">
                    <h3>${entryDate}</h3>
                    <span class="entry-type ${entry.type}">${
        entry.type.charAt(0).toUpperCase() + entry.type.slice(1)
      }</span>
                </div>
                ${entryContent}
                <div class="entry-actions">
                    <button class="btn-view" data-date="${
                      entry.date
                    }" data-type="${entry.type}">View Full Entry</button>
                    <button class="btn-delete" data-date="${
                      entry.date
                    }" data-type="${
        entry.type
      }"><i class="fas fa-trash"></i></button>
                </div>
            `;

      entriesContainer.appendChild(entryCard);
    });

    // Add event listeners to view buttons
    document.querySelectorAll(".btn-view").forEach((button) => {
      button.addEventListener("click", () => {
        viewFullEntry(
          button.getAttribute("data-date"),
          button.getAttribute("data-type")
        );
      });
    });

    // Add event listeners to delete buttons
    document.querySelectorAll(".btn-delete").forEach((button) => {
      button.addEventListener("click", () => {
        deleteEntry(
          button.getAttribute("data-date"),
          button.getAttribute("data-type")
        );
      });
    });
  }
}

function viewFullEntry(date, type) {
  // Get the entry based on type
  let entry;

  if (type === "freeform") {
    const journals = JSON.parse(localStorage.getItem("journals")) || [];
    entry = journals.find((j) => j.date === date);
  } else if (type === "prompted") {
    const promptedResponses =
      JSON.parse(localStorage.getItem("promptedResponses")) || [];
    entry = promptedResponses.find((p) => p.date === date);
  } else if (type === "gratitude") {
    const gratitudes = JSON.parse(localStorage.getItem("gratitudes")) || [];
    entry = gratitudes.find((g) => g.date === date);
  }

  if (!entry) return;

  // Format the date
  const entryDate = new Date(entry.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Create modal content based on entry type
  let content = "";

  if (type === "freeform") {
    content = `<p>${entry.entry}</p>`;
  } else if (type === "prompted") {
    content = `
            <p><strong>Prompt:</strong> ${entry.prompt}</p>
            <p>${entry.response}</p>
        `;
  } else if (type === "gratitude") {
    content = `
            <ul>
                ${entry.entries.map((item) => `<li>${item}</li>`).join("")}
            </ul>
        `;
  }

  // Update modal
  document.getElementById("modal-entry-date").textContent = entryDate;
  document.getElementById("modal-entry-content").innerHTML = content;
  document.querySelector(".modal-entry-type").textContent =
    type.charAt(0).toUpperCase() + type.slice(1);

  // Show modal
  document.getElementById("entry-modal").style.display = "flex";
}

function deleteEntry(date, type) {
  if (!confirm("Are you sure you want to delete this entry?")) return;

  if (type === "freeform") {
    let journals = JSON.parse(localStorage.getItem("journals")) || [];
    journals = journals.filter((j) => j.date !== date);
    localStorage.setItem("journals", JSON.stringify(journals));
  } else if (type === "prompted") {
    let promptedResponses =
      JSON.parse(localStorage.getItem("promptedResponses")) || [];
    promptedResponses = promptedResponses.filter((p) => p.date !== date);
    localStorage.setItem(
      "promptedResponses",
      JSON.stringify(promptedResponses)
    );
  } else if (type === "gratitude") {
    let gratitudes = JSON.parse(localStorage.getItem("gratitudes")) || [];
    gratitudes = gratitudes.filter((g) => g.date !== date);
    localStorage.setItem("gratitudes", JSON.stringify(gratitudes));
  }

  // Update journal history
  updateJournalHistory();
}

function updateSentimentChart() {
  // In a real app, you would analyze sentiment of journal entries
  // For demo purposes, we'll use random data

  const ctx = document.getElementById("sentimentChart").getContext("2d");

  // If chart already exists, destroy it first
  if (window.sentimentChartInstance) {
    window.sentimentChartInstance.destroy();
  }

  // Create new chart with sample data
  window.sentimentChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Positive", "Neutral", "Negative"],
      datasets: [
        {
          label: "Sentiment Analysis",
          data: [75, 20, 5],
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(255, 99, 132, 0.6)",
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(255, 99, 132, 1)",
          ],
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
          max: 100,
        },
      },
    },
  });
}
