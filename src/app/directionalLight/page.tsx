"use client";

import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import GUI from "lil-gui";
//@ts-ignore
import Stats from "three/examples/jsm/libs/stats.module";
import { visitChildren } from "@/utils";

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
  axesHelper.visible = false;

  // camera
  const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 100);
  camera.position.set(8, 10, -4);
  scene.add(camera);

  // orbitControl
  const orbitControl = new OrbitControls(camera, renderer.domElement);
  orbitControl.minDistance = 5;
  orbitControl.maxDistance = 30;
  orbitControl.maxPolarAngle = Math.PI / 2;
  orbitControl.update();

  // ambient
  const ambient = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 0.5);
  scene.add(ambient);

  // directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 14, 5);
  directionalLight.castShadow = true;
  directionalLight.intensity = 1.5;
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 25;
  directionalLight.shadow.camera.left = -10;
  directionalLight.shadow.camera.right = 10;
  directionalLight.shadow.camera.top = 10;
  directionalLight.shadow.camera.bottom = -10;

  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.bias = -0.03;
  scene.add(directionalLight);
  const helper = new THREE.DirectionalLightHelper(directionalLight, 5);
  scene.add(helper);
  helper.visible = false;

  // load model
  new GLTFLoader().load("/assets/gltf/waterfall/scene.gltf", (gltf) => {
    const loadedScene = gltf.scene;
    loadedScene.rotation.y = Math.PI / 2;
    visitChildren(loadedScene, (child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(gltf.scene);
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
