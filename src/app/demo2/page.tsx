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

export default function Demo() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const initializedRef = React.useRef(false);

  React.useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const container = containerRef.current;
    if (!container) return;
    // initialize(container);
  }, []);

  return <div ref={containerRef} className="w-full h-full relative" />;
}
