import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const DEFAULT_BLOOM = {
  // A high threshold keeps the pass focused on intentionally bright/emissive
  // objects: fruit trails, pineapples, gate lights, torches, telegraphs, and
  // sprite popups. Conservative strength/radius avoids washing out the jungle.
  threshold: 0.82,
  strength: 0.34,
  radius: 0.42,
};

export function createPostProcessing(renderer, scene, camera, { width, height, pixelRatio = 1, bloom = {} } = {}) {
  const renderSize = new THREE.Vector2(Math.max(1, width || 1), Math.max(1, height || 1));
  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(pixelRatio);
  composer.setSize(renderSize.x, renderSize.y);

  const renderPass = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(renderSize, 0, 0, 0);
  const bloomSettings = { ...DEFAULT_BLOOM, ...bloom };
  bloomPass.threshold = bloomSettings.threshold;
  bloomPass.strength = bloomSettings.strength;
  bloomPass.radius = bloomSettings.radius;

  composer.addPass(renderPass);
  composer.addPass(bloomPass);

  return {
    composer,
    renderPass,
    bloomPass,
    render() {
      composer.render();
    },
    resize(nextWidth, nextHeight, nextPixelRatio = pixelRatio) {
      const safeWidth = Math.max(1, nextWidth || 1);
      const safeHeight = Math.max(1, nextHeight || 1);
      composer.setPixelRatio(nextPixelRatio);
      composer.setSize(safeWidth, safeHeight);
      bloomPass.resolution.set(safeWidth, safeHeight);
    },
    dispose() {
      composer.dispose();
    },
  };
}
