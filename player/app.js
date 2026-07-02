/**
 * OWLDIO PLAYER - 核心管理與播放控制系統 (JS)
 * 支援多客戶密碼分流、零伺服器後台管理系統、本地 LocalStorage 持久化，以及設定程式碼匯出。
 */

// ==========================================
// 1. 預設初始設定資料 (若瀏覽器無 LocalStorage 時使用)
// ==========================================
const DEFAULT_VIDEOS = [
    {
        id: "vid-01",
        title: "Owldio Art - 測試影片一 (YouTube 範例)",
        duration: "05:15",
        thumbnail: "https://img.youtube.com/vi/vweqyVqQoFM/maxresdefault.jpg",
        sources: [
            {
                src: "vweqyVqQoFM",
                provider: "youtube"
            }
        ]
    },
    {
        id: "vid-02",
        title: "Owldio Art - 測試影片二 (YouTube 範例)",
        duration: "03:40",
        thumbnail: "https://img.youtube.com/vi/iRQGeJ5qiMk/maxresdefault.jpg",
        sources: [
            {
                src: "iRQGeJ5qiMk",
                provider: "youtube"
            }
        ]
    }
];

const DEFAULT_CLIENTS = [
    {
        id: "admin",
        password: "owl2026",
        role: "admin",
        videos: ["vid-01", "vid-02"] // 管理員看得到所有影片
    },
    {
        id: "clientA",
        password: "owl-client-a",
        role: "client",
        videos: ["vid-01"] // 客戶A只看得到影片一
    },
    {
        id: "clientB",
        password: "owl-client-b",
        role: "client",
        videos: ["vid-02"] // 客戶B只看得到影片二
    }
];

// ==========================================
// 2. 資料存取與初始化
// ==========================================
let allVideos = JSON.parse(localStorage.getItem('owldio_videos')) || DEFAULT_VIDEOS;
let allClients = JSON.parse(localStorage.getItem('owldio_clients')) || DEFAULT_CLIENTS;

// 儲存至 LocalStorage
function saveToLocalStorage() {
    localStorage.setItem('owldio_videos', JSON.stringify(allVideos));
    localStorage.setItem('owldio_clients', JSON.stringify(allClients));
}

// 當前對話階段變數 (Session variables)
let player = null;
let currentVideoIndex = 0;
let videoPlaylist = []; // 當前登入者所屬的影片清單

// 頁面初始化
document.addEventListener("DOMContentLoaded", () => {
    // 檢查 sessionStorage 中是否已經驗證過
    if (sessionStorage.getItem("owldio_auth") === "true") {
        const role = sessionStorage.getItem("owldio_role");
        const authorizedVideoIds = JSON.parse(sessionStorage.getItem("owldio_auth_videos")) || [];
        setupSessionPlaylist(role, authorizedVideoIds);
        revealContent(role);
    }
});

// 建立該工作階段的影片清單
function setupSessionPlaylist(role, authorizedVideoIds) {
    if (role === "admin") {
        videoPlaylist = [...allVideos]; // 管理員顯示完整影片庫
    } else {
        // 客戶端：只載入有被授權 ID 的影片
        videoPlaylist = allVideos.filter(vid => authorizedVideoIds.includes(vid.id));
    }
}

// ==========================================
// 3. 驗證密碼邏輯
// ==========================================
function verifyPassword(event) {
    event.preventDefault();
    const passwordInput = document.getElementById("access-password");
    const errorMsg = document.getElementById("error-msg");
    const enteredPassword = passwordInput.value.trim();

    // 在所有客戶/管理員清單中比對密碼
    const matchedUser = allClients.find(user => user.password === enteredPassword);

    if (matchedUser) {
        // 寫入 SessionStorage
        sessionStorage.setItem("owldio_auth", "true");
        sessionStorage.setItem("owldio_role", matchedUser.role);
        sessionStorage.setItem("owldio_auth_videos", JSON.stringify(matchedUser.videos));
        
        setupSessionPlaylist(matchedUser.role, matchedUser.videos);
        errorMsg.textContent = "";
        revealContent(matchedUser.role);
    } else {
        errorMsg.textContent = "密碼錯誤，請輸入有效的客戶或管理員密碼！";
        passwordInput.value = "";
        passwordInput.focus();
    }
}

