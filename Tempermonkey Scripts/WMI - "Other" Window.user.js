// ==UserScript==
// @name          WMI - "Other" Window
// @namespace     http://tampermonkey.net/
// @version       1.7
// @description   Buttons stacked in a vertical list, aligned left.
// @author        Gemini, Calyndrae
// @match         https://westlake.school.kiwi/*
// @grant         GM_xmlhttpRequest
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
        
        /* Ensure the injected buttons look like standard menu items */
        .wmi-nav-item {
            display: block !important;
            width: 100%;
            text-align: left !important;
            padding: 8px 20px !important;
            text-decoration: none !important;
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
    // PART 2: NEW UPDATE LOGS ADDITION
    // ================================================================
    const LOGS_URL = "https://raw.githubusercontent.com/Calyndrae/WMI---Modern-Interface/refs/heads/main/updatelogs.txt";

    const logStyle = document.createElement('style');
    logStyle.innerHTML = `
        #wmi-logs-overlay {
            display: none; position: fixed; top: 0; left: 0;
            width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(12px); z-index: 10001;
        }
        #wmi-logs-window {
            position: absolute; top: 50%; left: 50%;
            transform: translate(-50%, -50%); width: 600px;
            background: white; border-radius: 28px; padding: 40px;
            box-shadow: 0 30px 60px rgba(0,0,0,0.4); font-family: 'Inter', sans-serif;
        }
        #wmi-logs-content {
            max-height: 400px; overflow-y: auto; background: #f8fafc;
            padding: 20px; border-radius: 16px; font-family: monospace;
            font-size: 13px; color: #334155; white-space: pre-wrap;
            border: 1px solid #e2e8f0; margin-top: 20px;
        }
    `;
    document.head.appendChild(logStyle);

    const logHtml = `
        <div id="wmi-logs-overlay">
            <div id="wmi-logs-window">
                <span id="close-logs" style="position:absolute; top:20px; right:25px; font-size:30px; cursor:pointer; color:#cbd5e1;">&times;</span>
                <h2 style="margin:0; color:#297536; font-weight:800;">Update History</h2>
                <div id="wmi-logs-content">Loading logs...</div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', logHtml);

    document.getElementById('close-logs').onclick = () => { document.getElementById('wmi-logs-overlay').style.display = 'none'; };

    function injectButtons() {
        const menu = document.querySelector('#user-menu');
        if (!menu) return;

        const logoutBtn = menu.querySelector('a[href*="logout"]');
        if (!logoutBtn) return;

        // 1. Original "Other" (Vertical List Style)
        if (!document.getElementById('other-nav-link')) {
            const otherBtn = document.createElement('a');
            otherBtn.id = 'other-nav-link';
            otherBtn.className = 'sk_nav_text nav-link wmi-nav-item';
            otherBtn.innerText = 'Other';
            otherBtn.onclick = (e) => {
                e.preventDefault();
                document.getElementById('custom-overlay').style.display = 'block';
                menu.classList.remove('show');
            };
            menu.insertBefore(otherBtn, logoutBtn);
        }

        // 2. New Update Logs (Vertical List Style)
        if (!document.getElementById('wmi-logs-btn')) {
            const logsBtn = document.createElement('a');
            logsBtn.id = 'wmi-logs-btn';
            logsBtn.className = 'sk_nav_text nav-link wmi-nav-item';
            logsBtn.innerText = 'Update Logs';
            logsBtn.style.color = '#297536';
            logsBtn.onclick = (e) => {
                e.preventDefault();
                document.getElementById('wmi-logs-overlay').style.display = 'block';
                menu.classList.remove('show');

                GM_xmlhttpRequest({
                    method: "GET",
                    url: LOGS_URL,
                    onload: function(response) {
                        if (response.status === 200) {
                            document.getElementById('wmi-logs-content').innerText = response.responseText;
                        } else {
                            document.getElementById('wmi-logs-content').innerHTML = "<b>Error:</b> Server returned status " + response.status;
                        }
                    },
                    onerror: function() {
                        document.getElementById('wmi-logs-content').innerHTML = "<b>Critical Error:</b> Connection blocked by browser security.";
                    }
                });
            };
            menu.insertBefore(logsBtn, logoutBtn);
        }
    }

    const observer = new MutationObserver(injectButtons);
    observer.observe(document.body, { childList: true, subtree: true });
    injectButtons();
})();
