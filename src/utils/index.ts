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
