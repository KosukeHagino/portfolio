'use strict';

/**************************************************
   初回訪問判定
**************************************************/
// ちらつき防止のため、読み込みを待たずに即実行
const hasLoaded = sessionStorage.getItem('has-loaded');
if(!hasLoaded) {
    document.body.classList.add('is-loading');
}



/**************************************************
   定数・変数管理
**************************************************/
// ページ全体の演出設定
const TOP_CONFIG = {
    // --- ローディング演出関連 ---
    LOADING_PRE_WAIT: 300,          // ページ読み込み後、カウンターを表示するまでのタメ
    COUNTUP_START_DELAY: 900,       // カウンター表示後、数字が動き出すまでの待機時間
    COUNTUP_SPEED: 50,              // カウントアップの更新間隔
    LOADING_END_WAIT: 900,          // 100%に達してから黒い幕を開くまでの余韻

    // --- 遷移（2回目以降）関連 ---
    REVISIT_READY_DELAY: 300,       // 2回目以降の訪問時に演出を開始するまでのタメ

    // --- スクロール演出関連 ---
    OPENING_SCROLL_DELAY: 1500,     // 幕を開き始めてから1枚目のスクロールを開始するまでの待ち時間
    AUTO_SCROLL_DELAY: 600,         // 自動スクロール関数が呼ばれてから実際に動き出すまでの実行遅延
    NEXT_SLIDE_DELAY: 3000,         // 1枚目表示後、2枚目へ移動するまでの待機時間
};

// タイマー管理（一括キャンセル用）
const timers = {
    autoScroll: null,               // 1枚目への移動予約用
    nextSlide: null                 // 2枚目への移動予約用
}



/**************************************************
   初期化処理
**************************************************/
// ページ読み込み時に一度だけ実行
const initTopPage = () => {
    initWorksScrollObserver();      // スクロール監視とテキスト連動の仕組みを起動
    initIndicator();                // スマホ用ドットインジケーターを作成
    initLoading();                  // ローディング演出を開始
};

// 全てのリソースが読み込まれてから初期化を開始
window.addEventListener('load', initTopPage);



/**************************************************
   [機能] 制作物スライドの監視と連動
**************************************************/
const initWorksScrollObserver = () => {
    // 要素の取得
    const workVisualList = document.getElementById('js-work-visual-list');
    const workInfoList = document.getElementById('js-work-info-list');
    const workVisualItems = document.querySelectorAll('.p-work-visual__item');
    const workInfoItems = document.querySelectorAll('.p-work-info__item');
    if (!workVisualList || !workInfoList) return;

    // 中央に来た画像に合わせて、テキストの状態と位置を更新
    const updateActiveState = (index) => {

        // 画像側のクラス制御（拡大演出など用）
        workVisualItems.forEach(item => item.classList.remove('is-active'));
        if (workVisualItems[index]) {
            workVisualItems[index].classList.add('is-active');
        }
        
        // CSS側での計算用：インデックスをカスタムプロパティと属性にセット
        workInfoList.setAttribute('data-current-index', index);
        workInfoList.style.setProperty('--current', index);

        // 各テキストアイテムに中央からの距離（差分）を付与
        workInfoItems.forEach((item, i) => {
            item.setAttribute('data-index-diff', i - index);
        });

        // インジケーターも更新
        updateIndicator(index);
    };

    const options = {
        root: workVisualList,           // 監視する親要素
        threshold: 0.1,                 // 10%入れば反応（SEなどの小画面対策）
        rootMargin: "0px -25% 0px -25%" // 中央50%のエリアを監視
    }

    // 交差監視（Intersection Observer）の設定
    // 左右25%のrootMarginにより、画面中央の50%エリアに入った瞬間を検知
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 文字列から数値に変換する（SEなどのブラウザ挙動を安定させるため）
                const index = Number(entry.target.getAttribute('data-index'));
                updateActiveState(index);
            } else {
                entry.target.classList.remove('is-active');
            }
        });
    }, options );

    // 全ての画像を監視対象に登録
    workVisualItems.forEach(item => observer.observe(item));
};



