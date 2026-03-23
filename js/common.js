'use strict';

/**************************************************
   初期化処理
**************************************************/
// ページ読み込み時に一度だけ実行
const initCommon = () => {
    initHamburgerMenu();        // メニュー開閉機能の有効化
    initPageTop();              // ページトップへ戻るボタンの有効化
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



/**************************************************
   [機能] ページトップへ戻るボタン
**************************************************/
const initPageTop = () => {
    // 要素の取得
    const pageTopBtn = document.getElementById('js-pagetop');
    const workVisualList = document.getElementById('js-work-visual-list');      // トップの横スクロール要素
    if (!pageTopBtn) return;

    const handleScroll = () => {
        // windowの縦スクロール OR workListの横スクロール を合算して判定
        const scrolledY = window.scrollY;
        const scrolledX = workVisualList ? workVisualList.scrollLeft : 0;

        if (scrolledY > 300 || scrolledX > 300) {
            pageTopBtn.classList.add('is-show');
        } else {
            pageTopBtn.classList.remove('is-show');
        }
    };

    // 縦スクロール（全ページ）を監視
    window.addEventListener('scroll', handleScroll);
    
    // 横スクロール（トップページ）も監視
    if (workVisualList) {
        workVisualList.addEventListener('scroll', handleScroll);
    }

    // クリックイベント
    pageTopBtn.addEventListener('click', () => {
        // 縦を戻す
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // もしトップページなら横も戻す
        if (workVisualList) {
            workVisualList.scrollTo({ left: 0, behavior: 'smooth' });
        }
    });
};
