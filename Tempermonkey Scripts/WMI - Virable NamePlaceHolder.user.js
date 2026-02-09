// ==UserScript==
// @name         WMI - Virable NamePlaceHolder
// @namespace    http://tampermonkey.net/
// @version      1.7
// @author       Gemini, Calyndrae
// @match        https://westlake.school.kiwi/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 1. VARIABLE: The "NamePlaceHolder" logic
    // This looks into the dropdown header.
    function getIdentity() {
        const nameTag = document.querySelector('.dropdown-header.sk_nav_text strong.d-block');
        return nameTag ? nameTag.innerText.trim() : "Unknown User";
    }

    function injectModal() {
        if (document.getElementById('custom-overlay')) return;

        const userName = getIdentity(); // Sets the variable based on the page content

        const modalHtml = `
            <div id="custom-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.4); backdrop-filter:blur(10px); z-index:10000;">
                <div id="custom-window" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:700px; background:#fff; border-radius:28px; padding:45px; font-family: 'Inter', sans-serif; box-shadow: 0 25px 50px rgba(0,0,0,0.3);">
                    <span id="close-btn" style="position:absolute; top:25px; right:30px; font-size:32px; cursor:pointer; color:#cbd5e1;">&times;</span>

                    <h1 style="color:#1a4d24; margin:0; font-size: 1.8rem;">System Terminal</h1>

                    <p style="color:#94a3b8; margin-bottom: 30px;">
                        Current Session: <span id="display-name" style="color:#1a4d24; font-weight:700;">${userName}</span>
                    </p>

                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
                        <div>
                            <small style="text-transform:uppercase; color:#94a3b8; font-size:10px; font-weight:700; letter-spacing:1px;">Discord</small>
                            <p style="margin:5px 0; font-weight:600;">Calyndrae</p>
                        </div>
                        <div>
                            <small style="text-transform:uppercase; color:#94a3b8; font-size:10px; font-weight:700; letter-spacing:1px;">Email</small>
                            <p style="margin:5px 0; font-weight:600;">calyndrae@gmail.com</p>
                        </div>
                        <div>
                            <small style="text-transform:uppercase; color:#94a3b8; font-size:10px; font-weight:700; letter-spacing:1px;">Client Version</small>
                            <p style="margin:5px 0; font-weight:600; color:#10b981;">v3.5.0-STABLE</p>
                        </div>
                        <div>
                            <small style="text-transform:uppercase; color:#94a3b8; font-size:10px; font-weight:700; letter-spacing:1px;">Primary AI</small>
                            <p style="margin:5px 0; font-weight:600;"><a href="https://gemini.google.com/" target="_blank" style="color:#1a4d24; text-decoration:none;">Gemini Pro</a></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        document.getElementById('close-btn').onclick = () => {
            document.getElementById('custom-overlay').style.display = 'none';
        };
    }

    // 2. Button Injection Logic
    function injectButton() {
        const menu = document.getElementById('user-menu');
        if (!menu || document.getElementById('other-nav-link')) return;

        const logoutBtn = menu.querySelector('a[href*="logout"]');
        if (logoutBtn) {
            const otherBtn = document.createElement('a');
            otherBtn.id = 'other-nav-link';
            otherBtn.href = 'javascript:void(0)';
            otherBtn.className = 'sk_nav_text nav-link';
            otherBtn.innerText = 'Other';

            otherBtn.onclick = (e) => {
                e.preventDefault();
                // Update the name variable every time the window opens just to be safe
                document.getElementById('display-name').innerText = getIdentity();
                document.getElementById('custom-overlay').style.display = 'block';
                menu.classList.remove('show');
            };

            const divider = document.createElement('div');
            divider.className = 'dropdown-divider';
            menu.insertBefore(divider, logoutBtn);
            menu.insertBefore(otherBtn, divider);
        }
    }

    injectModal();
    injectButton();
    const observer = new MutationObserver(injectButton);
    observer.observe(document.body, { childList: true, subtree: true });
})();
