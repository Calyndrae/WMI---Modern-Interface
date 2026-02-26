//==UserScript==
// @name         WMI - Subject Tracker
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Current: Grey, Next: Green. Fixes overlaps and 50min duration logic.
// @author       Gemini, Calyndrae
// @match        https://westlake.school.kiwi/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/Calyndrae/WMI---Modern-Interface/main/Tempermonkey%20Scripts/WMI%20-%20Subject%20Tracker.user.js
// @downloadURL  https://raw.githubusercontent.com/Calyndrae/WMI---Modern-Interface/main/Tempermonkey%20Scripts/WMI%20-%20Subject%20Tracker.user.js
// ==/UserScript==

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
        // --- HOLIDAY CHECK ---
        const todayCol = document.querySelector('.is-today') || document.querySelector('.tt-day-wrap:not(.not-today)');

        if (!todayCol || todayCol.querySelector('.is-closed')) {
            const allBoxes = document.querySelectorAll('.calendar-day');
            allBoxes.forEach(p => {
                p.style.removeProperty('outline');
                p.style.removeProperty('box-shadow');
            });
            return;
        }

        const periods = Array.from(todayCol.querySelectorAll('.calendar-day:not(.non-period)'));
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        let currentIdx = -1;
        let nextIdx = -1;

        // --- STEP 1: CLEANUP ---
        periods.forEach(p => {
            p.style.removeProperty('outline');
            p.style.removeProperty('box-shadow');
            p.style.borderTop = "";
            p.style.borderRight = "";
            p.style.borderBottom = "";
        });

        // --- STEP 2: LOGIC ---
        // We loop through all periods to find the BEST match.
        for (let i = 0; i < periods.length; i++) {
            const timeText = periods[i].querySelector('.text-muted')?.textContent.trim();
            const startTime = parseTime(timeText);
            if (startTime === null) continue;

            // Define "Current" as starting within the last 50 minutes
            const endTime = startTime + 50;

            if (currentTime >= startTime && currentTime < endTime) {
                // If multiple subjects overlap, the one that starts LATER (higher index)
                // will overwrite currentIdx as we loop forward.
                currentIdx = i;
            }
        }

        // --- STEP 3: FIND NEXT ---
        if (currentIdx !== -1) {
            // If we are in a subject, the next one is simply the next in the list
            if (currentIdx + 1 < periods.length) {
                nextIdx = currentIdx + 1;
            }
        } else {
            // If we aren't in a subject, find the first one that hasn't started yet
            for (let i = 0; i < periods.length; i++) {
                const startTime = parseTime(periods[i].querySelector('.text-muted')?.textContent.trim());
                if (startTime > currentTime) {
                    nextIdx = i;
                    break;
                }
            }
        }

        // --- STEP 4: APPLY HIGHLIGHTS ---
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
