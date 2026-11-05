import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

export const craftColors = {
  pink: '#e977a1', blush: '#f5b0c6', darkPink: '#d95989',
  yellow: '#edc451', cream: '#fff4d6', green: '#65874f',
  lightGreen: '#91a765', lavender: '#bba2d5', ribbon: '#bc4767',
  paper: '#e7c9a4', white: '#fff6e9', ink: '#35252c',
}

let randomSeed = 437
function random() {
  randomSeed = (randomSeed * 16807) % 2147483647
  return (randomSeed - 1) / 2147483646
}
const v = (x: number, y: number, z = 0) => new THREE.Vector3(x, y, z)

function fibers(positions: number[], colors: number[]) {
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  return new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.68, depthWrite: false }))
}

function tube(parent: THREE.Group, points: THREE.Vector3[], radius: number, hex: string, density = 1400) {
  const curve = new THREE.CatmullRomCurve3(points)
  const length = curve.getLength()
  const segments = Math.max(24, Math.floor(length * 36))
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, segments, radius, 8, false), new THREE.MeshStandardMaterial({ color: hex, roughness: 1 }))
  mesh.castShadow = true
  parent.add(mesh)
  const frames = curve.computeFrenetFrames(segments, false)
  const positions: number[] = [], colors: number[] = []
  const baseColor = new THREE.Color(hex)
  const count = Math.floor(length * density)
  for (let i = 0; i < count; i++) {
    const t = random(), angle = random() * Math.PI * 2
    const index = Math.min(segments - 1, Math.floor(t * segments))
    const normal = frames.normals[index].clone().multiplyScalar(Math.cos(angle)).addScaledVector(frames.binormals[index], Math.sin(angle))
    const point = curve.getPointAt(t).addScaledVector(normal, radius * (0.85 + random() * 0.2))
    const tip = point.clone().addScaledVector(normal, radius * (0.2 + random() * 0.48)).addScaledVector(frames.tangents[index], (random() - 0.5) * radius * 0.7)
    positions.push(...point.toArray(), ...tip.toArray())
    const c = baseColor.clone().multiplyScalar(0.75 + random() * 0.6)
    colors.push(c.r, c.g, c.b, c.r, c.g, c.b)
  }
  parent.add(fibers(positions, colors))
}

function ball(parent: THREE.Group, position: THREE.Vector3, scale: THREE.Vector3, hex: string, fuzzy = true) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), new THREE.MeshStandardMaterial({ color: hex, roughness: fuzzy ? 1 : 0.24 }))
  mesh.position.copy(position)
  mesh.scale.copy(scale)
  mesh.castShadow = true
  parent.add(mesh)
  if (!fuzzy) return
  const count = Math.floor((scale.x + scale.y + scale.z) * 3500)
  const positions: number[] = [], colors: number[] = []
  const color = new THREE.Color(hex)
  for (let i = 0; i < count; i++) {
    const z = random() * 2 - 1, angle = random() * Math.PI * 2
    const r = Math.sqrt(1 - z * z)
    const normal = v(r * Math.cos(angle), r * Math.sin(angle), z)
    const point = normal.clone().multiply(scale).add(position)
    const tip = point.clone().addScaledVector(normal, 0.016 + random() * 0.030)
    positions.push(...point.toArray(), ...tip.toArray())
    const c = color.clone().multiplyScalar(0.75 + random() * 0.6)
    colors.push(c.r, c.g, c.b, c.r, c.g, c.b)
  }
  parent.add(fibers(positions, colors))
}

function leaf(parent: THREE.Group, x: number, y: number, direction: number, size = 0.6) {
  tube(parent, [v(x, y, 0), v(x + size * direction * 0.7, y + size * 0.2, 0.04), v(x + size * direction, y + size * 0.6, 0), v(x + size * direction * 0.4, y + size * 0.45, 0.04), v(x, y, 0)], 0.055, craftColors.green, 650)
}

