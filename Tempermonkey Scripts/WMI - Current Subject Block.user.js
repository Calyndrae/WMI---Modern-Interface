// ==UserScript==
// @name         WMI - Current Subject Block
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  HUD constantly follows cursor within a fixed tethered range. Smooth organic floating.
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
    const tetherRange = 20; // How far it can drift from the corner (tether length)

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
        // Find the "Home" position (bottom-left)
        const homeX = 30 + 120; // left + half-width
        const homeY = window.innerHeight - 30 - 45; // bottom + half-height

        // Calculate vector from Home to Mouse
        const diffX = mouseX - homeX;
        const diffY = mouseY - homeY;
        const angle = Math.atan2(diffY, diffX);
        const dist = Math.sqrt(diffX * diffX + diffY * diffY);

        // Tether: The HUD stays within tetherRange, but always points to mouse
        const targetDist = Math.min(dist * 0.15, tetherRange);
        const targetX = Math.cos(angle) * targetDist;
        const targetY = Math.sin(angle) * targetDist;

        // "Lerp" for smoothness (Linear Interpolation)
        // 0.1 makes it follow with a slight delay/elastic feel
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

        const firstPeriodStart = parseTime(periods[0].querySelector('.text-muted')?.textContent.trim());
        const lastPeriodStart = parseTime(periods[periods.length - 1].querySelector('.text-muted')?.textContent.trim());
        const dayEnd = lastPeriodStart + 50;

        // Check if day hasn't started or has ended
        if (currentTime >= dayEnd || currentTime < firstPeriodStart) {
            showClosed(); return;
        }

        let S = null, E = null, activeName = "";
        for (let i = 0; i < periods.length; i++) {
            const periodStart = parseTime(periods[i].querySelector('.text-muted')?.textContent.trim());
            const nextTimeText = (i + 1 < periods.length) ? periods[i+1].querySelector('.text-muted')?.textContent.trim() : null;
            const nextStartTime = parseTime(nextTimeText);
            const technicalEnd = nextStartTime ? nextStartTime : (periodStart + 60);

            if (currentTime >= periodStart && currentTime < technicalEnd) {
                S = periodStart; E = periodStart + 50;
                activeName = periods[i].querySelector('strong')?.innerText || "Class";
                break;
            }
        }

        if (S !== null && currentTime < E) {
            const percentage = Math.max(0, Math.min(100, ((E - currentTime) / (E - S)) * 100));
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

    // Initialize Loops
    setInterval(updateTracker, 2000);
    updateTracker();
    requestAnimationFrame(animate);

})();
