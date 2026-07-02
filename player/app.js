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
let shouldPlayAfterReady = false; // 標記切換訊源後是否需要自動播放
let serverEncryptedToken = ""; // 儲存從伺服器載入的加密 GitHub Token
let currentPlayerType = ""; // 紀錄目前播放器的底層訊源類型 (youtube, mp4, hls)
let hlsInstance = null; // hls.js 解碼器實例，用於 ABR 自適應多畫質串流播放
let keepFullscreen = false; // 紀錄切換影片前是否處於全螢幕狀態，以便換片後自動還原

// ==========================================
// 2. 頁面加載與初始化
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
    // 優先讀取 Hash 路由 (#playlistId)
    const hashParam = window.location.hash.slice(1);
    
    // 同時相容舊版 URL Query 參數 (?playlist=playlistId)
    const urlParams = new URLSearchParams(window.location.search);
    const playlistParam = urlParams.get('playlist');

    // 1. 清除過期的不一致 Session 資訊
    if (hashParam && hashParam !== "login") {
        sessionStorage.clear();
    } else if (playlistParam) {
        sessionStorage.clear();
    }

    // 2. 從伺服器最新 config.json 或 LocalStorage 讀取資料 (若是客戶直連或首頁，強制從伺服器拉取 config.json，避開舊 LocalStorage 快取)
    const isClientAccess = (hashParam !== "login");
    await loadDatabase(isClientAccess);

    // 3. 載入 GitHub 儲存庫同步設定
    loadGitHubSettings();

    // 4. 路由分流登入解析
    if (hashParam === "login") {
        // 造訪管理後台
        const auth = sessionStorage.getItem("owldio_auth");
        const role = sessionStorage.getItem("owldio_role");
        if (auth === "true" && role === "admin") {
            setupSessionPlaylist("admin", null);
            revealContent("admin");
            // 已經驗證過管理員身分，直接彈出控制台
            toggleAdminPortal(true);
        } else {
            // 尚未驗證，開啟管理員密碼登入遮罩，隱藏歡迎首頁
            document.getElementById("password-overlay").classList.remove("hidden");
            document.getElementById("welcome-overlay").classList.add("hidden");
            document.getElementById("main-content").classList.add("hidden");
        }
    } else if (hashParam && hashParam !== "login") {
        // 客戶播放清單直連
        verifyWithPlaylist(hashParam);
    } else if (playlistParam) {
        // 客戶舊有 Query 參數直連
        verifyWithPlaylist(playlistParam);
    } else {
        // 沒有任何 Hash (即 https://player.owldio.art/) ➔ 開啟「歡迎首頁」，展示歷史紀錄，不進播放器
        document.getElementById("welcome-overlay").classList.remove("hidden");
        document.getElementById("password-overlay").classList.add("hidden");
        document.getElementById("main-content").classList.add("hidden");
        renderVisitedHistory();
    }
    
    // 初始化全域快速鍵與雙擊快進退
    setupKeyboardShortcuts();
    setupDoubleTapToSeek();
});

/**
 * 載入播放清單資料庫 (帶有快取防禦與格式防禦)
 */
