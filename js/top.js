'use strict';

/**************************************************
   初期化処理（ページ読み込み時に一度だけ実行）
**************************************************/
const initTopPage = () => {
    initWorksScrollObserver();      // スクロール監視とテキスト連動の仕組みを起動
    initIndicator();                // スマホ用ドットインジケーターを作成
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

    // 取得失敗時は実行しない
    if (!workVisualList || !workInfoList) return;

    // 中央に来た画像に合わせて、テキストの状態と位置を更新
    const updateActiveState = (index) => {

        // 画像側のクラス制御（拡大演出など用）
        workVisualItems.forEach(item => item.classList.remove('is-active'));
        if (workVisualItems[index]) {
            workVisualItems[index].classList.add('is-active');
        }
        
        // CSS側での計算用：インデックスをカスタムプロパティにセット
        workInfoList.style.setProperty('--current-index', index);
        workInfoList.setAttribute('data-current-index', index);

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
   [機能] スマホ用インジケーター（ドット）
**************************************************/
const initIndicator = () => {
    // 要素の取得
    const workVisualItems = document.querySelectorAll('.p-work-visual__item');
    const indicator = document.getElementById('js-indicator');

    // 取得失敗時は実行しない
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

    // 取得失敗時は実行しない
    if (dots.length === 0) return;

    // 引数で受け取ったindexと、ループのiが一致するドットにだけクラスを付与（他は削除）
    dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index)
    });
};
