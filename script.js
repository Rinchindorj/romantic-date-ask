const nextBtn = document.getElementById('next-btn');
const responseInput = document.getElementById('response-input');
const container = document.getElementById('container');

// Show "Next" button when user types something
responseInput.addEventListener('input', () => {
  if (responseInput.value.trim() !== '') {
    nextBtn.style.display = 'inline-block';
  }
});

// Start the next step on button click
nextBtn.addEventListener('click', () => {
  showProposal();
});

function showProposal() {
  container.innerHTML = `
    <div class="fade">
      <p>I wanted to ask you something...</p>
    </div>
  `;

  setTimeout(() => {
    container.innerHTML += `
      <div class="fade">
        <p>It's hard to say it...</p>
      </div>
    `;
  }, 2000);

  setTimeout(() => {
    container.innerHTML += `
      <div class="fade">
        <h2>Will you go on a date with me? 💌</h2>
        <button onclick="accepted()">Yessss 💕</button>
        <button onclick="confirmNo()">No 😢</button>
      </div>
    `;
  }, 4000);
}

function confirmNo() {
  container.innerHTML = `
    <div class="fade">
      <p>Are you sure? 🥺</p>
      <button onclick="showProposal()">No 😅</button>
      <button onclick="rejected()">Yes 😞</button>
    </div>
  `;
}

function rejected() {
  container.innerHTML = `
    <div class="fade">
      <h2>Okay... I get it 💔</h2>
    </div>
  `;
  saveResponse("rejected");
}

function accepted() {
  const availableDays = getDateOptions();

  let buttonsHtml = '';
  availableDays.forEach((day) => {
    buttonsHtml += `<button onclick="confirmDay('${day}')">${day}</button><br>`;
  });

  container.innerHTML = `
    <div class="fade">
      <h2>Pick a day for our date 💕</h2>
      ${buttonsHtml}
    </div>
  `;
}

function confirmDay(selectedDay) {
  container.innerHTML = `
    <div class="fade">
      <h2>Thank you for accepting my offer 💖</h2>
      <p>I’ll make sure our date on <strong>${selectedDay}</strong> goes perfectly. Just show up 😊</p>
    </div>
  `;
  
  saveResponse("accepted", selectedDay);
}

function saveResponse(answer, day = "") {
  const data = {
    answer,
    day,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem("response", JSON.stringify(data));
}

// Generate list of date options: This Saturday to next Sunday
function getDateOptions() {
  const startDate = new Date("2025-10-12"); // Saturday
  const endDate = new Date("2025-10-20");   // Next Sunday
  const daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const options = [];

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayName = daysOfWeek[d.getDay()];
    const dateStr = d.toDateString(); // e.g., "Sat Oct 12 2025"
    options.push(`${dayName} (${dateStr})`);
  }

  return options;
}