async function loadDatabase(forceServer = false) {
    let localDataLoaded = false;
    const localPlaylists = localStorage.getItem('owldio_playlists');

    if (localPlaylists && !forceServer) {
        try {
            allPlaylists = JSON.parse(localPlaylists);
            localDataLoaded = true;
        } catch (e) {
            console.warn("本機 LocalStorage 解析失敗，改用伺服器設定", e);
        }
    }

    // 若本地無資料或強制伺服器，則向伺服器拉取最新 config.json (加上時間戳防止快取)
    if (!localDataLoaded || forceServer) {
        try {
            const response = await fetch(`config.json?t=${Date.now()}`);
            if (response.ok) {
                const data = await response.json();
                serverEncryptedToken = data.encryptedToken || "";
                allPlaylists = data.playlists || DEFAULT_PLAYLISTS;
                
                // 如果強制從伺服器拉取，同步更新 LocalStorage
                if (forceServer) {
                    saveToLocalStorage();
                }
            } else {
                allPlaylists = DEFAULT_PLAYLISTS;
            }
        } catch (e) {
            console.warn("無法載入 config.json，使用備用資料:", e);
            allPlaylists = DEFAULT_PLAYLISTS;
        }
    } else {
        // 如果本地已載入播放清單，我們仍順便拉取 config.json 的加密 Token，確保換瀏覽器後可用
        try {
            const response = await fetch(`config.json?t=${Date.now()}`);
            if (response.ok) {
                const data = await response.json();
                serverEncryptedToken = data.encryptedToken || "";
            }
        } catch (e) {}
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

        // 記憶此造訪歷史到 LocalStorage 中
        saveVisitedHistory(matchedPlaylist.id, matchedPlaylist.name);

        setupSessionPlaylist("client", matchedPlaylist.id);
        revealContent("client");
    } else {
        // 如果是在客戶端點擊錯誤的連結，也引導到歡迎頁並提示錯誤
        document.getElementById("welcome-overlay").classList.remove("hidden");
        alert(`❌ 找不到 ID 為 "${playlistId}" 的播放清單，請確認連結！`);
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
        sessionStorage.setItem("owldio_admin_pass", enteredPassword); // 儲存密碼作為解密金鑰
        
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
    const mainContent = document.getElementById("main-content");
    const btnAdminPortal = document.getElementById("btn-admin-portal");

    // 徹底隱藏兩個 Overlay
    document.getElementById("welcome-overlay").classList.add("hidden");
    document.getElementById("password-overlay").classList.add("hidden");
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
 * 創建與綁定 Plyr 播放器實例 (支援自訂選項以對接 HLS ABR 多畫質控制)
 */
function setupPlyrInstance(options = {}) {
    const defaultOptions = {
        controls: [
            'play-large', 'play', 'progress', 'current-time', 
            'duration', 'mute', 'volume', 'settings', 'pip', 'fullscreen'
        ],
        settings: ['speed'], // 預設僅開啟播放速度，不顯示無效的 YouTube 畫質選項
        fullscreen: { container: '.player-wrapper' }, // 指定最外層 wrapper 為全螢幕載體
        tooltips: { controls: true, seek: true },
        keyboard: { focused: true, global: true }
    };

    const mergedOptions = { ...defaultOptions, ...options };
    player = new Plyr('#player', mergedOptions);

    player.on('ready', () => {
        console.log("Plyr 播放器已就緒。");
        // 延遲淡出遮罩以防 DOM 白屏或閃動，待首影格載入就緒後優化顯示
        setTimeout(hidePlayerLoader, 250);
        
        // 換片後自動還原全螢幕狀態
        if (keepFullscreen) {
            keepFullscreen = false;
            setTimeout(() => {
                try {
                    player.fullscreen.enter();
                } catch (e) {
                    console.warn("自動還原全螢幕失敗:", e);
                }
            }, 100);
        }

        if (shouldPlayAfterReady) {
            shouldPlayAfterReady = false;
            setTimeout(() => {
                player.play().catch(error => {
                    console.log("自動播放被瀏覽器安全政策阻擋，需要用戶與網頁互動：", error);
                });
            }, 150);
        }
    });

    // 監聽播放結束事件
    player.on('ended', () => {
        console.log("🎥 目前影片播放結束。");
        const autoplayToggle = document.getElementById("autoplay-next-toggle");
        const shouldAutoplay = autoplayToggle ? autoplayToggle.checked : true;

        if (shouldAutoplay) {
            console.log("🚀 自動連播已啟用，載入下一首...");
            playNextVideo();
        } else {
            console.log("⏹️ 自動連播已停用。");
        }
    });
}

/**
 * 初始化 Plyr (首次載入頁面時)
 */
function initPlyr() {
    setupPlyrInstance();
    // 首次進入時載入第 0 部影片，預設不自動播放
    loadVideo(0, false);
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

        const srcUrl = video.sources && video.sources[0] && video.sources[0].src;
        const isYoutube = video.sources && video.sources[0] && video.sources[0].provider === 'youtube';
        const isHls = srcUrl && (srcUrl.endsWith(".m3u8") || srcUrl.includes(".m3u8"));
        
        let tagText = '4K MP4';
        if (isYoutube) tagText = 'YouTube 4K';
        else if (isHls) tagText = 'ABR 串流';
        
        // 若無時長欄位則不渲染黑色時長標籤
        const durationHtml = video.duration ? `<span class="card-duration">${video.duration}</span>` : '';

        card.innerHTML = `
            <div class="card-thumb-wrapper">
                <img class="card-thumb" src="${video.thumbnail}" alt="${video.title}">
                <div class="card-play-overlay">
                    <svg class="play-icon-mini" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
                ${durationHtml}
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
 * 載入影片 (支援跨訊源智能重建播放器，整合 hls.js 自適應串流解碼與畫質選單切換)
 */
function loadVideo(index, autoplay = true) {
    if (index < 0 || index >= videoPlaylist.length) return;

    // 紀錄換片前的全螢幕狀態，以便在新播放器載入就緒後自動重返全螢幕
    const wasFullscreen = player && player.fullscreen.active;
    const playerWrapper = document.querySelector(".player-wrapper");
    if (wasFullscreen) {
        keepFullscreen = true;
        // 🛡️ 核心黑科技：在銷毀 Plyr 前，手動讓最外層 wrapper 進入原生全螢幕接管，確保換片時瀏覽器不退出全螢幕！
        if (playerWrapper && document.fullscreenElement !== playerWrapper) {
            try {
                playerWrapper.requestFullscreen().catch(err => {
                    console.log("原生全螢幕接管受限：", err);
                });
            } catch (e) {}
        }
    }

    // 拉起優雅的黑底加載遮罩，掩蓋切換訊源時 DOM 摧毀重建的閃爍
    showPlayerLoader();

    currentVideoIndex = index;
    const video = videoPlaylist[index];

    document.getElementById("current-video-title").textContent = video.title;

    // 確定目標類型
    const srcUrl = video.sources && video.sources[0] && video.sources[0].src;
    const isYoutube = video.sources && video.sources[0] && video.sources[0].provider === 'youtube';
    const isHls = srcUrl && (srcUrl.endsWith(".m3u8") || srcUrl.includes(".m3u8"));
    const targetType = isHls ? "hls" : (isYoutube ? "youtube" : "mp4");

    // 動態標記是否為 YouTube 播放，以利 CSS 進行比例自適應分流並設定動態高寬比
    const playerWrapper = document.querySelector(".player-wrapper");
    const videoRatio = video.ratio || "16:9";
    if (playerWrapper) {
        if (targetType === "youtube") {
            playerWrapper.classList.add("youtube-active");
            playerWrapper.style.aspectRatio = videoRatio.replace(":", " / ");
            // 同時動態設定 Plyr 的影片比例變數以擠掉 iframe 內部黑邊
            const plyrEl = document.querySelector(".plyr");
            if (plyrEl) {
                plyrEl.style.setProperty("--plyr-video-aspect-ratio", videoRatio.replace(":", "/"));
            }
        } else {
            playerWrapper.classList.remove("youtube-active");
            playerWrapper.style.aspectRatio = "auto";
        }
    }

    const accessBadge = document.getElementById("video-access-badge");
    if (isYoutube) {
        accessBadge.textContent = "YouTube Player";
        accessBadge.className = "meta-tag resolution";
    } else if (isHls) {
        accessBadge.textContent = "自適應串流 (ABR)";
        accessBadge.className = "meta-tag resolution";
    } else {
        accessBadge.textContent = "Cloudflare R2 (4K)";
        accessBadge.className = "meta-tag access";
    }

    // 每次載入時，先安全銷毀可能存在的舊 hlsInstance
    if (hlsInstance) {
        try {
            hlsInstance.destroy();
            hlsInstance = null;
        } catch (e) {
            console.warn("銷毀舊 HLS 實例出錯:", e);
        }
    }

    // 🛡️ 智能重建：如果訊源類型發生轉換，或者即將播 HLS 串流，均執行重建以獲取乾淨的 DOM 與事件綁定
    const isTypeChanged = currentPlayerType !== targetType;
    if (isTypeChanged || targetType === "hls") {
        console.log(`🔄 訊源類型轉換或進入 HLS (${currentPlayerType} -> ${targetType})，正在重建播放器...`);
        if (player) {
            try {
                player.destroy();
            } catch (e) {
                console.warn("銷毀舊 Plyr 實例失敗:", e);
            }
        }
        // 重建為乾淨的 HTML5 video 標籤
        const wrapper = document.querySelector(".player-wrapper");
        wrapper.innerHTML = `<video id="player" playsinline controls></video>`;
        
        // 如果不是 HLS，在此處可以直接初始化 Plyr；若是 HLS，則延後到 MANIFEST_PARSED 後實例化
        if (targetType !== "hls") {
            setupPlyrInstance();
        }
    }

    // 更新目前播放器類型
    currentPlayerType = targetType;

    // 設定訊源後，若需要 autoplay，則將 flag 設為 true，交由 ready 事件或 hls 就緒時觸發播放
    shouldPlayAfterReady = autoplay;

    if (targetType === "hls") {
        const videoEl = document.getElementById("player");
        hlsInstance = new Hls({
            autoStartLoad: true,
            capLevelToPlayerSize: true // 自動根據播放視窗大小限制最高畫質，優化頻寬
        });
        hlsInstance.loadSource(srcUrl);
        hlsInstance.attachMedia(videoEl);

        // 監聽 HLS 多畫質清單解析完畢
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
            // 讀取所有可用的解析度高度 (例如 [1080, 720, 480])
            const availableQualities = hlsInstance.levels.map(l => l.height);
            // options 加入 0 代表「自動 (Auto)」畫質
            const qualityOptions = [0, ...availableQualities];

            // 實例化 Plyr 並綁定自適應畫質選單切換
            setupPlyrInstance({
                settings: ['quality', 'speed'],
                quality: {
                    default: 0, // 預設為 Auto 自動
                    options: qualityOptions,
                    forced: true,
                    onChange: (newQuality) => {
                        if (newQuality === 0) {
                            hlsInstance.currentLevel = -1; // ABR 自動調適
                            console.log("ABR 自適應畫質切換為：自動 (Auto)");
                        } else {
                            const levelIdx = hlsInstance.levels.findIndex(l => l.height === newQuality);
                            if (levelIdx !== -1) {
                                hlsInstance.currentLevel = levelIdx; // 手動切換
                                console.log(`畫質手動切換為：${newQuality}p`);
                            }
                        }
                    }
                },
                i18n: {
                    qualityLabel: {
                        0: '自動'
                    }
                }
            });
        });

    } else {
        // YouTube 或普通 MP4 播放流程
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

        // 如果是 MP4 (HTML5 Video) 且沒有進行跨類型重建，則手動呼叫 play，確保 HTML5 切換訊源成功播放
        if (targetType === "mp4" && autoplay && !isTypeChanged) {
            setTimeout(() => {
                player.play().then(() => {
                    setTimeout(hidePlayerLoader, 200);
                }).catch(error => {
                    console.log("HTML5 播放被阻擋：", error);
                    setTimeout(hidePlayerLoader, 200);
                });
            }, 50);
        } else if (!isTypeChanged) {
            // 如果同類型切換 (無重建) 且不自動播放，也需要手動隱藏 loader
            setTimeout(hidePlayerLoader, 250);
        }
    }

    // 如果沒有跨類型重建，則在 loadVideo 結尾直接手動觸發全螢幕狀態還原
    if (!isTypeChanged && keepFullscreen) {
        keepFullscreen = false;
        setTimeout(() => {
            try {
                player.fullscreen.enter();
            } catch (e) {
                console.warn("自動還原全螢幕失敗:", e);
            }
        }, 150);
    }

    const cards = document.querySelectorAll(".playlist-card");
    cards.forEach(card => card.classList.remove("active"));
    
    const activeCard = document.getElementById(`card-${index}`);
    if (activeCard) {
        activeCard.classList.add("active");
        activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
        // 清除後台按鈕與表單的顯示狀態，以防下次點開殘留
        document.getElementById("btn-delete-current-playlist").classList.add("hidden");
        document.getElementById("playlist-add-video-container").classList.add("hidden");
        
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

// 渲染左側播放清單表格 (移除直接刪除的按鈕，安全移至右側編輯區內；並生成美觀的 Hash 分享連結)
function renderAdminPlaylists() {
    const playlistContainer = document.getElementById("admin-playlist-list");
    playlistContainer.innerHTML = "";

    allPlaylists.forEach(playlist => {
        const tr = document.createElement("tr");
        
        // 取得乾淨的路徑 (去除 index.html)
        let cleanPath = window.location.pathname;
        if (cleanPath.endsWith("index.html")) {
            cleanPath = cleanPath.substring(0, cleanPath.length - 10);
        }
        const currentOrigin = window.location.origin + cleanPath;
        // 產生更精簡美觀的 Hash 連結：http://.../player/#clientA
        const playlistUrl = `${currentOrigin}#${playlist.id}`;

        tr.innerHTML = `
            <td>
                <strong>${playlist.name}</strong><br>
                <small style="color: var(--text-secondary)">ID: ${playlist.id}</small>
            </td>
            <td>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <button class="btn-primary" style="padding: 6px 8px; font-size: 11px;" onclick="selectPlaylistToEdit('${playlist.id}')">✏️ 編輯影片</button>
                    <button class="btn-primary" style="padding: 6px 8px; font-size: 11px; background: #4b5563; color: #fff;" onclick="copyShareUrl('${playlistUrl}')">📋 複製連結</button>
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
    if (!confirm(`確定要刪除整個清單 "${id}" 嗎？此操作無法還原。`)) return;
    allPlaylists = allPlaylists.filter(pl => pl.id !== id);
    saveToLocalStorage();
    renderAdminPlaylists();
    
    if (editingPlaylistId === id) {
        editingPlaylistId = null;
        document.getElementById("editing-playlist-title").textContent = "請選擇左側清單";
        document.getElementById("playlist-add-video-container").classList.add("hidden");
        document.getElementById("btn-delete-current-playlist").classList.add("hidden");
        document.getElementById("admin-playlist-videos").innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 30px;">請點選左側清單的「編輯影片」按鈕開始管理</td></tr>`;
    }
    
    refreshExportCode();
}

// 供右側頂部「刪除此清單」按鈕呼叫的接口
function deleteCurrentPlaylist() {
    if (editingPlaylistId) {
        deletePlaylist(editingPlaylistId);
    }
}

// 複製專屬連結
function copyShareUrl(url) {
    navigator.clipboard.writeText(url).then(() => {
        alert("📋 免密分享連結已複製到您的剪貼簿：\n" + url);
    }).catch(err => {
        alert("複製失敗，請手動複製此網址：\n" + url);
    });
}

// 選擇播放清單進行右側影片與順序編輯 (將新增影片表單展露於右側頂部)
function selectPlaylistToEdit(id) {
    editingPlaylistId = id;
    const playlist = allPlaylists.find(pl => pl.id === id);
    if (!playlist) return;

    // 展露新增影片容器
    document.getElementById("playlist-add-video-container").classList.remove("hidden");
    
    // 顯露右側「刪除此清單」按鈕
    document.getElementById("btn-delete-current-playlist").classList.remove("hidden");
    
    // 更新右側管理標題
    document.getElementById("editing-playlist-title").textContent = playlist.name;

    renderAdminPlaylistVideos();
}

// 切換左側新增影片表單的摺疊縮放狀態
function toggleAddVideoForm() {
    const form = document.getElementById("add-video-form");
    const icon = document.getElementById("add-video-collapse-icon");
    if (form.style.display === "none" || form.style.display === "") {
        form.style.display = "block";
        icon.textContent = "[收起]";
    } else {
        form.style.display = "none";
        icon.textContent = "[展開]";
    }
}

// 渲染選中清單內的影片列表 (加固對 sources 欄位遺留舊資料的空值防禦)
function renderAdminPlaylistVideos() {
    const listBody = document.getElementById("admin-playlist-videos");
    listBody.innerHTML = "";

    const playlist = allPlaylists.find(pl => pl.id === editingPlaylistId);
    if (!playlist || !playlist.videos || playlist.videos.length === 0) {
        listBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 30px;">目前此清單尚無任何影片。請在上方新增！</td></tr>`;
        return;
    }

    playlist.videos.forEach((video, index) => {
        const hasSource = video.sources && video.sources[0];
        const isYoutube = hasSource && video.sources[0].provider === 'youtube';
        const typeLabel = isYoutube ? "YouTube" : "MP4";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <img src="${video.thumbnail}" style="width: 50px; aspect-ratio: 16/9; object-fit: cover; flex-shrink: 0;">
                    <span style="font-weight: 500;">${video.title}</span>
                </div>
            </td>
            <td><span class="meta-tag codec" style="font-size: 10px; padding: 2px 6px;">${typeLabel}</span></td>
            <td>
                <div style="display: flex; gap: 4px;">
                    <button class="btn-admin-portal" style="padding: 4px 8px; font-size: 11px;" onclick="moveVideoUp(${index})" ${index === 0 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}>↑</button>
                    <button class="btn-admin-portal" style="padding: 4px 8px; font-size: 11px;" onclick="moveVideoDown(${index})" ${index === playlist.videos.length - 1 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : ''}>↓</button>
                </div>
            </td>
            <td>
                <button onclick="removeVideoFromPlaylist(${index})" style="background: none; border: none; color: #ef4444; font-size: 18px; cursor: pointer; padding: 4px 8px; font-weight: bold; transition: var(--transition-smooth);" onmouseover="this.style.color='#b91c1c'" onmouseout="this.style.color='#ef4444'">✕</button>
            </td>
        `;
        listBody.appendChild(tr);
    });
}

// 新增影片到播放清單 (不需填寫時長，支援 YouTube 自動抓取資料，加載健壯防禦)
function addVideoToPlaylist(event) {
    event.preventDefault();
    if (!editingPlaylistId) return;

    try {
        const titleInput = document.getElementById("new-video-title");
        const thumbnailInput = document.getElementById("new-video-thumb");
        const providerInput = document.getElementById("new-video-provider");
        const srcInput = document.getElementById("new-video-src");

        const title = titleInput.value.trim();
        const thumbnail = thumbnailInput.value.trim();
        const provider = providerInput.value;
        const src = srcInput.value.trim();
        const ratioInput = document.getElementById("new-video-ratio");
        const ratio = ratioInput ? ratioInput.value : "16:9";

        const playlist = allPlaylists.find(pl => pl.id === editingPlaylistId);
        if (!playlist) {
            alert("找不到當前正在編輯的播放清單，請點選左側「編輯影片」重試。");
            return;
        }

        const finalSrc = provider === "youtube" ? extractYoutubeId(src) : src;

        const newVideo = {
            id: `vid-${Date.now()}`,
            title: title,
            duration: "", // 移除時長，設定為空
            thumbnail: thumbnail,
            ratio: ratio,
            sources: [
                provider === "youtube"
                ? { src: finalSrc, provider: "youtube" }
                : { src: finalSrc, type: "video/mp4", size: 2160 }
            ]
        };

        playlist.videos.push(newVideo);
        saveToLocalStorage();
        renderAdminPlaylistVideos();
        
        // 重設表單與提示狀態
        document.getElementById("add-video-form").reset();
        toggleProviderInput();
        
        refreshExportCode();
        alert("🎉 影片新增成功！新影片已放入清單底部。");
    } catch (error) {
        console.error("新增影片發生錯誤:", error);
        alert(`❌ 新增影片失敗，詳細錯誤：${error.message}`);
    }
}

// 當 YouTube 網址/ID 輸入框失去焦點時，自動向 oEmbed API 抓取標題與封面圖
async function handleVideoSrcBlur() {
    const provider = document.getElementById("new-video-provider").value;
    const srcInput = document.getElementById("new-video-src");
    const urlOrId = srcInput.value.trim();

    if (provider !== "youtube" || !urlOrId) return;

    const ytId = extractYoutubeId(urlOrId);
    srcInput.value = ytId; // 幫管理員自動收束成乾淨的 11 字元 ID

    const titleInput = document.getElementById("new-video-title");
    const thumbInput = document.getElementById("new-video-thumb");

    // 提示正在抓取
    titleInput.value = "⏳ 正在自動抓取影片標題...";
    thumbInput.value = "⏳ 正在自動抓取封面圖...";

    try {
        // 使用 noembed 提供的免費且支援 CORS 的 YouTube oEmbed 轉接服務
        const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${ytId}`);
        if (res.ok) {
            const data = await res.json();
            if (data.title) {
                titleInput.value = data.title;
            } else {
                titleInput.value = "";
            }
            if (data.thumbnail_url) {
                thumbInput.value = data.thumbnail_url;
            } else {
                thumbInput.value = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
            }
        } else {
            throw new Error("oEmbed fetch failed");
        }
    } catch (err) {
        console.warn("自動讀取 YouTube Metadata 失敗，退回手動輸入:", err);
        titleInput.value = "";
        thumbInput.value = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
        alert("無法自動抓取此 YouTube 影片資料（可能為私人影片或地區限制），請手動輸入影片標題與封面。");
    }
}

// 提取 YouTube 的 11 位字元影片 ID
function extractYoutubeId(url) {
    url = url.trim();
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
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

// 載入 GitHub 設定 (整合對稱加密 Token 自動帶入機制)
function loadGitHubSettings() {
    const pat = localStorage.getItem('owldio_github_pat') || '';
    const repo = localStorage.getItem('owldio_github_repo') || 'owldio/Owldoge';
    const branch = localStorage.getItem('owldio_github_branch') || 'main';

    document.getElementById("github-repo").value = repo;
    document.getElementById("github-branch").value = branch;

    if (pat) {
        document.getElementById("github-pat").value = pat;
    } else if (serverEncryptedToken) {
        // 本地無明文 Token，但有伺服器加密密文 ➔ 嘗試以管理密碼解密
        try {
            const adminPass = sessionStorage.getItem("owldio_admin_pass");
            if (adminPass) {
                const bytes = CryptoJS.AES.decrypt(serverEncryptedToken, adminPass);
                const decryptedPat = bytes.toString(CryptoJS.enc.Utf8);
                if (decryptedPat && decryptedPat.startsWith("ghp_")) {
                    document.getElementById("github-pat").value = decryptedPat;
                }
            }
        } catch (e) {
            console.warn("自動解密 Token 失敗，可能密碼不同或密文損毀", e);
        }
    }
}

// 刷新 config.json 程式碼預覽 (包含加密後的 Token 密文)
function refreshExportCode() {
    const codeBlock = document.getElementById("code-export-output");
    const fullConfig = {
        encryptedToken: serverEncryptedToken,
        playlists: allPlaylists
    };
    codeBlock.textContent = JSON.stringify(fullConfig, null, 2);
}

// 一鍵同步到 GitHub (同步前以 AES 將 Token 加密後包裝進 JSON，兼顧安全與便利)
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

    // 使用當前登入的密碼 (owl2026) 作為金鑰進行 AES 加密
    let encryptedToken = serverEncryptedToken;
    const adminPass = sessionStorage.getItem("owldio_admin_pass") || "owl2026";
    if (pat && pat.startsWith("ghp_")) {
        try {
            encryptedToken = CryptoJS.AES.encrypt(pat, adminPass).toString();
            serverEncryptedToken = encryptedToken; // 更新記憶體中的密文
        } catch (e) {
            console.error("Token 加密失敗:", e);
        }
    }

    const fullConfig = {
        encryptedToken: encryptedToken,
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
    localStorage.removeItem('owldio_visited_history');
    sessionStorage.clear();
    alert("已重設，即將重新整理網頁！");
    window.location.reload();
}

// 儲存播放清單造訪歷史
function saveVisitedHistory(id, name) {
    let history = [];
    try {
        const localHistory = localStorage.getItem("owldio_visited_history");
        if (localHistory) {
            history = JSON.parse(localHistory);
        }
    } catch (e) {}

    // 過濾重複、將最新的放最前
    history = history.filter(item => item.id !== id);
    history.unshift({ id, name, time: Date.now() });

    // 最多留 5 筆
    if (history.length > 5) {
        history = history.slice(0, 5);
    }

    localStorage.setItem("owldio_visited_history", JSON.stringify(history));
}

// 渲染歡迎頁面的造訪歷史紀錄
function renderVisitedHistory() {
    const listDiv = document.getElementById("visited-playlists-list");
    if (!listDiv) return;

    let history = [];
    try {
        const localHistory = localStorage.getItem("owldio_visited_history");
        if (localHistory) {
            history = JSON.parse(localHistory);
        }
    } catch (e) {}

    if (history.length === 0) {
        listDiv.innerHTML = `<p style="font-size: 12px; color: var(--text-muted); text-align: left; line-height: 1.5; margin-bottom: 0;">目前本機尚無最近造訪紀錄。<br>請點擊您的專用分享網址造訪播放清單。</p>`;
        return;
    }

    listDiv.innerHTML = "";
    history.forEach(item => {
        const btn = document.createElement("button");
        btn.className = "btn-admin-portal";
        btn.style.width = "100%";
        btn.style.textAlign = "left";
        btn.style.padding = "10px 14px";
        btn.style.fontSize = "13px";
        btn.style.marginBottom = "4px";
        btn.style.display = "flex";
        btn.style.justifyContent = "space-between";
        btn.style.alignItems = "center";
        btn.innerHTML = `<span>📂 <strong>${item.name}</strong></span> <span style="font-size: 11px; color: var(--text-muted);">#${item.id}</span>`;
        btn.onclick = () => {
            window.location.hash = item.id;
            window.location.reload();
        };
        listDiv.appendChild(btn);
    });
}

// 導向管理後台
function navigateToAdmin(event) {
    event.preventDefault();
    window.location.hash = "login";
    window.location.reload();
}

// 1. 全域鍵盤快捷鍵：按 F/f 切換全螢幕
function setupKeyboardShortcuts() {
    document.addEventListener("keydown", (event) => {
        // 避免在輸入框打字時誤觸
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.tagName === "SELECT")) {
            return;
        }

        // 使用 event.code === "KeyF" 來捕捉實體按鍵的位置，即使切換成中文輸入法也能完美觸發全螢幕
        if (event.code === "KeyF" || event.key === "f" || event.key === "F") {
            if (player) {
                event.preventDefault();
                player.fullscreen.toggle();
            }
        }
    });
}

