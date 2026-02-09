// ==UserScript==
// @name         WMI - Web Edit Belonging Info
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  强制在页面最底部显示版权信息
// @author       Gemini, Calyndrae
// @match        https://westlake.school.kiwi/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function injectFooter() {
        if (document.getElementById('custom-site-footer')) return;

        // 创建页脚容器
        const footer = document.createElement('div');
        footer.id = 'custom-site-footer';

        // 使用更强的样式确保它显示在最底层，且不会被遮挡
        Object.assign(footer.style, {
            width: '100%',
            padding: '30px 0',
            textAlign: 'center',
            color: '#64748b',
            fontSize: '11px',
            fontFamily: "Inter, sans-serif",
            background: 'transparent',
            marginTop: 'auto', // 尝试推到容器底部
            clear: 'both'
        });

        footer.innerHTML = `
            <div style="opacity: 0.6; letter-spacing: 1px;">
                WESTLAKE MODERN INTERFACE © 2026<br>
                <span style="font-size: 9px;">DEVELOPED BY GEMINI, CALYNDRAE</span>
            </div>
        `;

        // 策略：尝试插入到主要的卡片容器之后，或者 body 的最后
        const mainContainer = document.querySelector('.container-fluid') || document.querySelector('.container') || document.body;
        mainContainer.appendChild(footer);
    }

    // 初始注入
    setTimeout(injectFooter, 1000); // 延迟一秒执行，确保页面加载完了

    // 持续检查
    const observer = new MutationObserver(injectFooter);
    observer.observe(document.body, { childList: true, subtree: true });
})();
