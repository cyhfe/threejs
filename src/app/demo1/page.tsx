"use client";

import React from "react";
import * as THREE from "three";

export default function Demo() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const rendered = React.useRef(false);

  React.useEffect(() => {
    if (!containerRef.current) return;
    if (rendered.current === true) return;
    rendered.current = true;

    const { width: w, height: h } =
      containerRef.current.getBoundingClientRect();

    // scene
    const scene = new THREE.Scene();

    // meshes
    // cube
    const cubeGeometry = new THREE.BoxGeometry();
    const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;
    scene.add(cube);

    //groundGeometry
    const groundGeometry = new THREE.PlaneGeometry(10000, 10000);
    const groundMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
    });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.position.set(0, -2, 0);
    groundMesh.rotation.set(Math.PI / -2, 0, 0);
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // camera
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    // camera.position.x = -3;
    camera.position.z = 8;
    // camera.position.y = 2;

    // light
    scene.add(new THREE.AmbientLight(0x666666));
    const dirLight = new THREE.DirectionalLight(0xaaaaaa);
    dirLight.position.set(5, 12, 8);
    dirLight.castShadow = true;
    dirLight.intensity = 1;
    scene.add(dirLight);

    // renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setClearColor(0xffffff);
    containerRef.current.appendChild(renderer.domElement);

    const renderScene = () => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
      requestAnimationFrame(renderScene);
    };

    renderScene();

    return () => {};
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