function daisy(parent: THREE.Group, x: number, y: number, z: number, color: string, scale = 1, rotation = 0) {
  const flower = new THREE.Group()
  flower.position.set(x, y, z)
  flower.scale.setScalar(scale)
  flower.rotation.set(-0.08, rotation, -x * 0.12)
  const petals = 8
  for (let i = 0; i < petals; i++) {
    const a = i / petals * Math.PI * 2
    const p = new THREE.Group()
    p.rotation.z = a
    // A single bent chenille stem forms each open, softly rounded petal.
    tube(p, [v(-0.075, 0.16, 0), v(-0.22, 0.43, 0.01), v(-0.17, 0.70, -0.04), v(0, 0.76, -0.06), v(0.17, 0.65, -0.02), v(0.19, 0.42, 0.03), v(0.07, 0.16, 0.03)], 0.085, color)
    flower.add(p)
  }
  ball(flower, v(0, 0, 0.115), v(0.24, 0.24, 0.16), craftColors.yellow)
  parent.add(flower)
}

function tulip(parent: THREE.Group, x: number, y: number, z: number, color: string, size = 1, rotation = 0) {
  const flower = new THREE.Group()
  flower.position.set(x, y, z)
  flower.scale.setScalar(size)
  flower.rotation.z = rotation
  for (let i = 0; i < 6; i++) {
    const a = i / 6 * Math.PI * 2
    const p = new THREE.Group()
    p.rotation.y = a
    for (let j = 0; j < 3; j++) {
      const w = 0.26 - j * 0.073
      tube(p, [v(0, -0.4, 0), v(-w, -0.08, 0.26), v(-w * 0.78, 0.43 - j * 0.035, 0.29), v(0, 0.5 - j * 0.02, 0.24), v(w * 0.78, 0.35, 0.29), v(w, -0.08, 0.24), v(0, -0.4, 0)], 0.062, color, 700)
    }
    flower.add(p)
  }
  parent.add(flower)
}

function stem(parent: THREE.Group, x: number, y: number, z: number, bottom = -1.9) {
  tube(parent, [v(x * 0.24, bottom, 0), v(x * 0.25, -0.6, z * 0.4), v(x * 0.72, y * 0.6, z * 0.7), v(x, y, z)], 0.044, craftColors.green, 500)
  leaf(parent, x * 0.55, y * 0.2, x < 0 ? -1 : 1, 0.6)
}

function bow(parent: THREE.Group, y = -0.7) {
  const ribbon = new THREE.MeshStandardMaterial({ color: craftColors.ribbon, roughness: 0.8, side: THREE.DoubleSide })
  const bowGroup = new THREE.Group()
  bowGroup.position.set(0, y, 0.45)
  for (const dir of [-1, 1]) {
    const curve = new THREE.CatmullRomCurve3([v(0, 0, 0), v(dir * 0.42, 0.30, 0), v(dir * 0.65, 0.16, -0.04), v(dir * 0.55, -0.03, 0.02), v(0, 0, 0.08)])
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 36, 0.06, 8, false), ribbon)
    bowGroup.add(mesh)
    const tail = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([v(0, 0, 0), v(dir * 0.22, -0.32, 0.07), v(dir * 0.20, -0.66, 0.10)]), 20, 0.055, 8, false), ribbon)
    bowGroup.add(tail)
  }
  ball(bowGroup, v(0, 0, 0.09), v(0.12, 0.10, 0.08), craftColors.ribbon, false)
  parent.add(bowGroup)
}

function paper(parent: THREE.Group) {
  const material = new THREE.MeshStandardMaterial({ color: craftColors.paper, roughness: 1, side: THREE.DoubleSide })
  const geo = new THREE.CylinderGeometry(1.06, 0.23, 1.65, 5, 1, true)
  const mesh = new THREE.Mesh(geo, material)
  mesh.position.y = -0.87
  mesh.rotation.y = 0.3
  mesh.scale.z = 0.63
  mesh.castShadow = true
  parent.add(mesh)
  // Folded, lighter inner sheet, kept low enough to expose the fuzzy stems.
  const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.96, 0.23, 1.6, 5, 1, true), new THREE.MeshStandardMaterial({ color: craftColors.cream, roughness: 1, side: THREE.DoubleSide }))
  inner.position.set(0, -0.74, -0.045)
  inner.scale.z = 0.58
  inner.rotation.y = -0.13
  parent.add(inner)
}

