/**
 * OWLDIO PLAYER - 核心管理與播放控制系統 (JS)
 * 支援網址專屬連結 (?key=xxx) 免密登入、GitHub API 一鍵同步設定檔，以及本地 LocalStorage 暫存。
 */

// ==========================================
// 1. 預設初始設定資料 (若 config.json / LocalStorage 空白時的備用資料)
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
        videos: ["vid-01", "vid-02"]
    },
    {
        id: "clientA",
        password: "owl-client-a",
        role: "client",
        videos: ["vid-01"]
    },
    {
        id: "clientB",
        password: "owl-client-b",
        role: "client",
        videos: ["vid-02"]
    }
];

// 核心資料狀態
let allVideos = [];
let allClients = [];
let videoPlaylist = []; // 當前登入者所屬的影片清單
let player = null;
let currentVideoIndex = 0;

// ==========================================
// 2. 頁面加載與多途徑認證初始化 (URL ?key= 或 Session)
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
    // 1. 優先從 config.json 或 LocalStorage 讀取資料
    await loadDatabase();

    // 2. 載入 GitHub 儲存庫同步相關設定
    loadGitHubSettings();

    // 3. 檢查網址是否有免密金鑰參數： ?key=xxx
    const urlParams = new URLSearchParams(window.location.search);
    const keyParam = urlParams.get('key');

    if (keyParam) {
        // 使用 URL 參數登入
        verifyWithKey(keyParam);
    } else if (sessionStorage.getItem("owldio_auth") === "true") {
        // 使用現有 Session 登入
        const role = sessionStorage.getItem("owldio_role");
        const authorizedVideoIds = JSON.parse(sessionStorage.getItem("owldio_auth_videos")) || [];
        setupSessionPlaylist(role, authorizedVideoIds);
        revealContent(role);
    }
});

/**
 * 載入影片與客戶資料庫
 */
async function loadDatabase() {
    // 優先使用本地暫存（讓管理員能立即預覽剛修改但未同步的項目）
    const localVideos = localStorage.getItem('owldio_videos');
    const localClients = localStorage.getItem('owldio_clients');

    if (localVideos && localClients) {
        allVideos = JSON.parse(localVideos);
        allClients = JSON.parse(localClients);
        return;
    }

    // 本地無暫存，則嘗試發起 fetch 取得伺服器上最新的 config.json
    try {
        const response = await fetch('config.json');
        if (response.ok) {
            const data = await response.json();
            allVideos = data.videos || DEFAULT_VIDEOS;
            allClients = data.clients || DEFAULT_CLIENTS;
        } else {
            allVideos = DEFAULT_VIDEOS;
            allClients = DEFAULT_CLIENTS;
        }
    } catch (e) {
        console.warn("無法取得 config.json，改用預設資料:", e);
        allVideos = DEFAULT_VIDEOS;
        allClients = DEFAULT_CLIENTS;
    }
    // 寫入本地暫存
    saveToLocalStorage();
}

function saveToLocalStorage() {
    localStorage.setItem('owldio_videos', JSON.stringify(allVideos));
    localStorage.setItem('owldio_clients', JSON.stringify(allClients));
}

// 建立該工作階段的影片清單
function setupSessionPlaylist(role, authorizedVideoIds) {
    if (role === "admin") {
        videoPlaylist = [...allVideos]; // 管理員看全部
    } else {
        // 客戶端：只載入有被授權 ID 的影片
        videoPlaylist = allVideos.filter(vid => authorizedVideoIds.includes(vid.id));
    }
}

// ==========================================
// 3. 認證邏輯 (手動密碼 or URL 免密連結)
// ==========================================

// 免密連結認證邏輯 (?key=xxx)
function verifyWithKey(key) {
    const matchedUser = allClients.find(user => user.password === key);

    if (matchedUser) {
        // 驗證成功：寫入 Session 並進入
        sessionStorage.setItem("owldio_auth", "true");
        sessionStorage.setItem("owldio_role", matchedUser.role);
        sessionStorage.setItem("owldio_auth_videos", JSON.stringify(matchedUser.videos));
        
        setupSessionPlaylist(matchedUser.role, matchedUser.videos);
        revealContent(matchedUser.role);
    } else {
        // 金鑰無效，在畫面上顯示提示並退回密碼登入
        document.getElementById("error-msg").textContent = "無效的專屬連結，請確認網址或輸入密碼！";
    }
}

// 手動密碼驗證邏輯
function verifyPassword(event) {
    event.preventDefault();
    const passwordInput = document.getElementById("access-password");
    const errorMsg = document.getElementById("error-msg");
    const enteredPassword = passwordInput.value.trim();

    const matchedUser = allClients.find(user => user.password === enteredPassword);

    if (matchedUser) {
        sessionStorage.setItem("owldio_auth", "true");
        sessionStorage.setItem("owldio_role", matchedUser.role);
        sessionStorage.setItem("owldio_auth_videos", JSON.stringify(matchedUser.videos));
        
        setupSessionPlaylist(matchedUser.role, matchedUser.videos);
        errorMsg.textContent = "";
        revealContent(matchedUser.role);
    } else {
        errorMsg.textContent = "密碼錯誤，請重新輸入！";
        passwordInput.value = "";
        passwordInput.focus();
    }
}

