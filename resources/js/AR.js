console.log('hey');

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

    xhr.addEventListener('loadend', () => {
        if (xhr.status === 200) {
            loginMessageElement.innerHTML = '認証に成功しました。少々お待ちください。';
            htmlChange(xhr.response);
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

const htmlChange = (html) => {
    let mainElement = document.getElementsByTagName('main')[0];
    let bodyElement = mainElement.parentElement;
    mainElement.remove();

    // let threeScriptElement = document.createElement('script');
    // threeScriptElement.src = './resources/js/three.min.js';
    // threeScriptElement.type = 'text/javascript';
    // bodyElement.appendChild(threeScriptElement);

    // let threeGLTFScriptElement = document.createElement('script');
    // threeGLTFScriptElement.src = './resources/js/GLTFLoader.js';
    // threeGLTFScriptElement.type = 'text/javascript';
    // bodyElement.appendChild(threeGLTFScriptElement);

    // let arScriptElement = document.createElement('script');
    // arScriptElement.src = './resources/js/ar.min.js';
    // arScriptElement.type = 'text/javascript';
    // bodyElement.appendChild(arScriptElement);

    // let tweenScriptElement = document.createElement('script');
    // tweenScriptElement.src = './resources/js/tweenjs.min.js';
    // tweenScriptElement.type = 'text/javascript';
    // bodyElement.appendChild(tweenScriptElement);

    let coreScriptElement = document.createElement('script');
    coreScriptElement.src = './resources/js/ARcore.js';
    coreScriptElement.type = 'text/javascript';
    bodyElement.appendChild(coreScriptElement);
}