// 2. 手機雙擊影片左側快退 10 秒、右側快進 10 秒 (ABR/MP4)
function setupDoubleTapToSeek() {
    const container = document.querySelector(".player-wrapper");
    if (!container) return;

    let lastTap = 0;
    container.addEventListener("touchstart", (e) => {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;
        if (now - lastTap < DOUBLE_TAP_DELAY) {
            // 雙擊命中
            handleSeekTap(e);
        }
        lastTap = now;
    }, { passive: false });

    function handleSeekTap(e) {
        if (!player) return;

        // 當前如果是 YouTube 訊源，由於 Iframe 的交互限制，觸摸主要是對 MP4/HLS 原生 Video 體驗最佳
        const rect = container.getBoundingClientRect();
        const touch = e.touches[0] || e.changedTouches[0];
        const touchX = touch.clientX - rect.left; // 相對於容器的 X 坐標
        const width = rect.width;

        const isLeft = touchX < (width * 0.4); // 點擊在左側 40% 區間
        const isRight = touchX > (width * 0.6); // 點擊在右側 60% 區間

        if (isLeft) {
            e.preventDefault();
            player.currentTime = Math.max(0, player.currentTime - 10);
            showSeekFeedback("left");
        } else if (isRight) {
            e.preventDefault();
            player.currentTime = Math.min(player.duration || 9999, player.currentTime + 10);
            showSeekFeedback("right");
        }
    }
}

// 3. 顯示雙擊 Seeking 的光暈與文字反饋
function showSeekFeedback(direction) {
    const elId = direction === "left" ? "seek-feedback-left" : "seek-feedback-right";
    const el = document.getElementById(elId);
    if (!el) return;

    // 移除舊的 animate 類別以重置動畫
    el.classList.remove("animate");
    // 強制重繪 (Trigger reflow)
    void el.offsetWidth;
    // 加上 animate 類別
    el.classList.add("animate");
}

// 4. 顯示與隱藏影片載入遮罩
function showPlayerLoader() {
    const loader = document.getElementById("player-loading-overlay");
    if (loader) {
        loader.classList.remove("hidden");
        void loader.offsetWidth;
        loader.classList.add("active");
    }
}

function hidePlayerLoader() {
    const loader = document.getElementById("player-loading-overlay");
    if (loader) {
        loader.classList.remove("active");
        setTimeout(() => {
            if (!loader.classList.contains("active")) {
                loader.classList.add("hidden");
            }
        }, 300);
    }
}
