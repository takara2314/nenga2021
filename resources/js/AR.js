// 要素を関連付ける
let usernameElement = document.getElementById('username');
let userpassElement = document.getElementById('userpass');
let loginMessageElement = document.getElementById('loginMessage');
let authButtonElement = document.getElementById('authButton');

// 認証ボタンが押されたら
authButtonElement.addEventListener('click', () => {
    // ユーザー情報を格納する連想配列
    let userInfo = {
        'userName': usernameElement.value,
        'userPassword': userpassElement.value,
        'userAgent': navigator.userAgent
    };

    // XMLHttpRequest
    let xhr = new XMLHttpRequest();

    xhr.addEventListener('loadend', () => {
        if (xhr.status === 200) {
            loginMessageElement.innerHTML = "認証に成功しました。ようこそ。"
        } else if (xhr.status === 401) {
            loginMessageElement.innerHTML = "名前またはパスワードが間違っています。"
        } else {
            loginMessageElement.innerHTML = "サーバーのエラーです。時間をおいてお試しください。"
        }
    });

    // 認証サーバーにJSONで認証情報をPOSTする
    xhr.open('POST', 'http://localhost:2021/auth');
    xhr.setRequestHeader('content-type', 'application/json');
    // ユーザー情報を認証サーバーに転送
    xhr.send(
        JSON.stringify(userInfo)
    );
})