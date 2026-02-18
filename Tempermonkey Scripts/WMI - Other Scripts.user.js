// ==UserScript==
// @name         WMI - Other Scripts
// @namespace    http://tampermonkey.net/
// @version      2.1
// @author       Gemini, Calyndrae
// @match        https://westlake.school.kiwi/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/Calyndrae/WMI---Modern-Interface/main/Tempermonkey%20Scripts/WMI%20-%20Other%20Scripts.user.js
// @downloadURL  https://raw.githubusercontent.com/Calyndrae/WMI---Modern-Interface/main/Tempermonkey%20Scripts/WMI%20-%20Other%20Scripts.user.js
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

    (function() {
    const css = `
        html {
            filter: invert(80%) hue-rotate(180deg) !important;
            background-color: white !important;
        }
        /* Re-inverting media so they don't look like negatives */
        img, video, canvas {
            filter: invert(100%) hue-rotate(180deg) !important;
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.documentElement.appendChild(style);
})();
    
    /* --- START OF ENGAGEMENT TABLE FIX V3 --- */
(function() {
    const tableStyle = document.createElement('style');
    tableStyle.innerHTML = `
        /* 1. Fix the parent cell container */
        .result-value {
            vertical-align: middle !important;
            padding: 10px !important;
        }

        /* 2. Reset the table to be a compact box */
        .result-value table {
            width: 320px !important; /* Fixed width prevents squishing */
            float: right !important; /* Keeps it on the right side */
            border-collapse: separate !important;
            border-spacing: 0 4px !important; /* Adds small gap between rows */
            background: transparent !important;
            border: none !important;
        }

        /* 3. Style the rows as "pills" */
        .result-value table tr {
            display: flex !important;
            justify-content: space-between;
            align-items: center;
            background: #f8fafc !important;
            border: 1px solid #e2e8f0 !important;
            border-radius: 6px;
            margin-bottom: 4px;
            padding: 4px 10px !important;
        }

        /* 4. Fix the text nodes - NO MORE STACKING */
        .result-value table td {
            display: block !important;
            border: none !important;
            background: transparent !important;
            padding: 0 !important;
            font-size: 11px !important;
            font-weight: 600 !important;
            color: #475569 !important;
            white-space: nowrap !important; /* Forces text to stay on one line */
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        /* 5. Highlight the Grade Number */
        .result-value table td:last-child {
            color: #1a4d24 !important;
            font-size: 13px !important;
            margin-left: 15px;
        }
    `;
    document.head.appendChild(tableStyle);

    function fixGrades() {
        const nestedTables = document.querySelectorAll('.result-value table');
        nestedTables.forEach(table => {
            // Scrub all the old school attributes
            table.removeAttribute('width');
            table.removeAttribute('cellpadding');
            table.removeAttribute('cellspacing');
            table.removeAttribute('border');

            // Scrub widths from individual cells
            const cells = table.querySelectorAll('td');
            cells.forEach(td => {
                td.removeAttribute('width');
                // If the cell only contains a number, give it a class for styling
                if (!isNaN(td.innerText.trim())) {
                    td.style.minWidth = "20px";
                    td.style.textAlign = "right";
                }
            });
        });
    }

    fixGrades();
    const gradeObserver = new MutationObserver(fixGrades);
    gradeObserver.observe(document.body, { childList: true, subtree: true });
})();
/* --- END OF ENGAGEMENT TABLE FIX V3 --- */

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


