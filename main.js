import "./style.css";
import * as THREE from "three";

// scene
const scene = new THREE.Scene();

// mesh
const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshBasicMaterial({ color: "red" });

const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);

scene.add(cubeMesh);

// camera
const camera = new THREE.PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  0.1,
  30
);

// position the camera
camera.position.z = 5;

scene.add(camera);

// renderer
const canvas = document.querySelector(".three");
const renderer = new THREE.WebGLRenderer({ canvas: canvas });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);
