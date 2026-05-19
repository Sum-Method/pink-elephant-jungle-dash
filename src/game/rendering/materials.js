import * as THREE from "three";

export function makeMaterial(colour, options = {}) {
  const materialOptions = {
    color: options.color ?? colour,
    roughness: options.roughness ?? 0.78,
    metalness: options.metalness ?? 0.05,
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1,
    emissive: options.emissive ?? options.emissiveColor ?? "#000000",
    emissiveIntensity: options.emissiveIntensity ?? 0,
    map: options.map ?? null,
    normalMap: options.normalMap ?? null,
    envMapIntensity: options.envMapIntensity ?? 1,
  };

  if (options.normalScale !== undefined) {
    materialOptions.normalScale = Array.isArray(options.normalScale) ? new THREE.Vector2(options.normalScale[0], options.normalScale[1]) : options.normalScale;
  }
  if (options.side !== undefined) materialOptions.side = options.side;
  if (options.depthWrite !== undefined) materialOptions.depthWrite = options.depthWrite;

  return new THREE.MeshStandardMaterial(materialOptions);
}
