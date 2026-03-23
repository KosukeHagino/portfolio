'use strict';

/**************************************************
   初期化処理
**************************************************/
// 初期化処理
const initCommon = () => {
    initHamburgerMenu();        // メニュー開閉機能の有効化
};

// ページ読み込み完了時に実行
window.addEventListener('load', initCommon);



/**************************************************
   [機能] ハンバーガーメニューの開閉制御
**************************************************/
const initHamburgerMenu = () => {
    // 要素の取得
    const menuBtn = document.getElementById('js-hamburger');
    const nav = document.getElementById('js-header-nav');
    const body = document.body;
    if (!menuBtn || !nav) return;

    menuBtn.addEventListener('click', () => {
        // 現在の状態（開いているか）を判定
        const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';

        // クラスの着脱
        // is-active クラスをトリガーに、CSSでアニメーションさせる
        menuBtn.classList.toggle('is-active');
        nav.classList.toggle('is-active');
        body.classList.toggle('is-fixed');

        // アクセシビリティ属性の更新
        menuBtn.setAttribute('aria-expanded', !isExpanded);
    });
};
