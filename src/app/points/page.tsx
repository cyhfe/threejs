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
  const range = 15;
  for (let i = 0; i < 1000000; i++) {
    let particle = new THREE.Vector3(
      Math.random() * range - range / 2,
      Math.random() * range - range / 2,
      Math.random() * range - range / 2
    );

    points.push(particle);
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

export const createGhostTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;

  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  // the body
  ctx.translate(-81, -84);

  ctx.fillStyle = "orange";
  ctx.beginPath();
  ctx.moveTo(83, 116);
  ctx.lineTo(83, 102);
  ctx.bezierCurveTo(83, 94, 89, 88, 97, 88);
  ctx.bezierCurveTo(105, 88, 111, 94, 111, 102);
  ctx.lineTo(111, 116);
  ctx.lineTo(106.333, 111.333);
  ctx.lineTo(101.666, 116);
  ctx.lineTo(97, 111.333);
  ctx.lineTo(92.333, 116);
  ctx.lineTo(87.666, 111.333);
  ctx.lineTo(83, 116);
  ctx.fill();

  // the eyes
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.moveTo(91, 96);
  ctx.bezierCurveTo(88, 96, 87, 99, 87, 101);
  ctx.bezierCurveTo(87, 103, 88, 106, 91, 106);
  ctx.bezierCurveTo(94, 106, 95, 103, 95, 101);
  ctx.bezierCurveTo(95, 99, 94, 96, 91, 96);
  ctx.moveTo(103, 96);
  ctx.bezierCurveTo(100, 96, 99, 99, 99, 101);
  ctx.bezierCurveTo(99, 103, 100, 106, 103, 106);
  ctx.bezierCurveTo(106, 106, 107, 103, 107, 101);
  ctx.bezierCurveTo(107, 99, 106, 96, 103, 96);
  ctx.fill();

  // the pupils
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(101, 102, 2, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(89, 102, 2, 0, Math.PI * 2, true);
  ctx.fill();

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
};

async function init(container: HTMLDivElement) {
  const width = container.clientWidth;
  const height = container.clientHeight;

  // renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.setClearColor("#e2e8f0");
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
  camera.position.set(15, 5, 15);
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
  const material = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    color: 0xffffff,
    map: createGhostTexture(),
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
