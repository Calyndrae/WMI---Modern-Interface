// ==UserScript==
// @name          WMI - Guides (Smooth Edition)
// @namespace     http://tampermonkey.net/
// @version       2.3
// @description   Targets specific widgets with premium smooth transitions.
// @author        Gemini, Calyndrae
// @match         https://westlake.school.kiwi/*
// @grant         none
// @updateURL    https://raw.githubusercontent.com/Calyndrae/WMI---Modern-Interface/main/Tempermonkey%20Scripts/WMI%20-%20Guides.user.js
// @downloadURL  https://raw.githubusercontent.com/Calyndrae/WMI---Modern-Interface/main/Tempermonkey%20Scripts/WMI%20-%20Guides.user.js
// ==/UserScript==

(function() {
    'use strict';

    const isLoggedIn = document.querySelector('a[href*="logout"]') || document.getElementById('user-menu');
    if (!isLoggedIn) return;

    if (localStorage.getItem('westlake_system_tutorial') === '1') return;

    let currentStep = parseInt(localStorage.getItem('tut_progress') || '0');

    const steps = [
        { title: "Guiding", text: "Welcome to the WMI - Westlake Modern Interface. Let's start the walkthrough.", selector: null, action: "next" },
        { title: "Profile Management", text: "Access your account settings and security here.", selector: ".nav-link--account", action: "next" },
        { title: "Knowledge Base", text: "This menu contains all school information folders.", selector: "a[data-toggle='collapse'][href*='menu-folder']", action: "next" },
        { title: "Attendance Tracker", text: "Click here to view your live attendance record.", selector: ".nav-link-attendance", action: "redirect" },
        { title: "Live Hub", text: "This widget tracks your current period and day progress in real-time.", selector: "div[style*='position: fixed'][style*='bottom: 30px'][style*='left: 30px']", action: "next" },
        { title: "Final Check", text: "Green 'P' means Present. Check this daily to ensure your records are accurate.", selector: ".is-today", action: "finish" }
    ];

    // --- UI INJECTION ---
    const overlay = document.createElement('div');
    overlay.id = 'tut-mask';
    Object.assign(overlay.style, {
        position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
        zIndex: '2147483640', pointerEvents: 'none', opacity: '0',
        transition: 'opacity 0.8s ease' // Smooth fade in for the background
    });

    overlay.innerHTML = `
        <svg width="100%" height="100%" style="position:absolute; pointer-events:none;">
            <defs>
                <mask id="hole">
                    <rect width="100%" height="100%" fill="white"/>
                    <rect id="mask-hole" x="50%" y="50%" width="0" height="0" rx="15" fill="black"
                        style="transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);" />
                </mask>
            </defs>
            <rect width="100%" height="100%" fill="rgba(0,0,0,0.7)" mask="url(#hole)" style="pointer-events:all;"/>
        </svg>`;
    document.body.appendChild(overlay);

    const card = document.createElement('div');
    card.id = 'tut-card';
    Object.assign(card.style, {
        position: 'fixed', bottom: '40px', right: '40px', width: '300px',
        backgroundColor: 'white', padding: '24px', borderRadius: '24px',
        boxShadow: '0 25px 70px rgba(0,0,0,0.2)', zIndex: '2147483647',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)', // The "Elastic" smooth glide
        transform: 'translateY(100px)', opacity: '0'
    });
    document.body.appendChild(card);

    function updateGuide() {
        const step = steps[currentStep];
        if (!step) return;

        const progressPercent = ((currentStep + 1) / steps.length) * 100;

        // Briefly fade out text content before switching
        card.style.opacity = '0.5';
        card.style.transform = 'translateY(5px)';

        setTimeout(() => {
            card.innerHTML = `
                <div style="margin-bottom:12px; display:flex; align-items:center; justify-content:space-between;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <div style="width:8px; height:8px; background:#1a4d24; border-radius:50%;"></div>
                        <h3 style="margin:0; color:#1a4d24; font-size:16px; font-weight:800;">${step.title}</h3>
                    </div>
                    <span style="font-size:11px; color:#94a3b8; font-weight:700;">${currentStep + 1} / ${steps.length}</span>
                </div>
                <p style="margin:0; color:#475569; font-size:14px; line-height:1.5; min-height:45px;">${step.text}</p>
                <div style="width:100%; height:4px; background:#f1f5f9; border-radius:10px; margin-top:20px; overflow:hidden;">
                    <div id="tut-progress-fill" style="width:${progressPercent}%; height:100%; background:#1a4d24; transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);"></div>
                </div>
                <div style="display:flex; gap:10px; margin-top:15px;">
                    <button id="guide-skip" style="flex:1; padding:10px; background:#fff; color:#94a3b8; border:1px solid #e2e8f0; border-radius:12px; font-weight:600; cursor:pointer; font-size:13px;">Skip</button>
                    <button id="guide-next" style="flex:2; padding:10px; background:#1a4d24; color:white; border:none; border-radius:12px; font-weight:700; cursor:pointer; font-size:13px;">
                        ${step.action === 'redirect' ? 'Open Page' : (step.action === 'finish' ? 'Finish' : 'Next Step')}
                    </button>
                </div>
            `;

            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';

            // Re-bind buttons
            document.getElementById('guide-next').onclick = handleNext;
            document.getElementById('guide-skip').onclick = completeTutorial;
        }, 200);

        const hole = document.getElementById('mask-hole');
        let target = null;
        if (step.selector) {
            target = (step.title === "Live Hub") ?
                Array.from(document.querySelectorAll('div')).find(el => el.style.position === 'fixed' && el.style.left === '30px') :
                document.querySelector(step.selector);
        }

        if (target) {
            overlay.style.opacity = "1";
            overlay.style.pointerEvents = "all";
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });

            setTimeout(() => {
                const rect = target.getBoundingClientRect();
                hole.setAttribute('x', rect.left - 12);
                hole.setAttribute('y', rect.top - 12);
                hole.setAttribute('width', rect.width + 24);
                hole.setAttribute('height', rect.height + 24);
            }, 400);
        } else {
            hole.setAttribute('width', '0');
            hole.setAttribute('height', '0');
            // If no target, we keep the overlay invisible but the card visible
            overlay.style.opacity = "0";
            overlay.style.pointerEvents = "none";
        }
    }

    function handleNext() {
        const step = steps[currentStep];
        if (step.action === 'redirect' && document.querySelector(step.selector)) {
            localStorage.setItem('tut_progress', (currentStep + 1).toString());
            document.querySelector(step.selector).click();
        } else if (step.action === 'finish') {
            completeTutorial();
        } else {
            currentStep++;
            localStorage.setItem('tut_progress', currentStep.toString());
            updateGuide();
        }
    }

    function completeTutorial() {
        card.style.transform = 'translateY(100px)';
        card.style.opacity = '0';
        overlay.style.opacity = '0';
        localStorage.setItem('westlake_system_tutorial', '1');
        localStorage.removeItem('tut_progress');
        setTimeout(() => { overlay.remove(); card.remove(); }, 800);
    }

    window.onload = () => setTimeout(updateGuide, 1500);
})();
