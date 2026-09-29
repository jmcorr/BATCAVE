import * as THREE from 'three';

const GLOSS_BLACK = 0x05060a;
const GLASS = 0x0b0e16;
const CHROME = 0xc9ccd1;
const RED = 0x220304;

function material(color, opts = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.4, ...opts });
}

function shapeFromPoints(points) {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) shape.lineTo(points[i][0], points[i][1]);
  shape.closePath();
  return shape;
}

function buildWheel(radius, tube) {
  const group = new THREE.Group();

  const tire = new THREE.Mesh(
    new THREE.TorusGeometry(radius, tube, 14, 36),
    material(0x0a0a0b, { roughness: 0.97, metalness: 0.02 })
  );
  group.add(tire);

  const rimGeo = new THREE.CylinderGeometry(radius * 0.62, radius * 0.62, tube * 0.75, 24, 1, true);
  rimGeo.rotateX(Math.PI / 2);
  const rim = new THREE.Mesh(rimGeo, material(CHROME, { roughness: 0.25, metalness: 0.9 }));
  group.add(rim);

  const hubGeo = new THREE.CylinderGeometry(radius * 0.16, radius * 0.16, tube * 1.5, 14);
  hubGeo.rotateX(Math.PI / 2);
  const hub = new THREE.Mesh(hubGeo, material(0x14161a, { metalness: 0.7, roughness: 0.35 }));
  group.add(hub);

  const spokeMat = material(CHROME, { roughness: 0.3, metalness: 0.85 });
  for (let i = 0; i < 7; i++) {
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(radius * 1.2, 0.022, 0.025), spokeMat);
    spoke.rotation.z = (i / 7) * Math.PI;
    group.add(spoke);
  }

  return group;
}

export function createCar() {
  const car = new THREE.Group();
  car.name = 'BMW 2 Series Coupe (2016)';

  const bodyMat = material(GLOSS_BLACK, { roughness: 0.22, metalness: 0.55 });
  const glassMat = material(GLASS, { roughness: 0.08, metalness: 0.7 });
  const chromeMat = material(CHROME, { roughness: 0.2, metalness: 0.9 });

  const shellWidth = 1.6;
  const shellPoints = [
    [-2.15, 0.3],
    [-2.21, 0.44],
    [-2.2, 0.58],
    [-2.05, 0.76],
    [-1.9, 0.86],
    [-1.7, 0.92],
    [-1.5, 0.94],
    [-0.6, 0.96],
    [0.35, 0.95],
    [0.55, 0.93],
    [0.72, 0.87],
    [0.95, 0.79],
    [1.25, 0.72],
    [1.55, 0.65],
    [1.78, 0.58],
    [1.95, 0.5],
    [2.07, 0.42],
    [2.13, 0.33],
    [2.1, 0.24],
    [1.97, 0.2],
    [1.6, 0.24],
    [1.0, 0.27],
    [0.0, 0.29],
    [-1.0, 0.29],
    [-1.7, 0.27],
    [-2.05, 0.26],
  ];
  const shellGeo = new THREE.ExtrudeGeometry(shapeFromPoints(shellPoints), {
    depth: shellWidth,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 2,
    curveSegments: 1,
  });
  shellGeo.translate(0, 0, -shellWidth / 2);
  const shell = new THREE.Mesh(shellGeo, bodyMat);
  shell.castShadow = true;
  shell.receiveShadow = true;
  car.add(shell);

  const cabinWidth = 1.36;
  const cabinPoints = [
    [-0.92, 0.93],
    [-0.82, 1.12],
    [-0.68, 1.28],
    [-0.4, 1.36],
    [-0.05, 1.39],
    [0.28, 1.37],
    [0.48, 1.28],
    [0.62, 1.1],
    [0.78, 0.93],
    [0.6, 0.93],
    [0.2, 0.94],
    [-0.4, 0.94],
    [-0.75, 0.93],
  ];
  const cabinGeo = new THREE.ExtrudeGeometry(shapeFromPoints(cabinPoints), {
    depth: cabinWidth,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelSegments: 2,
    curveSegments: 1,
  });
  cabinGeo.translate(0, 0, -cabinWidth / 2);
  const cabin = new THREE.Mesh(cabinGeo, glassMat);
  cabin.castShadow = true;
  car.add(cabin);

  [1, -1].forEach((side) => {
    const beltGeo = new THREE.BoxGeometry(3.55, 0.025, 0.02);
    const belt = new THREE.Mesh(beltGeo, chromeMat);
    belt.position.set(-0.2, 0.94, side * (shellWidth / 2 + 0.005));
    car.add(belt);
  });

  const R_W = 0.3;
  const TUBE = 0.095;
  const wheelX = 1.325;
  const wheelZ = 0.92;
  [
    [wheelX, wheelZ],
    [wheelX, -wheelZ],
    [-wheelX, wheelZ],
    [-wheelX, -wheelZ],
  ].forEach(([x, z]) => {
    const wheel = buildWheel(R_W, TUBE);
    wheel.position.set(x, R_W, z);
    car.add(wheel);
  });

  const grilleMat = material(0x0a0a0c, { roughness: 0.6, metalness: 0.3 });
  [1, -1].forEach((side) => {
    const grille = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.17), grilleMat);
    grille.position.set(2.06, 0.44, side * 0.13);
    grille.rotation.y = side * 0.05;
    car.add(grille);
  });

  const headlightHousing = material(0x0d0f13, { roughness: 0.2, metalness: 0.6 });
  const headlightGlow = new THREE.MeshStandardMaterial({
    color: 0xeaf3ff,
    emissive: 0xbfe0ff,
    emissiveIntensity: 0.55,
    roughness: 0.2,
  });
  [1, -1].forEach((side) => {
    const housing = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.13, 0.3), headlightHousing);
    housing.position.set(2.02, 0.52, side * 0.56);
    car.add(housing);

    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.025, 0.26), headlightGlow);
    strip.position.set(2.07, 0.56, side * 0.56);
    car.add(strip);
  });

  const taillightMat = new THREE.MeshStandardMaterial({
    color: RED,
    emissive: 0x8a0f12,
    emissiveIntensity: 0.55,
    roughness: 0.3,
  });
  [1, -1].forEach((side) => {
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 0.28), taillightMat);
    tail.position.set(-2.1, 0.62, side * 0.58);
    car.add(tail);
  });

  [1, -1].forEach((side) => {
    const mirrorArm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.1), bodyMat);
    mirrorArm.position.set(0.42, 0.98, side * 0.84);
    car.add(mirrorArm);
    const mirrorCap = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.09, 0.16), bodyMat);
    mirrorCap.position.set(0.4, 0.98, side * 0.92);
    car.add(mirrorCap);
  });

  [1, -1].forEach((side) => {
    const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.12, 14), chromeMat);
    tip.rotation.z = Math.PI / 2;
    tip.position.set(-2.16, 0.22, side * 0.38);
    car.add(tip);
  });

  const plateMat = material(0x15181d, { roughness: 0.5, metalness: 0.2 });
  const platef = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.13, 0.32), plateMat);
  platef.position.set(2.1, 0.32, 0);
  car.add(platef);

  car.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });

  return car;
}
