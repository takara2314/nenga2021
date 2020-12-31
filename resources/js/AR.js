let userID = 'Unknown';
let userDevice = 'Unknown';
let userBrowser = 'Unknown';

// 要素を関連付ける
let userpassElement = document.getElementById('userpass');
let loginMessageElement = document.getElementById('loginMessage');
let authButtonElement = document.getElementById('authButton');

// 認証ボタンが押されたら
authButtonElement.addEventListener('click', () => {
    // 名前かパスワードのどちらかが入力されていなかったら
    if (userpassElement.value === '') {
        loginMessageElement.innerHTML = '上のフォームにパスワードを入力してください。';
        // イベントキャンセル
        preventDefault();
    }

    // ユーザー情報を格納する連想配列
    let userInfo = {
        'userPassword': userpassElement.value,
    };

    // XMLHttpRequest
    let xhr = new XMLHttpRequest();
    // JSON形式でレスポンスを受け取る
    xhr.responseType = 'json';

    xhr.addEventListener('loadend', () => {
        if (xhr.status === 200) {
            loginMessageElement.innerHTML = '認証に成功しました。少々お待ちください。';
            res = xhr.response;
            userID = res.id;
            userDevice = res.device;
            userBrowser = res.browser;
            htmlChange();
        } else if (xhr.status === 401) {
            loginMessageElement.innerHTML = 'パスワードが間違っています。';
        } else {
            loginMessageElement.innerHTML = '認証サーバーで問題が発生しました。時間をおいてお試しください。';
        }
    });

    // 認証サーバーにJSONで認証情報をPOSTする
    xhr.open('POST', 'https://nenga2021.2314.tk/auth');
    xhr.setRequestHeader('content-type', 'application/json');
    // ユーザー情報を認証サーバーに転送
    xhr.send(
        JSON.stringify(userInfo)
    );
})

const htmlChange = () => {
    let mainElement = document.getElementsByTagName('main')[0];

    // Apple製のデバイスでは、Safari以外カメラ非対応
    if ((userDevice === 'Macintosh' || userDevice === 'iPhone' || userDevice === 'iPad' || userDevice === 'iPod') && (userBrowser !== 'Safari')) {
        mainElement.innerHTML = `<p id="authed">本人確認できました。</p><h1 id="cameraBlocked">Safariを使用してください</h1><p class="cameraMemo">ARによる演出のため、カメラを使用します。</p><p class="cameraMemo">${userDevice}では、Safari以外でカメラを使用することができないので、Safariでこのサイトを開き直してください。</p>`
    } else {
        mainElement.innerHTML = '<p id="authed">本人確認できました。</p><h1>カメラを許可してください</h1><p class="cameraMemo">ARによる演出のため、カメラの使用を許可してください。</p><p class="cameraMemo">カメラの映像がサーバーに転送されることはないので、ご安心ください。</p>';

        // バックカメラが利用可能かを見る
        // (利用可能かを見た後に、自動的に次にフロントカメラを使用する設定にしてくれる)
        navigator.mediaDevices.getUserMedia({video: {facingMode: "environment"}}).then(
            () => {
                mainElement.remove();

                let coreScriptElement = document.createElement('script');
                coreScriptElement.src = './resources/js/ARcore.js';
                coreScriptElement.type = 'text/javascript';
                document.body.appendChild(coreScriptElement);

                let explainSectionElement = document.createElement('section');
                explainSectionElement.id = 'arExplain';
                explainSectionElement.innerHTML = 'カメラをQRコードに向けてみよう！';
                document.body.appendChild(explainSectionElement);
            },
            () => {
                mainElement.innerHTML = '<p id="authed">本人確認できました。</p><h1 id="cameraBlocked">カメラをブロックしないでください</h1><p class="cameraMemo">ARによる演出のために、カメラの映像を使用する必要があります。</p><p class="cameraMemo">演出を見る場合は、カメラを許可してください。</p><p class="cameraMemo">カメラの映像がサーバーに転送されることはないので、ご安心ください。</p>';
            }
        );
    }
}