// ==========================================
// 4. 驗證通過，解鎖顯示播放器
// ==========================================
function revealContent(role) {
    const overlay = document.getElementById("password-overlay");
    const mainContent = document.getElementById("main-content");
    const btnAdminPortal = document.getElementById("btn-admin-portal");
    const roleBadgeText = document.getElementById("role-badge-text");

    // 1. 動態淡出密碼遮罩
    overlay.classList.add("fade-out");
    mainContent.classList.remove("hidden");

    // 2. 依照身分設定 UI 權限
    if (role === "admin") {
        btnAdminPortal.classList.remove("hidden");
        roleBadgeText.textContent = "Owldio Admin";
    } else {
        btnAdminPortal.classList.add("hidden");
        roleBadgeText.textContent = "Client Area";
    }

    // 3. 初始化播放器與清單 UI
    initPlyr();
    setupPlaylistUI();
}

/**
 * 初始化 Plyr 播放器
 */
function initPlyr() {
    player = new Plyr('#player', {
        controls: [
            'play-large', 'play', 'progress', 'current-time', 
            'duration', 'mute', 'volume', 'settings', 'pip', 'fullscreen'
        ],
        tooltips: { controls: true, seek: true },
        keyboard: { focused: true, global: true }
    });

    // 防止載入 YouTube 時無限觸發 ready 循環
    let isFirstReady = true;
    player.on('ready', () => {
        if (isFirstReady) {
            isFirstReady = false;
            loadVideo(0, false);
        }
    });

    // 自動連播
    player.on('ended', () => {
        playNextVideo();
    });
}

/**
 * 渲染右側/下方影片清單 UI
 */
function setupPlaylistUI() {
    const playlistItems = document.getElementById("playlist-items");
    const playlistCount = document.getElementById("playlist-count");
    
    playlistCount.textContent = `${videoPlaylist.length} 部影片`;
    playlistItems.innerHTML = "";

    if (videoPlaylist.length === 0) {
        playlistItems.innerHTML = `<p style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 13px;">目前此區域沒有已授權的影音內容。</p>`;
        document.getElementById("current-video-title").textContent = "無可播放的影片";
        return;
    }

    videoPlaylist.forEach((video, index) => {
        const card = document.createElement("div");
        card.className = `playlist-card ${index === currentVideoIndex ? 'active' : ''}`;
        card.id = `card-${index}`;
        card.onclick = () => loadVideo(index, true);

        const isYoutube = video.sources[0].provider === 'youtube';
        const tagText = isYoutube ? 'YouTube 4K' : '4K H.265';

        card.innerHTML = `
            <div class="card-thumb-wrapper">
                <img class="card-thumb" src="${video.thumbnail}" alt="${video.title}">
                <div class="card-play-overlay">
                    <svg class="play-icon-mini" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
                <span class="card-duration">${video.duration}</span>
            </div>
            <div class="card-info">
                <span class="card-title">${video.title}</span>
                <span class="card-tag">${tagText}</span>
            </div>
        `;
        playlistItems.appendChild(card);
    });
}

/**
 * 載入影片
 */
function loadVideo(index, autoplay = true) {
    if (index < 0 || index >= videoPlaylist.length) return;

    currentVideoIndex = index;
    const video = videoPlaylist[index];

    document.getElementById("current-video-title").textContent = video.title;

    // 修改影片詳細頁面標籤 (對應 YouTube 或 H.265)
    const isYoutube = video.sources[0].provider === 'youtube';
    const accessBadge = document.getElementById("video-access-badge");
    accessBadge.textContent = isYoutube ? "YouTube Player" : "Cloudflare R2 (4K)";
    accessBadge.className = isYoutube ? "meta-tag resolution" : "meta-tag access";

    // 切換 Plyr 訊源
    player.source = {
        type: 'video',
        title: video.title,
        sources: video.sources.map(src => {
            const sourceObj = { src: src.src };
            if (src.type) sourceObj.type = src.type;
            if (src.size) sourceObj.size = src.size;
            if (src.provider) sourceObj.provider = src.provider;
            return sourceObj;
        })
    };

    // 更新高亮
    const cards = document.querySelectorAll(".playlist-card");
    cards.forEach(card => card.classList.remove("active"));
    
    const activeCard = document.getElementById(`card-${index}`);
    if (activeCard) {
        activeCard.classList.add("active");
        activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (autoplay) {
        player.play().catch(error => console.log("自動播放被阻擋：", error));
    }
}

/**
 * 自動連播
 */
function playNextVideo() {
    if (videoPlaylist.length === 0) return;
    let nextIndex = currentVideoIndex + 1;
    if (nextIndex >= videoPlaylist.length) {
        nextIndex = 0;
    }
    loadVideo(nextIndex, true);
}

// ==========================================
// 5. 管理後台互動邏輯 (Admin Portal Logic)
// ==========================================

// 開關後台視窗
function toggleAdminPortal(show) {
    const modal = document.getElementById("admin-portal-modal");
    if (show) {
        modal.classList.remove("hidden");
        // 初始化渲染後台資料
        renderAdminVideos();
        renderAdminClients();
        refreshExportCode();
    } else {
        modal.classList.add("hidden");
    }
}

// 切換後台分頁
function switchTab(tabId) {
    const tabs = document.querySelectorAll(".tab-btn");
    const contents = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => tab.classList.remove("active"));
    contents.forEach(content => content.classList.remove("active"));

    // 啟動點擊的 tab 與 content
    const clickedTab = Array.from(tabs).find(tab => tab.getAttribute("onclick").includes(tabId));
    if (clickedTab) clickedTab.classList.add("active");
    
    document.getElementById(tabId).classList.add("active");

    if (tabId === 'tab-export') {
        refreshExportCode();
    }
}

