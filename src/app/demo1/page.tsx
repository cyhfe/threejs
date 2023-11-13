"use client";

import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default function Demo() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const rendered = React.useRef(false);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { width: w, height: h } = container.getBoundingClientRect();

    // scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 0.0025, 50);

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
    scene.add(new THREE.AmbientLight("#555555"));
    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(5, 12, 8);
    dirLight.castShadow = true;
    dirLight.intensity = 1.5;
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

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      torusKnotMesh.rotation.x += 0.01;
      torusKnotMesh.rotation.y += 0.01;

      controller.update();
      renderer.render(scene, camera);
    };
    animate();
    rendered.current = true;
    return () => {
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