// 解鎖顯示播放器
function revealContent(role) {
    const overlay = document.getElementById("password-overlay");
    const mainContent = document.getElementById("main-content");
    const btnAdminPortal = document.getElementById("btn-admin-portal");
    const roleBadgeText = document.getElementById("role-badge-text");

    overlay.classList.add("fade-out");
    mainContent.classList.remove("hidden");

    if (role === "admin") {
        btnAdminPortal.classList.remove("hidden");
        roleBadgeText.textContent = "Owldio Admin";
    } else {
        btnAdminPortal.classList.add("hidden");
        roleBadgeText.textContent = "Client Area";
    }

    initPlyr();
    setupPlaylistUI();
}

/**
 * 初始化 Plyr
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

    let isFirstReady = true;
    player.on('ready', () => {
        if (isFirstReady) {
            isFirstReady = false;
            loadVideo(0, false);
        }
    });

    player.on('ended', () => {
        playNextVideo();
    });
}

/**
 * 渲染右側影片卡片
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
 * 載入特定影片
 */
function loadVideo(index, autoplay = true) {
    if (index < 0 || index >= videoPlaylist.length) return;

    currentVideoIndex = index;
    const video = videoPlaylist[index];

    document.getElementById("current-video-title").textContent = video.title;

    const isYoutube = video.sources[0].provider === 'youtube';
    const accessBadge = document.getElementById("video-access-badge");
    accessBadge.textContent = isYoutube ? "YouTube Player" : "Cloudflare R2 (4K)";
    accessBadge.className = isYoutube ? "meta-tag resolution" : "meta-tag access";

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
// 4. 管理後台邏輯 (Admin Portal Logic)
// ==========================================

// 開關後台視窗
function toggleAdminPortal(show) {
    const modal = document.getElementById("admin-portal-modal");
    if (show) {
        modal.classList.remove("hidden");
        renderAdminVideos();
        renderAdminClients();
        refreshExportCode();
    } else {
        modal.classList.add("hidden");
    }
}

// 切換頁籤
function switchTab(tabId) {
    const tabs = document.querySelectorAll(".tab-btn");
    const contents = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => tab.classList.remove("active"));
    contents.forEach(content => content.classList.remove("active"));

    const clickedTab = Array.from(tabs).find(tab => tab.getAttribute("onclick").includes(tabId));
    if (clickedTab) clickedTab.classList.add("active");
    
    document.getElementById(tabId).classList.add("active");

    if (tabId === 'tab-export') {
        refreshExportCode();
    }
}

// 切換影片來源提示
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

// 渲染影片庫表格
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

    if (allVideos.some(v => v.id === id)) {
        alert("影片 ID 已存在！");
        return;
    }

    const newVideo = {
        id: id,
        title: title,
        duration: duration,
        thumbnail: thumbnail,
        sources: [
            provider === "youtube" 
            ? { src: src, provider: "youtube" }
            : { src: src, type: "video/mp4", size: 2160 }
        ]
    };

    allVideos.push(newVideo);
    saveToLocalStorage();
    renderAdminVideos();
    
    document.getElementById("add-video-form").reset();
    toggleProviderInput();
    refreshExportCode();
    alert("影片新增成功！");
}

// 刪除影片
function deleteVideo(id) {
    if (!confirm("確定要刪除此影片嗎？這將會同步移除所有客戶的觀看權限。")) return;

    allVideos = allVideos.filter(v => v.id !== id);
    allClients.forEach(client => {
        client.videos = client.videos.filter(vidId => vidId !== id);
    });

    saveToLocalStorage();
    renderAdminVideos();
    renderAdminClients();
    refreshExportCode();
}

// 渲染客戶列表表格 (加上複製專屬連結功能)
function renderAdminClients() {
    const clientContainer = document.getElementById("admin-client-list");
    clientContainer.innerHTML = "";

    const clientsOnly = allClients.filter(c => c.role !== "admin");

    clientsOnly.forEach(client => {
        const tr = document.createElement("tr");
        
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

        // 建立客戶專屬的網址連結 (?key=password)
        const currentOrigin = window.location.origin + window.location.pathname;
        const clientShareUrl = `${currentOrigin}?key=${client.password}`;

        tr.innerHTML = `
            <td>
                <strong>ID: ${client.id}</strong><br>
                <small style="color: var(--text-secondary)">🔑 金鑰 (密碼): ${client.password}</small>
            </td>
            <td>${checkboxesHtml}</td>
            <td>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <button class="btn-primary" style="padding: 6px 12px; font-size: 11px;" onclick="copyShareUrl('${clientShareUrl}')">📋 複製連結</button>
                    <button class="btn-danger" style="padding: 6px 12px; font-size: 11px;" onclick="deleteClient('${client.id}')">刪除</button>
                </div>
            </td>
        `;
        clientContainer.appendChild(tr);
    });
}

