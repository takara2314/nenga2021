//===================================================================
// three.js の各種設定
//===================================================================
var scene = new THREE.Scene();                        // シーンの作成
var renderer = new THREE.WebGLRenderer({              // レンダラの作成
  antialias: true,                                    // アンチエイリアス有効
  alpha: true,                                        // canvasに透明度バッファを持たせる
});
renderer.setClearColor(new THREE.Color("black"), 0);  // レンダラの背景色
renderer.setSize(640, 480);                           // レンダラのサイズ
renderer.domElement.style.position = "absolute";      // レンダラの位置は絶対値
renderer.domElement.style.top = "0px";                // レンダラの上端
renderer.domElement.style.left = "0px";               // レンダラの左端
document.body.appendChild(renderer.domElement);       // レンダラの DOM を body に入れる
var camera = new THREE.Camera();                      // カメラの作成
scene.add(camera);                                    // カメラをシーンに追加
var light = new THREE.DirectionalLight(0xffffff);     // 平行光源（白）を作成
light.position.set(0, 0, 2);                          // カメラ方向から照らす
scene.add(light);                                     // シーンに光源を追加

//===================================================================
// arToolkitSource（マーカトラッキングするメディアソース）
//===================================================================
var source = new THREEx.ArToolkitSource({             // arToolkitSourceの作成
  sourceType: "webcam",                               // Webカメラを使う（スマホもこれでOK）
});
source.init(function onReady() {                      // ソースを初期化し、準備ができたら
  onResize();                                         // リサイズ処理
});

//===================================================================
// arToolkitContext（カメラパラメータ、マーカ検出設定）
//===================================================================
var context = new THREEx.ArToolkitContext({           // arToolkitContextの作成
  debug: false,                                       // デバッグ用キャンバス表示（デフォルトfalse）
  cameraParametersUrl: "./resources/parameters/camera_para.dat",             // カメラパラメータファイル
  detectionMode: "mono",                              // 検出モード（color/color_and_matrix/mono/mono_and_matrix）
  imageSmoothingEnabled: true,                        // 画像をスムージングするか（デフォルトfalse）
  maxDetectionRate: 60,                               // マーカの検出レート（デフォルト60）
  canvasWidth: source.parameters.sourceWidth,         // マーカ検出用画像の幅（デフォルト640）
  canvasHeight: source.parameters.sourceHeight,       // マーカ検出用画像の高さ（デフォルト480）
});
context.init(function onCompleted(){                  // コンテクスト初期化が完了したら
  camera.projectionMatrix.copy(context.getProjectionMatrix());   // 射影行列をコピー
});

//===================================================================
// リサイズ処理
//===================================================================
window.addEventListener("resize", function() {        // ウィンドウがリサイズされたら
  onResize();                                         // リサイズ処理
});
// リサイズ関数
function onResize(){
  source.onResizeElement();                           // トラッキングソースをリサイズ
  source.copyElementSizeTo(renderer.domElement);      // レンダラも同じサイズに
  if(context.arController !== null){                  // arControllerがnullでなければ
    source.copyElementSizeTo(context.arController.canvas);  // それも同じサイズに
  } 
}

//===================================================================
// ArMarkerControls（マーカと、マーカ検出時の表示オブジェクト）
//===================================================================
//-------------------------------
// その２（kanjiマーカ＋.json）
//-------------------------------
// マーカ
// ネットでkanjiマーカの画像を得て、以下の AR.js のマーカトレーニングサイトで patt を作成
// https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html
var marker2 = new THREE.Group();                      // マーカをグループとして作成
var controls = new THREEx.ArMarkerControls(context, marker2, {    // マーカを登録
  type: "pattern",                                    // マーカのタイプ
  patternUrl: "./resources/patterns/pattern-ta.patt",                           // マーカファイル
});
scene.add(marker2);                                   // マーカをシーンに追加
// モデル（メッシュ）
var mesh2;                                            // モデルを入れる箱
var loader = new THREE.GLTFLoader();                  // json形式のモデルを読み込むローダ
loader.load("./resources/models/loadTest.glb", (gltf) => {       // モデルを読み込む
    mesh2 = gltf.scene;
    mesh2.name = "rocket";                              // メッシュの名前（後でピッキングで使う）
    mesh2.scale.set(0.5, 0.5, 0.5);                     // 初期サイズ（現物合わせ）
    mesh2.position.set(0, 0.5, 0);                      // 初期位置（現物合わせ）
    marker2.add(mesh2);
  // Processing のサンプルに付属の rocket.obj を Blender で json形式にエクスポートして自作
  // rocket.obj, rocket.mtl, rocket.png を以下から DL
  // https://github.com/processing/processing-android/tree/master/examples/Basics/Shape/LoadDisplayOBJ/data
  // Blender 用のエクスポータは Three.js の utils/exporters/addons/io_three に有り
//   mesh2 = new THREE.Mesh(geo, mat[0]);                // メッシュ化
//   mesh2.name = "rocket";                              // メッシュの名前（後でピッキングで使う）
//   mesh2.scale.set(0.5, 0.5, 0.5);                     // 初期サイズ（現物合わせ）
//   mesh2.position.set(0, 0.5, 0);                      // 初期位置（現物合わせ）
//   marker2.add(mesh2);                                 // メッシュをマーカに追加
});
// マーカ隠蔽（cloaking）
var videoTex = new THREE.VideoTexture(source.domElement);  // 映像をテクスチャとして取得
videoTex.minFilter = THREE.NearestFilter;             // 映像テクスチャのフィルタ処理？
var cloak = new THREEx.ArMarkerCloak(videoTex);       // マーカ隠蔽(cloak)オブジェクト
cloak.object3d.material.uniforms.opacity.value = 1.0; // cloakの不透明度
marker2.add(cloak.object3d);                          // cloakをマーカに追加

