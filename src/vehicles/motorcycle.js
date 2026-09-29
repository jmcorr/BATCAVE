import { loadGLTF, fitAndGround } from './gltfLoader.js';

const TARGET_LENGTH = 1.9;

export async function loadMotorcycle(envMap) {
  const gltf = await loadGLTF('/models/motorcycle.glb');
  const bike = gltf.scene;

  bike.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
      if (obj.material && 'envMap' in obj.material && !obj.material.envMap) {
        obj.material.envMap = envMap;
        obj.material.envMapIntensity = 0.6;
        obj.material.needsUpdate = true;
      }
    }
  });

  fitAndGround(bike, TARGET_LENGTH);

  return bike;
}
