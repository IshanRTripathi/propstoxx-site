import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const stage = document.querySelector(".stage");
const canvas = stage.querySelector("canvas");
const small = matchMedia("(max-width: 900px)").matches;

// Throws without WebGL, which leaves the poster image in place.
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.localClippingEnabled = true;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 400);
scene.fog = new THREE.Fog(0xf1ece1, 60, 150);

const hemi = new THREE.HemisphereLight(0xffffff, 0x8a8170, 1.1);
const sun = new THREE.DirectionalLight(0xfff1dc, 2.6);
sun.castShadow = true;
sun.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048);
Object.assign(sun.shadow.camera, { left: -24, right: 24, top: 24, bottom: -24, near: 1, far: 110 });
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.03;
const glow = new THREE.PointLight(0xffb45e, 0, 34, 1.4);
glow.position.set(0, 2.2, 0.5);
scene.add(hemi, sun, sun.target, glow);

const ground = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), new THREE.MeshStandardMaterial({ color: 0xf1ece1, roughness: 1 }));
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const leaf = new THREE.MeshStandardMaterial({ color: 0x6f8f4e, roughness: 0.9, flatShading: true });
const trunk = new THREE.MeshStandardMaterial({ color: 0x6b4f3a, roughness: 0.9 });
[[-11, -3], [11, -6], [-10, 9], [12, 5], [-4, -10], [7, -10.5]].forEach(([x, z], i) => {
  const s = 0.9 + (i % 3) * 0.25;
  const t = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 2 * s).translate(0, s, 0), trunk);
  const c = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5 * s, 1), leaf);
  t.position.set(x, 0, z);
  c.position.set(x, 2.5 * s, z);
  t.castShadow = c.castShadow = true;
  scene.add(t, c);
});

// The model is one body mesh, so floors are made by rendering three copies, each clipped to a height band.
// Cuts sit where the model has no horizontal faces (slab top is 3.55 m, roof slab starts at 6.41 m);
// a cut on a face makes it flicker.
const BANDS = [[-1, 3.66], [3.66, 6.3], [6.3, 99]];
const ink = new THREE.Color(0x1f2228), slabCut = new THREE.Color(0xe4dfd5);
const bands = [], caps = [], glass = [], lamps = [];
// Back faces are drawn flat so every cut reads as solid: ink on the plan, slab colour once built.
function capMat(planes) {
  const m = new THREE.MeshBasicMaterial({ color: ink, side: THREE.BackSide, clippingPlanes: planes, polygonOffset: true, polygonOffsetFactor: 2, polygonOffsetUnits: 2 });
  caps.push(m);
  return m;
}

new GLTFLoader().load("models/modern-house.glb", (gltf) => {
  BANDS.forEach(([lo, hi]) => {
    const low = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const high = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
    const planes = [low, high];
    const copy = gltf.scene.clone(true);
    const pairs = [];
    copy.traverse((o) => {
      if (!o.isMesh) return;
      const m = o.material.clone();
      m.clippingPlanes = planes;
      m.clipShadows = true;
      o.material = m;
      o.castShadow = o.receiveShadow = true;
      if (/glass/.test(m.name)) { m.emissive = new THREE.Color(0xffb45e); glass.push(m); }
      if (/lamp/.test(m.name)) { m.emissive = new THREE.Color(0xffc46b); lamps.push(m); }
      pairs.push([o, new THREE.Mesh(o.geometry, capMat(planes))]);
    });
    pairs.forEach(([o, cap]) => o.add(cap));
    const group = new THREE.Group();
    group.add(copy);
    scene.add(group);
    bands.push({ group, lo, hi, low, high });
  });
  stage.classList.add("gl");
  dirty = true;
});

