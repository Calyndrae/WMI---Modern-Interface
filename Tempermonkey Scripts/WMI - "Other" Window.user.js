// ==UserScript==
// @name         WMI - "Other" Window
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  None
// @author       Gemini, Calyndrae
// @match        https://westlake.school.kiwi/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 1. Styles for the UI
    const style = document.createElement('style');
    style.innerHTML = `
        #custom-overlay {
            display: none;
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(8px);
            z-index: 10000;
        }
        #custom-window {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 700px;
            background: #ffffff;
            border-radius: 28px;
            box-shadow: 0 40px 80px rgba(0,0,0,0.3);
            padding: 45px;
            font-family: 'Inter', -apple-system, sans-serif;
            color: #1e293b;
        }
        #close-btn {
            position: absolute;
            top: 25px; right: 30px;
            font-size: 32px;
            cursor: pointer;
            color: #cbd5e1;
            transition: all 0.2s;
        }
        #close-btn:hover { color: #ef4444; transform: rotate(90deg); }

        .info-section {
            display: grid;
            grid-template-columns: 200px 1fr;
            gap: 10px;
            margin-bottom: 18px;
            padding-bottom: 12px;
            border-bottom: 1px solid #f1f5f9;
        }
        .info-label {
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            font-size: 0.7rem;
            letter-spacing: 1px;
            align-self: center;
        }
        .info-value {
            font-weight: 600;
            color: #334155;
            font-size: 0.95rem;
        }
        .info-link {
            color: #297536 !important;
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: border 0.2s;
        }
        .info-link:hover { border-bottom: 1px solid #297536; }
    `;
    document.head.appendChild(style);

    // 2. Window Content
    const modalHtml = `
        <div id="custom-overlay">
            <div id="custom-window">
                <span id="close-btn">&times;</span>
                <h1 style="color:#1a4d24; margin: 0 0 35px 0; font-size: 1.8rem; font-weight: 800;">About This Mod</h1>

                <div class="info-section">
                    <div class="info-label">Developer</div>
                    <div class="info-value">Gemini, Calyndrae</div>
                </div>

                <div class="info-section">
                    <div class="info-label">Client Version</div>
                    <div class="info-value">v4.0.0-STABLE</div>
                </div>

                <div class="info-section">
                    <div class="info-label">Discord</div>
                    <div class="info-value">Calyndrae</div>
                </div>

                <div class="info-section">
                    <div class="info-label">Email</div>
                    <div class="info-value"><a href="mailto:calyndrae@gmail.com" class="info-link">calyndrae@gmail.com</a></div>
                </div>

                <div class="info-section">
                    <div class="info-label">Primary AI Hub</div>
                    <div class="info-value"><a href="https://gemini.google.com/" target="_blank" class="info-link">Gemini AI (Google)</a></div>
                </div>

                <div class="info-section">
                    <div class="info-label">Build Tools</div>
                    <div class="info-value">JavaScript, MutationObserver, CSS4 Grid</div>
                </div>

                <div style="margin-top: 30px; text-align: center;">
                    <small style="color:#94a3b8; font-weight: 500;">Westlake Modern Interface © 2026</small>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    document.getElementById('close-btn').onclick = () => {
        document.getElementById('custom-overlay').style.display = 'none';
    };

    // 3. Button Injection
    function injectButton() {
        const menu = document.querySelector('#user-menu');
        if (menu && !document.getElementById('other-nav-link')) {
            const logoutBtn = menu.querySelector('a[href*="logout"]');

            const otherBtn = document.createElement('a');
            otherBtn.id = 'other-nav-link';
            otherBtn.href = 'javascript:void(0)';
            otherBtn.className = 'sk_nav_text nav-link';
            otherBtn.innerText = 'Other';

            otherBtn.onclick = (e) => {
                e.preventDefault();
                document.getElementById('custom-overlay').style.display = 'block';
                menu.classList.remove('show');
            };

            if (logoutBtn) {
                menu.insertBefore(otherBtn, logoutBtn);
                const divider = document.createElement('div');
                divider.className = 'dropdown-divider';
                menu.insertBefore(divider, logoutBtn);
            }
        }
    }

    injectButton();
    const observer = new MutationObserver(injectButton);
    observer.observe(document.body, { childList: true, subtree: true });
})();
