// Buat username Anon otomatis
if (!localStorage.getItem("anonUser")) {
  const random = Math.floor(Math.random() * 100000);
  localStorage.setItem("anonUser", "Anon_" + random);
}
const anonName = localStorage.getItem("anonUser");

// Cek apakah ada data topik
let topics = JSON.parse(localStorage.getItem("topics") || "[]");
const topicList = document.getElementById("topicList");

function renderTopics() {
  if (!topicList) return;
  topicList.innerHTML = '';
  if (topics.length === 0) {
    topicList.innerHTML = '<li class="text-gray-500">No topics yet.</li>';
  } else {
    topics.forEach(topic => {
      const li = document.createElement("li");
      li.className = "bg-gray-100 border p-3 rounded";
      li.innerHTML = `
        <a href="room.html?id=${topic.id}" class="text-blue-700 font-bold">${topic.title}</a>
        <p class="text-sm text-gray-600">by ${topic.user}</p>
      `;
      topicList.appendChild(li);
    });
  }
}
renderTopics();

// Fungsi membuat topik baru
function createTopic() {
  const title = document.getElementById("newTitle").value.trim();
  const message = document.getElementById("newMessage").value.trim();

  if (!title || !message) {
    alert("Please fill in both title and message.");
    return;
  }

  const newTopic = {
    id: Date.now().toString(),
    title,
    message,
    user: anonName,
    replies: []
  };

  topics.push(newTopic);
  localStorage.setItem("topics", JSON.stringify(topics));
  renderTopics();

  // reset form
  document.getElementById("newTitle").value = '';
  document.getElementById("newMessage").value = '';
}

// Event Listener tombol "Create Topic"
const createBtn = document.getElementById("createTopicBtn");
if (createBtn) createBtn.addEventListener("click", createTopic);

// Event Listener tombol "Create First Topic"
const createFirstBtn = document.getElementById("createFirstBtn");
if (createFirstBtn) createFirstBtn.addEventListener("click", createTopic);