// 複製專屬網址到剪貼簿
function copyShareUrl(url) {
    navigator.clipboard.writeText(url).then(() => {
        alert("📋 該客戶專屬免密連結已複製到您的剪貼簿！\n" + url);
    }).catch(err => {
        alert("複製失敗，請手動複製此網址：\n" + url);
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
        videos: []
    };

    allClients.push(newClient);
    saveToLocalStorage();
    renderAdminClients();
    
    document.getElementById("add-client-form").reset();
    refreshExportCode();
    alert("客戶建立成功！");
}

// 刪除客戶
function deleteClient(id) {
    if (!confirm(`確定要刪除客戶 ${id} 嗎？`)) return;
    allClients = allClients.filter(c => c.id !== id);
    saveToLocalStorage();
    renderAdminClients();
    refreshExportCode();
}

// 切換授權狀態
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
// 5. GitHub API 一鍵同步設定檔功能
// ==========================================

// 載入儲存在本地 LocalStorage 的 GitHub 設定
function loadGitHubSettings() {
    const pat = localStorage.getItem('owldio_github_pat') || '';
    const repo = localStorage.getItem('owldio_github_repo') || 'owldio/Owldoge';
    const branch = localStorage.getItem('owldio_github_branch') || 'main';

    document.getElementById("github-pat").value = pat;
    document.getElementById("github-repo").value = repo;
    document.getElementById("github-branch").value = branch;
}

// 更新 config.json 程式碼預覽
function refreshExportCode() {
    const codeBlock = document.getElementById("code-export-output");
    const fullConfig = {
        videos: allVideos,
        clients: allClients
    };
    codeBlock.textContent = JSON.stringify(fullConfig, null, 2);
}

// 一鍵同步到 GitHub
async function syncToGitHub() {
    const pat = document.getElementById("github-pat").value.trim();
    const repo = document.getElementById("github-repo").value.trim();
    const branch = document.getElementById("github-branch").value.trim();
    const path = document.getElementById("github-path").value.trim();
    const syncStatus = document.getElementById("sync-status");

    if (!pat) {
        alert("請輸入 GitHub 個人存取權杖 (PAT)！");
        return;
    }
    if (!repo) {
        alert("請輸入儲存庫名稱（如 owldio/Owldoge）！");
        return;
    }

    // 暫存 GitHub 設定至 LocalStorage
    localStorage.setItem('owldio_github_pat', pat);
    localStorage.setItem('owldio_github_repo', repo);
    localStorage.setItem('owldio_github_branch', branch);

    syncStatus.textContent = "⏳ 正在與 GitHub 連線中...";
    syncStatus.style.color = "var(--accent)";

    const fullConfig = {
        videos: allVideos,
        clients: allClients
    };
    const newContent = JSON.stringify(fullConfig, null, 2);
    // 轉成 Base64 格式 (支援中文/特殊字元)
    const base64Content = btoa(unescape(encodeURIComponent(newContent)));

    try {
        const url = `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`;
        const headers = {
            "Authorization": `token ${pat}`,
            "Accept": "application/vnd.github+json"
        };

        // 1. 取得檔案目前狀態 (主要是拿到 sha 值，如果是更新必須帶 sha)
        let sha = null;
        const checkRes = await fetch(url, { headers });
        if (checkRes.ok) {
            const fileData = await checkRes.json();
            sha = fileData.sha;
        }

        // 2. 透過 PUT 提交新內容到 GitHub 倉庫
        const commitUrl = `https://api.github.com/repos/${repo}/contents/${path}`;
        const body = {
            message: "chore: update player config.json via admin portal",
            content: base64Content,
            branch: branch
        };
        if (sha) body.sha = sha;

        const uploadRes = await fetch(commitUrl, {
            method: "PUT",
            headers: {
                ...headers,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (uploadRes.ok) {
            syncStatus.textContent = "✅ 同步成功！GitHub 已更新，Cloudflare Pages 將在 1 分鐘內完成重新部署。";
            syncStatus.style.color = "#10b981"; // 成功綠色
            alert("🎉 同步成功！\n\n最新的 config.json 已經更新到您的 GitHub 儲存庫。Cloudflare Pages 將會自動重新建置並部署您的最新設定，客戶重刷網頁即可看見更新！");
        } else {
            const errData = await uploadRes.json();
            syncStatus.textContent = `❌ 提交失敗: ${errData.message}`;
            syncStatus.style.color = "#ef4444";
        }
    } catch (error) {
        console.error(error);
        syncStatus.textContent = `❌ 連線發生錯誤: ${error.message}`;
        syncStatus.style.color = "#ef4444";
    }
}

// 重設
function resetToDefault() {
    if (!confirm("⚠️ 警告：這將會清除您本機上的設定，恢復成一開始的測試範例。確定要重設嗎？")) return;
    localStorage.removeItem('owldio_videos');
    localStorage.removeItem('owldio_clients');
    sessionStorage.clear();
    alert("已重設，即將重新整理網頁！");
    window.location.reload();
}
