const urlParams = new URLSearchParams(window.location.search);
const topicId = urlParams.get("id");
const topics = JSON.parse(localStorage.getItem("topics") || "[]");
const topic = topics.find(t => t.id === topicId);

const anonName = localStorage.getItem("anonUser");

const roomDiv = document.getElementById("roomContent");
const replyList = document.getElementById("replyList");

if (!topic) {
  roomDiv.innerHTML = "<p>Topic not found.</p>";
} else {
  roomDiv.innerHTML = `
    <h2 class="text-2xl font-bold text-red-500">${topic.title}</h2>
    ${topic.image ? `<img src='${topic.image}' alt='topic image' class='my-3 max-h-60 w-auto rounded' />` : ''}
    <p class="mt-2">${topic.message}</p>
    <p class="text-sm text-gray-400">By: ${topic.user}</p>
    <hr class="my-4">
    <h3 class="text-lg font-semibold">Replies:</h3>
  `;
  renderReplies();
}

function renderReplies() {
  replyList.innerHTML = '';
  topic.replies.forEach((r, idx) => {
    // r bisa object (dengan gambar) atau string lama
    let replyObj = typeof r === 'string' ? {text: r} : r;
    let {text, image} = replyObj;
    // Cek format: "Anon_xxxxx: pesan" atau "@target: pesan (by user)"
    let match = text.match(/^@(.+?): (.*) \(by (.+)\)$/);
    let sender = '', msg = '', target = '';
    if (match) {
      [, target, msg, sender] = match;
    } else {
      let userMatch = text.match(/^(.+?): (.*)$/);
      sender = userMatch ? userMatch[1] : '';
      msg = userMatch ? userMatch[2] : text;
    }
    // Avatar dari inisial
    let avatar = `<div class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">${(sender||'A')[0]}</div>`;
    let replyToHtml = '';
    if (target) {
      // Cari index komentar yang dibalas (pertama ditemukan dengan sender = target)
      const replyIdx = topic.replies.findIndex((item, i) => {
        let obj = typeof item === 'string' ? {text: item} : item;
        let t = obj.text.match(/^(.+?): /);
        return t && t[1] === target && i < idx;
      });
      if (replyIdx !== -1) {
        replyToHtml = `<div class="flex items-center text-xs text-gray-400 mb-1"><svg class='inline mr-1' width='16' height='16' fill='none' viewBox='0 0 24 24'><path stroke='currentColor' stroke-width='2' d='M7 8l-4 4 4 4'/></svg>Replying to <span class='text-blue-400 ml-1'>@${target}</span></div>`;
      } else {
        replyToHtml = `<div class="flex items-center text-xs text-gray-400 mb-1"><svg class='inline mr-1' width='16' height='16' fill='none' viewBox='0 0 24 24'><path stroke='currentColor' stroke-width='2' d='M7 8l-4 4 4 4'/></svg>Replying to <span class='text-blue-400 ml-1'>@${target}</span></div>`;
      }
    }
    let bubble = `<div class="flex-1">
      ${replyToHtml}
      <div class="flex items-center gap-2">
        <span class="text-blue-400">${target ? '@'+target : sender}</span>
        <span class="text-xs text-gray-400">${match ? `(by ${sender})` : ''}</span>
      </div>
      <div class="text-white">${msg}</div>
      ${image ? `<img src="${image}" class="mt-2 max-h-32 rounded" />` : ''}
    </div>`;
    replyList.innerHTML += `<div class="flex items-start gap-3 mb-3">
      ${avatar}
      <div class="bg-gray-800 rounded-2xl px-4 py-2 flex-1">
        ${bubble}
        <button class="replyBtn text-xs text-blue-300 underline mt-1" data-user="${sender}">Reply</button>
      </div>
    </div>`;
  });
  // Pasang event reply
  document.querySelectorAll('.replyBtn').forEach(btn => {
    btn.onclick = function() {
      const user = this.getAttribute('data-user');
      document.getElementById('replyMsg').value = `@${user} `;
      document.getElementById('replyMsg').focus();
    };
  });
}

document.getElementById("sendReply").addEventListener("click", () => {
  let msg = document.getElementById("replyMsg").value.trim();
  const imgInput = document.getElementById("replyImage");
  if (!msg && (!imgInput.files || !imgInput.files[0])) return;

  function pushReply(imageData) {
    let fullMsg = '';
    if (msg.startsWith('@')) {
      const spaceIdx = msg.indexOf(' ');
      if (spaceIdx > 1) {
        const target = msg.substring(1, spaceIdx);
        const realMsg = msg.substring(spaceIdx + 1);
        fullMsg = `@${target}: ${realMsg} (by ${anonName})`;
      } else {
        fullMsg = `${anonName}: ${msg}`;
      }
    } else {
      fullMsg = `${anonName}: ${msg}`;
    }
    // Simpan reply sebagai object jika ada gambar
    if (imageData) {
      topic.replies.push({text: fullMsg, image: imageData});
    } else {
      topic.replies.push({text: fullMsg});
    }
    localStorage.setItem("topics", JSON.stringify(topics));
    renderReplies();
    document.getElementById("replyMsg").value = '';
    imgInput.value = '';
  }

  if (imgInput.files && imgInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      pushReply(e.target.result);
    };
    reader.readAsDataURL(imgInput.files[0]);
  } else {
    pushReply();
  }
});
