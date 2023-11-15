"use client";

import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import GUI from "lil-gui";
//@ts-ignore
import Stats from "three/examples/jsm/libs/stats.module";

const createPoints = () => {
  const points = [];

  for (let x = -15; x < 15; x++) {
    for (let y = -10; y < 10; y++) {
      let point = new THREE.Vector3(x / 4, y / 4, 0);
      points.push(point);
    }
  }

  const colors = new Float32Array(points.length * 3);
  points.forEach((e, i) => {
    const c = new THREE.Color(Math.random() * 0xffffff);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  });

  const geom = new THREE.BufferGeometry().setFromPoints(points);
  geom.setAttribute("color", new THREE.BufferAttribute(colors, 3, true));

  return geom;
};
async function init(container: HTMLDivElement) {
  const width = container.clientWidth;
  const height = container.clientHeight;

  // renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  // renderer.setClearColor("#e2e8f0");
  container.appendChild(renderer.domElement);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;

  renderer.setAnimationLoop(animate);

  // scene
  const scene = new THREE.Scene();

  // axis helper
  const axesHelper = new THREE.AxesHelper(10);
  scene.add(axesHelper);
  axesHelper.visible = true;

  // camera
  const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
  camera.position.set(8, 10, -4);
  scene.add(camera);

  // orbitControl
  const orbitControl = new OrbitControls(camera, renderer.domElement);
  // orbitControl.minDistance = 5;
  // orbitControl.maxDistance = 30;
  // orbitControl.maxPolarAngle = Math.PI / 2;
  orbitControl.update();

  // ambient
  // const ambient = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 0.5);
  // scene.add(ambient);

  // points
  // const material = new THREE.SpriteMaterial({ color: "red" });
  // const sprite = new THREE.Sprite(material);
  // scene.add(sprite);
  const material = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    color: 0xffffff,
  });
  const points = new THREE.Points(createPoints(), material);
  scene.add(points);

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
