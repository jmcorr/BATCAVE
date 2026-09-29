import * as THREE from 'three';
import { loadGLTF, fitAndGround } from './gltfLoader.js';

const TARGET_LENGTH = 4.4;

export async function loadCar(envMap) {
  const gltf = await loadGLTF('/models/ferrari.glb');
  const car = gltf.scene.children[0] ?? gltf.scene;

  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x050505,
    metalness: 1,
    roughness: 0.18,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    envMap,
  });

  const detailsMaterial = new THREE.MeshStandardMaterial({
    color: 0xe7e7ea,
    metalness: 1,
    roughness: 0.35,
    envMap,
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.25,
    roughness: 0,
    transmission: 1,
    envMap,
  });

  const body = car.getObjectByName('body');
  if (body) body.material = bodyMaterial;

  ['rim_fl', 'rim_fr', 'rim_rr', 'rim_rl'].forEach((name) => {
    const part = car.getObjectByName(name);
    if (part) part.material = detailsMaterial;
  });

  const glass = car.getObjectByName('glass');
  if (glass) glass.material = glassMaterial;

  car.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });

  fitAndGround(car, TARGET_LENGTH);

  return car;
}
