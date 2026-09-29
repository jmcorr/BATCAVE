import * as THREE from 'three';

export function createTurntable({ position, radius = 2.4, ringColor = 0x7fb8d9, revolutionSeconds = 26 }) {
  const group = new THREE.Group();
  group.position.copy(position);

  const bezelGeo = new THREE.TorusGeometry(radius + 0.16, 0.08, 12, 64);
  const bezelMat = new THREE.MeshStandardMaterial({ color: 0x1c1f26, metalness: 0.7, roughness: 0.35 });
  const bezel = new THREE.Mesh(bezelGeo, bezelMat);
  bezel.rotation.x = Math.PI / 2;
  bezel.position.y = 0.03;
  bezel.castShadow = true;
  group.add(bezel);

  const disc = new THREE.Group();
  group.add(disc);

  const discTopGeo = new THREE.CylinderGeometry(radius, radius, 0.16, 64);
  const discTopMat = new THREE.MeshStandardMaterial({ color: 0x0c0e12, metalness: 0.75, roughness: 0.22 });
  const discTop = new THREE.Mesh(discTopGeo, discTopMat);
  discTop.position.y = 0.08;
  discTop.receiveShadow = true;
  discTop.castShadow = true;
  disc.add(discTop);

  const ringGeo = new THREE.TorusGeometry(radius * 0.88, 0.02, 8, 96);
  const ringMat = new THREE.MeshStandardMaterial({
    color: ringColor,
    emissive: ringColor,
    emissiveIntensity: 1.8,
    roughness: 0.4,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.17;
  disc.add(ring);

  const vehicleMount = new THREE.Group();
  vehicleMount.position.y = 0.16;
  disc.add(vehicleMount);

  const spot = new THREE.SpotLight(0xfbf2e2, 1300, 34, Math.PI / 6.5, 0.5, 1.4);
  spot.position.set(position.x + 2.2, 13.5, position.z + 3.2);
  spot.target.position.copy(position);
  spot.castShadow = true;
  spot.shadow.mapSize.set(1024, 1024);
  spot.shadow.bias = -0.0006;
  spot.shadow.camera.near = 5;
  spot.shadow.camera.far = 30;
  group.add(spot, spot.target);

  const fill = new THREE.PointLight(0x8fb3d9, 260, 15, 2);
  fill.position.set(position.x - 2.6, 2.1, position.z + 2.8);
  group.add(fill);

  const kicker = new THREE.PointLight(ringColor, 180, 11, 2);
  kicker.position.set(position.x, 0.6, position.z - radius - 0.5);
  group.add(kicker);

  let spinning = true;
  const speed = (Math.PI * 2) / revolutionSeconds;

  return {
    group,
    vehicleMount,
    setSpinning(value) {
      spinning = value;
    },
    toggleSpinning() {
      spinning = !spinning;
      return spinning;
    },
    update(delta) {
      if (spinning) disc.rotation.y += delta * speed;
    },
  };
}
