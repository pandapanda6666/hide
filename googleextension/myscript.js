(function() {
    // JSON 部分：直接寫在 JS 的變數裡
    let myntConfig = {
        name: "PandaPanda",
        inputMode: "search",
        clockStyle: "digital",
        clockFont: "tetris", 
        themeColor: "#0061a4",
        clockColor: "#1a1c1e",
        bgColor: "#fdfcff",
        bgMode: "none",
        engine: "google",
        shortcuts: [
            { name: "YouTube", url: "https://youtube.com" },
            { name: "GitHub", url: "https://github.com" }
        ],
        todos: []
    };

    // 防止重複執行，再次點擊即可隱藏或顯示
    if (document.getElementById('mynt-ai-home-iframe')) {
        const existing = document.getElementById('mynt-ai-home-iframe');
        existing.style.display = existing.style.display === 'none' ? 'block' : 'none';
        return;
    }

    // HTML 部分：用 JS 動態建立一個 iframe 塞進網頁
    const iframe = document.createElement('iframe');
    iframe.id = 'mynt-ai-home-iframe';
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100vw';
    iframe.style.height = '100vh';
    iframe.style.zIndex = '2147483647'; // 確保覆蓋在最上層
    iframe.style.border = 'none';
    iframe.style.backgroundColor = '#fdfcff';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument;
    doc.open();
    doc.write(`
        <!DOCTYPE html>
        <html lang="zh-Hant">
        <head>
            <meta charset="UTF-8">
            <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Quicksand:wght@400;600&family=Silkscreen&family=VT323&display=swap" rel="stylesheet">
            <style>
                :root {
                    --m3-surface: #fdfcff;
                    --m3-on-surface: #1a1c1e;
                    --m3-primary: #0061a4;
                    --m3-primary-container: #d1e4ff;
                    --m3-surface-variant: #dfe2eb;
                    --m3-outline: #73777f;
                    --m3-secondary-container: #d3e4ff;
                    --m3-on-secondary-container: #001c3b;
                    --gemini-sparkle: linear-gradient(135deg, #4285f4, #9b72cb, #d96570);
                    --chatgpt-teal: #10a37f;
                    --bg-overlay: rgba(0, 0, 0, 0);
                    --custom-clock-font: 'Orbitron', sans-serif;
                    --custom-clock-color: #1a1c1e;
                    --custom-bg-color: #fdfcff;
                }

                body {
                    margin: 0; padding: 0;
                    background-color: var(--custom-bg-color);
                    background-size: cover; background-position: center;
                    color: var(--m3-on-surface);
                    font-family: 'Google Sans', Roboto, "PingFang TC", sans-serif;
                    display: flex; flex-direction: column; align-items: center;
                    min-height: 100vh; transition: all 0.5s ease;
                    position: relative; overflow-x: hidden;
                }

                body::before {
                    content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                    background: var(--bg-overlay); z-index: 0; pointer-events: none;
                }

                .content-layer { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; width: 100%; }

                .top-section { margin-top: 5vh; text-align: center; }
                #clock-container { cursor: pointer; transition: transform 0.3s; display: flex; flex-direction: column; align-items: center; }
                #clock-container:hover { transform: scale(1.02); }
                
                #clock-digital { 
                    font-size: 7.5rem; 
                    font-weight: 500; 
                    margin: 0; 
                    letter-spacing: 2px;
                    font-family: var(--custom-clock-font);
                    color: var(--custom-clock-color);
                    text-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    transition: color 0.3s;
                    display: flex;
                    align-items: baseline;
                    justify-content: center;
                }

                .sec-text { font-size: 0.35em; margin-left: 10px; opacity: 0.8; font-weight: 400; }
                
                #clock-analog { display: none; width: 180px; height: 180px; margin-bottom: 10px; }
                
                #clock-tetris-wrapper {
                    display: none; 
                    align-items: flex-end;
                    justify-content: center;
                    gap: 15px;
                    margin-bottom: 10px;
                }
                
                #clock-tetris { width: 500px; height: 160px; }
                #tetris-seconds { 
                    font-size: 2.5rem; 
                    font-weight: bold; 
                    font-family: 'VT323', monospace; 
                    color: var(--custom-clock-color);
                    margin-bottom: 15px; 
                }
                
                #greeting { font-size: 1.6rem; margin-bottom: 30px; opacity: 0.8; }

                .search-area { width: 100%; max-width: 650px; margin-bottom: 40px; }
                .search-engines { display: flex; gap: 10px; margin-bottom: 15px; justify-content: center; }
                .engine-icon { cursor: pointer; padding: 6px 14px; border-radius: 20px; background: var(--m3-surface-variant); font-size: 0.8rem; font-weight: 600; opacity: 0.6; }
                .engine-icon.active { opacity: 1; background: var(--m3-primary); color: white; }

                .search-bar input {
                    width: 100%; box-sizing: border-box; padding: 22px 35px; border-radius: 40px;
                    border: 2px solid var(--m3-outline); background: var(--m3-surface); color: inherit;
                    font-size: 1.2rem; outline: none; transition: all 0.3s;
                }

                .mode-gemini .search-bar input { 
                    border: 3px solid transparent;
                    background: linear-gradient(var(--m3-surface), var(--m3-surface)) padding-box, var(--gemini-sparkle) border-box;
                    box-shadow: 0 0 20px rgba(66, 133, 244, 0.2); 
                }
                
                .mode-chatgpt .search-bar input { 
                    border-color: var(--chatgpt-teal); 
                    box-shadow: 0 0 20px rgba(16, 163, 127, 0.15); 
                    border-radius: 12px;
                }

                .search-bar input:focus { box-shadow: 0 8px 30px rgba(0,0,0,0.15); }

                .ai-hub { display: flex; gap: 15px; margin-bottom: 50px; justify-content: center; }
                .ai-card { display: flex; align-items: center; gap: 10px; background: var(--m3-surface-variant); padding: 12px 24px; border-radius: 24px; text-decoration: none; color: var(--m3-on-surface); font-weight: 600; font-size: 0.9rem; transition: all 0.2s; }
                .ai-card:hover { transform: translateY(-2px); background: var(--m3-primary-container); color: var(--m3-primary); }
                .icon-gemini { width: 18px; height: 18px; background: var(--gemini-sparkle); border-radius: 50%; }
                .icon-chatgpt { width: 18px; height: 18px; background: var(--chatgpt-teal); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold; }

                .main-layout { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; width: 90%; max-width: 1100px; margin-bottom: 80px; }
                .card { background: var(--m3-surface-variant); border-radius: 28px; padding: 24px; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); }
                .card-title { font-size: 0.85rem; font-weight: 700; color: var(--m3-primary); margin-bottom: 15px; text-transform: uppercase; display: flex; justify-content: space-between; align-items: center; }

                #quake-card-trigger { cursor: pointer; transition: transform 0.2s; }
                #quake-card-trigger:hover { transform: scale(1.02); background: var(--m3-primary-container); }

                .shortcuts { display: grid; grid-template-columns: repeat(auto-fill, minmax(65px, 1fr)); gap: 12px; }
                .shortcut-item { display: flex; flex-direction: column; align-items: center; text-decoration: none; color: inherit; transition: transform 0.2s; position: relative; }
                .shortcut-item:hover { transform: scale(1.1); }
                .shortcut-icon { width: 50px; height: 50px; background: var(--m3-secondary-container); color: var(--m3-on-secondary-container); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 5px; font-weight: bold; font-size: 1.1rem; }
                .del-s { position: absolute; top: -5px; right: 0; background: #ff4d4d; color: white; border-radius: 50%; width: 16px; height: 16px; display: none; align-items: center; justify-content: center; font-size: 10px; cursor: pointer; }
                .shortcut-item:hover .del-s { display: flex; }

                #todo-list { list-style: none; padding: 0; margin: 0; max-height: 120px; overflow-y: auto; }
                .todo-item { display: flex; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05); font-size: 0.95rem; }
                .todo-text.done { text-decoration: line-through; opacity: 0.5; }
                #notepad { width: 100%; height: 120px; background: transparent; border: none; color: inherit; resize: none; outline: none; font-size: 1rem; line-height: 1.5; }

                .settings-trigger { position: fixed; bottom: 30px; right: 30px; background: var(--m3-primary-container); color: var(--m3-primary); width: 56px; height: 56px; border-radius: 18px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 100; font-size: 1.5rem; transition: transform 0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
                .settings-trigger:hover { transform: rotate(45deg); }
                
                .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); justify-content: center; align-items: center; z-index: 1000; }
                .modal-content { background: var(--m3-surface); padding: 30px; border-radius: 30px; width: 450px; max-height: 85vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
                
                .setting-row { display: flex; gap: 15px; margin-bottom: 15px; }
                .setting-col { flex: 1; display: flex; flex-direction: column; }
                .setting-item { margin-bottom: 15px; }
                .setting-item label, .setting-col label { display: block; margin-bottom: 8px; font-weight: 600; font-size: 0.9rem; color: var(--m3-primary); }
                
                input[type="text"], select { width: 100%; padding: 10px 15px; border-radius: 12px; border: 1px solid var(--m3-outline); background: rgba(255,255,255,0.05); color: inherit; box-sizing: border-box; font-size: 0.95rem; outline: none; }
                input[type="color"] { width: 100%; height: 45px; border: none; border-radius: 12px; cursor: pointer; padding: 0; background: none; }

                /* 地牛 Wake Up 風格地震儀表板 CSS */
                #quake-dashboard { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); justify-content: center; align-items: center; z-index: 2000; }
                .qk-window { width: 850px; height: 550px; background: #fff; border-radius: 8px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 15px 50px rgba(0,0,0,0.3); font-family: "Microsoft JhengHei", Arial, sans-serif; color: #333; }
                .qk-header { background: #444; color: #fff; padding: 10px 15px; display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem; }
                .qk-close { cursor: pointer; background: transparent; border: none; color: #fff; font-size: 1.2rem; }
                .qk-body { display: flex; flex: 1; overflow: hidden; }
                
                .qk-left { flex: 1; background: #5c8bb5; position: relative; display: flex; justify-content: center; align-items: center; overflow: hidden; }
                .qk-map-svg { width: 100%; height: 95%; opacity: 0.95; }
                .qk-epicenter-marker { position: absolute; top: 38%; left: 62%; color: red; font-size: 2.2rem; transform: translate(-50%, -50%); animation: pulse 1s infinite; text-shadow: 0 0 5px white; display: none; }
                .qk-local-marker { position: absolute; top: 55%; left: 52%; color: red; font-size: 2.2rem; transform: translate(-50%, -50%); font-weight: bold; text-shadow: 0 0 5px white; }
                
                .qk-right { width: 340px; background: #f9f9f9; display: flex; flex-direction: column; border-left: 1px solid #ccc; }
                .qk-tabs { display: flex; border-bottom: 2px solid #ddd; background: #eee; }
                .qk-tab { flex: 1; text-align: center; padding: 12px 0; font-weight: bold; font-size: 1rem; color: #666; cursor: default; }
                .qk-tab.active { background: #fff; color: #cc0000; border-top: 3px solid #cc0000; margin-top: -3px; }
                
                .qk-info-box { padding: 15px; border-bottom: 1px solid #ddd; }
                .qk-info-title { text-align: center; font-size: 1.3rem; margin: 0 0 15px 0; font-weight: bold; color: #222; }
                .qk-grid { display: grid; grid-template-columns: 80px 1fr; gap: 8px; font-size: 0.95rem; }
                .qk-label { color: #555; text-align: right; padding-right: 10px; }
                .qk-value { color: #000; font-weight: 500; }
                
                .qk-local { padding: 15px; flex: 1; display: flex; flex-direction: column; align-items: center; background: #fff; }
                .qk-local-flex { display: flex; width: 100%; justify-content: space-around; margin-top: 10px; }
                .qk-local-item { text-align: center; display: flex; flex-direction: column; align-items: center; }
                .qk-local-head { font-size: 1.1rem; color: #555; margin-bottom: 5px; }
                .qk-local-num { font-size: 4.5rem; font-weight: bold; color: #444; line-height: 1; display: flex; align-items: baseline; }
                .qk-local-unit { font-size: 1.5rem; color: #ccc; margin-left: 5px; font-weight: normal; }
                
                .qk-table-wrapper { height: 100px; background: #fff; border-top: 1px solid #ddd; overflow-y: auto; font-size: 0.8rem; }
                .qk-table { width: 100%; border-collapse: collapse; text-align: center; }
                .qk-table th { background: #eee; padding: 5px; border-bottom: 1px solid #ccc; color: #555; font-weight: normal; }
                .qk-table td { padding: 5px; border-bottom: 1px solid #eee; color: #333; }

                @keyframes pulse {
                    0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                    50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.7; }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }

                footer { margin-top: auto; padding: 25px; font-size: 0.85rem; opacity: 0.6; }
                footer a { color: var(--m3-primary); text-decoration: none; font-weight: bold; cursor: pointer;}
            </style>
        </head>
        <body id="app-body">
            <div class="content-layer">
                <div class="top-section">
                    <div id="clock-container" title="點擊切換時鐘顯示方式">
                        <h1 id="clock-digital">
                            <span id="digital-hm">00:00</span><span id="digital-s" class="sec-text">00</span>
                        </h1>
                        <canvas id="clock-analog" width="180" height="180"></canvas>
                        <div id="clock-tetris-wrapper">
                            <canvas id="clock-tetris" width="500" height="160"></canvas>
                            <div id="tetris-seconds">00</div>
                        </div>
                    </div>
                    <div id="greeting">你好，PandaPanda</div>
                    
                    <div class="search-area">
                        <div class="search-engines" id="engine-list">
                            <span class="engine-icon active" data-engine="google">Google</span>
                            <span class="engine-icon" data-engine="google-ai">AI 搜尋</span>
                            <span class="engine-icon" data-engine="bing">Bing</span>
                            <span class="engine-icon" data-engine="youtube">YouTube</span>
                        </div>
                        <div class="search-bar">
                            <form id="search-form">
                                <input type="text" id="main-input" placeholder="搜尋或詢問 AI..." autofocus autocomplete="off">
                            </form>
                        </div>
                    </div>

                    <div class="ai-hub">
                        <a href="https://gemini.google.com" target="_blank" class="ai-card"><span class="icon-gemini"></span> Gemini</a>
                        <a href="https://chatgpt.com" target="_blank" class="ai-card"><span class="icon-chatgpt">●</span> ChatGPT</a>
                        <a href="https://www.perplexity.ai" target="_blank" class="ai-card">Perplexity</a>
                    </div>
                </div>

                <div class="main-layout">
                    <div class="card" id="quake-card-trigger" title="點擊開啟地牛 Wake Up 儀表板">
                        <div class="card-title">環境狀況</div>
                        <div style="display:flex; align-items:baseline; gap:10px">
                            <span id="temp" style="font-size: 2.5rem; font-weight:500">--°</span>
                            <div id="weather-desc" style="font-size:0.9rem">載入中...</div>
                        </div>
                        <div id="quake-badge" style="margin-top:15px; font-size:0.8rem; padding:8px; border-radius:10px; background:rgba(204,0,0,0.1); color:#cc0000; font-weight:bold;">
                            即時地震監控中... (點擊展開)
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-title">快速捷徑 <button id="btn-add-s" style="border:none; background:none; color:inherit; cursor:pointer; font-size:1.1rem">＋</button></div>
                        <div id="shortcut-container" class="shortcuts"></div>
                    </div>
                    <div class="card">
                        <div class="card-title">待辦清單</div>
                        <div style="display:flex; gap:5px; margin-bottom:10px">
                            <input type="text" id="todo-input" placeholder="新增任務..." style="flex:1; padding:8px; border-radius:10px; border:none; background:rgba(0,0,0,0.05); color:inherit; outline:none">
                            <button id="btn-add-t" style="border:none; background:var(--m3-primary); color:white; border-radius:10px; padding:0 12px; cursor:pointer">＋</button>
                        </div>
                        <ul id="todo-list"></ul>
                    </div>
                    <div class="card" style="grid-column: span 3;">
                        <div class="card-title">快速筆記 (自動儲存)</div>
                        <textarea id="notepad" placeholder="在此記錄靈感..."></textarea>
                    </div>
                </div>

                <footer>
                    版權所有 © 2026 <a href="https://pandapanda6666.github.io" target="_blank">PandaPanda的AI日常</a> All Rights Reserved.
                </footer>
            </div>

            <div class="settings-trigger" id="settings-open">⚙️</div>
            <div class="modal" id="modal-settings">
                <div class="modal-content">
                    <h2 style="margin-top:0">系統高級設定</h2>
                    <div class="setting-row">
                        <div class="setting-col">
                            <label>您的名稱</label>
                            <input type="text" id="set-name">
                        </div>
                        <div class="setting-col">
                            <label>輸入框模式 (套用 AI 視覺)</label>
                            <select id="set-mode">
                                <option value="search">一般搜尋引擎</option>
                                <option value="gemini">Gemini 模式</option>
                                <option value="chatgpt">ChatGPT 模式</option>
                            </select>
                        </div>
                    </div>
                    <div class="setting-row">
                        <div class="setting-col">
                            <label>時鐘字體與樣式</label>
                            <select id="set-clock-font">
                                <option value="tetris">動態彩色俄羅斯方塊</option>
                                <option value="'Orbitron', sans-serif">電子時鐘 (Orbitron)</option>
                                <option value="'VT323', monospace">方塊字 (Pixel)</option>
                                <option value="'Quicksand', sans-serif">普通圓形 (Quicksand)</option>
                                <option value="'Silkscreen', cursive">復古像素 (Retro)</option>
                                <option value="'Google Sans', sans-serif">預設無襯線</option>
                            </select>
                        </div>
                        <div class="setting-col">
                            <label>時鐘顯示模式</label>
                            <select id="set-clock">
                                <option value="digital">文字 / 俄羅斯方塊</option>
                                <option value="analog">經典類比指針</option>
                            </select>
                        </div>
                    </div>
                    <div class="setting-row">
                        <div class="setting-col">
                            <label>主色調</label>
                            <input type="color" id="set-color">
                        </div>
                        <div class="setting-col">
                            <label>時鐘顏色 (限文字/指針)</label>
                            <input type="color" id="set-clock-color">
                        </div>
                        <div class="setting-col">
                            <label>背景顏色</label>
                            <input type="color" id="set-bg-color">
                        </div>
                    </div>
                    <div class="setting-item">
                        <label>背景風格</label>
                        <select id="set-bg">
                            <option value="color">自訂純色</option>
                            <option value="daily">每日隨機桌布</option>
                        </select>
                    </div>
                    <div style="display:flex; gap:10px; margin-top:25px">
                        <button id="settings-save" style="flex:1; padding:12px; border:none; background:var(--m3-primary); color:white; border-radius:15px; cursor:pointer; font-weight:bold">儲存並套用</button>
                        <button id="settings-close" style="flex:1; padding:12px; border:none; background:var(--m3-surface-variant); color:var(--m3-on-surface); border-radius:15px; cursor:pointer">取消</button>
                    </div>
                </div>
            </div>

            <!-- 地牛 Wake Up 風格地震儀表板 -->
            <div id="quake-dashboard">
                <div class="qk-window">
                    <div class="qk-header">
                        <span>地牛Wake Up! (連線即時抓取)</span>
                        <button class="qk-close" id="quake-dash-close">✖</button>
                    </div>
                    <div class="qk-body">
                        <div class="qk-left">
                            <svg class="qk-map-svg" viewBox="0 0 300 400">
                                <g id="taiwan-map">
                                    <polygon points="180,50 200,65 210,80 230,120 220,180 180,260 160,330 140,360 120,380 110,360 110,320 90,260 70,180 80,130 110,90 140,60" fill="#a8e6cf" stroke="#333" stroke-width="1.5"/>
                                    <polygon points="140,60 110,90 130,120 150,110" fill="#a8e6cf" stroke="#333" stroke-width="0.5"/>
                                    <polygon points="110,90 80,130 100,150 130,120" fill="#a8e6cf" stroke="#333" stroke-width="0.5"/>
                                    <polygon points="80,130 70,180 110,190 100,150" fill="#a8e6cf" stroke="#333" stroke-width="0.5"/>
                                    <polygon points="150,110 130,120 100,150 110,190 150,220 180,190 220,180 230,120 210,80 200,65 180,50 140,60" fill="#3cb371" stroke="#333" stroke-width="0.5" id="zone-east"/>
                                    <polygon points="110,190 70,180 90,260 110,320 130,280 150,220" fill="#a8e6cf" stroke="#333" stroke-width="0.5"/>
                                    <polygon points="150,220 130,280 110,320 110,360 120,380 140,360 160,330 180,260 180,190" fill="#a8e6cf" stroke="#333" stroke-width="0.5" id="zone-south"/>
                                </g>
                                <circle cx="210" cy="110" r="40" fill="none" stroke="yellow" stroke-width="2" opacity="0.5" id="p-wave" style="display:none;"/>
                            </svg>
                            
                            <div class="qk-epicenter-marker" id="epicenter-icon">🎯</div>
                            <div class="qk-local-marker" title="您的位置: 八德區">✖</div>
                            
                            <div class="legend-box">
                                <div class="legend-item"><div class="color-box" style="background: #a8e6cf;"></div> 1-2 級</div>
                                <div class="legend-item"><div class="color-box" style="background: #3cb371;"></div> 3-4 級</div>
                                <div class="legend-item"><div class="color-box" style="background: #ffcc00;"></div> 5 弱-5 強</div>
                                <div class="legend-item"><div class="color-box" style="background: #ff6600;"></div> 6 弱-6 強</div>
                                <div class="legend-item"><div class="color-box" style="background: #cc0000;"></div> 7 級</div>
                            </div>
                        </div>
                        
                        <div class="qk-right">
                            <div class="qk-tabs">
                                <div class="qk-tab active">強震即時警報</div>
                                <div class="qk-tab">地震報告</div>
                            </div>
                            <div class="qk-info-box">
                                <h3 class="qk-info-title">震央</h3>
                                <div class="qk-grid">
                                    <div class="qk-label">時間</div><div class="qk-value" id="qk-time">等待連線中...</div>
                                    <div class="qk-label">位置</div><div class="qk-value" id="qk-loc">--</div>
                                    <div class="qk-label">深度</div><div class="qk-value" id="qk-depth">-- 公里</div>
                                    <div class="qk-label">規模</div><div class="qk-value" id="qk-mag">--</div>
                                    <div class="qk-label">最大震度</div><div class="qk-value" id="qk-max-int">--</div>
                                </div>
                            </div>
                            <div class="qk-local">
                                <h3 class="qk-info-title" style="margin-bottom: 5px;">所在地</h3>
                                <div class="qk-local-flex">
                                    <div class="qk-local-item">
                                        <div class="qk-local-head">震度</div>
                                        <div class="qk-local-num"><span id="qk-int">0</span><span class="qk-local-unit">級</span></div>
                                    </div>
                                    <div class="qk-local-item">
                                        <div class="qk-local-head">抵達</div>
                                        <div class="qk-local-num"><span id="qk-arr">0</span><span class="qk-local-unit">秒</span></div>
                                    </div>
                                </div>
                            </div>
                            <div class="qk-table-wrapper">
                                <table class="qk-table">
                                    <thead>
                                        <tr>
                                            <th>編號</th>
                                            <th>發佈時間</th>
                                            <th>規模</th>
                                        </tr>
                                    </thead>
                                    <tbody id="qk-table-body">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);
    doc.close();

    // JS 部分：原本的邏輯 (完全使用 doc 替代 document 操作 iframe 內的元素)
    let previousTimeStr = "";
    let settledBlocks = []; 
    let pieceQueue = []; 
    let activePiece = null; 
    let animationFrameId = null;

    const tetrisBlockSize = 12;
    const digitCols = 6;
    const digitRows = 10;
    const digitWidth = digitCols * tetrisBlockSize; 
    const gap = 15; 
    const tetrisCanvasWidth = 500; 
    const tetrisCanvasHeight = 160;

    let countdownTimer = null;
    let currentSeconds = 0;

    function initApp() {
        const saved = localStorage.getItem('mynt_data_bookmarklet');
        if (saved) myntConfig = { ...myntConfig, ...JSON.parse(saved) };
        doc.getElementById('notepad').value = localStorage.getItem('mynt_note_bookmarklet') || "";
        applyUI();
    }

    function applyUI() {
        const body = doc.getElementById('app-body');
        const root = doc.documentElement;
        
        body.classList.remove('mode-gemini', 'mode-chatgpt');
        if (myntConfig.inputMode === 'gemini') body.classList.add('mode-gemini');
        if (myntConfig.inputMode === 'chatgpt') body.classList.add('mode-chatgpt');

        root.style.setProperty('--m3-primary', myntConfig.themeColor);
        root.style.setProperty('--m3-primary-container', myntConfig.themeColor + "33");
        root.style.setProperty('--custom-clock-color', myntConfig.clockColor);

        const digital = doc.getElementById('clock-digital');
        const analog = doc.getElementById('clock-analog');
        const tetrisWrapper = doc.getElementById('clock-tetris-wrapper');
        
        digital.style.display = 'none';
        analog.style.display = 'none';
        tetrisWrapper.style.display = 'none';

        if (myntConfig.clockStyle === 'analog') {
            analog.style.display = 'block';
        } else {
            if (myntConfig.clockFont === 'tetris') {
                tetrisWrapper.style.display = 'flex';
            } else {
                digital.style.display = 'flex';
                root.style.setProperty('--custom-clock-font', myntConfig.clockFont);
            }
        }

        if (myntConfig.bgMode === 'daily') {
            body.style.backgroundImage = "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80')";
            root.style.setProperty('--bg-overlay', 'rgba(0,0,0,0.4)');
            root.style.setProperty('--m3-on-surface', '#ffffff');
            root.style.setProperty('--custom-clock-color', '#ffffff');
        } else {
            body.style.backgroundImage = 'none';
            root.style.setProperty('--custom-bg-color', myntConfig.bgColor);
            root.style.setProperty('--bg-overlay', 'rgba(0,0,0,0)');
            root.style.setProperty('--m3-on-surface', '#1a1c1e');
        }

        const icons = doc.querySelectorAll('.engine-icon');
        for(let i=0; i<icons.length; i++) {
            if(icons[i].dataset.engine === myntConfig.engine) {
                icons[i].classList.add('active');
            } else {
                icons[i].classList.remove('active');
            }
        }

        const input = doc.getElementById('main-input');
        if (myntConfig.inputMode === 'search') {
            input.placeholder = "以 " + myntConfig.engine + " 搜尋...";
        } else {
            input.placeholder = "詢問 " + (myntConfig.inputMode === 'gemini' ? 'Gemini' : 'ChatGPT') + " AI...";
        }

        renderShortcuts();
        renderTodos();
        
        previousTimeStr = "";
        settledBlocks = [];
        pieceQueue = [];
        activePiece = null;
        updateTimeData();
    }

    function updateTimeData() {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const hmStr = hh + ":" + mm;
        const secStr = String(now.getSeconds()).padStart(2, '0');
        
        doc.getElementById('digital-hm').textContent = hmStr;
        doc.getElementById('digital-s').textContent = secStr;
        doc.getElementById('tetris-seconds').textContent = secStr;

        const hr = now.getHours();
        let greet = "你好";
        if (hr < 12) greet = "早安"; else if (hr < 18) greet = "午安"; else greet = "晚安";
        doc.getElementById('greeting').textContent = greet + "，" + myntConfig.name;

        if (myntConfig.clockStyle !== 'analog' && myntConfig.clockFont === 'tetris') {
            updateTetrisBlocks(hmStr);
        }
    }

    function startAnimationLoop() {
        if (animationFrameId) iframe.contentWindow.cancelAnimationFrame(animationFrameId);
        const aCtx = doc.getElementById('clock-analog').getContext('2d');
        const tCtx = doc.getElementById('clock-tetris').getContext('2d');

        function loop() {
            if (myntConfig.clockStyle === 'analog') {
                drawAnalogClock(aCtx, new Date());
            } else if (myntConfig.clockFont === 'tetris') {
                renderTetrisFrame(tCtx);
            }
            animationFrameId = iframe.contentWindow.requestAnimationFrame(loop);
        }
        loop();
    }

    function drawAnalogClock(ctx, date) {
        ctx.clearRect(0, 0, 180, 180);
        const cx = 90, cy = 90, r = 80;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); 
        ctx.strokeStyle = iframe.contentWindow.getComputedStyle(doc.documentElement).getPropertyValue('--m3-outline');
        ctx.lineWidth = 2; ctx.stroke();
        
        const h = date.getHours(), m = date.getMinutes(), s = date.getSeconds(), ms = date.getMilliseconds();
        const smoothS = s + ms / 1000; 
        drawHand(ctx, cx, cy, (h % 12 + m/60) * 30, r * 0.5, 5, '#444');
        drawHand(ctx, cx, cy, (m + s/60) * 6, r * 0.75, 3, '#666');
        drawHand(ctx, cx, cy, smoothS * 6, r * 0.85, 2, myntConfig.clockColor);
    }

    function drawHand(ctx, x, y, angle, len, width, color) {
        ctx.save(); ctx.beginPath(); ctx.translate(x, y); ctx.rotate((angle - 90) * Math.PI / 180);
        ctx.moveTo(0, 0); ctx.lineTo(len, 0); ctx.lineWidth = width; ctx.strokeStyle = color;
        ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
    }

    const rawMaps6x10 = {
        '0': [
            "AAAABB", "CDEEEF", "CD..FF", "GG..HH", "II..JJ", 
            "KK..LL", "MM..NN", "OO..PP", "QRRRSS", "QTTTUU"
        ],
        '1': [
            "..AA..", "..BB..", "..CC..", "..DD..", "..EE..", 
            "..FF..", "..GG..", "..HH..", "IIJJKK", "LLMMNN"
        ],
        '2': [
            "AAABBB", "CDEEEF", "CD..FF", "GG..HH", "IIJJJJ", 
            "KKLLLL", "MMNN..", "OO....", "PQRRSS", "PQTTUU"
        ],
        '3': [
            "AAABBB", "CDEEEF", "CD..FF", "GG..HH", "..IIJJ", 
            "..KKLL", "MM..NN", "OO..PP", "QRRRSS", "QTTTUU"
        ],
        '4': [
            "AA..BB", "CC..DD", "EE..FF", "GG..HH", "IIJJKK", 
            "LLMMNN", "....OO", "....PP", "....QQ", "....RR"
        ],
        '5': [
            "AAABBB", "CDEEEF", "CD....", "GG....", "HHIIJJ", 
            "KKLLLL", "....MM", "....NN", "OOPPQQ", "ORRRSS"
        ],
        '6': [
            "AAABBB", "CCDEEE", "FFD...", "GGHH..", "IIJJKK", 
            "LLMMNN", "OO..PP", "QQ..RR", "SSTTUU", "VVWWXX"
        ],
        '7': [
            "AAABBB", "CDEEEF", "CD..FF", "....GG", "....HH", 
            "....II", "....JJ", "....KK", "....LL", "....MM"
        ],
        '8': [
            "AAABBB", "CDEEEF", "CD..FF", "GG..HH", "IIJJKK", 
            "LLMMNN", "OO..PP", "QQ..RR", "SSTTUU", "VVWWXX"
        ],
        '9': [
            "AAABBB", "CDEEEF", "CD..FF", "GG..HH", "IIJJKK", 
            "LLMMNN", "....OO", "....PP", "QQ..RR", "SSTTUU"
        ],
        ':': [
            "......", "..AA..", "..BB..", "......", "......", 
            "......", "..CC..", "..DD..", "......", "......"
        ]
    };

    function getPiecesFromMap(mapArray, charIndex, startX, startY) {
        let pieces = [];
        let groups = {};
        for(let r=0; r<digitRows; r++){
            let rowStr = mapArray[r];
            for(let c=0; c<digitCols; c++){
                let char = rowStr[c];
                if (char !== '.') {
                    if (!groups[char]) groups[char] = [];
                    groups[char].push({r, c});
                }
            }
        }

        for (let key in groups) {
            let blocks = groups[key];
            let colorId = Math.floor(Math.random() * 16) + 1; 
            let minC = Math.min(...blocks.map(b => b.c));
            let maxC = Math.max(...blocks.map(b => b.c));
            let spawnOffsetX = (digitCols / 2 - (minC + maxC + 1) / 2) * tetrisBlockSize;
            
            pieces.push({
                colorId, blocks, charIndex, 
                targetX: startX, targetY: startY,
                spawnOffsetX
            });
        }
        return pieces;
    }

    function updateTetrisBlocks(timeStr) {
        if (timeStr === previousTimeStr) return;
        
        let totalWidth = timeStr.length * digitWidth + (timeStr.length - 1) * gap;
        let currentX = (tetrisCanvasWidth - totalWidth) / 2;
        let currentY = 20;

        for (let i = 0; i < timeStr.length; i++) {
            let char = timeStr[i];
            let isNewChar = (char !== previousTimeStr[i]);

            if (isNewChar) {
                settledBlocks = settledBlocks.filter(b => b.charIndex !== i);
                pieceQueue = pieceQueue.filter(p => p.charIndex !== i);
                if (activePiece && activePiece.charIndex === i) activePiece = null;
                
                let map = rawMaps6x10[char];
                if (map) {
                    let newPieces = getPiecesFromMap(map, i, currentX, currentY);
                    newPieces.sort((a,b) => {
                        let maxRa = Math.max(...a.blocks.map(blk=>blk.r));
                        let maxRb = Math.max(...b.blocks.map(blk=>blk.r));
                        if (maxRa !== maxRb) return maxRb - maxRa;
                        let minRa = Math.min(...a.blocks.map(blk=>blk.r));
                        let minRb = Math.min(...b.blocks.map(blk=>blk.r));
                        return minRb - minRa;
                    });
                    pieceQueue.push(...newPieces);
                }
            }
            currentX += digitWidth + gap;
        }
        previousTimeStr = timeStr;
    }

    function renderTetrisFrame(ctx) {
        ctx.clearRect(0, 0, tetrisCanvasWidth, tetrisCanvasHeight);

        for (let b of settledBlocks) {
            drawTetrisBlock(ctx, b.x, b.y, tetrisBlockSize, b.colorId);
        }

        if (!activePiece && pieceQueue.length > 0) {
            activePiece = pieceQueue.shift();
            activePiece.currOffsetX = activePiece.spawnOffsetX;
            activePiece.currOffsetY = -50; 
            activePiece.rot = (Math.floor(Math.random() * 3) + 1) * (Math.PI / 2);
            activePiece.state = 'drop_in'; 
        }

        if (activePiece) {
            let speedX = 6; 
            let speedY = 12; 

            if (Math.abs(activePiece.rot) > 0.01) {
                activePiece.rot += (0 - activePiece.rot) * 0.15;
            } else {
                activePiece.rot = 0;
            }

            if (activePiece.state === 'drop_in') {
                activePiece.currOffsetY += speedY;
                if (activePiece.currOffsetY >= -5) {
                    activePiece.currOffsetY = -5;
                    activePiece.state = 'move_x';
                }
            } else if (activePiece.state === 'move_x') {
                if (Math.abs(activePiece.currOffsetX) <= speedX) {
                    activePiece.currOffsetX = 0;
                    activePiece.state = 'wait';
                    activePiece.waitTimer = 15; 
                } else {
                    activePiece.currOffsetX += (activePiece.currOffsetX < 0) ? speedX : -speedX;
                }
            } else if (activePiece.state === 'wait') {
                activePiece.waitTimer--;
                if (activePiece.waitTimer <= 0) {
                    activePiece.state = 'drop';
                }
            } else if (activePiece.state === 'drop') {
                if (activePiece.currOffsetY + speedY >= 0) { 
                    activePiece.currOffsetY = 0; 
                    activePiece.rot = 0;
                    for (let b of activePiece.blocks) {
                        settledBlocks.push({
                            x: activePiece.targetX + activePiece.currOffsetX + b.c * tetrisBlockSize,
                            y: activePiece.targetY + activePiece.currOffsetY + b.r * tetrisBlockSize,
                            colorId: activePiece.colorId,
                            charIndex: activePiece.charIndex
                        });
                    }
                    activePiece = null; 
                } else {
                    activePiece.currOffsetY += speedY;
                }
            }

            if (activePiece) {
                let minC = Math.min(...activePiece.blocks.map(b => b.c));
                let maxC = Math.max(...activePiece.blocks.map(b => b.c));
                let minR = Math.min(...activePiece.blocks.map(b => b.r));
                let maxR = Math.max(...activePiece.blocks.map(b => b.r));
                let cx = activePiece.targetX + activePiece.currOffsetX + (minC + maxC + 1) * tetrisBlockSize / 2;
                let cy = activePiece.targetY + activePiece.currOffsetY + (minR + maxR + 1) * tetrisBlockSize / 2;

                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(activePiece.rot);
                ctx.translate(-cx, -cy);

                for (let b of activePiece.blocks) {
                    drawTetrisBlock(
                        ctx, 
                        activePiece.targetX + activePiece.currOffsetX + b.c * tetrisBlockSize, 
                        activePiece.targetY + activePiece.currOffsetY + b.r * tetrisBlockSize, 
                        tetrisBlockSize, 
                        activePiece.colorId
                    );
                }
                ctx.restore();
            }
        }
    }

    function drawTetrisBlock(ctx, x, y, size, colorId) {
        const colors = [
            null,
            { base: '#00FFFF', light: '#E0FFFF', dark: '#008080' }, 
            { base: '#0000FF', light: '#8080FF', dark: '#000080' }, 
            { base: '#FFA500', light: '#FFD280', dark: '#cc8400' }, 
            { base: '#FFFF00', light: '#FFFF80', dark: '#808000' }, 
            { base: '#00FF00', light: '#80FF80', dark: '#008000' }, 
            { base: '#800080', light: '#FF80FF', dark: '#400040' }, 
            { base: '#FF0000', light: '#FF8080', dark: '#800000' }, 
            { base: '#FF1493', light: '#FFB6C1', dark: '#C71585' }, 
            { base: '#32CD32', light: '#98FB98', dark: '#228B22' }, 
            { base: '#00CED1', light: '#E0FFFF', dark: '#008B8B' }, 
            { base: '#FF4500', light: '#FFA07A', dark: '#8B0000' }, 
            { base: '#9370DB', light: '#E6E6FA', dark: '#4B0082' }, 
            { base: '#FFD700', light: '#FFFACD', dark: '#B8860B' }, 
            { base: '#20B2AA', light: '#AFEEEE', dark: '#008080' }, 
            { base: '#DC143C', light: '#FFC0CB', dark: '#800000' }, 
            { base: '#1E90FF', light: '#87CEFA', dark: '#0000CD' }  
        ];
        const c = colors[colorId];
        if (!c) return;
        const border = size * 0.15;

        ctx.fillStyle = c.base;
        ctx.fillRect(x, y, size, size);

        ctx.fillStyle = c.light;
        ctx.beginPath();
        ctx.moveTo(x, y); ctx.lineTo(x + size, y); ctx.lineTo(x + size - border, y + border);
        ctx.lineTo(x + border, y + border); ctx.lineTo(x + border, y + size - border);
        ctx.lineTo(x, y + size); ctx.fill();

        ctx.fillStyle = c.dark;
        ctx.beginPath();
        ctx.moveTo(x + size, y + size); ctx.lineTo(x, y + size); ctx.lineTo(x + border, y + size - border);
        ctx.lineTo(x + size - border, y + size - border); ctx.lineTo(x + size - border, y + border);
        ctx.lineTo(x + size, y); ctx.fill();
    }

    function initEnvironment() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(pos => {
                const latitude = pos.coords.latitude;
                const longitude = pos.coords.longitude;
                fetch("https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&current_weather=true")
                    .then(r => r.json()).then(data => {
                        doc.getElementById('temp').textContent = Math.round(data.current_weather.temperature) + "°";
                        doc.getElementById('weather-desc').textContent = "天氣穩定";
                    });
            });
        }
    }

    async function fetchPalertData() {
        doc.getElementById('qk-time').textContent = "連線中研院伺服器...";
        doc.getElementById('qk-loc').textContent = "--";
        doc.getElementById('qk-depth').textContent = "-- 公里";
        doc.getElementById('qk-mag').textContent = "--";
        doc.getElementById('qk-max-int').textContent = "--";
        doc.getElementById('qk-int').textContent = "0";
        doc.getElementById('qk-arr').textContent = "0";
        doc.getElementById('epicenter-icon').style.display = 'none';
        doc.getElementById('p-wave').style.display = 'none';
        
        const query = "query ($date: [Date!], $depth: [Float!], $ml: [Float!], $dateTime: DateTime, $needHaspga: Boolean!) { eventList( QueryEvent: {depth: $depth, date: $date, ml: $ml, dateTime: $dateTime} needHaspga: $needHaspga ) { DateUTC Depth Latitude Longitude ML hasPGA @include(if: $needHaspga) } }";

        const today = new Date();
        const past = new Date();
        past.setDate(today.getDate() - 30);
        
        const d1 = past.toISOString().split('T')[0];
        const d2 = today.toISOString().split('T')[0];

        const variables = {
            date: [d1, d2],
            ml: [0, 10],
            depth: [0, 1000],
            needHaspga: true
        };

        try {
            let res;
            try {
                res = await fetch('https://palert.earth.sinica.edu.tw/graphql', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: query, variables: variables })
                });
            } catch(err) {
                console.warn("直接連線受阻，嘗試透過代理...", err);
                const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://palert.earth.sinica.edu.tw/graphql');
                res = await fetch(proxyUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: query, variables: variables })
                });
            }
            
            if (!res.ok) throw new Error("HTTP狀態碼錯誤: " + res.status);
            const json = await res.json();
            
            if (json.data && json.data.eventList && json.data.eventList.length > 0) {
                const events = json.data.eventList.sort((a, b) => new Date(b.DateUTC) - new Date(a.DateUTC));
                const latest = events[0];
                processRealQuakeData(latest, events);
            } else {
                doc.getElementById('qk-time').textContent = "近期無顯著地震資料";
            }
        } catch(e) {
            console.error("連線徹底失敗:", e);
            // 當網頁 CSP 完全阻擋任何向外連線時，會進入這個捕獲區塊
            doc.getElementById('qk-time').textContent = "連線失敗 (請於一般網頁如維基百科點擊書籤)";
        }
    }

    function processRealQuakeData(data, allEvents) {
        const date = new Date(data.DateUTC);
        date.setHours(date.getHours() + 8); // UTC轉換為台灣時間
        
        const timeStr = date.getFullYear() + "年" + String(date.getMonth()+1).padStart(2,'0') + "月" + String(date.getDate()).padStart(2,'0') + "日 " + String(date.getHours()).padStart(2,'0') + "時" + String(date.getMinutes()).padStart(2,'0') + "分" + String(date.getSeconds()).padStart(2,'0') + "秒";
        
        doc.getElementById('qk-time').textContent = timeStr;
        doc.getElementById('qk-loc').textContent = "北緯 " + data.Latitude.toFixed(2) + "度\n東經 " + data.Longitude.toFixed(2) + "度";
        doc.getElementById('qk-depth').textContent = data.Depth.toFixed(1) + " 公里";
        doc.getElementById('qk-mag').textContent = data.ML.toFixed(1);
        
        const mapX = ((data.Longitude - 119.5) / 3.0) * 100; 
        const mapY = ((25.5 - data.Latitude) / 4.0) * 100; 

        const epiIcon = doc.getElementById('epicenter-icon');
        epiIcon.style.display = 'block';
        epiIcon.style.left = mapX + "%";
        epiIcon.style.top = mapY + "%";

        const myLat = 24.93;
        const myLng = 121.28;
        
        const distDeg = Math.sqrt(Math.pow(data.Latitude - myLat, 2) + Math.pow(data.Longitude - myLng, 2));
        const distKm = distDeg * 111;
        
        let estInt = Math.round(data.ML * 1.5 - distKm / 40);
        if (estInt < 0) estInt = 0;
        if (estInt > 7) estInt = 7;
        
        let maxInt = Math.ceil(data.ML * 1.2);
        if (maxInt > 7) maxInt = 7;
        
        doc.getElementById('qk-max-int').textContent = maxInt + " 級 (估計)";
        doc.getElementById('qk-int').textContent = estInt;
        doc.getElementById('qk-int').style.color = getIntensityColor(estInt);
        doc.getElementById('zone-east').setAttribute('fill', getIntensityMapColor(maxInt));

        const now = new Date();
        const diffSeconds = Math.floor((now - date) / 1000);
        const totalTravelTime = Math.floor(distKm / 3.5);
        let remain = totalTravelTime - diffSeconds;
        if (remain < 0) remain = 0;

        currentSeconds = remain;
        doc.getElementById('qk-arr').textContent = currentSeconds;

        if(countdownTimer) clearInterval(countdownTimer);
        if (currentSeconds > 0) {
            countdownTimer = setInterval(() => {
                if(currentSeconds > 0) {
                    currentSeconds--;
                    doc.getElementById('qk-arr').textContent = currentSeconds;
                    const pwave = doc.getElementById('p-wave');
                    pwave.style.display = 'block';
                    pwave.setAttribute('r', 40 + (totalTravelTime - currentSeconds) * 5);
                } else {
                    clearInterval(countdownTimer);
                    doc.getElementById('p-wave').style.display = 'none';
                    doc.getElementById('qk-arr').style.color = '#cc0000';
                }
            }, 1000);
        } else {
             doc.getElementById('p-wave').style.display = 'none';
        }

        const tbody = doc.getElementById('qk-table-body');
        tbody.innerHTML = '';
        allEvents.slice(0, 5).forEach((f, idx) => {
            const d = new Date(f.DateUTC);
            d.setHours(d.getHours() + 8);
            const ts = String(d.getHours()).padStart(2,'0') + ":" + String(d.getMinutes()).padStart(2,'0') + ":" + String(d.getSeconds()).padStart(2,'0');
            const row = document.createElement('tr');
            row.innerHTML = "<td>" + (idx + 1) + "</td><td>" + ts + "</td><td>" + f.ML.toFixed(1) + "</td>";
            tbody.appendChild(row);
        });
    }

    function getIntensityColor(intensity) {
        const intValue = parseInt(intensity);
        if (intValue >= 7) return '#cc0000';
        if (intValue >= 5) return '#ffcc00';
        if (intValue >= 3) return '#3cb371';
        return '#333';
    }

    function getIntensityMapColor(intensity) {
        const intValue = parseInt(intensity);
        if (intValue >= 7) return '#cc0000';
        if (intValue >= 5) return '#ffcc00';
        if (intValue >= 3) return '#3cb371';
        return '#a8e6cf';
    }

    function setupEvents() {
        doc.getElementById('quake-card-trigger').onclick = () => {
            doc.getElementById('quake-dashboard').style.display = 'flex';
        };
        doc.getElementById('quake-dash-close').onclick = () => {
            doc.getElementById('quake-dashboard').style.display = 'none';
        };

        const engineList = doc.getElementById('engine-list');
        engineList.onclick = (e) => {
            if (e.target.dataset.engine) { myntConfig.engine = e.target.dataset.engine; saveConfig(); }
        };

        doc.getElementById('search-form').onsubmit = (e) => {
            e.preventDefault();
            const q = doc.getElementById('main-input').value;
            if (!q) return;
            
            if (myntConfig.inputMode === 'search') {
                if (myntConfig.engine === 'google-ai') {
                    // 改用 window.top 讓主視窗跳轉，避免卡在 iframe 裡面
                    window.top.location.href = "https://www.google.com/search?udm=50&q=" + encodeURIComponent(q);
                } else {
                    const urls = { 
                        google: "https://www.google.com/search?q=", 
                        bing: "https://www.bing.com/search?q=", 
                        youtube: "https://www.youtube.com/results?search_query="
                    };
                    window.top.location.href = (urls[myntConfig.engine] || urls.google) + encodeURIComponent(q);
                }
            } else {
                window.top.location.href = myntConfig.inputMode === 'gemini' ? "https://gemini.google.com/app" : "https://chatgpt.com/";
            }
        };

        const modal = doc.getElementById('modal-settings');
        doc.getElementById('settings-open').onclick = () => {
            doc.getElementById('set-name').value = myntConfig.name;
            doc.getElementById('set-mode').value = myntConfig.inputMode;
            doc.getElementById('set-clock').value = myntConfig.clockStyle;
            doc.getElementById('set-clock-font').value = myntConfig.clockFont;
            doc.getElementById('set-color').value = myntConfig.themeColor;
            doc.getElementById('set-clock-color').value = myntConfig.clockColor;
            doc.getElementById('set-bg-color').value = myntConfig.bgColor;
            doc.getElementById('set-bg').value = myntConfig.bgMode;
            modal.style.display = 'flex';
        };
        
        doc.getElementById('settings-close').onclick = () => modal.style.display = 'none';

        doc.getElementById('settings-save').onclick = () => {
            myntConfig.name = doc.getElementById('set-name').value;
            myntConfig.inputMode = doc.getElementById('set-mode').value;
            myntConfig.clockStyle = doc.getElementById('set-clock').value;
            myntConfig.clockFont = doc.getElementById('set-clock-font').value;
            myntConfig.themeColor = doc.getElementById('set-color').value;
            myntConfig.clockColor = doc.getElementById('set-clock-color').value;
            myntConfig.bgColor = doc.getElementById('set-bg-color').value;
            myntConfig.bgMode = doc.getElementById('set-bg').value;
            saveConfig();
            modal.style.display = 'none';
        };

        doc.getElementById('notepad').oninput = (e) => {
            localStorage.setItem('mynt_note_bookmarklet', e.target.value);
        };

        doc.getElementById('btn-add-t').onclick = () => {
            const inp = doc.getElementById('todo-input');
            if (inp.value) { myntConfig.todos.push({ text: inp.value, done: false }); inp.value = ''; saveConfig(); }
        };
        doc.getElementById('btn-add-s').onclick = () => {
            const n = window.top.prompt("名稱:");
            const u = window.top.prompt("網址:");
            if (n && u) { myntConfig.shortcuts.push({ name: n, url: u.includes('://') ? u : 'https://' + u }); saveConfig(); }
        };
        
        doc.getElementById('clock-container').onclick = () => {
            myntConfig.clockStyle = myntConfig.clockStyle === 'digital' ? 'analog' : 'digital';
            saveConfig();
        };
    }

    function saveConfig() {
        localStorage.setItem('mynt_data_bookmarklet', JSON.stringify(myntConfig));
        applyUI();
    }

    function renderTodos() {
        const list = doc.getElementById('todo-list');
        list.innerHTML = '';
        myntConfig.todos.forEach((t, i) => {
            const li = document.createElement('li');
            li.className = 'todo-item';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = t.done;
            checkbox.style.marginRight = '10px';
            checkbox.onchange = () => { myntConfig.todos[i].done = !myntConfig.todos[i].done; saveConfig(); };
            
            const spanText = document.createElement('span');
            spanText.className = 'todo-text ' + (t.done ? 'done' : '');
            spanText.style.flex = '1';
            spanText.textContent = t.text;
            
            const spanDel = document.createElement('span');
            spanDel.style.cursor = 'pointer';
            spanDel.style.color = 'red';
            spanDel.style.fontSize = '12px';
            spanDel.className = 'del-todo';
            spanDel.textContent = '✕';
            spanDel.onclick = () => { myntConfig.todos.splice(i, 1); saveConfig(); };
            
            li.appendChild(checkbox);
            li.appendChild(spanText);
            li.appendChild(spanDel);
            list.appendChild(li);
        });
    }

    function renderShortcuts() {
        const container = doc.getElementById('shortcut-container');
        container.innerHTML = '';
        myntConfig.shortcuts.forEach((s, i) => {
            const item = document.createElement('a');
            item.href = s.url;
            item.className = 'shortcut-item';
            
            const iconDiv = document.createElement('div');
            iconDiv.className = 'shortcut-icon';
            iconDiv.textContent = s.name[0].toUpperCase();
            
            const textDiv = document.createElement('div');
            textDiv.style.fontSize = '0.75rem';
            textDiv.style.textAlign = 'center';
            textDiv.style.whiteSpace = 'nowrap';
            textDiv.style.overflow = 'hidden';
            textDiv.style.textOverflow = 'ellipsis';
            textDiv.style.width = '100%';
            textDiv.textContent = s.name;
            
            const delDiv = document.createElement('div');
            delDiv.className = 'del-s';
            delDiv.textContent = '✕';
            delDiv.onclick = (e) => { e.preventDefault(); myntConfig.shortcuts.splice(i, 1); saveConfig(); };
            
            item.appendChild(iconDiv);
            item.appendChild(textDiv);
            item.appendChild(delDiv);
            container.appendChild(item);
        });
    }

    // 當 iframe 載入完畢，啟動所有功能
    initApp();
    initEnvironment();
    setupEvents();
    
    fetchPalertData();
    setInterval(fetchPalertData, 180000);
    
    setInterval(updateTimeData, 1000);
    updateTimeData();
    startAnimationLoop();

})();
