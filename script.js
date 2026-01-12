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
      <h2>Хэхэ, би бууж өгөхгүй шүү 😄</h2>
      <p>Дахиад нэг удаа асууя...</p>
    </div>
  `;

  // Wait a moment, then ask again
  setTimeout(() => {
    showProposal();
  }, 2000);
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
      <h2>Зөвшөөрсөнд баярлалаа 💖</h2>
      <p><strong>${selectedDay}</strong>-нд болзоондоо бэлэн байгаарай. Бүхнийг төгс болгоно 😊</p>
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
      'apikey': 'YOUR_API_KEY',
      'Authorization': 'Bearer YOUR_API_KEY',
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
      return res.text().then(text => {
        console.error("Supabase error:", text);
        alert("Something went wrong saving your answer");
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
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + daysUntilSaturday);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 8);

  const daysOfWeek = ["Ням", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба"];
  const options = [];

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayName = daysOfWeek[d.getDay()];
    const dateStr = d.toDateString();
    options.push(`${dayName} (${dateStr})`);
  }

  return options;
}