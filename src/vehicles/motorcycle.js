import * as THREE from 'three';

const KAWASAKI_GREEN = 0x5fb327;
const GLOSS_BLACK = 0x08090b;
const GUNMETAL = 0x16181c;
const TITANIUM = 0x6c6f74;
const GOLD = 0xc8a24a;
const TIRE = 0x1b1d20;

function material(color, opts = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.3, ...opts });
}

function buildWheel(radius, tube) {
  const group = new THREE.Group();

  const tireMat = material(TIRE, { roughness: 0.97, metalness: 0.02 });
  const tire = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 14, 36), tireMat);
  tire.castShadow = true;
  tire.receiveShadow = true;
  group.add(tire);

  const rimMat = material(GOLD, { roughness: 0.35, metalness: 0.85 });
  const rimGeo = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, tube * 0.7, 20, 1, true);
  rimGeo.rotateX(Math.PI / 2);
  const rim = new THREE.Mesh(rimGeo, rimMat);
  group.add(rim);

  const hubGeo = new THREE.CylinderGeometry(radius * 0.14, radius * 0.14, tube * 1.4, 12);
  hubGeo.rotateX(Math.PI / 2);
  const hub = new THREE.Mesh(hubGeo, material(0x1a1c20, { metalness: 0.7, roughness: 0.4 }));
  group.add(hub);

  const spokeMat = material(GOLD, { roughness: 0.4, metalness: 0.8 });
  for (let i = 0; i < 5; i++) {
    const spokeGeo = new THREE.BoxGeometry(radius * 1.15, 0.018, 0.02);
    const spoke = new THREE.Mesh(spokeGeo, spokeMat);
    spoke.rotation.z = (i / 5) * Math.PI;
    group.add(spoke);
  }

  return group;
}

