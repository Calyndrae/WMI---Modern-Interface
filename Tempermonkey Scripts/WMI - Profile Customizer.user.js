// ==UserScript==
// @name          WMI - Profile Customizer
// @namespace     http://tampermonkey.net/
// @version       4.7
// @description   Fixed Reset button and optimized UI loops with MutationObserver for instant sync.
// @author        Gemini, Calyndrae
// @match         *://westlake.school.kiwi/*
// @run-at        document-start
// @grant         none
// @updateURL     https://raw.githubusercontent.com/Calyndrae/WMI---Modern-Interface/main/Tempermonkey%20Scripts/WMI%20-%20Profile%20Customizer.user.js
// @downloadURL   https://raw.githubusercontent.com/Calyndrae/WMI---Modern-Interface/main/Tempermonkey%20Scripts/WMI%20-%20Profile%20Customizer.user.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'custom_user_avatar_v4';

    const injectStyles = () => {
        if (document.getElementById('wmi-v4-styles')) return;
        const style = document.createElement('style');
        style.id = 'wmi-v4-styles';
        style.textContent = `
            @keyframes wmiFadeIn { from { opacity: 0; transform: translate(-50%, -45%); } to { opacity: 1; transform: translate(-50%, -50%); } }
            #wmi-settings-modal {
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: white; padding: 40px; border-radius: 24px;
                box-shadow: 0 25px 80px rgba(0,0,0,0.2); z-index: 9999999;
                display: none; flex-direction: column; align-items: center; gap: 25px;
                border: 1px solid #e2e8f0; font-family: 'Inter', sans-serif;
                min-width: 480px; text-align: center; animation: wmiFadeIn 0.3s ease-out forwards;
            }
            #wmi-settings-modal img { width: 180px; height: 180px; border-radius: 50%; object-fit: cover; border: 4px solid #297536; }
            .wmi-btn-group { display: flex; gap: 12px; width: 100%; justify-content: center; }
            .wmi-btn { padding: 10px 22px; border-radius: 12px; border: none; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 14px; }
            .wmi-btn-primary { background: #297536; color: white; }
            .wmi-btn-secondary { background: #f1f5f9; color: #475569; }
            .wmi-btn-danger { background: #fee2e2; color: #dc2626; }
            #wmi-cropper-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(8px);
                z-index: 10000000; display: none; flex-direction: column; align-items: center; justify-content: center;
            }
            .wmi-crop-card { background: white; padding: 25px; border-radius: 24px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 20px 50px rgba(0,0,0,0.15); }
            #wmi-canvas { border-radius: 16px; cursor: grab; background: #eee; touch-action: none; }
            #wmi-canvas:active { cursor: grabbing; }
            .wmi-instr { color: #64748b; margin-top: 15px; font-size: 13px; font-weight: 500; }
        `;
        document.documentElement.appendChild(style);
    };

    let sourceImg = new Image();
    let imgState = { x: 0, y: 0, scale: 1, isDragging: false, startX: 0, startY: 0 };
    const spotlight = { r: 150 };
    let canvas, ctx;

    const draw = () => {
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        const w = sourceImg.width * imgState.scale;
        const h = sourceImg.height * imgState.scale;
        ctx.drawImage(sourceImg, imgState.x, imgState.y, w, h);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.arc(canvas.width / 2, canvas.height / 2, spotlight.r, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.strokeStyle = '#297536';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, spotlight.r, 0, Math.PI * 2);
        ctx.stroke();
    };

    const startCropping = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            sourceImg = new Image();
            sourceImg.onload = () => {
                const overlay = document.getElementById('wmi-cropper-overlay');
                canvas = document.getElementById('wmi-canvas');
                ctx = canvas.getContext('2d', { alpha: false });
                canvas.width = 750; canvas.height = 500;
                imgState.scale = Math.min(canvas.width / sourceImg.width, canvas.height / sourceImg.height) * 0.8;
                imgState.x = (canvas.width - sourceImg.width * imgState.scale) / 2;
                imgState.y = (canvas.height - sourceImg.height * imgState.scale) / 2;
                overlay.style.display = 'flex';
                draw();
                canvas.onmousedown = (ev) => {
                    imgState.isDragging = true;
                    const rect = canvas.getBoundingClientRect();
                    imgState.startX = (ev.clientX - rect.left) - imgState.x;
                    imgState.startY = (ev.clientY - rect.top) - imgState.y;
                };
                window.onmousemove = (ev) => {
                    if (!imgState.isDragging) return;
                    const rect = canvas.getBoundingClientRect();
                    imgState.x = (ev.clientX - rect.left) - imgState.startX;
                    imgState.y = (ev.clientY - rect.top) - imgState.startY;
                    requestAnimationFrame(draw);
                };
                window.onmouseup = () => { imgState.isDragging = false; };
            };
            sourceImg.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    const buildUI = () => {
        if (document.getElementById('wmi-settings-modal')) return;
        injectStyles();

        const modal = document.createElement('div');
        modal.id = 'wmi-settings-modal';
        const current = localStorage.getItem(STORAGE_KEY) || 'https://westlake.school.kiwi/students/profile';
        modal.innerHTML = `
            <h2 style="margin:0; color:#1a4d24; font-weight:800;">Profile Customizer</h2>
            <img src="${current}" id="wmi-preview-img">
            <div class="wmi-btn-group">
                <button class="wmi-btn wmi-btn-danger" id="wmi-reset-act">Reset</button>
                <button class="wmi-btn wmi-btn-primary" id="wmi-upload-act">Upload</button>
            </div>
            <input type="file" id="wmi-hidden-input" style="display:none;" accept="image/*">
            <button class="wmi-btn wmi-btn-secondary" style="margin-top:5px; width:100%" id="wmi-dismiss-btn">Dismiss</button>
        `;
        document.body.appendChild(modal);

        const cropUI = document.createElement('div');
        cropUI.id = 'wmi-cropper-overlay';
        cropUI.innerHTML = `
            <div class="wmi-crop-card">
                <h3 style="margin:0 0 15px 0; color:#1e293b; font-weight:700;">Edit Photo</h3>
                <canvas id="wmi-canvas"></canvas>
                <div class="wmi-btn-group" style="margin-top:20px;">
                    <button class="wmi-btn wmi-btn-secondary" id="wmi-zoom-out">－ Zoom Out</button>
                    <button class="wmi-btn wmi-btn-secondary" id="wmi-zoom-in">＋ Zoom In</button>
                </div>
                <div class="wmi-instr">Drag photo to position • Spotlight is fixed</div>
                <div class="wmi-btn-group" style="margin-top:25px; border-top: 1px solid #f1f5f9; padding-top:20px;">
                    <button class="wmi-btn wmi-btn-secondary" id="wmi-cancel-crop">Cancel</button>
                    <button class="wmi-btn wmi-btn-primary" id="wmi-save-crop">Apply</button>
                </div>
            </div>
        `;
        document.body.appendChild(cropUI);

        // Events
        document.getElementById('wmi-dismiss-btn').onclick = () => { modal.style.display = 'none'; };
        document.getElementById('wmi-reset-act').onclick = () => {
            localStorage.removeItem(STORAGE_KEY);
            location.reload();
        };
        const fileInput = document.getElementById('wmi-hidden-input');
        document.getElementById('wmi-upload-act').onclick = () => fileInput.click();
        fileInput.onchange = (e) => { if(e.target.files[0]) startCropping(e.target.files[0]); };
        document.getElementById('wmi-zoom-in').onclick = () => { imgState.scale *= 1.1; draw(); };
        document.getElementById('wmi-zoom-out').onclick = () => { imgState.scale *= 0.9; draw(); };
        document.getElementById('wmi-cancel-crop').onclick = () => { cropUI.style.display = 'none'; fileInput.value = ''; };
        document.getElementById('wmi-save-crop').onclick = () => {
            const out = document.createElement('canvas');
            out.width = 500; out.height = 500;
            const oCtx = out.getContext('2d');
            oCtx.beginPath(); oCtx.arc(250, 250, 250, 0, Math.PI * 2); oCtx.clip();
            const sourceSize = (spotlight.r * 2) / imgState.scale;
            const sourceX = (canvas.width / 2 - imgState.x) / imgState.scale - (spotlight.r / imgState.scale);
            const sourceY = (canvas.height / 2 - imgState.y) / imgState.scale - (spotlight.r / imgState.scale);
            oCtx.drawImage(sourceImg, sourceX, sourceY, sourceSize, sourceSize, 0, 0, 500, 500);
            localStorage.setItem(STORAGE_KEY, out.toDataURL('image/png'));
            location.reload();
        };
    };

    const addMenuTrigger = () => {
        const userMenu = document.getElementById('user-menu') || document.querySelector('.dropdown-menu');
        if (userMenu && !document.getElementById('wmi-trigger-btn')) {
            const btn = document.createElement('a');
            btn.id = 'wmi-trigger-btn';
            btn.className = 'sk_nav_text nav-link';
            btn.innerHTML = '✨ Custom Profile Picture';
            btn.style.cssText = 'color:#297536 !important; font-weight:bold; cursor:pointer;';
            const logout = userMenu.querySelector('a[href*="logout"]');
            if (logout) {
                userMenu.insertBefore(btn, logout);
                const d = document.createElement('div'); d.className = 'dropdown-divider';
                userMenu.insertBefore(d, logout);
            } else {
                userMenu.appendChild(btn);
            }
            btn.onclick = (e) => {
                e.preventDefault();
                buildUI(); // Ensure UI exists
                document.getElementById('wmi-settings-modal').style.display = 'flex';
            };
        }
    };

    const sync = () => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;
        // Expanded selectors to catch navbars, profile pages, and thumbnails
        const selectors = [
            'img.avatar',
            '.school-card-image img',
            'img[src*="/students/profile"]',
            '.nav-user-avatar img',
            '.user-profile-avatar img',
            '#user-menu img',
            '.profile-image'
        ];
        document.querySelectorAll(selectors.join(', ')).forEach(img => {
            if (img.src !== saved) {
                img.src = saved;
                img.srcset = ""; // Clear srcset to prevent original high-res from loading
            }
        });
    };

    // Use MutationObserver for instant replacement
    const observer = new MutationObserver(() => {
        sync();
        addMenuTrigger();
    });

    // Start watching the page immediately
    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
        sync();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            observer.observe(document.body, { childList: true, subtree: true });
            sync();
        });
    }

    // Fallback interval for tricky elements
    setInterval(sync, 1000);
})();