// 依照選擇的來源類型切換表單說明與輸入提示
function toggleProviderInput() {
    const provider = document.getElementById("new-video-provider").value;
    const label = document.getElementById("url-label");
    const input = document.getElementById("new-video-src");

    if (provider === "youtube") {
        label.textContent = "YouTube 影片 ID (如 vweqyVqQoFM)";
        input.placeholder = "e.g. vweqyVqQoFM";
    } else {
        label.textContent = "MP4 影片直連網址 (如 Cloudflare R2 連結)";
        input.placeholder = "e.g. https://r2.owldio.art/vip-video.mp4";
    }
}

// 渲染影片列表表格
function renderAdminVideos() {
    const listContainer = document.getElementById("admin-video-list");
    document.getElementById("admin-video-count").textContent = allVideos.length;
    listContainer.innerHTML = "";

    allVideos.forEach(video => {
        const isYoutube = video.sources[0].provider === 'youtube';
        const typeLabel = isYoutube ? "🔴 YouTube" : "🌐 MP4 / R2";
        
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${video.title}</strong><br><small style="color: var(--text-muted)">ID: ${video.id}</small></td>
            <td><span class="meta-tag codec">${typeLabel}</span></td>
            <td><button class="btn-danger" onclick="deleteVideo('${video.id}')">刪除</button></td>
        `;
        listContainer.appendChild(tr);
    });
}

// 新增影片
function addVideo(event) {
    event.preventDefault();
    const id = document.getElementById("new-video-id").value.trim();
    const title = document.getElementById("new-video-title").value.trim();
    const duration = document.getElementById("new-video-duration").value.trim();
    const thumbnail = document.getElementById("new-video-thumb").value.trim();
    const provider = document.getElementById("new-video-provider").value;
    const src = document.getElementById("new-video-src").value.trim();

    // 驗證 ID 是否重複
    if (allVideos.some(v => v.id === id)) {
        alert("影片 ID 已存在，請使用其他 ID！");
        return;
    }

    // 建立新影片物件
    const newVideo = {
        id: id,
        title: title,
        duration: duration,
        thumbnail: thumbnail,
        sources: [
            provider === "youtube" 
            ? { src: src, provider: "youtube" }
            : { src: src, type: "video/mp4", size: 2160 } // 預設 4K
        ]
    };

    allVideos.push(newVideo);
    saveToLocalStorage();
    renderAdminVideos();
    
    // 清除表單
    document.getElementById("add-video-form").reset();
    toggleProviderInput();
    refreshExportCode();
    alert("影片新增成功！");
}

// 刪除影片
function deleteVideo(id) {
    if (!confirm("確定要刪除此影片嗎？這將會同步移除所有客戶的觀看權限。")) return;

    // 從影片庫移除
    allVideos = allVideos.filter(v => v.id !== id);
    
    // 從所有客戶的影片授權名單中移除該 id
    allClients.forEach(client => {
        client.videos = client.videos.filter(vidId => vidId !== id);
    });

    saveToLocalStorage();
    renderAdminVideos();
    renderAdminClients();
    refreshExportCode();
}

// 渲染客戶清單表格 (包含影片權限勾選)
function renderAdminClients() {
    const clientContainer = document.getElementById("admin-client-list");
    clientContainer.innerHTML = "";

    // 濾除管理員 admin，只顯示需要管理的客戶
    const clientsOnly = allClients.filter(c => c.role !== "admin");

    clientsOnly.forEach(client => {
        const tr = document.createElement("tr");
        
        // 建立影片授權核選清單 HTML
        let checkboxesHtml = `<div class="auth-checkbox-list">`;
        allVideos.forEach(video => {
            const isChecked = client.videos.includes(video.id) ? "checked" : "";
            checkboxesHtml += `
                <label class="auth-item">
                    <input type="checkbox" ${isChecked} onchange="toggleVideoAuth('${client.id}', '${video.id}', this.checked)">
                    <span>${video.title}</span>
                </label>
            `;
        });
        checkboxesHtml += `</div>`;

        tr.innerHTML = `
            <td>
                <strong>ID: ${client.id}</strong><br>
                <small style="color: var(--accent)">🔑 密碼: ${client.password}</small>
            </td>
            <td>${checkboxesHtml}</td>
            <td>
                <button class="btn-danger" onclick="deleteClient('${client.id}')">刪除</button>
            </td>
        `;
        clientContainer.appendChild(tr);
    });
}

// 新增客戶
function addClient(event) {
    event.preventDefault();
    const id = document.getElementById("new-client-id").value.trim();
    const password = document.getElementById("new-client-pass").value.trim();

    if (allClients.some(c => c.id === id)) {
        alert("客戶 ID 已存在！");
        return;
    }

    const newClient = {
        id: id,
        password: password,
        role: "client",
        videos: [] // 預設沒有任何授權影片
    };

    allClients.push(newClient);
    saveToLocalStorage();
    renderAdminClients();
    
    document.getElementById("add-client-form").reset();
    refreshExportCode();
    alert("客戶建立成功！現在可以在右側勾選想授權給該客戶的影片！");
}

// 刪除客戶
function deleteClient(id) {
    if (!confirm(`確定要刪除客戶 ${id} 嗎？`)) return;
    allClients = allClients.filter(c => c.id !== id);
    saveToLocalStorage();
    renderAdminClients();
    refreshExportCode();
}

// 切換影片授權勾選狀態
function toggleVideoAuth(clientId, videoId, checked) {
    const client = allClients.find(c => c.id === clientId);
    if (!client) return;

    if (checked) {
        if (!client.videos.includes(videoId)) {
            client.videos.push(videoId);
        }
    } else {
        client.videos = client.videos.filter(id => id !== videoId);
    }
    
    saveToLocalStorage();
    refreshExportCode();
}

// ==========================================
// 6. 匯出/重設設定程式碼功能
// ==========================================

// 生成可直接貼回 app.js 的最新變數原始碼
function refreshExportCode() {
    const codeBlock = document.getElementById("code-export-output");
    
    const formattedVideos = JSON.stringify(allVideos, null, 4);
    const formattedClients = JSON.stringify(allClients, null, 4);

    const generatedCode = `// 請將這段程式碼直接複製，覆蓋掉 player/app.js 檔案最上方的對應變數：

const DEFAULT_VIDEOS = ${formattedVideos};

const DEFAULT_CLIENTS = ${formattedClients};`;

    codeBlock.textContent = generatedCode;
}

// 複製到剪貼簿
function copyConfigCode() {
    const codeText = document.getElementById("code-export-output").textContent;
    navigator.clipboard.writeText(codeText).then(() => {
        alert("📋 設定碼已複製到您的剪貼簿！請將其覆蓋 player/app.js 最上方的對應變數。");
    }).catch(err => {
        alert("複製失敗，請手動選取程式碼進行複製。");
    });
}

// 恢復為初始預設值
function resetToDefault() {
    if (!confirm("⚠️ 警告：這將會清除您在瀏覽器上的所有自訂影片與客戶設定，恢復成一開始的 YouTube 測試範例。確定要重設嗎？")) return;
    localStorage.removeItem('owldio_videos');
    localStorage.removeItem('owldio_clients');
    sessionStorage.clear();
    alert("已重設，即將重新整理網頁！");
    window.location.reload();
}