function coiledPot(parent: THREE.Group, hex: string, flatBack = false) {
  const turns = 13
  const stepsPerTurn = 58
  const points: THREE.Vector3[] = []
  for (let i = 0; i <= turns * stepsPerTurn; i++) {
    const fraction = i / (turns * stepsPerTurn)
    const angle = i / stepsPerTurn * Math.PI * 2
    const radius = 0.47 + fraction * 0.27
    const z = Math.sin(angle) * radius * (flatBack ? 0.32 : 0.78)
    points.push(v(Math.cos(angle) * radius, -1.45 + fraction * 1.16, flatBack ? Math.max(-0.07, z) : z))
  }
  tube(parent, points, 0.063, hex, 730)
  const rim: THREE.Vector3[] = []
  for (let i = 0; i <= 72; i++) {
    const angle = i / 72 * Math.PI * 2
    const z = Math.sin(angle) * 0.78 * (flatBack ? 0.32 : 0.78)
    rim.push(v(Math.cos(angle) * 0.78, -0.25, flatBack ? Math.max(-0.08, z) : z))
  }
  tube(parent, rim, 0.087, hex, 1000)
  ball(parent, v(0, -0.30, flatBack ? 0.05 : 0), v(0.67, 0.052, flatBack ? 0.16 : 0.48), '#81704e')
  if (flatBack) {
    // Thin charcoal puck just behind the flattened chenille pot.
    const magnet = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.12, 32), new THREE.MeshStandardMaterial({ color: '#454344', roughness: 0.7 }))
    magnet.rotation.x = Math.PI / 2
    magnet.position.set(0.16, -0.85, -0.17)
    parent.add(magnet)
  }
}

function pottedStem(parent: THREE.Group, x: number, y: number, z: number) {
  tube(parent, [v(x * 0.23, -0.33, 0.025), v(x * 0.46, y * 0.28, z * 0.4), v(x, y, z)], 0.043, craftColors.green, 600)
  leaf(parent, x * 0.43, y * 0.16, x < 0 ? -1 : 1, 0.46)
}

// Merge like materials so the detailed fibre work stays economical to render.
function optimize(root: THREE.Group) {
  root.updateMatrixWorld(true)
  const meshGroups = new Map<string, { material: THREE.Material; geometries: THREE.BufferGeometry[] }>()
  const lineGeometries: THREE.BufferGeometry[] = []
  let lineMaterial: THREE.Material | null = null
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      const mat = obj.material as THREE.MeshStandardMaterial
      const key = `${mat.color.getHexString()}-${mat.side}-${mat.roughness}`
      if (!meshGroups.has(key)) meshGroups.set(key, { material: mat, geometries: [] })
      meshGroups.get(key)!.geometries.push(obj.geometry.clone().applyMatrix4(obj.matrixWorld))
    } else if (obj instanceof THREE.LineSegments) {
      lineGeometries.push(obj.geometry.clone().applyMatrix4(obj.matrixWorld))
      lineMaterial = obj.material as THREE.Material
    }
  })
  const result = new THREE.Group()
  for (const { material, geometries } of meshGroups.values()) {
    const geometry = mergeGeometries(geometries)
    if (geometry) {
      const mesh = new THREE.Mesh(geometry, material.clone())
      mesh.castShadow = true
      mesh.receiveShadow = true
      result.add(mesh)
    }
    geometries.forEach(g => g.dispose())
  }
  if (lineMaterial && lineGeometries.length) {
    const geometry = mergeGeometries(lineGeometries)
    if (geometry) result.add(new THREE.LineSegments(geometry, (lineMaterial as THREE.Material).clone()))
    lineGeometries.forEach(g => g.dispose())
  }
  disposeModel(root)
  return result
}

