/**
 * OWLDIO PLAYER - 核心管理與播放控制系統 (JS)
 * 1. 播放清單（Playlist）免密碼直連路由 (?playlist=xxx)，客戶點開直接播放影片。
 * 2. 只有管理員密碼 (owl2026) 才能登入控制台。
 * 3. 支援管理員後台：新增播放清單、對特定清單加片/刪片、上下移動按鈕調整順序。
 * 4. 整合 GitHub API：一鍵同步 config.json，自動觸發 Cloudflare Pages 重新建置部署。
 */

// ==========================================
// 1. 預設初始設定資料 (若 config.json / LocalStorage 空白時的備用資料)
// ==========================================
const DEFAULT_PLAYLISTS = [
    {
        id: "clientA",
        name: "客戶 A 的專屬影音專區",
        videos: [
            {
                id: "vid-01",
                title: "Owldio Art - 測試影片一 (YouTube)",
                duration: "05:15",
                thumbnail: "https://img.youtube.com/vi/vweqyVqQoFM/maxresdefault.jpg",
                sources: [
                    {
                        src: "vweqyVqQoFM",
                        provider: "youtube"
                    }
                ]
            }
        ]
    },
    {
        id: "clientB",
        name: "客戶 B 的特製影音清單",
        videos: [
            {
                id: "vid-02",
                title: "Owldio Art - 測試影片二 (YouTube)",
                duration: "03:40",
                thumbnail: "https://img.youtube.com/vi/iRQGeJ5qiMk/maxresdefault.jpg",
                sources: [
                    {
                        src: "iRQGeJ5qiMk",
                        provider: "youtube"
                    }
                ]
            }
        ]
    }
];

// 核心資料狀態
let allPlaylists = [];
let videoPlaylist = []; // 目前網頁加載的影片播放清單
let player = null;
let currentVideoIndex = 0;
let editingPlaylistId = null; // 管理員目前正在編輯的播放清單 ID

// ==========================================
// 2. 頁面加載與初始化
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const playlistParam = urlParams.get('playlist');

    // 1. 如果 URL 帶有播放清單參數，先清除任何殘留的舊管理員 Session，確保客戶端載入乾淨
    if (playlistParam) {
        sessionStorage.clear();
    }

    // 2. 從伺服器最新 config.json 或 LocalStorage 讀取資料
    await loadDatabase();

    // 3. 載入 GitHub 儲存庫同步設定
    loadGitHubSettings();

    // 4. 解析 URL 播放清單參數： ?playlist=xxx
    if (playlistParam) {
        verifyWithPlaylist(playlistParam);
    } else if (sessionStorage.getItem("owldio_auth") === "true") {
        const role = sessionStorage.getItem("owldio_role");
        const playlistId = sessionStorage.getItem("owldio_playlist_id");
        setupSessionPlaylist(role, playlistId);
        revealContent(role);
    }
});

/**
 * 載入播放清單資料庫 (帶有快取防禦與格式防禦)
 */
async function loadDatabase() {
    let localDataLoaded = false;
    const localPlaylists = localStorage.getItem('owldio_playlists');

    if (localPlaylists) {
        try {
            allPlaylists = JSON.parse(localPlaylists);
            localDataLoaded = true;
        } catch (e) {
            console.warn("本機 LocalStorage 解析失敗，改用伺服器設定", e);
        }
    }

    // 若本地無資料，則向伺服器拉取最新 config.json (加上時間戳防止快取)
    if (!localDataLoaded) {
        try {
            const response = await fetch(`config.json?t=${Date.now()}`);
            if (response.ok) {
                const data = await response.json();
                allPlaylists = data.playlists || DEFAULT_PLAYLISTS;
            } else {
                allPlaylists = DEFAULT_PLAYLISTS;
            }
        } catch (e) {
            console.warn("無法載入 config.json，使用備用資料:", e);
            allPlaylists = DEFAULT_PLAYLISTS;
        }
    }

    // 🛡️ 資料格式防禦：若資料庫遺留舊版本格式，自動重置
    let isDataValid = true;
    if (allPlaylists && Array.isArray(allPlaylists) && allPlaylists.length > 0) {
        const sample = allPlaylists[0];
        // 舊版可能具備 password 欄位，或者沒有 id/videos。新版只需檢查 id 和 videos 即可
        if (sample.id === undefined || sample.videos === undefined) {
            isDataValid = false;
        }
    } else {
        isDataValid = false;
    }

    if (!isDataValid) {
        console.warn("⚠️ 檢測到瀏覽器留有舊版資料，自動重置為最新播放清單模式...");
        localStorage.removeItem('owldio_playlists');
        allPlaylists = DEFAULT_PLAYLISTS;
    }

    saveToLocalStorage();
}

