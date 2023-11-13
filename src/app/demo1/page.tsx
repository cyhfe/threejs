"use client";

import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default function Demo() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    console.log(canvas);
    if (!canvas) return;

    // scene

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 0.0025, 50);

    // mesh
    const cubeGeometry = new THREE.BoxGeometry();
    const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    cube.position.x = -1;
    cube.castShadow = true;
    scene.add(cube);

    const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 100);
    const torusKnotMat = new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      roughness: 0.1,
    });
    const torusKnotMesh = new THREE.Mesh(torusKnotGeometry, torusKnotMat);

    torusKnotMesh.castShadow = true;
    torusKnotMesh.position.x = 2;
    scene.add(torusKnotMesh);

    const groundGeometry = new THREE.PlaneGeometry(1000, 1000);

    const groundMaterial = new THREE.MeshLambertMaterial({
      color: "#ffffff",
    });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.position.set(0, -2, 0);
    groundMesh.rotation.set(Math.PI / -2, 0, 0);
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // light
    scene.add(new THREE.AmbientLight("#a2a2a2"));
    const dirLight = new THREE.DirectionalLight("#d9d9d9");
    dirLight.position.set(5, 12, 8);
    dirLight.castShadow = true;
    dirLight.intensity = 1;
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

    // camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.x = -3;
    camera.position.y = 2;
    camera.position.z = 8;

    // renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff);
    renderer.render(scene, camera);

    const props = {
      cubeSpeed: 0.01,
      torusSpeed: 0.01,
    };

    const controller = new OrbitControls(camera, canvas);
    controller.enableDamping = true;
    controller.dampingFactor = 0.05;
    controller.minDistance = 3;
    controller.maxDistance = 10;
    controller.minPolarAngle = Math.PI / 4;
    controller.maxPolarAngle = (3 * Math.PI) / 4;

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);

      cube.rotation.x += props.cubeSpeed;
      cube.rotation.y += props.cubeSpeed;
      cube.rotation.z += props.cubeSpeed;

      torusKnotMesh.rotation.x -= props.torusSpeed;
      torusKnotMesh.rotation.y += props.torusSpeed;
      torusKnotMesh.rotation.z -= props.torusSpeed;

      // uncomment this to have the cube jump around
      //   step += 0.04;
      //   cube.position.x = 4*(Math.cos(step));
      //   cube.position.y = 4*Math.abs(Math.sin(step));
      controller.update();
    }
    animate();
  });
  return <canvas ref={canvasRef}></canvas>;
}
