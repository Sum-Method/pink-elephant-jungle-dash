import * as THREE from "three";

export function makeBananaLeafCluster(rng, material, geometries, count = 5) {
  const cluster = new THREE.Group();
  for (let i = 0; i < count; i += 1) {
    const leaf = new THREE.Mesh(geometries.broadBananaLeaf, material);
    leaf.position.set((rng() - 0.5) * 1.45, 1.05 + rng() * 0.75, (rng() - 0.5) * 0.56);
    leaf.rotation.set(-0.55 - rng() * 0.28, rng() * Math.PI * 2, (rng() - 0.5) * 0.62);
    leaf.scale.set(0.82 + rng() * 0.55, 0.92 + rng() * 0.7, 1);
    leaf.castShadow = true;
    cluster.add(leaf);
  }
  return cluster;
}

export function makeMossPatch(rng, material, geometries, count = 7) {
  const patch = new THREE.Group();
  for (let i = 0; i < count; i += 1) {
    const moss = new THREE.Mesh(geometries.mossClump, material);
    const scale = 0.45 + rng() * 0.8;
    moss.position.set((rng() - 0.5) * 1.8, 0.08 + rng() * 0.12, (rng() - 0.5) * 1.4);
    moss.scale.set(scale * (1.2 + rng() * 0.6), scale * 0.28, scale * (0.8 + rng() * 0.45));
    moss.rotation.y = rng() * Math.PI;
    moss.receiveShadow = true;
    patch.add(moss);
  }
  return patch;
}

export function makeLargeRockPile(rng, rockMaterial, mossMaterial, geometries, count = 3) {
  const pile = new THREE.Group();
  for (let i = 0; i < count; i += 1) {
    const rock = new THREE.Mesh(geometries.foregroundRock, rockMaterial);
    const scale = 0.8 + rng() * 1.2;
    rock.position.set((rng() - 0.5) * 1.7, scale * 0.28, (rng() - 0.5) * 1.2);
    rock.scale.set(scale * (1.0 + rng() * 0.6), scale * (0.42 + rng() * 0.25), scale * (0.7 + rng() * 0.5));
    rock.rotation.set((rng() - 0.5) * 0.28, rng() * Math.PI, (rng() - 0.5) * 0.22);
    rock.castShadow = true;
    rock.receiveShadow = true;
    pile.add(rock);
  }
  const moss = makeMossPatch(rng, mossMaterial, geometries, 3 + Math.floor(rng() * 4));
  moss.position.y = 0.46;
  pile.add(moss);
  return pile;
}

export function makeRuinBlockCluster(rng, blockMaterial, mossMaterial, geometries, blockCount = 4) {
  const ruin = new THREE.Group();
  for (let i = 0; i < blockCount; i += 1) {
    const block = new THREE.Mesh(geometries.ruinBlockCluster, blockMaterial);
    const width = 0.65 + rng() * 0.8;
    const height = 0.42 + rng() * 1.0;
    block.position.set((rng() - 0.5) * 2.0, height * 0.5 - 0.02, (rng() - 0.5) * 1.25);
    block.scale.set(width, height, 0.55 + rng() * 0.72);
    block.rotation.y = (rng() - 0.5) * 0.36;
    block.castShadow = true;
    block.receiveShadow = true;
    ruin.add(block);
  }
  const moss = makeMossPatch(rng, mossMaterial, geometries, 4 + Math.floor(rng() * 3));
  moss.position.set(0, 0.18, 0);
  ruin.add(moss);
  return ruin;
}