function saveToLocalStorage() {
    localStorage.setItem('owldio_playlists', JSON.stringify(allPlaylists));
}

/**
 * 設定該工作階段的播放清單
 */
function setupSessionPlaylist(role, playlistId) {
    if (role === "admin") {
        // 管理員預設載入第 1 個清單的影片，方便預覽
        if (allPlaylists.length > 0) {
            videoPlaylist = allPlaylists[0].videos || [];
            document.getElementById("role-badge-text").textContent = "Admin Mode";
        } else {
            videoPlaylist = [];
        }
    } else {
        const matched = allPlaylists.find(pl => pl.id === playlistId);
        if (matched) {
            videoPlaylist = matched.videos || [];
            document.getElementById("role-badge-text").textContent = matched.name;
        } else {
            videoPlaylist = [];
        }
    }
}

// ==========================================
// 3. 認證邏輯 (URL 免密登入 or 管理員密碼)
// ==========================================

// URL 播放清單參數免密碼登入
function verifyWithPlaylist(playlistId) {
    const matchedPlaylist = allPlaylists.find(pl => pl.id === playlistId);

    if (matchedPlaylist) {
        sessionStorage.setItem("owldio_auth", "true");
        sessionStorage.setItem("owldio_role", "client");
        sessionStorage.setItem("owldio_playlist_id", matchedPlaylist.id);

        setupSessionPlaylist("client", matchedPlaylist.id);
        revealContent("client");
    } else {
        document.getElementById("error-msg").textContent = `找不到 ID 為 "${playlistId}" 的播放清單，請確認連結！`;
    }
}

// 手動輸入密碼認證 (限管理員使用)
function verifyPassword(event) {
    event.preventDefault();
    const passwordInput = document.getElementById("access-password");
    const errorMsg = document.getElementById("error-msg");
    const enteredPassword = passwordInput.value.trim();

    // 只有管理員密碼 "owl2026" 才能登入控制台
    if (enteredPassword === "owl2026") {
        sessionStorage.setItem("owldio_auth", "true");
        sessionStorage.setItem("owldio_role", "admin");
        
        setupSessionPlaylist("admin", null);
        errorMsg.textContent = "";
        revealContent("admin");
    } else {
        errorMsg.textContent = "密碼無效！該密碼並非管理員密碼。";
        passwordInput.value = "";
        passwordInput.focus();
    }
}

