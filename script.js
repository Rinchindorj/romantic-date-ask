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
      <p>Нэгэн зүйлийг асуух гэсэн юм.</p>
    </div>
  `;

  setTimeout(() => {
    container.innerHTML += `
      <div class="fade">
        <p>Өмнө нь асуусан ч гэсэн дахиад асууя. Анхнаасаа л ингэж асуух байсан юм ххха</p>
      </div>
    `;
  }, 2000);

  setTimeout(() => {
    container.innerHTML += `
      <div class="fade">
        <h2>Надтай хамт болзоонд явах уу? 💌</h2>
        <button onclick="accepted()">Тийм ээ 💕</button>
        <button onclick="confirmNo()">Үгүй 😢</button>
      </div>
    `;
  }, 4000);
}

function confirmNo() {
  container.innerHTML = `
    <div class="fade">
      <p>Итгэлтэй байна уу? 🥺</p>
      <button onclick="showProposal()">Үгүй 😅</button>
      <button onclick="rejected()">Тийм ээ 😞</button>
    </div>
  `;
}

function rejected() {
  container.innerHTML = `
    <div class="fade">
      <h2>Заазаа ойлголоо 💔</h2>
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
      <h2>Өдрөө сонгоно уу 💕</h2>
      ${buttonsHtml}
    </div>
  `;
}

function confirmDay(selectedDay) {
  container.innerHTML = `
    <div class="fade">
      <h2>💖</h2>
      <p><strong>${selectedDay}</strong>-нд болзоондоо бэлэн байгаарай. 😊</p>
    </div>
  `;
  saveResponse("accepted", selectedDay);
}

function saveResponse(answer, day = "") {
  const timestamp = new Date().toISOString();

  fetch('https://phxikwtzecbjkvqlzcsj.supabase.co/rest/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoeGlrd3R6ZWNiamt2cWx6Y3NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjUyNDQsImV4cCI6MjA3NTUwMTI0NH0.HHh3oz1MrtaQhGdcIegE2UfWYk7IqzQUj6L_pLIEI1E',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoeGlrd3R6ZWNiamt2cWx6Y3NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjUyNDQsImV4cCI6MjA3NTUwMTI0NH0.HHh3oz1MrtaQhGdcIegE2UfWYk7IqzQUj6L_pLIEI1E',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({
      answer,
      day,
      timestamp
    })
  })
  .then(res => {
    if (!res.ok) {
      // This line shows detailed error info
      return res.text().then(text => {
        console.error("Supabase error:", text);
        alert("Something went wrong saving your answer ");
      });
    }
  })
  .catch(err => {
    console.error("JavaScript error:", err);
    alert("Error saving response.");
  });
}


// Generate list of date options: This Saturday to next Sunday
function getDateOptions() {
  const startDate = new Date("2025-10-12"); // Saturday
  const endDate = new Date("2025-11-01");   // Next Sunday
  const daysOfWeek = ["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"];
  const options = [];

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayName = daysOfWeek[d.getDay()];
    const dateStr = d.toDateString(); // e.g., "Sat Oct 12 2025"
    options.push(`${dayName} (${dateStr})`);
  }

  return options;
}
