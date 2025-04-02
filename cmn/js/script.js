'use strict';

/* ローディング画面（タイプライター風） */

// .loading_text クラスを持つ要素を取得
let element = document.querySelector('.loading_text');

// もし .loading_text 要素が存在するなら
if (element) {
    setTimeout(() => {
        // 0.5秒後に要素を表示
        element.style.visibility = 'visible';
        // テキストアニメーションを開始
        animateText(element);
    }, 500);
}

// テキストを1文字ずつ表示するアニメーション関数
function animateText(element) {
    // 要素のテキストを取得し、前後の空白を削除
    let text = element.textContent.trim();
    // 要素のテキストをクリア
    element.textContent = "";

    // カーソルを表す要素を作成
    let cursor = document.createElement('span');
    cursor.classList.add('cursor'); // CSSでカーソルをスタイル指定する前提
    // カーソルを追加
    element.appendChild(cursor);

    let i = 0; // 文字のインデックス
    function typeNextChar() {
        // まだ文字が残っている場合
        if (i < text.length) {
            let charSpan = document.createElement('span'); // 1文字分の要素を作成
            charSpan.textContent = text[i]; // 文字を設定
            element.insertBefore(charSpan, cursor); // カーソルの前に文字を挿入
            i++; // 次の文字へ
            setTimeout(typeNextChar, 100); // 0.1秒後に次の文字を追加
        } else {
            // 全部の文字が表示されたら、0.3秒後にカーソルを削除
            setTimeout(() => cursor.remove(), 300);
        }
    }
    
    typeNextChar(); // アニメーション開始
}

// ローディング画面の要素を取得
const loadingElement = document.getElementById('loading');

// ローディング画面を非表示にする関数
function hideLoadingText() {
    if (element) { // 要素が存在する場合のみ実行
        loadingElement.style.transition = 'opacity 1s ease, visibility 1s ease'; // CSSトランジション設定
        loadingElement.style.opacity = 0; // 徐々に透明にする
        setTimeout(() => element.remove(), 1200); // 1.2秒後に削除
    }
}

// ローディング画面を非表示にする関数
function hideLoading() {
    if (loadingElement) { // 要素が存在する場合のみ実行
        loadingElement.style.transition = 'opacity 2s ease, visibility 2s ease'; // CSSトランジション設定
        loadingElement.style.opacity = 0; // 徐々に透明にする
        loadingElement.style.visibility = 'hidden'; // 完全に非表示
    }
}

// ページが初回訪問かどうかをセッションストレージで確認
if (!sessionStorage.getItem('firstVisit')) {
    // 初回訪問の場合、セッションストレージにフラグをセット
    sessionStorage.setItem('firstVisit', 'true');

    // 6秒後にローディング画面を非表示にする
    setTimeout(hideLoading, 6000);
} else if (loadingElement) {
    // 初回訪問ではない場合、ローディング画面を即座に非表示にする
    loadingElement.style.display = 'none';
}





/* プロフィール・ワークス　セクションスライド */
window.addEventListener('load', () => {
    setTimeout(() => {
        const slide_wrapper = document.getElementById('slide_wrapper');
        const leftBtn = document.getElementById('left');
        const rightBtn = document.getElementById('right');

        if (rightBtn && leftBtn) {
            const section = document.querySelectorAll('#slide_wrapper section');
            let idx = 0;

            function changeImage() {
                if (idx > section.length - 1) {
                    idx = 0;
                } else if (idx < 0) {
                    idx = section.length - 1;
                }

                slide_wrapper.style.transform = `translateX(${-idx * 33.33}%)`;
            }

            rightBtn.addEventListener('click', () => {
                idx++;
                changeImage();
            });

            leftBtn.addEventListener('click', () => {
                idx--;
                changeImage();
            });
        } else {
            console.error('ボタン要素が見つかりません');
        }
    }, 100); // 少し遅延を与えてから処理を実行
});




/* ワークス　マインドマップとデザインカンプをモーダル表示 */
const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const thumbnails = document.querySelectorAll(".thumbnail");

// 各ボタンにクリックイベントを設定
thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener("click", function (event) {
        event.preventDefault(); // aタグのデフォルト動作を防ぐ
        modalImage.src = this.getAttribute("data-full"); // 拡大画像のURL取得
        modal.classList.add("show"); // フェードイン
    });
});

// モーダルの背景をクリックするとフェードアウト
modal.addEventListener("click", function () {
    modal.classList.remove("show"); // フェードアウト
});



/* お問い合わせフォームの内容を読み取る */
// フォームの入力を検証する関数
function goToConfirm() {
    const inquiryType = document.querySelector('input[name="subject"]:checked');
    const name = document.getElementById('name').value.trim();
    const company = document.getElementById('company').value.trim();
    const mail = document.getElementById('mail').value.trim();
    const message = document.getElementById('message').value.trim();
    const privacyChecked = document.getElementById('privacy_policy').checked;

    if (!inquiryType || !name || !mail || !message) {
        alert('お問い合わせ種別、お名前、メールアドレス、お問い合わせ内容は必須です。');
        return;
    }

    if (!privacyChecked) {
        alert('プライバシーポリシーに同意してください。');
        return;
    }
    
    const queryString = `?subject=${encodeURIComponent(inquiryType.value)}&name=${encodeURIComponent(name)}&company=${encodeURIComponent(company)}&mail=${encodeURIComponent(mail)}&message=${encodeURIComponent(message)}`;
    window.location.href = 'confirm.html' + queryString;
}





/* お問い合わせフォームの入力内容を確認する */
// URLのクエリパラメータを取得する関数
function getQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        subject: urlParams.get('subject'),
        name: urlParams.get('name'),
        company: urlParams.get('company'),
        mail: urlParams.get('mail'),
        message: urlParams.get('message')
    };
}

// 確認画面にデータを表示する関数
function displayConfirmData() {
    const { subject, name, company, mail, message } = getQueryParams();
    document.getElementById('confirmInquiryType').textContent = subject || '未選択';
    document.getElementById('confirmName').textContent = name || '未入力';
    document.getElementById('confirmCompany').textContent = company || '未入力';
    document.getElementById('confirmMail').textContent = mail || '未入力';
    document.getElementById('confirmMessage').textContent = message || '未入力';
}

// 戻るボタンの処理
function goBack() {
    window.history.back();
}

// 送信ボタンの処理
function submitForm() {
    alert('送信されました！');
    // 実際のフォーム送信処理をここで追加
}

window.onload = displayConfirmData;





/* マインドマップ、デザインカンプをモーダル表示 */
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("imageModal");
    const thumbnail = document.getElementById("thumbnail");

    // 画像をクリックしたらモーダルを表示
    thumbnail.addEventListener("click", function () {
        modal.style.display = "flex";
    });

    // モーダルの背景をクリックしたら閉じる
    modal.addEventListener("click", function () {
        modal.style.display = "none";
    });
});