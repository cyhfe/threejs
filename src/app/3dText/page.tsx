"use client";

import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

import GUI from "lil-gui";
//@ts-ignore
import Stats from "three/examples/jsm/libs/stats.module";

const content = `
永和九年岁在癸丑暮春之初会于
会稽山阴之兰亭修禊事也群贤毕
至少长咸集此地有崇山峻岭茂林
修竹又有清流激湍映带左右引以
为流觞曲水列坐其次虽无丝竹管
弦之盛一觞一咏亦足以畅叙幽情
是日也天朗气清惠风和畅仰观宇
宙之大俯察品类之盛所以游目骋
怀足以极视听之娱信可乐也夫人
之相与俯仰一世或取诸怀抱晤言
一室之内或因寄所托放浪形骸之
外虽取舍万殊静躁不同当其欣于
所遇暂得于己快然自足不知老之
将至及其所之既倦情随事迁感慨
系之矣向之所欣俯仰之间已为陈
迹犹不能不以之兴怀况修短随化
终期于尽古人云死生亦大矣岂不
痛哉每览昔人兴感之由若合一契
未尝不临文嗟悼不能喻之于怀固
知一死生为虚诞齐彭殇为妄作后
之视今亦犹今之视昔悲夫故列叙
时人录其所述虽世殊事异所以兴
怀其致一也后之览者亦将有感于
斯文
`;

async function init(container: HTMLDivElement) {
  const width = container.clientWidth;
  const height = container.clientHeight;

  // renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;

  renderer.setAnimationLoop(animate);

  // scene
  const scene = new THREE.Scene();
  // scene.background = new THREE.Color(0x000000);

  // axis helper
  const axesHelper = new THREE.AxesHelper(1000);
  scene.add(axesHelper);
  axesHelper.visible = false;

  // camera
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 10000);
  camera.position.set(300, 0, 1200);
  scene.add(camera);

  // orbitControl
  const orbitControl = new OrbitControls(camera, renderer.domElement);
  // orbitControl.minDistance = 2;
  // orbitControl.maxDistance = 10;
  orbitControl.maxPolarAngle = Math.PI / 2;
  // orbitControl.target.set(10, 0, 0);
  // orbitControl.autoRotate = true;

  // ambient
  // const ambient = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 0.15);
  // scene.add(ambient);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
  dirLight.position.set(0, 0, 1).normalize();
  scene.add(dirLight);

  const pointLight = new THREE.PointLight(0xffffff, 4.5, 0, 0);
  pointLight.color.setHSL(Math.random(), 1, 0.5);
  pointLight.position.set(0, 100, 90);
  scene.add(pointLight);

  // load font
  const fontLoader = new FontLoader();
  const textureLoader = new THREE.TextureLoader();
  fontLoader.load("/assets/fonts/SCFwxz_Regular.json", (font) => {
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

    const matcapTexture = textureLoader.load("/assets/textures/matcaps/2.png");
    const textMaterial = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture,
    });

    const text = new THREE.Mesh(textGeometry, textMaterial);
    text.castShadow = true;
    text.receiveShadow = true;
    scene.add(text);
  });

  // gui
  const gui = new GUI();

  // Stats
  const stats = new Stats();
  stats.dom.style.position = "absolute";
  container.appendChild(stats.dom);

  function animate() {
    stats.update();
    renderer.render(scene, camera);
  }

  function handleResize() {
    if (!container) return;
    const { clientWidth: w, clientHeight: h } = container;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  window.addEventListener("resize", handleResize);
  return () => {
    window.removeEventListener("resize", handleResize);
    renderer.setAnimationLoop(null);
    gui.destroy();
  };
}

export default function Demo() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const initializedRef = React.useRef(false);
  React.useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const container = containerRef.current;
    if (!container) return;

    let cleanup: (() => void) | undefined;
    init(container).then((cb) => (cleanup = cb));

    return () => {
      typeof cleanup === "function" && cleanup();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full relative" />;
}
