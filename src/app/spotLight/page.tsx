"use client";

import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PLYLoader } from "three/addons/loaders/PLYLoader.js";
import GUI from "lil-gui";
//@ts-ignore
import Stats from "three/examples/jsm/libs/stats.module";

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

  // axis helper
  const axesHelper = new THREE.AxesHelper(6);
  scene.add(axesHelper);
  axesHelper.visible = false;

  // camera
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(7, 4, 1);
  scene.add(camera);

  // orbitControl
  const orbitControl = new OrbitControls(camera, renderer.domElement);
  orbitControl.minDistance = 2;
  orbitControl.maxDistance = 10;
  orbitControl.maxPolarAngle = Math.PI / 2;
  orbitControl.target.set(0, 1, 0);
  orbitControl.update();

  // ambient
  const ambient = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 0.15);
  scene.add(ambient);

  // textures
  const loader = new THREE.TextureLoader().setPath("/assets/textures/");
  const filenames = ["disturb.jpg", "colors.png", "uv_grid_opengl.jpg"];

  const textures: { [key: string]: THREE.Texture | null } = {
    none: null,
  };

  for (let i = 0; i < filenames.length; i++) {
    const filename = filenames[i];

    const texture = loader.load(filename);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.colorSpace = THREE.SRGBColorSpace;

    textures[filename] = texture;
  }

  // spotLight
  const spotLight = new THREE.SpotLight(0xffffff, 100);
  spotLight.position.set(2.5, 5, 2.5);
  spotLight.angle = Math.PI / 6;
  spotLight.penumbra = 1;
  spotLight.decay = 2;
  spotLight.distance = 0;
  spotLight.map = textures["none"];

  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 10;
  spotLight.shadow.focus = 1;
  scene.add(spotLight);

  const lightHelper = new THREE.SpotLightHelper(spotLight);
  scene.add(lightHelper);
  lightHelper.visible = true;

  // ground
  const geometry = new THREE.PlaneGeometry(200, 200);
  const material = new THREE.MeshLambertMaterial({ color: 0xbcbcbc });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, -1, 0);
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);

  // load model
  new PLYLoader().load("assets/models/ply/Lucy100k.ply", function (geometry) {
    geometry.scale(0.0024, 0.0024, 0.0024);
    geometry.computeVertexNormals();

    const material = new THREE.MeshLambertMaterial();

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.y = -Math.PI / 2;
    mesh.position.y = 0.8;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
  });

  // gui
  const gui = new GUI();

  const params = {
    map: null,
    spotLight: spotLight.visible,
    color: spotLight.color.getHex(),
    intensity: spotLight.intensity,
    distance: spotLight.distance,
    angle: spotLight.angle,
    penumbra: spotLight.penumbra,
    decay: spotLight.decay,
    focus: spotLight.shadow.focus,
    shadows: true,
    hemisphereLight: ambient.visible,
    skyColor: ambient.color.getHex(),
    groundColor: ambient.groundColor.getHex(),
    hmIndensity: ambient.intensity,
    axesHelper: axesHelper.visible,
    lightHelper: lightHelper.visible,
  };

  gui.add(params, "spotLight").onChange(function (val: boolean) {
    spotLight.visible = val;
  });

  gui.add(params, "map", textures).onChange(function (val: THREE.Texture) {
    spotLight.map = val;
  });

  gui.addColor(params, "color").onChange(function (val: number) {
    spotLight.color.setHex(val);
  });

  gui.add(params, "intensity", 0, 500).onChange(function (val: number) {
    spotLight.intensity = val;
  });

  gui.add(params, "distance", 50, 200).onChange(function (val: number) {
    spotLight.distance = val;
  });

  gui.add(params, "angle", 0, Math.PI / 3).onChange(function (val: number) {
    spotLight.angle = val;
  });

  gui.add(params, "penumbra", 0, 1).onChange(function (val: number) {
    spotLight.penumbra = val;
  });

  gui.add(params, "decay", 1, 2).onChange(function (val: number) {
    spotLight.decay = val;
  });

  gui.add(params, "focus", 0, 1).onChange(function (val: number) {
    spotLight.shadow.focus = val;
  });

  gui.add(params, "shadows").onChange(function (val: boolean) {
    renderer.shadowMap.enabled = val;
    scene.traverse(function (child) {
      // @ts-ignore
      if (child.material) {
        // @ts-ignore
        child.material.needsUpdate = true;
      }
    });
  });

  gui.add(params, "hemisphereLight").onChange(function (val: boolean) {
    ambient.visible = val;
  });

  gui.addColor(params, "skyColor").onChange(function (val: number) {
    ambient.color.setHex(val);
  });

  gui.addColor(params, "groundColor").onChange(function (val: number) {
    ambient.groundColor.setHex(val);
  });

  gui.add(params, "hmIndensity", 0, 3).onChange(function (val: number) {
    ambient.intensity = val;
  });

  gui.add(params, "axesHelper").onChange(function (val: boolean) {
    axesHelper.visible = val;
  });

  gui.add(params, "lightHelper").onChange(function (val: boolean) {
    lightHelper.visible = val;
  });

  // Stats
  const stats = new Stats();
  stats.dom.style.position = "absolute";
  container.appendChild(stats.dom);

  function animate() {
    const time = performance.now() / 3000;

    spotLight.position.x = Math.cos(time) * 2.5;
    spotLight.position.z = Math.sin(time) * 2.5;

    lightHelper.update();

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
