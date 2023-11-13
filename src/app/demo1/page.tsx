"use client";

import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
//@ts-ignore
import Stats from "three/examples/jsm/libs/stats.module";

export default function Demo() {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { width: w, height: h } = container.getBoundingClientRect();
    //  gui
    const gui = new GUI();
    const props = {
      speed: 0.01,
      ambientIntensity: 0.9,
      directionalIntensity: 1.1,
    };

    gui.add(props, "speed", -0.1, 0.1, 0.01);
    gui.add(props, "ambientIntensity", 0, 2, 0.1);
    gui.add(props, "directionalIntensity", 0, 2, 0.1);

    // scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 0.0025, 90);

    // meshes
    // cube
    const cubeGeometry = new THREE.BoxGeometry();
    const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = -1;
    cube.castShadow = true;
    scene.add(cube);

    // torusKnotMesh
    const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 100);
    const torusKnotMat = new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      roughness: 0.1,
    });
    const torusKnotMesh = new THREE.Mesh(torusKnotGeometry, torusKnotMat);

    torusKnotMesh.castShadow = true;
    torusKnotMesh.position.x = 2;
    scene.add(torusKnotMesh);

    //groundGeometry
    const groundGeometry = new THREE.PlaneGeometry(10000, 10000);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.position.set(0, -2, 0);
    groundMesh.rotation.set(Math.PI / -2, 0, 0);
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // camera
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.x = -3;
    camera.position.z = 8;
    camera.position.y = 2;

    // light
    const ambientLight = new THREE.AmbientLight(0xffffff);
    ambientLight.intensity = props.ambientIntensity;
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(5, 12, 8);
    dirLight.castShadow = true;
    dirLight.intensity = props.directionalIntensity;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.camera.right = 10;
    dirLight.shadow.camera.left = -10;
    dirLight.shadow.camera.top = 10;
    dirLight.shadow.camera.bottom = -10;
    dirLight.shadow.mapSize.width = 512;
    dirLight.shadow.mapSize.height = 512;
    dirLight.shadow.radius = 4;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    // renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    renderer.setSize(w, h);
    renderer.setClearColor(0xffffff);
    container.appendChild(renderer.domElement);

    // controller
    const controller = new OrbitControls(camera, renderer.domElement);
    controller.enableDamping = true;
    controller.dampingFactor = 0.05;
    controller.minDistance = 3;
    controller.maxDistance = 10;
    controller.minPolarAngle = Math.PI / 4;
    controller.maxPolarAngle = (3 * Math.PI) / 4;

    const stats = new Stats();
    stats.dom.style.position = "absolute";
    container.appendChild(stats.dom);

    window.addEventListener("resize", onWindowResize, false);
    function onWindowResize() {
      if (!container) return;
      const { width: w, height: h } = container.getBoundingClientRect();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += props.speed;
      cube.rotation.y += props.speed;

      torusKnotMesh.rotation.x += props.speed;
      torusKnotMesh.rotation.y += props.speed;

      ambientLight.intensity = props.ambientIntensity;
      dirLight.intensity = props.directionalIntensity;

      controller.update();
      renderer.render(scene, camera);
      stats.update();
    };
    animate();

    return () => {
      container.removeChild(renderer.domElement);
      container.removeChild(stats.dom);
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full relative" />;
}
