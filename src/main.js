import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createCave } from './scene/cave.js';
import { createTurntable } from './scene/turntable.js';
import { createCar } from './vehicles/car.js';
import { createMotorcycle } from './vehicles/motorcycle.js';

const canvas = document.getElementById('scene');
const loadingEl = document.getElementById('loading');
const hintEl = document.getElementById('hud-hint');
const carPlateEl = document.getElementById('plate-car');
const bikePlateEl = document.getElementById('plate-bike');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 220);
const target = new THREE.Vector3(-0.3, 1.1, 0);
camera.position.set(1.2, 3.6, 11.5);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.3;

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.copy(target);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 4;
controls.maxDistance = 24;
controls.minPolarAngle = 0.3;
controls.maxPolarAngle = 1.48;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.35;
controls.update();

const cave = createCave(scene);

const carTurntable = createTurntable({
  position: new THREE.Vector3(-3.6, 0, 0),
  radius: 2.5,
  ringColor: 0x6f9fd8,
  revolutionSeconds: 30,
});
scene.add(carTurntable.group);
carTurntable.vehicleMount.add(createCar());

const bikeTurntable = createTurntable({
  position: new THREE.Vector3(3.0, 0, 0),
  radius: 1.4,
  ringColor: 0x8fd66f,
  revolutionSeconds: 22,
});
scene.add(bikeTurntable.group);
bikeTurntable.vehicleMount.add(createMotorcycle());

const carLabelAnchor = new THREE.Vector3(carTurntable.group.position.x, 2.15, carTurntable.group.position.z);
const bikeLabelAnchor = new THREE.Vector3(bikeTurntable.group.position.x, 1.65, bikeTurntable.group.position.z);
const projTemp = new THREE.Vector3();

function updateLabel(el, anchor) {
  projTemp.copy(anchor).project(camera);
  if (projTemp.z > 1 || projTemp.z < -1) {
    el.style.opacity = '0';
    return;
  }
  el.style.opacity = '1';
  const x = (projTemp.x * 0.5 + 0.5) * window.innerWidth;
  const y = (1 - (projTemp.y * 0.5 + 0.5)) * window.innerHeight;
  el.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
}

let spinning = true;
window.addEventListener('keydown', (event) => {
  if (event.code !== 'Space') return;
  event.preventDefault();
  spinning = !spinning;
  carTurntable.setSpinning(spinning);
  bikeTurntable.setSpinning(spinning);
});

let hintFaded = false;
function fadeHintOnFirstInput() {
  if (hintFaded) return;
  hintFaded = true;
  hintEl.style.opacity = '0';
}
controls.addEventListener('start', fadeHintOnFirstInput);
window.addEventListener('keydown', fadeHintOnFirstInput, { once: true });

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize);

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.1);
  const elapsed = clock.elapsedTime;

  cave.update(delta, elapsed);
  carTurntable.update(delta);
  bikeTurntable.update(delta);
  controls.update();

  renderer.render(scene, camera);

  updateLabel(carPlateEl, carLabelAnchor);
  updateLabel(bikePlateEl, bikeLabelAnchor);
}

animate();

setTimeout(() => loadingEl.classList.add('hidden'), 550);
