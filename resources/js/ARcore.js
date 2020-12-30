// three.js の設定
let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setClearColor(new THREE.Color('black'), 0);
renderer.setSize(640, 480);
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
document.body.appendChild(renderer.domElement);

let camera = new THREE.Camera();
scene.add(camera);
let light = new THREE.DirectionalLight(0xffffff);
light.position.set(0, 0, 2);
scene.add(light);

// arToolkitSource (マーカートラッキングするメディア)
let source = new THREEx.ArToolkitSource({
    sourceType: 'webcam'
});
source.init(function onReady() {
    onResize();
});

// arToolkitContext (マーカー検出設定)
let context = new THREEx.ArToolkitContext({
    debug: false,
    cameraParametersUrl: './resources/parameters/camera_para.dat',
    detectionMode: 'mono',
    imageSmoothingEnabled: true,
    maxDetectionRate: 60,
    canvasWidth: source.parameters.sourceWidth,
    canvasHeight: source.parameters.sourceHeight
});
context.init(function OnCompleted() {
    camera.projectionMatrix.copy(context.getProjectionMatrix());
})

// リサイズ処理
window.addEventListener('resize', () => {
    onResize();
})

const onResize = () => {
    source.onResizeElement();
    source.copyElementSizeTo(renderer.domElement);

    if (context.arController !== null) {
        source.copyElementSizeTo(context.arController.canvas);
    }
}

// ArMarkerControls (マーカーの指定と、表示オブジェクトの設定)
let marker = new THREE.Group();
let controls = new THREEx.ArMarkerControls(context, marker, {
    type: 'pattern',
    patternUrl: './resources/patterns/pattern-nenga2021-qr.patt'
});
scene.add(marker);

let mesh;
let loader = new THREE.GLTFLoader();
loader.load('./resources/models/loadTest.glb', (gltf) => {
    mesh = gltf.scene;
    mesh.scale.set(0.1, 0.1, 0.1);
    mesh.position.set(0, 0, 0);
    marker.add(mesh);
})

// FontLoaderインスタンスの作成
let fontLoader = new THREE.FontLoader();
// フォントのロード
fontLoader.load('./resources/fonts/inter.json', (font) => {
    // テキストオブジェクトの作成
    // 第1引数に作成する文字を指定し、あとはパラメータ
    // font: 使用するフォント（typeface.jsで作成されたフォント）
    // size: テキストサイズ
    // height: テキストの奥行き
    // curveSegments: 曲線に使用する点の数
    // bevelEnabled: 斜体にするかどうか
    // bevelThickness: 斜体の傾き度
    // bevelSize: アウトラインからどの程度傾けるか
    var textObject = new THREE.TextGeometry(personName, {
        font: font,
        size: 0.5,
        height: 0.1,
    } );
    // ジオメトリを中心に移動
    textObject.center();

    // オブジェクトの作成
    var textMesh = new THREE.Mesh(textObject, new THREE.MeshBasicMaterial({color: 0x00ff00}));
    textMesh.position.set(2, 0, 0);
    // オブジェクトをシーンに追加
    marker.add(textMesh);
});

// レンダリング
const renderScene = () => {
    requestAnimationFrame(renderScene);
    if (source.ready == false) {
        return;
    }

    context.update(source.domElement);
    renderer.render(scene, camera);
    onResize();
}
renderScene();