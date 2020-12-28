// 要素を関連付ける
let usernameElement = document.getElementById('username');
let userpassElement = document.getElementById('userpass');
let authButtonElement = document.getElementById('authButton');

// 認証ボタンが押されたら
authButtonElement.addEventListener('click', () => {
    // ユーザー情報を格納する連想配列
    let userInfo = {
        'userName': usernameElement.value,
        'userPassword': userpassElement.value,
        'userOS': navigator.platform,
        'userAgent': navigator.userAgent
    };

    // XMLHttpRequest
    let xhr = new XMLHttpRequest();
    // 認証サーバーにJSONで認証情報をPOSTする
    xhr.open('POST', 'https://nenga2021.2314.tk/auth');
    xhr.setRequestHeader('content-type', 'application/json');

    xhr.onload = () => {
        console.log(xhr.status);
        console.log("成功");
    }

    xhr.onerror = () => {
        console.log(xhr.status);
        console.log("失敗");
    }

    xhr.send(
        JSON.stringify(userInfo)
    );
})