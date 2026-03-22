'use strict';

/**************************************************
   初期化処理（ページ読み込み時に一度だけ実行）
**************************************************/
const initTopPage = () => {
    initWorksScrollObserver();  // スクロール監視とテキスト連動の仕組みを起動
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
    };

    // 交差監視（Intersection Observer）の設定
    // 左右25%のrootMarginにより、画面中央の50%エリアに入った瞬間を検知
    const observer = new IntersectionObserver((entries) => {
        // 中央に入った要素のみを抽出
        const intersectingEntry = entries.find(entry => entry.isIntersecting);

        if (intersectingEntry) {
            // 監視対象（workVisualItems）の中の何番目かを特定
            const index = Array.from(workVisualItems).indexOf(intersectingEntry.target);
            if (index !== -1) {
                updateActiveState(index);
            }
        }
    }, { 
        root: workVisualList,           // 監視する親要素
        threshold: 0.6,                 // 60%以上露出で検知（スナップ動作に合わせる）
        rootMargin: "0px -25% 0px -25%" // 判定エリアを中央50%に絞り込む
    });

    // 全ての画像を監視対象に登録
    workVisualItems.forEach(item => observer.observe(item));
};