/**************************************************
   [機能] ローディング演出
**************************************************/
const initLoading = () => {
    // 要素の取得
    const numEl = document.getElementById('js-loading-num');
    if (!numEl) return;

    // 判定と初期状態のセット
    if (document.body.classList.contains('is-loading')) {
        // 初回：カウントアップ演出
        setTimeout(() => {
            const counter = document.getElementById('js-loading-counter');
            if (counter) counter.classList.add('is-active');    // 数字を出す

            setTimeout(() => updateCount(numEl, 0) , TOP_CONFIG.COUNTUP_START_DELAY);      // 少し遅らせてからカウント開始
        }, TOP_CONFIG.LOADING_PRE_WAIT);
    } else {
        // 2回目以降：即座に表示準備
        setTimeout(() => {
            document.body.classList.add('is-ready');
            showContentDirectly();
        }, TOP_CONFIG.REVISIT_READY_DELAY);
    }
};

// カウントアップの再帰処理
const updateCount = (el, current) => {
    let nextCount = current + (Math.floor(Math.random() * 3) + 1);      // 1～3をランダムで加算して変数に代入

    if (nextCount >= 100) {
        el.textContent = 100;
        setTimeout(endLoading, TOP_CONFIG.LOADING_END_WAIT);    // 100%になってから少し余韻を置く
    } else {
        el.textContent = nextCount;
        setTimeout(() => updateCount(el, nextCount), TOP_CONFIG.COUNTUP_SPEED);     // 加算
    }
};


// ローディング終了
const endLoading = () => {
    sessionStorage.setItem('has-loaded', 'true');
    // 幕を開ける
    document.body.classList.remove('is-loading');
    
    // 幕が開ききってから、中身の文字フェードインアニメーションを開始
    setTimeout(() => {
        document.body.classList.add('is-ready');

        // スクロール処理へ
        showContentDirectly();
    }, TOP_CONFIG.OPENING_SCROLL_DELAY);
};

// 表示後の自動スクロール
const showContentDirectly = () => {
    // 要素を取得
    const workVisualList = document.getElementById('js-work-visual-list');
    const firstWork = document.querySelector('.p-work-visual__item[data-index="0"]');
    const secondWork = document.querySelector('.p-work-visual__item[data-index="1"]');
    if (!workVisualList || !firstWork) return;

    const offset1 = firstWork.offsetLeft + (firstWork.clientWidth / 2) - (workVisualList.clientWidth / 2);

    // ユーザー操作によるキャンセル（イベントリスナー登録）
    const cancelAutoScroll = () => {
        Object.values(timers).forEach(timer => clearTimeout(timer));
        workVisualList.removeEventListener('wheel', cancelAutoScroll);
        workVisualList.removeEventListener('touchstart', cancelAutoScroll);
    };

    // 1枚目へ移動
    timers.autoScroll = setTimeout(() => {
        workVisualList.scrollTo({ left: offset1, behavior: 'smooth'});

        // 2枚目へ移動
        timers.nextSlide = setTimeout(() => {
            if (secondWork) {
                const offset2 = secondWork.offsetLeft + (secondWork.clientWidth / 2) - (workVisualList.clientWidth / 2);
                workVisualList.scrollTo({ left: offset2, behavior: 'smooth' });
            }
        }, TOP_CONFIG.NEXT_SLIDE_DELAY);

    }, TOP_CONFIG.AUTO_SCROLL_DELAY);

    workVisualList.addEventListener('wheel', cancelAutoScroll);
    workVisualList.addEventListener('touchstart', cancelAutoScroll);
};



/**************************************************
   [機能] スマホ用インジケーター（ドット）
**************************************************/
const initIndicator = () => {
    // 要素の取得
    const workVisualItems = document.querySelectorAll('.p-work-visual__item');
    const indicator = document.getElementById('js-indicator');
    if (!indicator || workVisualItems.length === 0) return;

    // 再読み込みやリセット時に、ドットが重複して生成されるのを防止
    indicator.innerHTML = '';

    // スライドの数だけドットを生成してDOMに追加
    workVisualItems.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('p-indicator__dot');

        // 最初の要素に初期アクティブクラスを付与
        if (index === 0) {
            dot.classList.add('is-active');
        }

        indicator.appendChild(dot);
    });
};

// インジケーターの表示更新
// 現在表示されているスライドのインデックス番号を受け取り、アクティブクラスを切替
const updateIndicator = (index) => {
    // 要素の取得
    const dots = document.querySelectorAll('.p-indicator__dot');
    if (dots.length === 0) return;

    // 引数で受け取ったindexと、ループのiが一致するドットにだけクラスを付与（他は削除）
    dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index)
    });
};
