"use client";

import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import GUI from "lil-gui";
//@ts-ignore
import Stats from "three/examples/jsm/libs/stats.module";

export const visitChildren = (
  object: THREE.Object3D,
  fn: (object: THREE.Mesh) => void
) => {
  if (object.children && object.children.length > 0) {
    for (const child of object.children) {
      visitChildren(child, fn);
    }
  } else {
    if (object.type === "Mesh") {
      fn(object as THREE.Mesh);
    }
  }
};

async function init(container: HTMLDivElement) {
  const width = container.clientWidth;
  const height = container.clientHeight;

  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync("/assets/models/sea_house/scene.gltf");
  gltf.scene.scale.setScalar(0.2);
  visitChildren(gltf.scene, (child) => {
    if (child.material) {
      const material = child.material as THREE.Material;
      material.depthWrite = true;
    }
  });

  // scene
  const scene = new THREE.Scene();

  // mesh
  const mesh = gltf.scene;
  scene.add(mesh);

  // camera
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.x = -60;
  camera.position.z = -20;
  camera.position.y = 40;
  scene.add(camera);

  // renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setSize(width, height);
  renderer.setClearColor(0xffffff);

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
    renderer.render(scene, camera);
    controller.update();
    stats.update();
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