// 解鎖介面
function revealContent(role) {
    const overlay = document.getElementById("password-overlay");
    const mainContent = document.getElementById("main-content");
    const btnAdminPortal = document.getElementById("btn-admin-portal");

    overlay.classList.add("fade-out");
    mainContent.classList.remove("hidden");

    if (role === "admin") {
        btnAdminPortal.classList.remove("hidden");
    } else {
        btnAdminPortal.classList.add("hidden");
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
 * 載入影片
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
// 4. 管理後台互動邏輯 (Admin Portal Logic)
// ==========================================

// 開關後台視窗
function toggleAdminPortal(show) {
    const modal = document.getElementById("admin-portal-modal");
    if (show) {
        modal.classList.remove("hidden");
        renderAdminPlaylists();
        refreshExportCode();
    } else {
        modal.classList.add("hidden");
        if (sessionStorage.getItem("owldio_role") === "admin") {
            setupSessionPlaylist("admin", null);
        } else {
            setupSessionPlaylist("client", sessionStorage.getItem("owldio_playlist_id"));
        }
        setupPlaylistUI();
        loadVideo(0, false);
    }
}

// 切換後台分頁
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
    const input = document.getElementById("new-video-src");

    if (provider === "youtube") {
        input.placeholder = "YouTube 影片 ID (如 vweqyVqQoFM)...";
    } else {
        input.placeholder = "R2 MP4 直連網址 (https://...)...";
    }
}

// 渲染左側播放清單表格
function renderAdminPlaylists() {
    const playlistContainer = document.getElementById("admin-playlist-list");
    playlistContainer.innerHTML = "";

    allPlaylists.forEach(playlist => {
        const tr = document.createElement("tr");
        
        const currentOrigin = window.location.origin + window.location.pathname;
        const playlistUrl = `${currentOrigin}?playlist=${playlist.id}`;

        tr.innerHTML = `
            <td>
                <strong>${playlist.name}</strong><br>
                <small style="color: var(--text-secondary)">ID: ${playlist.id}</small>
            </td>
            <td>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <button class="btn-primary" style="padding: 6px 8px; font-size: 11px;" onclick="selectPlaylistToEdit('${playlist.id}')">✏️ 編輯影片</button>
                    <button class="btn-primary" style="padding: 6px 8px; font-size: 11px; background: #4b5563; color: #fff;" onclick="copyShareUrl('${playlistUrl}')">📋 複製連結</button>
                    <button class="btn-danger" style="padding: 6px 8px; font-size: 11px;" onclick="deletePlaylist('${playlist.id}')">刪除</button>
                </div>
            </td>
        `;
        playlistContainer.appendChild(tr);
    });
}

// 建立新播放清單
function addPlaylist(event) {
    event.preventDefault();
    const id = document.getElementById("new-playlist-id").value.trim();
    const name = document.getElementById("new-playlist-name").value.trim();

    // 檢查 ID 格式 (不允許特殊字元，方便作為網址參數)
    const idRegex = /^[a-zA-Z0-9_-]+$/;
    if (!idRegex.test(id)) {
        alert("清單 ID 僅能包含英文、數字、底線或減號！");
        return;
    }

    if (allPlaylists.some(pl => pl.id === id)) {
        alert("清單 ID 已存在！");
        return;
    }

    const newPlaylist = {
        id: id,
        name: name,
        videos: [] // 初始影片為空
    };

    allPlaylists.push(newPlaylist);
    saveToLocalStorage();
    renderAdminPlaylists();
    
    document.getElementById("add-playlist-form").reset();
    refreshExportCode();
    alert("播放清單建立成功！現在可點擊「✏️ 編輯影片」為該清單新增影片。");
}

// 刪除播放清單
function deletePlaylist(id) {
    if (!confirm(`確定要刪除整個清單 ${id} 嗎？此操作無法還原。`)) return;
    allPlaylists = allPlaylists.filter(pl => pl.id !== id);
    saveToLocalStorage();
    renderAdminPlaylists();
    
    if (editingPlaylistId === id) {
        editingPlaylistId = null;
        document.getElementById("editing-playlist-title").textContent = "請選擇左側清單";
        document.getElementById("editing-playlist-link").textContent = "無";
        document.getElementById("playlist-add-video-container").classList.add("hidden");
        document.getElementById("admin-playlist-videos").innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 30px;">請點選左側清單的「編輯影片」按鈕開始管理</td></tr>`;
    }
    
    refreshExportCode();
}

// 複製專屬連結
function copyShareUrl(url) {
    navigator.clipboard.writeText(url).then(() => {
        alert("📋 免密分享連結已複製到您的剪貼簿：\n" + url);
    }).catch(err => {
        alert("複製失敗，請手動複製此網址：\n" + url);
    });
}

// 選擇播放清單進行右側影片與順序編輯
function selectPlaylistToEdit(id) {
    editingPlaylistId = id;
    const playlist = allPlaylists.find(pl => pl.id === id);
    if (!playlist) return;

    document.getElementById("playlist-add-video-container").classList.remove("hidden");
    
    document.getElementById("editing-playlist-title").textContent = playlist.name;
    const currentOrigin = window.location.origin + window.location.pathname;
    const link = `${currentOrigin}?playlist=${playlist.id}`;
    document.getElementById("editing-playlist-link").innerHTML = `<a href="${link}" target="_blank" style="color: var(--accent); text-decoration: underline;">${link}</a>`;

    renderAdminPlaylistVideos();
}

// 渲染選中清單內的影片列表
function renderAdminPlaylistVideos() {
    const listBody = document.getElementById("admin-playlist-videos");
    listBody.innerHTML = "";

    const playlist = allPlaylists.find(pl => pl.id === editingPlaylistId);
    if (!playlist || !playlist.videos || playlist.videos.length === 0) {
        listBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 30px;">目前此清單尚無任何影片。請在上方新增！</td></tr>`;
        return;
    }

    playlist.videos.forEach((video, index) => {
        const isYoutube = video.sources[0].provider === 'youtube';
        const typeLabel = isYoutube ? "🔴 YT" : "🌐 MP4";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <img src="${video.thumbnail}" style="width: 50px; aspect-ratio: 16/9; object-fit: cover; border-radius: 4px; flex-shrink: 0;">
                    <span style="font-weight: 500;">${video.title}</span>
                </div>
            </td>
            <td><span class="meta-tag codec" style="font-size: 10px; padding: 2px 6px;">${typeLabel}</span></td>
            <td>
                <div style="display: flex; gap: 4px;">
                    <button class="btn-admin-portal" style="padding: 4px 8px; font-size: 11px;" onclick="moveVideoUp(${index})" ${index === 0 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}>⬆️</button>
                    <button class="btn-admin-portal" style="padding: 4px 8px; font-size: 11px;" onclick="moveVideoDown(${index})" ${index === playlist.videos.length - 1 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}>⬇️</button>
                </div>
            </td>
            <td>
                <button class="btn-danger" style="padding: 4px 8px; font-size: 11px;" onclick="removeVideoFromPlaylist(${index})">❌ 移除</button>
            </td>
        `;
        listBody.appendChild(tr);
    });
}

// 新增影片到播放清單
function addVideoToPlaylist(event) {
    event.preventDefault();
    if (!editingPlaylistId) return;

    const title = document.getElementById("new-video-title").value.trim();
    const duration = document.getElementById("new-video-duration").value.trim();
    const thumbnail = document.getElementById("new-video-thumb").value.trim();
    const provider = document.getElementById("new-video-provider").value;
    const src = document.getElementById("new-video-src").value.trim();

    const playlist = allPlaylists.find(pl => pl.id === editingPlaylistId);
    if (!playlist) return;

    const newVideo = {
        id: `vid-${Date.now()}`,
        title: title,
        duration: duration,
        thumbnail: thumbnail,
        sources: [
            provider === "youtube"
            ? { src: src, provider: "youtube" }
            : { src: src, type: "video/mp4", size: 2160 }
        ]
    };

    playlist.videos.push(newVideo);
    saveToLocalStorage();
    renderAdminPlaylistVideos();
    
    document.getElementById("add-video-form").reset();
    toggleProviderInput();
    refreshExportCode();
}

// 影片排序：上移
function moveVideoUp(index) {
    const playlist = allPlaylists.find(pl => pl.id === editingPlaylistId);
    if (!playlist || index <= 0) return;

    const temp = playlist.videos[index];
    playlist.videos[index] = playlist.videos[index - 1];
    playlist.videos[index - 1] = temp;

    saveToLocalStorage();
    renderAdminPlaylistVideos();
    refreshExportCode();
}

// 影片排序：下移
function moveVideoDown(index) {
    const playlist = allPlaylists.find(pl => pl.id === editingPlaylistId);
    if (!playlist || index >= playlist.videos.length - 1) return;

    const temp = playlist.videos[index];
    playlist.videos[index] = playlist.videos[index + 1];
    playlist.videos[index + 1] = temp;

    saveToLocalStorage();
    renderAdminPlaylistVideos();
    refreshExportCode();
}

// 從播放清單中移除影片
function removeVideoFromPlaylist(index) {
    const playlist = allPlaylists.find(pl => pl.id === editingPlaylistId);
    if (!playlist) return;

    if (!confirm("確定要將此影片從本播放清單移除嗎？")) return;

    playlist.videos.splice(index, 1);
    saveToLocalStorage();
    renderAdminPlaylistVideos();
    refreshExportCode();
}

// ==========================================
// 5. GitHub API 一鍵同步設定檔功能
// ==========================================

// 載入 GitHub 設定
function loadGitHubSettings() {
    const pat = localStorage.getItem('owldio_github_pat') || '';
    const repo = localStorage.getItem('owldio_github_repo') || 'owldio/Owldoge';
    const branch = localStorage.getItem('owldio_github_branch') || 'main';

    document.getElementById("github-pat").value = pat;
    document.getElementById("github-repo").value = repo;
    document.getElementById("github-branch").value = branch;
}

// 刷新 config.json 程式碼預覽
function refreshExportCode() {
    const codeBlock = document.getElementById("code-export-output");
    const fullConfig = {
        playlists: allPlaylists
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

    localStorage.setItem('owldio_github_pat', pat);
    localStorage.setItem('owldio_github_repo', repo);
    localStorage.setItem('owldio_github_branch', branch);

    syncStatus.textContent = "⏳ 正在與 GitHub 連線中...";
    syncStatus.style.color = "var(--accent)";

    const fullConfig = {
        playlists: allPlaylists
    };
    const newContent = JSON.stringify(fullConfig, null, 2);
    const base64Content = btoa(unescape(encodeURIComponent(newContent)));

    try {
        const url = `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`;
        const headers = {
            "Authorization": `token ${pat}`,
            "Accept": "application/vnd.github+json"
        };

        let sha = null;
        const checkRes = await fetch(url, { headers });
        if (checkRes.ok) {
            const fileData = await checkRes.json();
            sha = fileData.sha;
        }

        const commitUrl = `https://api.github.com/repos/${repo}/contents/${path}`;
        const body = {
            message: "chore: update player playlists config.json via admin portal",
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
            syncStatus.style.color = "#10b981";
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
    localStorage.removeItem('owldio_playlists');
    sessionStorage.clear();
    alert("已重設，即將重新整理網頁！");
    window.location.reload();
}
