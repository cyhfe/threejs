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

    console.log(w, h);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Add this function inside the useEffect hook
    const renderScene = () => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
      requestAnimationFrame(renderScene);
    };
    // Call the renderScene function to start the animation loop
    renderScene();

    // Add this inside the useEffect hook
    return () => {};
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
