// ==UserScript==
// @name         WMI - Current Subject Block
// @namespace    http://tampermonkey.net/
// @version      6.2
// @description  A floating hub that shows the current status. Fixed overlap/50min logic.
// @author       Gemini, Calyndrae
// @match        https://westlake.school.kiwi/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/Calyndrae/WMI---Modern-Interface/main/Tempermonkey%20Scripts/WMI%20-%20Current%20Subject%20Block.user.js
// @downloadURL  https://raw.githubusercontent.com/Calyndrae/WMI---Modern-Interface/main/Tempermonkey%20Scripts/WMI%20-%20Current%20Subject%20Block.user.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Setup HUD Style
    const hub = document.createElement('div');
    const tetherRange = 20;

    Object.assign(hub.style, {
        position: 'fixed',
        bottom: '30px',
        left: '30px',
        width: '240px',
        padding: '12px',
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(8px)',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
        zIndex: '10000',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        pointerEvents: 'none',
        willChange: 'transform'
    });

    hub.innerHTML = `
        <div style="font-size: 11px; font-weight: 700; color: #94a3b8; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Live Schedule</div>
        <div id="hub-subject" style="font-size: 14px; font-weight: 600; margin-bottom: 10px; color: #f8fafc;">Syncing...</div>
        <div id="hub-bar-bg" style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); borderRadius: 3px; overflow: hidden;">
            <div id="hub-fill" style="height: 100%; width: 0%; background: #1a4d24; transition: width 0.8s linear;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 10px; font-weight: 500; color: #94a3b8;">
            <span id="hub-percent"></span>
            <span id="hub-status">Standby</span>
        </div>
    `;

    document.body.appendChild(hub);
    const fill = hub.querySelector('#hub-fill');
    const percentTxt = hub.querySelector('#hub-percent');
    const subjectTxt = hub.querySelector('#hub-subject');
    const statusTxt = hub.querySelector('#hub-status');

    // --- SMOOTH FLOATING LOGIC ---
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        const homeX = 30 + 120;
        const homeY = window.innerHeight - 30 - 45;

        const diffX = mouseX - homeX;
        const diffY = mouseY - homeY;
        const angle = Math.atan2(diffY, diffX);
        const dist = Math.sqrt(diffX * diffX + diffY * diffY);

        const targetDist = Math.min(dist * 0.15, tetherRange);
        const targetX = Math.cos(angle) * targetDist;
        const targetY = Math.sin(angle) * targetDist;

        currentX += (targetX - currentX) * 0.1;
        currentY += (targetY - currentY) * 0.1;

        hub.style.transform = `translate(${currentX}px, ${currentY}px)`;
        requestAnimationFrame(animate);
    }

    // --- CORE SCHEDULING LOGIC ---
    function parseTime(timeStr) {
        if (!timeStr) return null;
        let cleanTime = timeStr.replace(/\s/g, '').toLowerCase();
        let [time, modifier] = cleanTime.split(/(am|pm)/i);
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'pm' && hours < 12) hours += 12;
        if (modifier === 'am' && hours === 12) hours = 0;
        return hours * 60 + minutes;
    }

    function updateTracker() {
        const todayCol = document.querySelector('.is-today') || document.querySelector('.tt-day-wrap:not(.not-today)');
        if (!todayCol || todayCol.querySelector('.is-closed')) {
            showClosed(); return;
        }

        const periods = Array.from(todayCol.querySelectorAll('.calendar-day:not(.non-period)'));
        if (periods.length === 0) { showClosed(); return; }

        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        let S = null, E = null, activeName = "";

        // Loop through all periods. If multiple subjects overlap (like 2:30 start vs 2:50 end),
        // the one starting later will be the final value for S and activeName.
        for (let i = 0; i < periods.length; i++) {
            const periodStart = parseTime(periods[i].querySelector('.text-muted')?.textContent.trim());
            if (periodStart === null) continue;

            const periodEnd = periodStart + 50;

            if (currentTime >= periodStart && currentTime < periodEnd) {
                S = periodStart;
                E = periodEnd;
                activeName = periods[i].querySelector('strong')?.innerText || "Class";
            }
        }

        if (S !== null) {
            // Logic: Percentage of the 50-minute block REMAINING
            const timePassed = currentTime - S;
            const percentage = Math.max(0, Math.min(100, ((50 - timePassed) / 50) * 100));

            fill.style.width = `${percentage}%`;
            percentTxt.innerText = `${Math.round(percentage)}% Left`;
            subjectTxt.innerText = activeName;
            statusTxt.innerText = percentage < 15 ? "Ending Soon..." : "Downloading Knowledge...";
            fill.style.background = (percentage < 15) ? '#e11d48' : '#1a4d24';
        } else {
            fill.style.width = "0%";
            percentTxt.innerText = "";
            subjectTxt.innerText = "No Lesson";
            statusTxt.innerText = "Standby";
        }
    }

    function showClosed() {
        subjectTxt.innerText = "School Closed";
        statusTxt.innerText = "Enjoy your day!";
        fill.style.width = "0%";
        percentTxt.innerText = "";
    }

    setInterval(updateTracker, 2000);
    updateTracker();
    requestAnimationFrame(animate);

})();
