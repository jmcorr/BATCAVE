import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

export const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

export function loadGLTF(url) {
  return new Promise((resolve, reject) => {
    gltfLoader.load(url, resolve, undefined, reject);
  });
}

export function createStudioEnvironment(renderer) {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const texture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
  pmremGenerator.dispose();
  return texture;
}

export function fitAndGround(object, targetLength) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  box.getSize(size);

  const currentLength = Math.max(size.x, size.z);
  const scale = targetLength / currentLength;
  object.scale.setScalar(scale);

  const box2 = new THREE.Box3().setFromObject(object);
  const center2 = new THREE.Vector3();
  box2.getCenter(center2);
  object.position.x -= center2.x;
  object.position.z -= center2.z;
  object.position.y -= box2.min.y;

  return object;
}
