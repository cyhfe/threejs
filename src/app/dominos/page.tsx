"use client";

import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RigidBodyDesc, RigidBodyType } from "@dimforge/rapier3d";

import GUI from "lil-gui";
//@ts-ignore
import Stats from "three/examples/jsm/libs/stats.module";

function createArena() {
  const textureLoader = new THREE.TextureLoader();
  const groundMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load(
      "/assets/textures/wood/floor-parquet-pattern-172292.jpg"
    ),
  });
  const arena = new THREE.Group();
  arena.name = "arena";
  const ground = new THREE.Mesh(
    new THREE.BoxGeometry(6, 0.2, 6),
    groundMaterial
  );
  ground.castShadow = true;
  ground.receiveShadow = true;
  arena.add(ground);

  const borderLeft = new THREE.Mesh(
    new THREE.BoxGeometry(6, 0.6, 0.2),
    groundMaterial
  );

  borderLeft.position.z = 3.1;
  borderLeft.position.y = 0.2;
  borderLeft.castShadow = true;
  borderLeft.receiveShadow = true;
  arena.add(borderLeft);

  const borderRight = new THREE.Mesh(
    new THREE.BoxGeometry(6, 0.6, 0.2),
    groundMaterial
  );

  borderRight.position.z = -3.1;
  borderRight.position.y = 0.2;
  borderRight.castShadow = true;
  borderRight.receiveShadow = true;
  arena.add(borderRight);

  const borderBottom = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.6, 6.4),
    groundMaterial
  );
  borderBottom.position.x = 3.1;
  borderBottom.position.y = 0.2;
  borderBottom.castShadow = true;
  borderBottom.receiveShadow = true;
  arena.add(borderBottom);

  const borderTop = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.6, 6.4),
    groundMaterial
  );
  borderTop.position.x = -3.1;
  borderTop.position.y = 0.2;
  borderTop.castShadow = true;
  borderTop.receiveShadow = true;
  arena.add(borderTop);

  return arena;
}

const createDominos = () => {
  const getPoints = () => {
    const points = [];
    const r = 2.8;
    const cX = 0;
    const cY = 0;

    let circleOffset = 0;
    for (let i = 0; i < 1200; i += 6 + circleOffset) {
      circleOffset = 1.5 * (i / 360);

      const x = (r / 1440) * (1440 - i) * Math.cos(i * (Math.PI / 180)) + cX;
      const z = (r / 1440) * (1440 - i) * Math.sin(i * (Math.PI / 180)) + cY;
      const y = 0;

      points.push(new THREE.Vector3(x, y, z));
    }

    return points;
  };
  const stones = new THREE.Group();
  stones.name = "dominos";
  const points = getPoints();
  points.forEach((point, index) => {
    const colors = [0x66ff00, 0x6600ff];
    const stoneGeom = new THREE.BoxGeometry(0.05, 0.5, 0.2);
    const stone = new THREE.Mesh(
      stoneGeom,
      new THREE.MeshStandardMaterial({
        color: colors[index % colors.length],
      })
    );
    stone.position.copy(point);
    stone.lookAt(new THREE.Vector3(0, 0, 0));

    stone.position.y = 0.35;
    stone.castShadow = true;
    stone.receiveShadow = true;

    stones.add(stone);
  });
  return stones;
};

async function init(container: HTMLDivElement) {
  const width = container.clientWidth;
  const height = container.clientHeight;

  // scene
  const scene = new THREE.Scene();

  // axis helper
  const axesHelper = new THREE.AxesHelper(6);
  scene.add(axesHelper);

  // physic
  const RAPIER = await import("@dimforge/rapier3d");
  const gravity = { x: 0.0, y: 0.0, z: 0.0 };
  const world = new RAPIER.World(gravity);

  // mesh
  const arena = createArena();
  scene.add(arena);

  const dominos = createDominos();
  scene.add(dominos);

  // camera
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(6, 6, 6);
  scene.add(camera);

  // light
  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(0, 6, 4);
  dirLight.castShadow = true;

  scene.add(dirLight);

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