export function createMotorcycle() {
  const bike = new THREE.Group();
  bike.name = 'Kawasaki Ninja ZX-6R (2006)';

  const R_W = 0.3;
  const TUBE = 0.078;
  const wheelbase = 1.4;

  const greenMat = material(KAWASAKI_GREEN, { roughness: 0.35, metalness: 0.25 });
  const blackMat = material(GLOSS_BLACK, { roughness: 0.3, metalness: 0.3 });
  const gunmetalMat = material(GUNMETAL, { roughness: 0.5, metalness: 0.6 });
  const titaniumMat = material(TITANIUM, { roughness: 0.45, metalness: 0.55 });
  const goldMat = material(GOLD, { roughness: 0.35, metalness: 0.85 });

  const frontWheel = buildWheel(R_W, TUBE);
  frontWheel.position.set(wheelbase / 2, R_W, 0);
  bike.add(frontWheel);

  const rearWheel = buildWheel(R_W, TUBE);
  rearWheel.position.set(-wheelbase / 2, R_W, 0);
  bike.add(rearWheel);

  const swingarmGeo = new THREE.BoxGeometry(0.55, 0.06, 0.06);
  const swingarmL = new THREE.Mesh(swingarmGeo, gunmetalMat);
  swingarmL.position.set(-0.42, 0.28, 0.12);
  bike.add(swingarmL);
  const swingarmR = swingarmL.clone();
  swingarmR.position.z = -0.12;
  bike.add(swingarmR);

  const tankGeo = new THREE.CapsuleGeometry(0.19, 0.4, 4, 14);
  tankGeo.rotateZ(-Math.PI / 2);
  const tank = new THREE.Mesh(tankGeo, greenMat);
  tank.scale.set(1, 0.85, 0.88);
  tank.position.set(0.16, 0.68, 0);
  tank.castShadow = true;
  bike.add(tank);

  const tankStripeGeo = new THREE.BoxGeometry(0.5, 0.05, 0.32);
  const tankStripe = new THREE.Mesh(tankStripeGeo, blackMat);
  tankStripe.position.set(0.14, 0.84, 0);
  bike.add(tankStripe);

  const tailGeo = new THREE.BoxGeometry(0.5, 0.2, 0.32);
  const tail = new THREE.Mesh(tailGeo, blackMat);
  tail.position.set(-0.62, 0.74, 0);
  tail.rotation.z = 0.05;
  tail.castShadow = true;
  bike.add(tail);

  const tailStripeGeo = new THREE.BoxGeometry(0.5, 0.05, 0.34);
  const tailStripe = new THREE.Mesh(tailStripeGeo, greenMat);
  tailStripe.position.set(-0.6, 0.65, 0);
  bike.add(tailStripe);

  const tailTipGeo = new THREE.ConeGeometry(0.17, 0.22, 4);
  tailTipGeo.rotateZ(-Math.PI / 2);
  tailTipGeo.scale(1, 1, 0.62);
  const tailTip = new THREE.Mesh(tailTipGeo, blackMat);
  tailTip.position.set(-0.92, 0.76, 0);
  bike.add(tailTip);

  const seatGeo = new THREE.BoxGeometry(0.42, 0.05, 0.28);
  const seat = new THREE.Mesh(seatGeo, blackMat);
  seat.position.set(-0.42, 0.85, 0);
  bike.add(seat);

  const fairingGeo = new THREE.CylinderGeometry(0.1, 0.24, 0.72, 14);
  fairingGeo.rotateZ(-Math.PI / 2);
  const fairing = new THREE.Mesh(fairingGeo, greenMat);
  fairing.scale.set(1, 1.1, 0.7);
  fairing.position.set(0.6, 0.68, 0);
  fairing.castShadow = true;
  bike.add(fairing);

  const bellyGeo = new THREE.BoxGeometry(0.62, 0.26, 0.3);
  const belly = new THREE.Mesh(bellyGeo, blackMat);
  belly.position.set(0.22, 0.42, 0);
  belly.castShadow = true;
  bike.add(belly);

  const bellyStripeGeo = new THREE.BoxGeometry(0.62, 0.05, 0.31);
  const bellyStripe = new THREE.Mesh(bellyStripeGeo, greenMat);
  bellyStripe.position.set(0.22, 0.53, 0);
  bike.add(bellyStripe);

  const headGeoUpper = new THREE.SphereGeometry(0.066, 14, 12);
  const headMat = new THREE.MeshStandardMaterial({
    color: 0xeef5ff,
    emissive: 0x9fc4ff,
    emissiveIntensity: 0.45,
    roughness: 0.25,
    metalness: 0.1,
  });
  const headUpper = new THREE.Mesh(headGeoUpper, headMat);
  headUpper.position.set(0.98, 0.72, 0);
  bike.add(headUpper);

  const headLower = new THREE.Mesh(new THREE.SphereGeometry(0.05, 14, 12), headMat);
  headLower.position.set(0.95, 0.6, 0);
  bike.add(headLower);

  const screenGeo = new THREE.PlaneGeometry(0.24, 0.24);
  screenGeo.rotateY(Math.PI / 2);
  const screenMat = new THREE.MeshPhysicalMaterial({
    color: 0x1a2a33,
    transparent: true,
    opacity: 0.4,
    roughness: 0.15,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(0.78, 0.92, 0);
  screen.rotation.z = -0.45;
  bike.add(screen);

  const exhaustGeo = new THREE.CylinderGeometry(0.065, 0.08, 0.34, 14);
  exhaustGeo.rotateZ(-Math.PI / 2);
  const exhaust = new THREE.Mesh(exhaustGeo, titaniumMat);
  exhaust.position.set(-0.88, 0.34, 0.19);
  exhaust.rotation.y = 0.1;
  exhaust.castShadow = true;
  bike.add(exhaust);

  const forkGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.44, 10);
  const forkL = new THREE.Mesh(forkGeo, goldMat);
  forkL.position.set(0.8, 0.5, 0.1);
  forkL.rotation.z = -0.35;
  bike.add(forkL);
  const forkR = forkL.clone();
  forkR.position.z = -0.1;
  bike.add(forkR);

  const yokeGeo = new THREE.BoxGeometry(0.1, 0.12, 0.26);
  const yoke = new THREE.Mesh(yokeGeo, gunmetalMat);
  yoke.position.set(0.85, 0.68, 0);
  yoke.rotation.z = -0.35;
  bike.add(yoke);

  const barGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.28, 10);
  const barL = new THREE.Mesh(barGeo, gunmetalMat);
  barL.position.set(0.8, 0.82, 0.16);
  barL.rotation.x = Math.PI / 2.3;
  barL.rotation.z = -0.3;
  bike.add(barL);
  const barR = barL.clone();
  barR.position.z = -0.16;
  barR.rotation.z = 0.3;
  bike.add(barR);

  const fenderGeo = new THREE.BoxGeometry(0.32, 0.045, 0.26);
  const fender = new THREE.Mesh(fenderGeo, blackMat);
  fender.position.set(0.72, 0.52, 0);
  fender.rotation.z = -0.15;
  bike.add(fender);

  const tailLight = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.06, 0.2),
    new THREE.MeshStandardMaterial({ color: 0x3a0708, emissive: 0x7a0e10, emissiveIntensity: 0.6, roughness: 0.3 })
  );
  tailLight.position.set(-1.0, 0.78, 0);
  bike.add(tailLight);

  bike.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });

  return bike;
}
