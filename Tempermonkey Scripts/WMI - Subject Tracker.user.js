//==UserScript==
// @name         WMI - Subject Tracker
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Current: Grey, Next: Green. Preserves your original theme!
// @author       Gemini, Calyndrae
// @match        https://westlake.school.kiwi/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/Calyndrae/WMI---Modern-Interface/main/Tempermonkey%20Scripts/WMI%20-%20Subject%20Tracker.user.js
// @downloadURL  https://raw.githubusercontent.com/Calyndrae/WMI---Modern-Interface/main/Tempermonkey%20Scripts/WMI%20-%20Subject%20Tracker.user.js
// ==/UserScript==

function updateTracker() {
        // --- HOLIDAY CHECK ---
        // If the "is-today" column contains an "is-closed" box, stop everything.
        const todayCol = document.querySelector('.is-today') || document.querySelector('.tt-day-wrap:not(.not-today)');

        if (!todayCol || todayCol.querySelector('.is-closed')) {
            console.log("Tracker: School is closed or column not found. Standing down.");

            // Cleanup any leftover outlines just in case
            const allBoxes = document.querySelectorAll('.calendar-day');
            allBoxes.forEach(p => {
                p.style.removeProperty('outline');
                p.style.removeProperty('box-shadow');
            });
            return;
        }

        // ... rest of the code (periods, currentTime, logic, etc.)
    }

(function() {
    'use strict';

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
        if (!todayCol) return;

        const periods = Array.from(todayCol.querySelectorAll('.calendar-day:not(.non-period)'));
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        let currentIdx = -1;
        let nextIdx = -1;

        // --- STEP 1: ONLY REMOVE OUR SPECIFIC HIGHLIGHTS ---
        periods.forEach(p => {
            p.style.removeProperty('outline'); // Using outline to avoid touching your border theme
            p.style.removeProperty('box-shadow');
            // Ensure we don't kill your existing border-left
            p.style.borderTop = "";
            p.style.borderRight = "";
            p.style.borderBottom = "";
        });

        // --- STEP 2: LOGIC ---
        for (let i = 0; i < periods.length; i++) {
            const timeText = periods[i].querySelector('.text-muted')?.textContent.trim();
            const startTime = parseTime(timeText);
            if (startTime === null) continue;

            const nextTimeText = (i + 1 < periods.length) ? periods[i+1].querySelector('.text-muted')?.textContent.trim() : null;
            const nextStartTime = parseTime(nextTimeText);
            const endTime = nextStartTime ? nextStartTime : startTime + 60;

            if (currentTime >= startTime && currentTime < endTime) {
                currentIdx = i;
                if (i + 1 < periods.length) nextIdx = i + 1;
                break;
            }
            if (i === 0 && currentTime < startTime) {
                nextIdx = 0;
                break;
            }
        }

        // --- STEP 3: APPLY HIGHLIGHTS USING OUTLINE ---
        // I'm using 'outline' instead of 'border' so your green left-bar stays visible.
        if (currentIdx !== -1) {
            periods[currentIdx].style.setProperty('outline', '6px solid #d7ded9', 'important');
            periods[currentIdx].style.setProperty('outline-offset', '-6px', 'important');
            periods[currentIdx].style.setProperty('box-shadow', 'inset 0 0 10px rgba(215, 222, 217, 0.3)', 'important');
        }

        if (nextIdx !== -1) {
            periods[nextIdx].style.setProperty('outline', '6px solid #1a4d24', 'important');
            periods[nextIdx].style.setProperty('outline-offset', '-6px', 'important');
            periods[nextIdx].style.setProperty('box-shadow', '0 0 15px rgba(26, 77, 36, 0.3)', 'important');
        }
    }

    setInterval(updateTracker, 5000);
    updateTracker();
})();
