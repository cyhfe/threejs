import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons";
import { FontLoader } from "three/examples/jsm/Addons";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("textures/matcaps/2.png");

const fontLoader = new FontLoader();

const content = `
永和九年岁在癸丑暮春之初会于
会稽山阴之兰亭修禊事也群贤毕
至少长咸集此地有崇山峻岭茂林
修竹又有清流激湍映带左右引以
为流觞曲水列坐其次虽无丝竹管
弦之盛一觞一咏亦足以畅叙幽情
`;

// 是日也天朗气清惠风和畅仰观宇
// 宙之大俯察品类之盛所以游目骋
// 怀足以极视听之娱信可乐也夫人
// 之相与俯仰一世或取诸怀抱晤言
// 一室之内或因寄所托放浪形骸之
// 外虽取舍万殊静躁不同当其欣于
// 所遇暂得于己快然自足不知老之
// 将至及其所之既倦情随事迁感慨
// 系之矣向之所欣俯仰之间已为陈
// 迹犹不能不以之兴怀况修短随化
// 终期于尽古人云死生亦大矣岂不
// 痛哉每览昔人兴感之由若合一契
// 未尝不临文嗟悼不能喻之于怀固
// 知一死生为虚诞齐彭殇为妄作后
// 之视今亦犹今之视昔悲夫故列叙
// 时人录其所述虽世殊事异所以兴
// 怀其致一也后之览者亦将有感于
// 斯文

const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

fontLoader.load("/SCFwxz_Regular.json", (font) => {
  const textGeometry = new TextGeometry(content, {
    font: font,
    size: 20,
    height: 5,
    curveSegments: 12,
    bevelEnabled: false,
    bevelThickness: 10,
    bevelSize: 8,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.center();

  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);
});

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.x = 10;
camera.position.y = 10;
camera.position.z = 240;

scene.add(camera);
const canvas = document.querySelector(".webgl");

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
