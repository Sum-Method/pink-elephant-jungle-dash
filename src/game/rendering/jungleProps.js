import * as THREE from "three";

export function makeLowPolyTree(trunkMat, leafMats, geometries, rng = Math.random, scale = 1, castShadow = true, mistMat = null) {
  const tree = new THREE.Group();
  const trunkHeight = (2.6 + rng() * 2.4) * scale;
  const trunk = new THREE.Mesh(geometries.trunk, trunkMat);
  trunk.position.y = trunkHeight * 0.48;
  trunk.scale.set(scale * (0.72 + rng() * 0.5), trunkHeight, scale * (0.72 + rng() * 0.5));
  trunk.rotation.z = (rng() - 0.5) * 0.14;
  trunk.castShadow = castShadow;
  tree.add(trunk);

  const canopyCount = 5 + Math.floor(rng() * 5);
  for (let i = 0; i < canopyCount; i += 1) {
    const canopy = new THREE.Mesh(geometries.bushClump, leafMats[Math.floor(rng() * leafMats.length)]);
    const angle = rng() * Math.PI * 2;
    const radius = (0.2 + rng() * 1.2) * scale;
    const height = trunkHeight * (0.58 + rng() * 0.48);
    const clumpScale = (0.82 + rng() * 0.9) * scale;
    canopy.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius * 0.75);
    canopy.scale.set(clumpScale * (1.05 + rng() * 0.75), clumpScale * (0.58 + rng() * 0.38), clumpScale * (0.95 + rng() * 0.65));
    canopy.rotation.set((rng() - 0.5) * 0.32, rng() * Math.PI, (rng() - 0.5) * 0.22);
    canopy.castShadow = castShadow;
    tree.add(canopy);
  }

  const crown = new THREE.Mesh(geometries.bushClump, leafMats[Math.floor(rng() * leafMats.length)]);
  const crownScale = (1.25 + rng() * 0.8) * scale;
  crown.position.y = trunkHeight * (0.96 + rng() * 0.08);
  crown.scale.set(crownScale * 1.18, crownScale * 0.72, crownScale);
  crown.rotation.y = rng() * Math.PI;
  crown.castShadow = castShadow;
  tree.add(crown);

  if (geometries.broadLeaf && rng() < 0.82) {
    const leafCount = 2 + Math.floor(rng() * 4);
    for (let i = 0; i < leafCount; i += 1) {
      const leaf = new THREE.Mesh(geometries.broadLeaf, leafMats[Math.floor(rng() * leafMats.length)]);
      leaf.position.set((rng() - 0.5) * 2.6 * scale, trunkHeight * (0.46 + rng() * 0.45), (rng() - 0.5) * 1.8 * scale);
      leaf.scale.set((0.55 + rng() * 0.52) * scale, (0.6 + rng() * 0.72) * scale, 1);
      leaf.rotation.set(-0.48 - rng() * 0.42, rng() * Math.PI * 2, (rng() - 0.5) * 0.78);
      leaf.castShadow = castShadow;
      tree.add(leaf);
    }
  }

  if (geometries.vine && rng() < 0.9) {
    const vineCount = 2 + Math.floor(rng() * 4);
    for (let i = 0; i < vineCount; i += 1) {
      const length = (1.3 + rng() * 2.6) * scale;
      const vine = new THREE.Mesh(geometries.vine, geometries.vineMaterial ?? trunkMat);
      const angle = rng() * Math.PI * 2;
      vine.position.set(Math.cos(angle) * (0.55 + rng() * 0.95) * scale, trunkHeight * (0.76 + rng() * 0.26) - length * 0.5, Math.sin(angle) * (0.45 + rng() * 0.75) * scale);
      vine.scale.set(1.1 + rng() * 0.9, length, 1.1 + rng() * 0.9);
      vine.rotation.z = (rng() - 0.5) * 0.16;
      vine.castShadow = castShadow;
      tree.add(vine);
    }
  }

  if (geometries.baseMist && mistMat && rng() < 0.7) {
    const mist = new THREE.Mesh(geometries.baseMist, mistMat);
    const mistScale = (2.2 + rng() * 2.8) * scale;
    mist.rotation.x = -Math.PI / 2;
    mist.rotation.z = rng() * Math.PI;
    mist.position.y = 0.055 + rng() * 0.04;
    mist.scale.set(mistScale * (1.0 + rng() * 0.45), mistScale * (0.58 + rng() * 0.24), 1);
    mist.renderOrder = 1;
    tree.add(mist);
  }

  tree.rotation.y = rng() * Math.PI;
  return tree;
}

export function makeLowPolyBush(leafMats, geometries, rng = Math.random, scale = 1, castShadow = true, mistMat = null) {
  const bush = new THREE.Group();
  const clumpCount = 4 + Math.floor(rng() * 5);
  for (let i = 0; i < clumpCount; i += 1) {
    const radius = (0.45 + rng() * 0.58) * scale;
    const clump = new THREE.Mesh(geometries.bushClump, leafMats[Math.floor(rng() * leafMats.length)]);
    clump.position.set((rng() - 0.5) * 1.9 * scale, 0.32 * scale + rng() * 0.52 * scale, (rng() - 0.5) * 1.55 * scale);
    clump.scale.set(radius * (1.1 + rng() * 0.75), radius * (0.58 + rng() * 0.36), radius * (0.9 + rng() * 0.55));
    clump.rotation.set((rng() - 0.5) * 0.24, rng() * Math.PI, (rng() - 0.5) * 0.18);
    clump.castShadow = castShadow;
    bush.add(clump);
  }

  if (geometries.broadLeaf && rng() < 0.7) {
    const leafCount = 1 + Math.floor(rng() * 3);
    for (let i = 0; i < leafCount; i += 1) {
      const leaf = new THREE.Mesh(geometries.broadLeaf, leafMats[Math.floor(rng() * leafMats.length)]);
      leaf.position.set((rng() - 0.5) * 1.8 * scale, 0.72 * scale + rng() * 0.45 * scale, (rng() - 0.5) * 1.3 * scale);
      leaf.scale.set((0.3 + rng() * 0.34) * scale, (0.36 + rng() * 0.48) * scale, 1);
      leaf.rotation.set(-0.62 - rng() * 0.34, rng() * Math.PI * 2, (rng() - 0.5) * 0.75);
      leaf.castShadow = castShadow;
      bush.add(leaf);
    }
  }

  if (geometries.baseMist && mistMat && rng() < 0.38) {
    const mist = new THREE.Mesh(geometries.baseMist, mistMat);
    const mistScale = (1.45 + rng() * 1.25) * scale;
    mist.rotation.x = -Math.PI / 2;
    mist.rotation.z = rng() * Math.PI;
    mist.position.y = 0.045;
    mist.scale.set(mistScale * 1.3, mistScale * 0.62, 1);
    mist.renderOrder = 1;
    bush.add(mist);
  }

  return bush;
}