export function makeCreation(type: string) {
  randomSeed = 437
  const group = new THREE.Group()
  if (type === 'flowerpot') {
    coiledPot(group, '#d28b74')
    const flowers = [[-0.72, 0.87, 0.05, 0.63], [0.16, 1.60, -0.08, 0.69], [0.72, 0.75, 0.16, 0.61], [-0.05, 0.48, 0.38, 0.56]]
    for (const [x, y, z, size] of flowers) {
      pottedStem(group, x, y, z)
      daisy(group, x, y, z, craftColors.cream, size, x * 0.1)
    }
    // Two low leaves frame the opening without hiding the coiled pot.
    leaf(group, -0.25, -0.05, -1, 0.6)
    leaf(group, 0.25, -0.04, 1, 0.55)
  } else if (type === 'magnet') {
    coiledPot(group, '#b098c6', true)
    const flowers: [number, number, number, number, string][] = [[-0.48, 0.57, 0.13, 0.57, craftColors.pink], [0.30, 1.26, 0.02, 0.62, craftColors.blush], [0.56, 0.20, 0.29, 0.49, craftColors.darkPink]]
    for (const [x, y, z, size, color] of flowers) {
      pottedStem(group, x, y, z)
      daisy(group, x, y, z, color, size, -0.02)
    }
    // A tiny cream bow on the pot echoes hand-finished gift details.
    const detail = new THREE.Group()
    detail.position.set(0, -0.91, 0.32)
    for (const direction of [-1, 1]) {
      tube(detail, [v(0, 0), v(direction * 0.18, 0.12), v(direction * 0.28, 0.02), v(direction * 0.12, -0.04), v(0, 0)], 0.026, craftColors.cream, 500)
      tube(detail, [v(0, 0), v(direction * 0.05, -0.12), v(direction * 0.13, -0.23)], 0.026, craftColors.cream, 500)
    }
    group.add(detail)
  } else if (type === 'bunny') {
    ball(group, v(0, -0.6, 0), v(0.64, 0.83, 0.52), craftColors.cream)
    ball(group, v(0, 0.36, 0.08), v(0.74, 0.66, 0.6), craftColors.cream)
    for (const d of [-1, 1]) {
      const ear = new THREE.Group()
      ear.position.set(d * 0.34, 1.06, 0)
      ear.rotation.z = d * -0.14
      ball(ear, v(0, 0.35, 0), v(0.23, 0.73, 0.22), craftColors.cream)
      ball(ear, v(0, 0.36, 0.18), v(0.12, 0.51, 0.07), craftColors.blush)
      group.add(ear)
      ball(group, v(d * 0.42, -1.17, 0.25), v(0.31, 0.22, 0.4), craftColors.cream)
      ball(group, v(d * 0.25, 0.45, 0.625), v(0.045, 0.057, 0.036), craftColors.ink, false)
      ball(group, v(d * 0.37, 0.23, 0.61), v(0.09, 0.052, 0.02), craftColors.blush, false)
      ball(group, v(d * 0.56, -0.40, 0.28), v(0.22, 0.39, 0.25), craftColors.cream)
    }
    ball(group, v(0, 0.30, 0.69), v(0.06, 0.045, 0.026), craftColors.ribbon, false)
    const flower = new THREE.Group()
    flower.position.set(0.44, -0.5, 0.64)
    flower.scale.setScalar(0.37)
    daisy(flower, 0, 0.6, 0, craftColors.lavender)
    tube(flower, [v(0, -0.65), v(0, 0.65)], 0.05, craftColors.green)
    group.add(flower)
  } else if (type === 'daisies') {
    const flowerData = [[-0.78, 0.7, 0, 0.8], [0.42, 1.45, -0.1, 0.9], [0.72, 0.3, 0.34, 0.77], [-0.38, -0.1, 0.45, 0.69]]
    for (const [x, y, z, s] of flowerData) {
      stem(group, x, y, z, -1.75)
      daisy(group, x, y, z, craftColors.cream, s, x * 0.14)
    }
    bow(group, -0.95)
  } else if (type === 'tulips') {
    const data: [number, number, number, string][] = [[-0.85, 0.82, 0, craftColors.pink], [0, 1.48, -0.15, craftColors.yellow], [0.8, 1.02, 0, craftColors.blush], [-0.25, 0.46, 0.6, craftColors.darkPink], [0.54, 0.12, 0.62, craftColors.yellow]]
    for (const [x, y, z, color] of data) {
      stem(group, x, y, z)
      tulip(group, x, y, z, color, 1, -x * 0.25)
    }
    bow(group, -1.05)
  } else {
    const data: [number, number, number, string, number][] = [[-1.04, 0.92, 0, craftColors.pink, 0.85], [0.02, 1.72, -0.25, craftColors.blush, 0.92], [1.03, 1.23, -0.05, craftColors.cream, 0.85], [0.22, 0.53, 0.58, craftColors.darkPink, 0.90], [-0.65, 1.84, -0.50, craftColors.yellow, 0.8]]
    for (let i = 0; i < data.length; i++) {
      const [x, y, z, c, size] = data[i]
      stem(group, x, y, z)
      if (i === 4) tulip(group, x, y, z, c, 1.1, 0.3)
      else daisy(group, x, y, z, c, size, x * 0.17)
    }
    stem(group, 0.84, 2.04, -0.45)
    tulip(group, 0.84, 2.04, -0.45, craftColors.yellow, 0.94, -0.25)
    paper(group)
    bow(group)
  }
  return optimize(group)
}