// Timeline
const clamp = (v) => Math.min(1, Math.max(0, v));
const ease = (t) => t * t * (3 - 2 * t);
const seg = (p, a, b) => ease(clamp((p - a) / (b - a)));
const C = (h) => new THREE.Color(h);
const paper = C(0xf1ece1), sage = C(0xd6d9c2), sky = C(0xdfe7ee), dusk = C(0x151c2c);
// The plan key sits straight above the house so the entrance (east, +z) faces the reader.
const keys = [
  [0, [0, 40, 0.01], [0, 0, 0]],
  [0.08, [0, 40, 0.01], [0, 0, 0]],
  [0.3, [21, 15, 26], [0, 2, 0]],
  [0.46, [-25, 15, 27], [0, 3.6, 0]],
  [0.62, [33, 22, 22], [0, 6.5, 0]],
  [0.7, [25, 13, 23], [0, 3.6, 0]],
  [0.88, [-27, 10, 22], [0, 3.6, 0]],
  [1, [2, 6, 35], [0, 3.8, 0]],
];
const v3 = (a) => new THREE.Vector3(...a);
const tmp = new THREE.Vector3();
function cameraAt(p) {
  let i = 0;
  while (i < keys.length - 2 && p > keys[i + 1][0]) i++;
  const [pa, ca, ta] = keys[i], [pb, cb, tb] = keys[i + 1];
  const t = ease(clamp((p - pa) / (pb - pa)));
  const target = v3(ta).lerp(v3(tb), t);
  const pos = v3(ca).lerp(v3(cb), t);
  pos.sub(target).multiplyScalar(Math.max(1, 1.3 / camera.aspect)).add(target);
  camera.position.copy(pos);
  camera.lookAt(target);
}

const labels = [...document.querySelectorAll(".lb")].map((el) => ({
  el,
  at: el.dataset.at ? v3(el.dataset.at.split(",").map(Number)) : null,
  floor: el.dataset.floor,
}));
const titleblock = document.querySelector(".titleblock");

function apply(p) {
  const cut = 1.2 + seg(p, 0.1, 0.42) * 8;
  const ex = seg(p, 0.48, 0.6) * (1 - seg(p, 0.64, 0.7));
  const hour = p < 0.7 ? 10 : 7 + clamp((p - 0.7) / 0.2) * 12;
  const night = seg(p, 0.88, 0.98);
  const grown = seg(p, 0.1, 0.3);

  bands.forEach((b, i) => {
    const off = i * 3.5 * ex;
    b.group.position.y = off;
    b.group.visible = cut > b.lo;
    b.low.constant = -(b.lo + off);
    b.high.constant = Math.min(b.hi, cut) + off;
  });
  caps.forEach((m) => m.color.lerpColors(ink, slabCut, grown));

  ground.material.color.lerpColors(paper, sage, grown);
  const bg = paper.clone().lerp(sky, grown).lerp(dusk, night);
  scene.background = bg;
  scene.fog.color.copy(bg);

  // East is +z (the entrance side), so the sun rises over the door and sets behind the house.
  // At Bengaluru's latitude the midday sun is high and a little to the south (-x).
  const a = ((hour - 6) / 12) * Math.PI;
  const h = Math.sin(a);
  sun.position.set(-10, Math.max(h, 0.05) * 32 + 2, Math.cos(a) * 32);
  sun.intensity = (0.4 + 2.4 * clamp(h * 1.6)) * (1 - night * 0.85);
  sun.color.setRGB(1, 0.78 + 0.2 * clamp(h), 0.55 + 0.4 * clamp(h));
  hemi.intensity = 1.1 * (1 - night * 0.72);
  glass.forEach((m) => (m.emissiveIntensity = night * 1.4));
  lamps.forEach((m) => (m.emissiveIntensity = night * 2));
  glow.intensity = night * 110;

  cameraAt(p);
  camera.updateMatrixWorld();

  const w = stage.clientWidth, hgt = stage.clientHeight;
  const show = { plan: 1 - seg(p, 0.06, 0.12), floor: ex, top: Math.max(ex, seg(p, 0.92, 0.97)) };
  const anchor = {
    ground: v3([0, 1.8, 0]),
    upper: v3([0, 5.1 + 3.5 * ex, 0]),
    roof: v3([0, 7.2 + 7 * ex, 0]),
    top: v3([0, 9.2 + 7 * ex, 0]),
  };
  labels.forEach(({ el, at, floor }) => {
    const o = at ? show.plan : floor === "top" ? show.top : show.floor;
    tmp.copy(at || anchor[floor]).project(camera);
    el.style.opacity = tmp.z > 1 ? 0 : o;
    el.style.left = ((tmp.x + 1) / 2) * w + "px";
    el.style.top = ((1 - tmp.y) / 2) * hgt + "px";
  });
  titleblock.style.opacity = show.plan;
}

let cur = window.__tourP || 0, dirty = true;
function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  dirty = true;
}
addEventListener("resize", resize);
resize();
// Eases toward the scroll position and only renders while something changed.
renderer.setAnimationLoop(() => {
  const target = window.__tourP || 0;
  const d = target - cur;
  if (Math.abs(d) > 0.0001) { cur += d * 0.12; dirty = true; } else if (cur !== target) { cur = target; dirty = true; }
  if (!dirty || !bands.length) return;
  dirty = false;
  apply(cur);
  renderer.render(scene, camera);
});
