const nextBtn = document.getElementById('next-btn');
const responseInput = document.getElementById('response-input');
const container = document.getElementById('container');

// Use your provided OpenAI API Key
const OPENAI_API_KEY = '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';

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

async function showProposal() {
  const userDayInfo = responseInput.value;

  container.innerHTML = `
    <div class="fade">
      <p>Нэгэн зүйлийг асуух гэсэн юм...</p>
      <div id="poem-container" style="font-style: italic; color: #ff1493; margin: 20px 0; min-height: 50px;">
        <p>Түр хүлээнэ үү, танд зориулж шүлэг тэрлэж байна... ✨</p>
      </div>
    </div>
  `;

  // Get the AI poem based on their day
  const poem = await getAIPoem(userDayInfo);
  const poemDiv = document.getElementById('poem-container');
  poemDiv.innerHTML = `<p>${poem.replace(/\n/g, '<br>')}</p>`;

  // Show the proposal buttons after the poem loads
  setTimeout(() => {
    container.innerHTML += `
      <div class="fade">
        <h2>Надтай хамт болзоонд явах уу? 💌</h2>
        <button onclick="accepted()">Тийм ээ 💕</button>
        <button onclick="confirmNo()">Үгүй 😢</button>
      </div>
    `;
  }, 2000);
}

async function getAIPoem(dayDescription) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a romantic Mongolian poet. Write a beautiful, short 4-line poem in Mongolian."
          },
          {
            role: "user",
            content: `Тэр хүн өнөөдрийг "${dayDescription}" ингэж өнгөрүүлсэн байна. Үүн дээр үндэслэн түүнд урам өгсөн, хайрласан утгатай богино шүлэг бичээд болзоонд уриарай.`
          }
        ],
        temperature: 0.8
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Poem AI Error:", error);
    return "Өдрийн сайхныг чамтайгаа хуваалцаж\nӨнөөдөр би нэгэн зүйлийг асууя...\nХамтдаа өнгөрүүлэх хором бүрийг\nХайрлаж дурсаж явъя.";
  }
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
  setTimeout(() => { showProposal(); }, 2000);
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

async function confirmDay(selectedDay) {
  container.innerHTML = `
    <div class="fade">
      <h2>Зөвшөөрсөнд баярлалаа 💖</h2>
      <p><strong>${selectedDay}</strong>-нд болзоондоо бэлэн байгаарай.</p>
      <hr style="border: 0; height: 1px; background: #eee; margin: 20px 0;">
      <div id="activity-section">
        <p id="activity-loading">Танд зориулж Улаанбаатарт хийх сонирхолтой санаанууд гаргаж байна... ✨</p>
      </div>
    </div>
  `;

  saveResponse("accepted", selectedDay);

  const suggestions = await getAIActivities(selectedDay);
  
  const activitySection = document.getElementById('activity-section');
  activitySection.innerHTML = `
    <h3>Санал болгох үйл ажиллагаанууд:</h3>
    <div style="text-align: left; display: inline-block; background: #fffafa; padding: 15px; border-radius: 10px; border-left: 4px solid #ff69b4;">
      ${suggestions.replace(/\n/g, '<br>')}
    </div>
  `;
}

async function getAIActivities(selectedDay) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a romantic date planner in Ulaanbaatar, Mongolia. Suggest 2-4 specific, fun activities."
          },
          {
            role: "user",
            content: `Бид ${selectedDay}-нд болзохоор боллоо. Улаанбаатар хотод хийж болох хамгийн сонирхолтой, романтик 2-4 үйл ажиллагааг жагсааж бичнэ үү. (Залууст зориулсан сонирхолтой хэлбэрээр).`
          }
        ],
        temperature: 0.7
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Activity AI Error:", error);
    return "1. Сонирхолтой ресторанд оройн хоол идэх 🍝\n2. Оройн хотын гудамжаар алхах ✨\n3. Хамтдаа тоглоомын төв орох 🎮";
  }
}

function saveResponse(answer, day = "") {
  const timestamp = new Date().toISOString();
  // Replace YOUR_SUPABASE_KEY with your actual key if needed
  fetch('https://phxikwtzecbjkvqlzcsj.supabase.co/rest/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': 'YOUR_SUPABASE_KEY', 
      'Authorization': 'Bearer YOUR_SUPABASE_KEY',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({
      answer,
      day,
      timestamp
    })
  })
  .then(res => {
    if (!res.ok) console.error("Supabase error saving response.");
  })
  .catch(err => console.error("Supabase connection error:", err));
}

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
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    options.push(`${dayName} (${dateStr})`);
  }
  return options;
}