export function disposeModel(group: THREE.Object3D) {
  group.traverse(obj => {
    if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
      obj.geometry.dispose()
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
      mats.forEach(m => m.dispose())
    }
  })
}

export type BouquetPalette = 'rose' | 'lilac' | 'peach'

// Keep the stems, golden centres, paper and ribbon true to their materials.
// Only the three pink petal pigments and their individual fibres change mood.
export function recolorPinkFibres(group: THREE.Object3D, palette: BouquetPalette) {
  const originals = [craftColors.pink, craftColors.blush, craftColors.darkPink].map(hex => new THREE.Color(hex))
  const palettes = {
    rose: [craftColors.pink, craftColors.blush, craftColors.darkPink],
    lilac: ['#b092d0', '#d9c4e9', '#9670b7'],
    peach: ['#eea178', '#f4c5a4', '#d8825f'],
  }
  const targets = palettes[palette].map(hex => new THREE.Color(hex))
  const originalHexes = originals.map(color => color.getHexString())
  group.traverse(object => {
    if (object instanceof THREE.Mesh) {
      const material = object.material as THREE.MeshStandardMaterial
      material.userData.originalPetalHex ??= material.color.getHexString()
      const index = originalHexes.indexOf(material.userData.originalPetalHex)
      if (index !== -1) material.color.copy(targets[index])
    } else if (object instanceof THREE.LineSegments) {
      const attribute = object.geometry.getAttribute('color') as THREE.BufferAttribute
      if (!attribute) return
      if (!object.geometry.userData.petalMask) {
        const source = new Float32Array(attribute.array)
        const mask = new Int8Array(attribute.count).fill(-1)
        for (let i = 0; i < attribute.count; i++) {
          const red = source[i * 3], green = source[i * 3 + 1], blue = source[i * 3 + 2]
          if (green < 0.001) continue
          const index = originals.findIndex(base => Math.abs(red / green - base.r / base.g) < 0.025 && Math.abs(blue / green - base.b / base.g) < 0.025)
          mask[i] = index
        }
        object.geometry.userData.originalFiberColors = source
        object.geometry.userData.petalMask = mask
      }
      const source = object.geometry.userData.originalFiberColors as Float32Array
      const mask = object.geometry.userData.petalMask as Int8Array
      for (let i = 0; i < attribute.count; i++) {
        const index = mask[i]
        if (index === -1) continue
        const shade = source[i * 3] / originals[index].r
        attribute.setXYZ(i, targets[index].r * shade, targets[index].g * shade, targets[index].b * shade)
      }
      attribute.needsUpdate = true
    }
  })
}

export function setupScene(canvas: HTMLCanvasElement, width: number, height: number, transparent = true) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: transparent, antialias: true, preserveDrawingBuffer: !transparent, powerPreference: 'low-power' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7))
  renderer.setSize(width, height, false)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.06
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 50)
  camera.position.set(0, 0.6, 9.4)
  camera.lookAt(0, 0.3, 0)
  scene.add(new THREE.AmbientLight('#fff5ed', 0.85))
  const key = new THREE.DirectionalLight('#fff7eb', 2.8)
  key.position.set(-3, 6, 7)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  key.shadow.camera.left = -4
  key.shadow.camera.right = 4
  key.shadow.camera.top = 4
  key.shadow.camera.bottom = -4
  key.shadow.normalBias = 0.035
  scene.add(key)
  const fill = new THREE.DirectionalLight('#eadbff', 1.1)
  fill.position.set(4, 2, -2)
  scene.add(fill)
  return { renderer, scene, camera }
}
