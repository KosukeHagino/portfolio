'use strict';

/**************************************************
   グローバル変数
**************************************************/
// マウスの現在座標を保持
window.mouseX = 0;
window.mouseY = 0;


/**************************************************
   初期化処理
**************************************************/
// ローディング画面がないページ（＝トップページ以外）なら、すぐに表示フラグを立てる
if (!document.getElementById('js-loading')) {
    document.body.classList.add('content-ready');
}

// ページ読み込み時に一度だけ実行
const initCommon = () => {
    initCustomCursor();         // 追尾カーソルの開始
    initHamburgerMenu();        // メニュー開閉機能の有効化
    initPageTop();              // ページトップへ戻るボタンの有効化
    initScrollShow();           // スクロールに応じたコンテンツ表示の有効化
};

// ページ読み込み完了時に実行
window.addEventListener('load', initCommon);


/**************************************************
   [機能] 追尾カーソルの制御
**************************************************/
// マウスの動きに滑らかに追従するカスタムカーソルの実装
const initCustomCursor = () => {
    const cursor = document.getElementById('js-cursor');
    if (!cursor) return;

    let cursorX = 0;    // カーソルの現在のX座標
    let cursorY = 0;    // カーソルの現在のY座標

    // マウスが動くたびに座標を更新
    document.addEventListener('mousemove', (e) => {
        window.mouseX = e.clientX;
        window.mouseY = e.clientY;
    });

    // アニメーションループ
    // 毎フレーム実行され、カーソルをマウス位置へ滑らかに移動させる
    const animateCursor = () => {
        // 現在地から目標地点までの距離の15%ずつ移動させることでヌルヌル動かす
        cursorX += (window.mouseX - cursorX) * 0.15;
        cursorY += (window.mouseY - cursorY) * 0.15;

        // CSS変数を通じて位置を反映
        cursor.style.setProperty('--x', `${cursorX}px`);
        cursor.style.setProperty('--y', `${cursorY}px`);

        // 次の描画フレームでも呼び出す
        requestAnimationFrame(animateCursor);
    };
    requestAnimationFrame(animateCursor);

    // ホバーイベントの設定
    // 特定の要素に乗ったときにカーソルの見た目を変える
    const updateHoverEvents = () => {
        const hoverElements = document.querySelectorAll('a, button');
        hoverElements.forEach((el) => {
            el.addEventListener('mouseenter', () => cursor.classList.add('cursor-large'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-large'));
        });
    };
    updateHoverEvents();
};


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


/**************************************************
   [機能] スクロールに応じて表示
**************************************************/
const initScrollShow = () => {
    const targets = document.querySelectorAll('.js-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // 画面内に入ったら
            if (entry.isIntersecting) {
                entry.target.classList.add('is-show');
                // 一度表示したら監視を止める（パフォーマンス向上）
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null, // ブラウザの画面全体を監視
        rootMargin: '0px 0px -15% 0px', // 画面の下端から15%入ったところで発動
        threshold: 0 // 少しでも入ったら反応
    });

    targets.forEach(target => observer.observe(target));
};
