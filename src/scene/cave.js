import * as THREE from 'three';

function pseudoNoise(x, y, z) {
  return (
    Math.sin(x * 1.7 + y * 0.6) * 0.5 +
    Math.sin(y * 2.3 - z * 1.1 + 1.3) * 0.3 +
    Math.sin(z * 1.3 + x * 2.1 + 4.7) * 0.2
  );
}

function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function displaceAlongNormal(geometry, amount, frequency = 1) {
  const pos = geometry.attributes.position;
  const normal = geometry.attributes.normal;
  const v = new THREE.Vector3();
  const n = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    n.fromBufferAttribute(normal, i);
    const noise = pseudoNoise(v.x * frequency, v.y * frequency, v.z * frequency);
    v.addScaledVector(n, noise * amount);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
}

function buildFloor() {
  const radius = 58;
  const geo = new THREE.CircleGeometry(radius, 96, 0);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const dist = Math.sqrt(v.x * v.x + v.y * v.y);
    const falloff = smoothstep(11, 26, dist);
    const bump = pseudoNoise(v.x * 0.35, v.y * 0.35, 0) * 0.4 * falloff;
    pos.setZ(i, bump);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({
    color: 0x1c2028,
    roughness: 0.96,
    metalness: 0.04,
  });
  const floor = new THREE.Mesh(geo, mat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  return floor;
}

function buildShowroomFloor() {
  const geo = new THREE.CircleGeometry(15.5, 96);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x0a0c10,
    roughness: 0.22,
    metalness: 0.65,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.015;
  mesh.receiveShadow = true;

  const ringGeo = new THREE.RingGeometry(15.5, 15.85, 96);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0x3a4552,
    emissive: 0x1a2f42,
    emissiveIntensity: 0.6,
    roughness: 0.4,
    metalness: 0.5,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.02;

  const group = new THREE.Group();
  group.add(mesh, ring);
  return group;
}

function buildLagoon() {
  const geo = new THREE.RingGeometry(38, 57, 96);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x03070b,
    roughness: 0.08,
    metalness: 0.9,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -0.06;
  return mesh;
}

function buildShell() {
  const geo = new THREE.SphereGeometry(56, 56, 40, 0, Math.PI * 2, 0, Math.PI * 0.6);
  displaceAlongNormal(geo, 5.5, 0.09);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x1a1e27,
    roughness: 1,
    metalness: 0,
    side: THREE.BackSide,
  });
  const shell = new THREE.Mesh(geo, mat);
  shell.position.y = 4;
  shell.receiveShadow = true;
  return shell;
}

function buildFormations({ count, minR, maxR, minH, maxH, hanging }) {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x1c2028, roughness: 1, metalness: 0.02 });
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = minR + Math.random() * (maxR - minR);
    const height = minH + Math.random() * (maxH - minH);
    const radius = 0.12 + Math.random() * (hanging ? 0.55 : 0.7);
    const geo = new THREE.ConeGeometry(radius, height, 6);
    const mesh = new THREE.Mesh(geo, mat);
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;
    if (hanging) {
      mesh.position.set(x, 21 + Math.random() * 11, z);
      mesh.rotation.x = Math.PI;
    } else {
      mesh.position.set(x, height / 2 - 0.15, z);
    }
    mesh.rotation.y = Math.random() * Math.PI;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  }
  return group;
}

function buildDust() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(180,200,220,0.9)');
  gradient.addColorStop(1, 'rgba(180,200,220,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);

  const count = 220;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 22;
    positions[i * 3] = Math.cos(angle) * dist - 2;
    positions[i * 3 + 1] = Math.random() * 8 + 0.2;
    positions[i * 3 + 2] = Math.sin(angle) * dist;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.05,
    map: texture,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
    color: 0x9fb6cc,
  });
  const points = new THREE.Points(geo, mat);
  points.userData.baseY = positions.slice();
  return points;
}

export function createCave(scene) {
  const cave = new THREE.Group();

  scene.background = new THREE.Color(0x03040a);
  scene.fog = new THREE.FogExp2(0x03040a, 0.019);

  cave.add(buildFloor());
  cave.add(buildShowroomFloor());
  cave.add(buildLagoon());
  cave.add(buildShell());
  cave.add(buildFormations({ count: 42, minR: 8, maxR: 50, minH: 3, maxH: 11, hanging: true }));
  cave.add(buildFormations({ count: 16, minR: 26, maxR: 48, minH: 1.5, maxH: 4.5, hanging: false }));

  const dust = buildDust();
  cave.add(dust);

  const hemi = new THREE.HemisphereLight(0x3a5c82, 0x0d0f16, 2.6);
  cave.add(hemi);

  const rim = new THREE.DirectionalLight(0x6f9fce, 1.3);
  rim.position.set(-24, 32, -14);
  cave.add(rim);

  const batglow = new THREE.PointLight(0x2ea8ff, 1100, 60, 2);
  batglow.position.set(-36, 7, -32);
  cave.add(batglow);

  const wallWash1 = new THREE.PointLight(0x3d72a4, 800, 50, 2);
  wallWash1.position.set(18, 15, -26);
  cave.add(wallWash1);

  const wallWash2 = new THREE.PointLight(0xa46a35, 480, 44, 2);
  wallWash2.position.set(-22, 10, 20);
  cave.add(wallWash2);

  const overhead = new THREE.PointLight(0x9fc4e8, 340, 34, 2);
  overhead.position.set(-0.3, 20, 4);
  cave.add(overhead);

  scene.add(cave);

  return {
    group: cave,
    update(delta, elapsed) {
      dust.rotation.y += delta * 0.01;
      const pos = dust.geometry.attributes.position;
      const base = dust.userData.baseY;
      for (let i = 0; i < pos.count; i++) {
        const by = base[i * 3 + 1];
        pos.setY(i, by + Math.sin(elapsed * 0.15 + i) * 0.6 + elapsed * 0.03 % 8);
      }
      pos.needsUpdate = true;
    },
  };
}
