// ==UserScript==
// @name         WMI - Clock
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Forces the clock to the exact center of the header
// @author       Gemini, Calyndrae
// @match        https://westlake.school.kiwi/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 1. Create the Clock Element
    const clockDiv = document.createElement('div');
    clockDiv.id = 'tm-header-clock';

    // 2. Style the Clock (Forced Centering)
    Object.assign(clockDiv.style, {
        position: 'absolute',    // Ignores other elements
        left: '50%',             // Moves to middle
        transform: 'translateX(-50%)', // Offsets itself to be perfectly centered
        color: '#334155',        // Dark grey to match heading
        fontWeight: '800',
        fontSize: '1.2rem',
        padding: '5px 20px',
        background: 'rgba(241, 245, 249, 0.9)',
        borderRadius: '50px',
        fontFamily: 'monospace',
        border: '1px solid #e2e8f0',
        zIndex: '1000',          // Ensures it stays on top
        whiteSpace: 'nowrap'
    });

    // 3. Update Time with Blinking Effect
    function updateClock() {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');

        // Use a span for the colons to make them look nice
        clockDiv.innerHTML = `${hh}<span class="clock-sep">:</span>${mm}<span class="clock-sep">:</span>${ss}`;
    }

    // 4. Inject into Header
    const headerContent = document.querySelector('.sk_header_content');
    if (headerContent) {
        headerContent.style.position = 'relative'; // Allows absolute positioning inside
        headerContent.appendChild(clockDiv);
    }

    // Start the clock
    setInterval(updateClock, 1000);
    updateClock();
})();