// //===================================================================
// // Tween アニメーション
// //===================================================================
// //-------------------------------
// // mesh2 について（rocketが飛ぶ）
// //-------------------------------
// var twIni2 = {posY: 0.5, rotY: 0};                    // 初期パラメータ
// var twVal2 = {posY: 0.5, rotY: 0};                    // tweenによって更新されるパラメータ
// var twFor2 = {posY: 5, rotY: 2*Math.PI};              // ターゲットパラメータ
// function tween2() {                                   // 「行き」のアニメーション
//   var tween = new TWEEN.Tween(twVal2)                 // tweenオブジェクトを作成
//   .to(twFor2, 2000)                                   // ターゲットと到達時間
//   .easing(TWEEN.Easing.Quadratic.InOut)               // イージング
//   .onUpdate(function() {                              // フレーム更新時の処理
//     mesh2.position.y = twVal2.posY;                   // 位置を変更
//     mesh2.rotation.y = twVal2.rotY;                   // 回転を変更
//   })
//   .onComplete(function() {                            // アニメーション完了時の処理
//     tween2_back();                                    // 「帰り」のアニメーションを実行
//   })
//   .delay(0)                                           // 開始までの遅延時間
//   .start();                                           // tweenアニメーション開始
// }
// function tween2_back() {                              // 「帰り」のアニメーション
//   var tween = new TWEEN.Tween(twVal2)
//   .to(twIni2, 3000)                                   // ターゲットを初期パラメータに設定
//   .easing(TWEEN.Easing.Quintic.InOut)
//   .onUpdate(function() {
//     mesh2.position.y = twVal2.posY;
//     mesh2.rotation.y = twVal2.rotY;
//   })
//   .onComplete(function() {
//     // なにもしない
//   })
//   .delay(0)
//   .start();
// }

// //===================================================================
// // マウスダウン（タップ）によるピッキング処理
// //===================================================================
// window.addEventListener("mousedown", function(ret) {
//   var mouseX = ret.clientX;                           // マウスのx座標
//   var mouseY = ret.clientY;                           // マウスのy座標
//   mouseX =  (mouseX / window.innerWidth)  * 2 - 1;    // -1 ～ +1 に正規化されたx座標
//   mouseY = -(mouseY / window.innerHeight) * 2 + 1;    // -1 ～ +1 に正規化されたy座標
//   var pos = new THREE.Vector3(mouseX, mouseY, 1);     // マウスベクトル
//   pos.unproject(camera);                              // スクリーン座標系をカメラ座標系に変換
//   // レイキャスタを作成（始点, 向きのベクトル）
//   var ray = new THREE.Raycaster(camera.position, pos.sub(camera.position).normalize());
//   var obj = ray.intersectObjects(scene.children, true);   // レイと交差したオブジェクトの取得
//   if(obj.length > 0) {                                // 交差したオブジェクトがあれば
//     picked(obj[0].object.name);                       // ピックされた対象に応じた処理を実行
//   }
// });
// // ピックされた対象に応じた処理
// function picked(objName) {
//   switch(objName) {
//     case "rocket":                                    // rocketなら
//       tween2();                                       // rocketのアニメーションを実行
//       break;
//     default:
//       break;
//   }
// }

//===================================================================
// レンダリング・ループ
//===================================================================
function renderScene() {                              // レンダリング関数
  requestAnimationFrame(renderScene);                 // ループを要求
  if(source.ready === false)    { return; }             // メディアソースの準備ができていなければ抜ける
  context.update(source.domElement);                  // ARToolkitのコンテキストを更新
  // TWEEN.update();                                     // Tweenアニメーションを更新
  renderer.render(scene, camera);                     // レンダリング実施
}
renderScene();                                        // 最初に1回だけレンダリングをトリガ