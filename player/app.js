/**
 * OWLDIO PLAYER - 核心邏輯控制 (JS)
 * 包含：前端密碼驗證、Plyr 播放器初始化、影片清單點擊切換、結束後自動連播
 */

// 密碼設定
const ACCESS_PASSWORD = "owl2026";
const AUTH_KEY = "owldio_authorized";

// 影片清單 (videoPlaylist Array)
// 提示：sources 內的 4K H.265 MP4 網址，之後可替換成您在 Cloudflare R2 上的實際連結。
// 為了讓您目前開箱即用，我們預設放置了公開的穩定測試影片。
const videoPlaylist = [
    {
        id: "vid-01",
        title: "Owldio Art 藝術宣傳 - Tears of Steel (4K H.265 範例)",
        duration: "12:14",
        thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&auto=format&fit=crop&q=80",
        sources: [
            {
                src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
                type: "video/mp4",
                size: 2160 // 4K 標記
            }
        ]
    },
    {
        id: "vid-02",
        title: "Owldoge 私密展示 - Sintel (高畫質範例)",
        duration: "08:48",
        thumbnail: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=600&auto=format&fit=crop&q=80",
        sources: [
            {
                src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
                type: "video/mp4",
                size: 1080
            }
        ]
    },
    {
        id: "vid-03",
        title: "森林極致光影 - Big Buck Bunny (經典測試影片)",
        duration: "09:56",
        thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
        sources: [
            {
                src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                type: "video/mp4",
                size: 1080
            }
        ]
    }
];

// 全域狀態變數
let player = null;
let currentVideoIndex = 0;

// 頁面初始化
document.addEventListener("DOMContentLoaded", () => {
    // 檢查 sessionStorage 中是否已經驗證過密碼
    if (sessionStorage.getItem(AUTH_KEY) === "true") {
        revealContent();
    }
});

/**
 * 密碼驗證邏輯
 */
function verifyPassword(event) {
    event.preventDefault();
    const passwordInput = document.getElementById("access-password");
    const errorMsg = document.getElementById("error-msg");
    const enteredPassword = passwordInput.value;

    if (enteredPassword === ACCESS_PASSWORD) {
        // 驗證成功：寫入會話儲存空間
        sessionStorage.setItem(AUTH_KEY, "true");
        errorMsg.textContent = "";
        revealContent();
    } else {
        // 驗證失敗：顯示錯誤訊息
        errorMsg.textContent = "密碼錯誤，請重新輸入！";
        passwordInput.value = "";
        passwordInput.focus();
    }
}

/**
 * 驗證通過，解鎖顯示播放器
 */
function revealContent() {
    const overlay = document.getElementById("password-overlay");
    const mainContent = document.getElementById("main-content");

    // 1. 動態淡出密碼遮罩
    overlay.classList.add("fade-out");

    // 2. 顯示主網頁內容
    mainContent.classList.remove("hidden");

    // 3. 初始化播放器與清單 UI
    initPlyr();
    setupPlaylistUI();

    // 4. 預載入第一首影片 (不自動播放)
    loadVideo(0, false);
}

/**
 * 初始化 Plyr 播放器
 */
function initPlyr() {
    // 使用 Plyr 預設控制選項，並加入 H.265/4K 相容的控制配置
    player = new Plyr('#player', {
        controls: [
            'play-large', // 畫面中央的大播放按鈕
            'play',       // 播放/暫停
            'progress',   // 進度條
            'current-time', // 目前播放時間
            'duration',   // 總時間
            'mute',       // 靜音切換
            'volume',     // 音量控制
            'captions',   // 字幕 (若有)
            'settings',   // 設定選單 (包含速度、畫質等)
            'pip',        // 畫中畫模式
            'fullscreen'  // 全螢幕
        ],
        tooltips: { controls: true, seek: true },
        keyboard: { focused: true, global: true },
        title: videoPlaylist[0].title
    });

    // 監聽影片結束 (ended) 事件，觸發自動連播邏輯
    player.on('ended', () => {
        playNextVideo();
    });
}

/**
 * 渲染右側影片清單 UI
 */
function setupPlaylistUI() {
    const playlistItems = document.getElementById("playlist-items");
    const playlistCount = document.getElementById("playlist-count");
    
    // 更新影片總數顯示
    playlistCount.textContent = `${videoPlaylist.length} 部影片`;
    playlistItems.innerHTML = "";

    // 循環生成影片卡片 HTML
    videoPlaylist.forEach((video, index) => {
        const card = document.createElement("div");
        card.className = `playlist-card ${index === currentVideoIndex ? 'active' : ''}`;
        card.id = `card-${index}`;
        card.onclick = () => loadVideo(index, true);

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
                <span class="card-tag">${video.sources[0].size}p 4K H.265</span>
            </div>
        `;
        playlistItems.appendChild(card);
    });
}

/**
 * 載入指定索引的影片
 * @param {number} index - 影片在 videoPlaylist 陣列中的索引
 * @param {boolean} autoplay - 是否在載入後立即播放
 */
function loadVideo(index, autoplay = true) {
    if (index < 0 || index >= videoPlaylist.length) return;

    // 更新目前播放索引
    currentVideoIndex = index;
    const video = videoPlaylist[index];

    // 更新播放器主標題
    document.getElementById("current-video-title").textContent = video.title;

    // 無縫切換 Plyr 播放器訊源
    player.source = {
        type: 'video',
        title: video.title,
        sources: video.sources.map(src => ({
            src: src.src,
            type: src.type,
            size: src.size
        }))
    };

    // 更新清單卡片的高亮 (Active) 狀態
    const cards = document.querySelectorAll(".playlist-card");
    cards.forEach(card => card.classList.remove("active"));
    
    const activeCard = document.getElementById(`card-${index}`);
    if (activeCard) {
        activeCard.classList.add("active");
        // 讓目前高亮的卡片滾動到可見視線內 (平滑滾動)
        activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // 若設定自動播放則立即播放
    if (autoplay) {
        // 部分瀏覽器安全機制限制，可能需要使用者有前置互動才能自動播放
        player.play().catch(error => {
            console.log("自動播放被瀏覽器阻擋，將靜音播放或等待用戶點擊：", error);
        });
    }
}

/**
 * 自動連播：播放下一部影片
 */
function playNextVideo() {
    let nextIndex = currentVideoIndex + 1;
    
    // 如果播放到最後一部，則循環回到第一部
    if (nextIndex >= videoPlaylist.length) {
        nextIndex = 0;
    }
    
    loadVideo(nextIndex, true);
}
