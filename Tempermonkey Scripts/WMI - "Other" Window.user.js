// ==UserScript==
// @name          WMI - "Other" Window
// @namespace     http://tampermonkey.net/
// @version       1.8
// @description   Includes Custom Background with Blur and Reset.
// @author        Gemini, Calyndrae
// @match         https://westlake.school.kiwi/*
// @grant         GM_xmlhttpRequest
// @grant         GM_setValue
// @grant         GM_getValue
// @connect       raw.githubusercontent.com
// @updateURL     https://raw.githubusercontent.com/Calyndrae/WMI---Modern-Interface/main/Tempermonkey%20Scripts/WMI%20-%20%22Other%22%20Window.user.js
// @downloadURL   https://raw.githubusercontent.com/Calyndrae/WMI---Modern-Interface/main/Tempermonkey%20Scripts/WMI%20-%20%22Other%22%20Window.user.js
// ==/UserScript==

(function() {
    'use strict';

    // ================================================================
    // PART 1: ORIGINAL "OTHER" WINDOW (UNCHANGED)
    // ================================================================
    const style = document.createElement('style');
    style.innerHTML = `
        #custom-overlay {
            display: none; position: fixed; top: 0; left: 0;
            width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(8px); z-index: 10000;
        }
        #custom-window {
            position: absolute; top: 50%; left: 50%;
            transform: translate(-50%, -50%); width: 700px;
            background: #ffffff; border-radius: 28px;
            box-shadow: 0 40px 80px rgba(0,0,0,0.3); padding: 45px;
            font-family: 'Inter', sans-serif; color: #1e293b;
        }
        #close-btn {
            position: absolute; top: 25px; right: 30px;
            font-size: 32px; cursor: pointer; color: #cbd5e1; transition: all 0.2s;
        }
        #close-btn:hover { color: #ef4444; transform: rotate(90deg); }
        .info-section {
            display: grid; grid-template-columns: 200px 1fr;
            gap: 10px; margin-bottom: 18px; padding-bottom: 12px;
            border-bottom: 1px solid #f1f5f9;
        }
        .info-label {
            font-weight: 700; color: #94a3b8; text-transform: uppercase;
            font-size: 0.7rem; letter-spacing: 1px; align-self: center;
        }
        .info-value { font-weight: 600; color: #334155; font-size: 0.95rem; }
        .info-link { color: #297536 !important; text-decoration: none; border-bottom: 1px solid transparent; transition: border 0.2s; }
        .info-link:hover { border-bottom: 1px solid #297536; }

        .wmi-nav-item {
            display: block !important;
            width: 100%;
            text-align: left !important;
            padding: 8px 20px !important;
            text-decoration: none !important;
            cursor: pointer;
        }

        /* BACKGROUND BLUR SYSTEM */
        .wmi-bg-layer {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            z-index: -1; background-size: cover; background-position: center;
            filter: blur(15px); transform: scale(1.1); transition: opacity 0.5s;
        }
    `;
    document.head.appendChild(style);

    const modalHtml = `
        <div id="custom-overlay">
            <div id="custom-window">
                <span id="close-btn">&times;</span>
                <h1 style="color:#1a4d24; margin: 0 0 35px 0; font-size: 1.8rem; font-weight: 800;">About This Mod</h1>
                <div class="info-section"><div class="info-label">Developer</div><div class="info-value">Gemini, Calyndrae</div></div>
                <div class="info-section"><div class="info-label">Client Version</div><div class="info-value">v4.0.0-STABLE</div></div>
                <div class="info-section"><div class="info-label">Discord</div><div class="info-value">Calyndrae</div></div>
                <div class="info-section"><div class="info-label">Email</div><div class="info-value"><a href="mailto:calyndrae@gmail.com" class="info-link">calyndrae@gmail.com</a></div></div>
                <div class="info-section"><div class="info-label">Primary AI Hub</div><div class="info-value"><a href="https://gemini.google.com/" target="_blank" class="info-link">Gemini AI (Google)</a></div></div>
                <div class="info-section"><div class="info-label">Build Tools</div><div class="info-value">JavaScript, MutationObserver, CSS4 Grid</div></div>
                <div style="margin-top: 30px; text-align: center;"><small style="color:#94a3b8; font-weight: 500;">Westlake Modern Interface © 2026</small></div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('close-btn').onclick = () => { document.getElementById('custom-overlay').style.display = 'none'; };

    // ================================================================
    // PART 2: UPDATE LOGS
    // ================================================================
    const LOGS_URL = "https://raw.githubusercontent.com/Calyndrae/WMI---Modern-Interface/refs/heads/main/updatelogs.txt";

    const logHtml = `
        <div id="wmi-logs-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.4); backdrop-filter:blur(12px); z-index:10001;">
            <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:600px; background:white; border-radius:28px; padding:40px; box-shadow:0 30px 60px rgba(0,0,0,0.4); font-family:'Inter', sans-serif;">
                <span id="close-logs" style="position:absolute; top:20px; right:25px; font-size:30px; cursor:pointer; color:#cbd5e1;">&times;</span>
                <h2 style="margin:0; color:#297536; font-weight:800;">Update History</h2>
                <div id="wmi-logs-content" style="max-height:400px; overflow-y:auto; background:#f8fafc; padding:20px; border-radius:16px; font-family:monospace; font-size:13px; color:#334155; white-space:pre-wrap; border:1px solid #e2e8f0; margin-top:20px;">Loading logs...</div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', logHtml);
    document.getElementById('close-logs').onclick = () => { document.getElementById('wmi-logs-overlay').style.display = 'none'; };

    // ================================================================
    // PART 3: CUSTOM BACKGROUND SYSTEM (NEW)
    // ================================================================
    const bgOverlayHtml = `
        <div id="wmi-bg-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.4); backdrop-filter:blur(12px); z-index:10002;">
            <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:400px; background:white; border-radius:28px; padding:40px; text-align:center; font-family:'Inter', sans-serif;">
                <span id="close-bg-settings" style="position:absolute; top:20px; right:25px; font-size:30px; cursor:pointer; color:#cbd5e1;">&times;</span>
                <h2 style="margin:0 0 20px 0; color:#1a4d24; font-weight:800;">Background Settings</h2>
                <p style="font-size: 14px; color: #64748b; margin-bottom: 25px;">Upload a custom image. It will be automatically blurred.</p>
                <input type="file" id="wmi-bg-input" accept="image/*" style="display:none;">
                <button id="wmi-upload-trigger" style="background:#297536; color:white; border:none; padding:12px 24px; border-radius:12px; font-weight:bold; cursor:pointer; width:100%; margin-bottom:10px;">Upload Image</button>
                <button id="wmi-bg-reset" style="background:#f1f5f9; color:#64748b; border:none; padding:12px 24px; border-radius:12px; font-weight:bold; cursor:pointer; width:100%;">Reset to White</button>
            </div>
        </div>
        <div id="wmi-bg-layer" class="wmi-bg-layer"></div>
    `;
    document.body.insertAdjacentHTML('beforeend', bgOverlayHtml);

    const bgLayer = document.getElementById('wmi-bg-layer');
    const bgInput = document.getElementById('wmi-bg-input');

    // Load saved background on startup
    const savedBg = GM_getValue("custom_bg", null);
    if (savedBg) bgLayer.style.backgroundImage = `url(${savedBg})`;

    document.getElementById('close-bg-settings').onclick = () => { document.getElementById('wmi-bg-overlay').style.display = 'none'; };
    document.getElementById('wmi-upload-trigger').onclick = () => { bgInput.click(); };

    bgInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imgData = event.target.result;
                bgLayer.style.backgroundImage = `url(${imgData})`;
                GM_setValue("custom_bg", imgData);
            };
            reader.readAsDataURL(file);
        }
    };

    document.getElementById('wmi-bg-reset').onclick = () => {
        bgLayer.style.backgroundImage = 'none';
        GM_setValue("custom_bg", null);
        alert("Background reset to normal white.");
    };

    // ================================================================
    // INJECTION LOGIC (VERTICAL LIST)
    // ================================================================
    function injectButtons() {
        const menu = document.querySelector('#user-menu');
        if (!menu) return;
        const logoutBtn = menu.querySelector('a[href*="logout"]');
        if (!logoutBtn) return;

        // 1. Other Button
        if (!document.getElementById('other-nav-link')) {
            const btn = document.createElement('a');
            btn.id = 'other-nav-link';
            btn.className = 'sk_nav_text nav-link wmi-nav-item';
            btn.innerText = 'Other';
            btn.onclick = (e) => { e.preventDefault(); document.getElementById('custom-overlay').style.display = 'block'; menu.classList.remove('show'); };
            menu.insertBefore(btn, logoutBtn);
        }

        // 2. Custom Background Button
        if (!document.getElementById('wmi-bg-btn')) {
            const btn = document.createElement('a');
            btn.id = 'wmi-bg-btn';
            btn.className = 'sk_nav_text nav-link wmi-nav-item';
            btn.innerText = '✨ Custom Background';
            btn.style.color = '#297536';
            btn.onclick = (e) => { e.preventDefault(); document.getElementById('wmi-bg-overlay').style.display = 'block'; menu.classList.remove('show'); };
            menu.insertBefore(btn, logoutBtn);
        }

        // 3. Update Logs Button
        if (!document.getElementById('wmi-logs-btn')) {
            const btn = document.createElement('a');
            btn.id = 'wmi-logs-btn';
            btn.className = 'sk_nav_text nav-link wmi-nav-item';
            btn.innerText = 'Update Logs';
            btn.onclick = (e) => {
                e.preventDefault();
                document.getElementById('wmi-logs-overlay').style.display = 'block';
                menu.classList.remove('show');
                GM_xmlhttpRequest({
                    method: "GET", url: LOGS_URL,
                    onload: function(r) { document.getElementById('wmi-logs-content').innerText = r.responseText; }
                });
            };
            menu.insertBefore(btn, logoutBtn);
        }
    }

    const observer = new MutationObserver(injectButtons);
    observer.observe(document.body, { childList: true, subtree: true });
    injectButtons();
})();
