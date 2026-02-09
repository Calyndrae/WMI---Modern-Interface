// ==UserScript==
// @name         WMI - Blank Subject Block FIx
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  None
// @author       Gemini, Calyndrae
// @match        https://westlake.school.kiwi/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function syncLayout() {
        const allBoxes = document.querySelectorAll('.calendar-day');

        allBoxes.forEach(box => {
            const h6 = box.querySelector('h6');
            if (!h6) return;

            const text = h6.innerText.trim().toUpperCase();

            // 1. 物理删除 AM/PM
            if (text === 'AM' || text === 'PM') {
                box.style.setProperty('display', 'none', 'important');
                return;
            }

            // 2. 改造空白 Period 盒子 (带有 non-period 类的)
            if (box.classList.contains('non-period')) {
                const periodTitle = h6.innerText; // 获取 "Period 1" 等

                // 注入标准三层 HTML 结构
                box.innerHTML = `
                    <div class="d-flex align-items-top justify-content-between">
                        <h6>${periodTitle}</h6>
                        <small class="text-muted">NONE</small>
                    </div>
                    <div class="d-flex align-items-center justify-content-between">
                        <strong class="b-block text-center">&nbsp;</strong>
                        <div class="h-100">
                            <div class="btn-sm">&nbsp;</div>
                        </div>
                    </div>
                    <div class="d-flex align-items-center justify-content-between">
                        <small>&nbsp;</small>
                        <small>NONE</small>
                    </div>
                `;

                // 3. 样式修正：移除淡化效果，使其继承 Stylebot 的大阴影卡片样式
                box.style.opacity = '1';
                box.style.border = 'none';
                box.classList.remove('non-period');

                // 确保它有 sk_border 类
                if (!box.classList.contains('sk_border')) {
                    box.classList.add('sk_border');
                }
            }
        });
    }

    // Run and start listening.
    syncLayout();
    const observer = new MutationObserver(syncLayout);
    observer.observe(document.body, { childList: true, subtree: true });
})();
