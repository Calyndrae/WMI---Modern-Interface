// ==UserScript==
// @name          WMI - Subject Interaction
// @namespace     http://tampermonkey.net/
// @version       2.2
// @description   Fixed visibility check for host prompts and tooltips.
// @author        Gemini, Calyndrae
// @match         https://westlake.school.kiwi/*
// @grant         none
// @updateURL     https://raw.githubusercontent.com/Calyndrae/WMI---Modern-Interface/main/Tempermonkey%20Scripts/WMI%20-%20Subject%20Interaction.user.js
// @downloadURL   https://raw.githubusercontent.com/Calyndrae/WMI---Modern-Interface/main/Tempermonkey%20Scripts/WMI%20-%20Subject%20Interaction.user.js
// ==/UserScript==

(function() {
    'use strict';

    const subjectData = {
        "MAT": "Focus on Quadratic Equations, numbers",
        "SCI": "Physics & Chemistry",
        "ENG": "Literature Analysis",
        "SST": "History studies",
        "PED": "Physical Education and sports",
        "ART": "Creative expression of human emotion, imagination, and skill",
        "ADMIN": "Morning Roll Call & Notices",
        "HMT": "Learning how to cut, create, fix",
        "SPN": "Learning Spanish",
        "FSC": "Learn about finance skills",
        "WEL": "Wellbeing/Phisical Education",
        "DTC": "Design and innovation",
        "DRA": "Learning about drama",
        "MUS": "Music"
    };

    const subjectLinks = {
        "MAT": "https://westlake.bridge.school.nz/course_selection/learning_areas/1912",
        "ENG": "https://westlake.bridge.school.nz/course_selection/learning_areas/1905",
        "SCI": "https://westlake.bridge.school.nz/course_selection/learning_areas/1906",
        "HMT": "https://westlake.bridge.school.nz/course_selection/learning_areas/1911",
        "WEL": "https://westlake.bridge.school.nz/course_selection/learning_areas/1916",
        "PED": "https://westlake.bridge.school.nz/course_selection/learning_areas/1916",
        "SST": "https://westlake.bridge.school.nz/course_selection/learning_areas/1913",
        "SPN": "https://westlake.bridge.school.nz/course_selection/learning_areas/1910",
        "ART": "https://westlake.bridge.school.nz/course_selection/learning_areas/1897",
        "FSC": "https://westlake.bridge.school.nz/course_selection/learning_areas/1908",
        "DTC": "https://westlake.bridge.school.nz/course_selection/learning_areas/1915",
        "DRA": "https://westlake.bridge.school.nz/course_selection/learning_areas/2417",
        "MUS": "https://westlake.bridge.school.nz/course_selection/learning_areas/1900"
    };

    // --- IMPROVED MODAL CHECK ---
    function isWmiModalActive() {
        const modalIds = [
            'wmi-settings-modal',
            'custom-overlay',
            'wmi-logs-overlay',
            'wmi-bg-overlay',
            'wmi-cropper-overlay'
        ];

        for (let id of modalIds) {
            const el = document.getElementById(id);
            // Check if element exists AND is actually visible to the user
            if (el && window.getComputedStyle(el).display !== 'none') {
                return true;
            }
        }
        return false;
    }

    const tooltip = document.createElement('div');
    Object.assign(tooltip.style, {
        position: 'fixed',
        left: '0', top: '0',
        pointerEvents: 'none',
        display: 'none',
        padding: '6px 12px',
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(4px)',
        color: '#ffffff',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '400',
        zIndex: '20000000', // Higher than everything
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
        willChange: 'transform'
    });
    document.body.appendChild(tooltip);

    let mouseX = 0, mouseY = 0;

    function update() {
        if (tooltip.style.display === 'block') {
            tooltip.style.transform = `translate(${mouseX + 15}px, ${mouseY + 15}px)`;
        }
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);

    // --- HOVER LOGIC ---
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Block tooltips if a settings modal is open
        if (isWmiModalActive()) {
            tooltip.style.display = 'none';
            return;
        }

        const target = document.elementFromPoint(e.clientX, e.clientY);
        const box = target?.closest('.calendar-day');

        if (box) {
            const subjectTitle = box.querySelector('strong')?.innerText.trim().toUpperCase() || "";
            const matchKey = Object.keys(subjectData).find(key => subjectTitle.includes(key));
            let description = matchKey ? subjectData[matchKey] : "Subject Info: " + subjectTitle;

            const style = box.style.outline || box.style.border;
            let label = "";

            if (style.includes('rgb(215, 222, 217)') || style.includes('#d7ded9')) {
                label = "<strong> - CURRENT CLASS: </strong>";
            } else if (style.includes('rgb(26, 77, 36)') || style.includes('#1a4d24')) {
                label = "<strong> - NEXT CLASS: </strong>";
            }

            // Restore the "Click to view" host prompt
            const linkHint = (matchKey && subjectLinks[matchKey]) ? "<br><i style='font-size:10px; opacity:0.7'>Click to view course page</i>" : "";

            tooltip.innerHTML = label + description + linkHint;
            tooltip.style.display = 'block';
        } else {
            tooltip.style.display = 'none';
        }
    }, { passive: true });

    // --- CLICK LOGIC ---
    window.addEventListener('click', (e) => {
        if (isWmiModalActive()) return;

        const target = document.elementFromPoint(e.clientX, e.clientY);
        const box = target?.closest('.calendar-day');

        if (box) {
            const subjectTitle = box.querySelector('strong')?.innerText.trim().toUpperCase() || "";
            const matchKey = Object.keys(subjectLinks).find(key => subjectTitle.includes(key));

            if (matchKey && subjectLinks[matchKey]) {
                window.open(subjectLinks[matchKey], '_blank');
            }
        }
    });

})();
