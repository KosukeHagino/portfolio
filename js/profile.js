'use strict';

/**************************************************
   初期化処理
**************************************************/
// 初期化処理
const initProcess = () => {
    initProcessTabs();      // プロセス項目の切り替え機能を有効化
};


// ページ読み込み完了時に実行
window.addEventListener('load', initProcess);


/**************************************************
   [機能] プロセス項目の切り替え
**************************************************/
const initProcessTabs = () => {
    // 全てのグループを取得
    const approachGroups = document.querySelectorAll('.js-approach-group');

    approachGroups.forEach((group) => {
        // グループ内のアイテムを取得
        const items = group.querySelectorAll('.js-approach-item');

        items.forEach((item) => {
            item.addEventListener('click', () => {
                // 同じグループ内の他のアイテムからis-activeを外す
                group.querySelector('.is-active').classList.remove('is-active');
                
                // クリックされたアイテムにis-activeをつける
                item.classList.add('is-active');
            });
        });
    });
};
