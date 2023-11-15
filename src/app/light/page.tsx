"use client";

import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import GUI from "lil-gui";
//@ts-ignore
import Stats from "three/examples/jsm/libs/stats.module";

async function init(container: HTMLDivElement) {
  const width = container.clientWidth;
  const height = container.clientHeight;

  // gui
  const gui = new GUI();

  // scene
  const scene = new THREE.Scene();

  // axis helper
  // const axesHelper = new THREE.AxesHelper(6);
  // scene.add(axesHelper);

  // mesh

  // camera
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(3, 3, 3);
  scene.add(camera);

  // light
  // const ambientLight = new THREE.AmbientLight(0xffffff);
  // scene.add(ambientLight);

  // const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  // dirLight.position.set(0, 6, 4);
  // dirLight.castShadow = true;

  // scene.add(dirLight);

  // renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setSize(width, height);
  renderer.setClearColor("#e2e8f0");
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // controller
  const controller = new OrbitControls(camera, renderer.domElement);
  controller.enableDamping = true;
  controller.dampingFactor = 0.05;

  container.appendChild(renderer.domElement);

  const stats = new Stats();
  stats.dom.style.position = "absolute";
  container.appendChild(stats.dom);

  let rafId: number | undefined;
  function animate() {
    controller.update();
    stats.update();
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
  }

  animate();

  function handleResize() {
    if (!container) return;
    const { clientWidth: w, clientHeight: h } = container;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  window.addEventListener("resize", handleResize);

  return function cleanup() {
    rafId && cancelAnimationFrame(rafId);
    window.removeEventListener("resize", handleResize);
    container.removeChild(renderer.domElement);
    container.removeChild(stats.dom);
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
