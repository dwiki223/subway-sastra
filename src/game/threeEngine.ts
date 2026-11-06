import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export interface GameEngineCallbacks {
  onCheckpointReached: (distance: number) => void;
  onCoinCollected: (count: number) => void;
  onHitObstacle: () => void;
  onDistanceUpdate: (meters: number) => void;
  onPowerupCollected: (type: 'magnet' | 'shield' | 'double') => void;
  onGameOver: () => void;
}

export interface EngineOutfitConfig {
  shirtColor: string;
  pantsColor: string;
  accentColor: string;
}

const LANE_WIDTH = 2.4;
const LANES = [-LANE_WIDTH, 0, LANE_WIDTH]; // Left (-2.4), Middle (0), Right (2.4)
const SEGMENT_LENGTH = 50;
const TOTAL_SEGMENTS = 7;
const GRAVITY = -32;
const JUMP_VELOCITY = 11.8;

// Procedural texture generators
function createBuildingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, 128, 256);

  // Draw window grid
  const cols = 5;
  const rows = 16;
  const w = 14;
  const h = 8;
  const gapX = 10;
  const gapY = 7;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const rand = Math.random();
      if (rand > 0.45) {
        if (rand > 0.85) ctx.fillStyle = '#fde047'; // warm yellow
        else if (rand > 0.7) ctx.fillStyle = '#38bdf8'; // cyan light
        else ctx.fillStyle = '#e2e8f0'; // white
        ctx.fillRect(10 + c * (w + gapX), 12 + r * (h + gapY), w, h);
      } else {
        ctx.fillStyle = '#1e293b'; // dark window
        ctx.fillRect(10 + c * (w + gapX), 12 + r * (h + gapY), w, h);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createNeonBannerTexture(text: string, bgColor: string, textColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 256, 64);

  // Border glow
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, 248, 56);

  // Text
  ctx.fillStyle = textColor;
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 32);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export class SubwayEngine {
  private container: HTMLElement;
  private callbacks: GameEngineCallbacks;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private clock!: THREE.Clock;

  private isSoftwareGl: boolean = false;
  private animationFrameId: number = 0;
  private isDestroyed: boolean = false;

  // Game state
  public isRunning: boolean = false;
  public isPaused: boolean = false;
  private currentLaneIndex: number = 1;
  private targetX: number = 0;
  private playerX: number = 0;
  private playerY: number = 0;
  private playerVelocityY: number = 0;
  private isJumping: boolean = false;
  private isSliding: boolean = false;
  private slideTimer: number = 0;
  private speed: number = 17;
  private targetSpeed: number = 17;
  private distanceRun: number = 0;
  private checkpointInterval: number = 100;
  private nextCheckpointDistance: number = 100;

  // Powerups
  public hasShield: boolean = false;
  public magnetTimer: number = 0;
  public doubleTimer: number = 0;
  private invincibleTimer: number = 0;

  // 3D Objects
  private playerGroup!: THREE.Group;
  private playerBodyMesh!: THREE.Mesh;
  private playerPantsMesh!: THREE.Mesh;
  private playerCapMesh!: THREE.Mesh;
  private leftArmGroup!: THREE.Group;
  private rightArmGroup!: THREE.Group;
  private leftLegGroup!: THREE.Group;
  private rightLegGroup!: THREE.Group;
  private shieldBubble!: THREE.Mesh;
  private backpackMesh!: THREE.Mesh;

  // Visual Effects & Particle Systems
  private particlesGroup!: THREE.Group;
  private speedLinesMesh!: THREE.LineSegments;
  private runningSparks: { mesh: THREE.Mesh; life: number; velocity: THREE.Vector3 }[] = [];

  // Track & Environment
  private trackSegments: THREE.Group[] = [];
  private obstacles: { group: THREE.Group; type: 'low' | 'high' | 'train'; lane: number; z: number; passed: boolean }[] = [];
  private coins: { mesh: THREE.Group; lane: number; z: number; collected: boolean; initialY: number }[] = [];
  private powerups: { group: THREE.Group; type: 'magnet' | 'shield' | 'double'; lane: number; z: number; collected: boolean }[] = [];
  private checkpointGateGroup!: THREE.Group;
  private checkpointGateActive: boolean = false;
  private holographicBooks: THREE.Group[] = [];

  // Reusable Materials & Textures
  private buildingTexture!: THREE.CanvasTexture;
  private coinGeometry!: THREE.CylinderGeometry;
  private coinMaterial!: THREE.MeshStandardMaterial;

  constructor(container: HTMLElement, callbacks: GameEngineCallbacks) {
    this.container = container;
    this.callbacks = callbacks;

    this.checkSoftwareGl();
    this.initScene();
    this.createSpeedLines();
    this.createPlayer();
    this.initTracks();
    this.setupEvents();
    this.startLoop();
  }

  private checkSoftwareGl() {
    try {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) {
        this.isSoftwareGl = true;
        return;
      }
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      this.isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    } catch {
      this.isSoftwareGl = false;
    }
  }

  private initScene() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    // Warm Twilight / Cyber City Horizon Fog
    this.scene.background = new THREE.Color(0x16132b);
    this.scene.fog = new THREE.FogExp2(0x16132b, 0.012);

    this.camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 240);
    this.camera.position.set(0, 3.4, 4.8);
    this.camera.lookAt(0, 1.3, -7);

    this.clock = new THREE.Clock();

    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // Studio Environment Lighting Map
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Key Light: Warm Golden Sunset Light
    const dirLight = new THREE.DirectionalLight(0xffedd5, 2.6);
    dirLight.position.set(16, 24, 12);
    dirLight.castShadow = !this.isSoftwareGl;
    if (dirLight.castShadow) {
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.camera.near = 0.5;
      dirLight.shadow.camera.far = 80;
      dirLight.shadow.camera.left = -16;
      dirLight.shadow.camera.right = 16;
      dirLight.shadow.camera.top = 28;
      dirLight.shadow.camera.bottom = -16;
      dirLight.shadow.bias = -0.0005;
      dirLight.shadow.normalBias = 0.02;
    }
    this.scene.add(dirLight);

    // Cool Violet & Sky Blue Ambient / Hemisphere Fill Light
    const hemiLight = new THREE.HemisphereLight(0xa855f7, 0x1e1b4b, 1.2);
    hemiLight.position.set(0, 30, 0);
    this.scene.add(hemiLight);

    // Subtle Ground Glow Underneath
    const groundGeo = new THREE.PlaneGeometry(80, 500);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.9,
      metalness: 0.1,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.05;
    groundMesh.receiveShadow = !this.isSoftwareGl;
    this.scene.add(groundMesh);

    // Reusable Textures
    this.buildingTexture = createBuildingTexture();

    // Reusable Coin Geometry & Rich Gold PBR Material
    this.coinGeometry = new THREE.CylinderGeometry(0.36, 0.36, 0.08, 18);
    this.coinGeometry.rotateX(Math.PI / 2);
    this.coinMaterial = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.15,
      metalness: 0.9,
      emissive: 0xd97706,
      emissiveIntensity: 0.35,
    });

    this.particlesGroup = new THREE.Group();
    this.scene.add(this.particlesGroup);
  }

  // --- SPEED LINES PARTICLE EFFECT ---
  private createSpeedLines() {
    const lineCount = 36;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(lineCount * 6);

    for (let i = 0; i < lineCount; i++) {
      const x = (Math.random() - 0.5) * 12;
      const y = 0.5 + Math.random() * 4.5;
      const z = -Math.random() * 50;
      const len = 2.5 + Math.random() * 4;

      positions[i * 6] = x;
      positions[i * 6 + 1] = y;
      positions[i * 6 + 2] = z;

      positions[i * 6 + 3] = x;
      positions[i * 6 + 4] = y;
      positions[i * 6 + 5] = z - len;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
    });

    this.speedLinesMesh = new THREE.LineSegments(geometry, material);
    this.scene.add(this.speedLinesMesh);
  }

  // --- UPGRADED PROCEDURAL HERO CHARACTER ---
  private createPlayer() {
    this.playerGroup = new THREE.Group();
    this.playerGroup.position.set(0, 0, 0);

    // 1. Torso / Jacket
    const torsoGeo = new THREE.BoxGeometry(0.56, 0.68, 0.36);
    const torsoMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.45,
      metalness: 0.1,
    });
    this.playerBodyMesh = new THREE.Mesh(torsoGeo, torsoMat);
    this.playerBodyMesh.position.y = 1.05;
    this.playerBodyMesh.castShadow = !this.isSoftwareGl;
    this.playerGroup.add(this.playerBodyMesh);

    // 2. Collar & Tie (SMP Blue)
    const tieGeo = new THREE.BoxGeometry(0.18, 0.36, 0.06);
    const tieMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.3, metalness: 0.2 });
    const tie = new THREE.Mesh(tieGeo, tieMat);
    tie.position.set(0, 1.08, 0.19);
    this.playerGroup.add(tie);

    // 3. School Backpack / Tas Ransel
    const packGeo = new THREE.BoxGeometry(0.44, 0.5, 0.22);
    const packMat = new THREE.MeshStandardMaterial({
      color: 0xef4444, // Red school bag
      roughness: 0.5,
      metalness: 0.2,
    });
    this.backpackMesh = new THREE.Mesh(packGeo, packMat);
    this.backpackMesh.position.set(0, 1.08, -0.26);
    this.backpackMesh.castShadow = !this.isSoftwareGl;
    this.playerGroup.add(this.backpackMesh);

    // Bag Pocket
    const pocketGeo = new THREE.BoxGeometry(0.34, 0.22, 0.08);
    const pocketMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.6 });
    const pocket = new THREE.Mesh(pocketGeo, pocketMat);
    pocket.position.set(0, 0.98, -0.38);
    this.playerGroup.add(pocket);

    // 4. Head
    const headGeo = new THREE.BoxGeometry(0.38, 0.38, 0.36);
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xfcd34d,
      roughness: 0.6,
      metalness: 0.05,
    });
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.position.y = 1.58;
    headMesh.castShadow = !this.isSoftwareGl;
    this.playerGroup.add(headMesh);

    // Eyes / Stylized Visor
    const eyeGeo = new THREE.BoxGeometry(0.26, 0.08, 0.05);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
    const eyes = new THREE.Mesh(eyeGeo, eyeMat);
    eyes.position.set(0, 1.6, 0.19);
    this.playerGroup.add(eyes);

    // 5. Cap with 3D Brim & Logo
    const capGeo = new THREE.BoxGeometry(0.42, 0.16, 0.42);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      roughness: 0.4,
      metalness: 0.15,
    });
    this.playerCapMesh = new THREE.Mesh(capGeo, capMat);
    this.playerCapMesh.position.set(0, 1.76, 0.01);
    this.playerGroup.add(this.playerCapMesh);

    const brimGeo = new THREE.BoxGeometry(0.42, 0.04, 0.24);
    const brim = new THREE.Mesh(brimGeo, capMat);
    brim.position.set(0, 1.7, -0.26);
    this.playerGroup.add(brim);

    // 6. Headphones (Metallic Red & Chrome)
    const phoneGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.48, 14);
    phoneGeo.rotateZ(Math.PI / 2);
    const phoneMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.2,
      metalness: 0.8,
    });
    const phones = new THREE.Mesh(phoneGeo, phoneMat);
    phones.position.set(0, 1.6, 0);
    this.playerGroup.add(phones);

    // 7. Arms
    this.leftArmGroup = new THREE.Group();
    this.leftArmGroup.position.set(-0.38, 1.25, 0);
    const armGeo = new THREE.BoxGeometry(0.16, 0.55, 0.16);
    armGeo.translate(0, -0.22, 0);
    const leftArmMesh = new THREE.Mesh(armGeo, torsoMat);
    leftArmMesh.castShadow = !this.isSoftwareGl;
    this.leftArmGroup.add(leftArmMesh);
    this.playerGroup.add(this.leftArmGroup);

    this.rightArmGroup = new THREE.Group();
    this.rightArmGroup.position.set(0.38, 1.25, 0);
    const rightArmMesh = new THREE.Mesh(armGeo, torsoMat);
    rightArmMesh.castShadow = !this.isSoftwareGl;
    this.rightArmGroup.add(rightArmMesh);
    this.playerGroup.add(this.rightArmGroup);

    // 8. Legs & Sneakers
    const pantsMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      roughness: 0.6,
      metalness: 0.1,
    });

    this.leftLegGroup = new THREE.Group();
    this.leftLegGroup.position.set(-0.16, 0.72, 0);
    const legGeo = new THREE.BoxGeometry(0.2, 0.65, 0.2);
    legGeo.translate(0, -0.28, 0);
    this.playerPantsMesh = new THREE.Mesh(legGeo, pantsMat);
    this.playerPantsMesh.castShadow = !this.isSoftwareGl;
    this.leftLegGroup.add(this.playerPantsMesh);

    // Sneaker with rubber sole & colored upper
    const shoeGeo = new THREE.BoxGeometry(0.22, 0.15, 0.36);
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.1 });
    const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
    leftShoe.position.set(0, -0.65, -0.06);
    this.leftLegGroup.add(leftShoe);

    const soleGeo = new THREE.BoxGeometry(0.24, 0.05, 0.38);
    const soleMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.4 });
    const leftSole = new THREE.Mesh(soleGeo, soleMat);
    leftSole.position.set(0, -0.71, -0.06);
    this.leftLegGroup.add(leftSole);

    this.playerGroup.add(this.leftLegGroup);

    this.rightLegGroup = new THREE.Group();
    this.rightLegGroup.position.set(0.16, 0.72, 0);
    const rightLegMesh = new THREE.Mesh(legGeo, pantsMat);
    rightLegMesh.castShadow = !this.isSoftwareGl;
    this.rightLegGroup.add(rightLegMesh);

    const rightShoe = new THREE.Mesh(shoeGeo, shoeMat);
    rightShoe.position.set(0, -0.65, -0.06);
    this.rightLegGroup.add(rightShoe);

    const rightSole = new THREE.Mesh(soleGeo, soleMat);
    rightSole.position.set(0, -0.71, -0.06);
    this.rightLegGroup.add(rightSole);

    this.playerGroup.add(this.rightLegGroup);

    // 9. Shield Bubble (Shimmering Cyan Force Field)
    const shieldGeo = new THREE.SphereGeometry(1.25, 24, 20);
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.38,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5,
    });
    this.shieldBubble = new THREE.Mesh(shieldGeo, shieldMat);
    this.shieldBubble.position.y = 1.0;
    this.shieldBubble.visible = false;
    this.playerGroup.add(this.shieldBubble);

    // Ground Contact Shadow
    const shadowGeo = new THREE.PlaneGeometry(0.85, 1.25);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    const playerShadow = new THREE.Mesh(shadowGeo, shadowMat);
    playerShadow.rotation.x = -Math.PI / 2;
    playerShadow.position.y = 0.01;
    this.playerGroup.add(playerShadow);

    this.scene.add(this.playerGroup);
  }

  public setOutfit(outfit: EngineOutfitConfig) {
    if (this.playerBodyMesh) {
      (this.playerBodyMesh.material as THREE.MeshStandardMaterial).color.set(outfit.shirtColor);
    }
    if (this.playerPantsMesh) {
      (this.playerPantsMesh.material as THREE.MeshStandardMaterial).color.set(outfit.pantsColor);
    }
    if (this.playerCapMesh) {
      (this.playerCapMesh.material as THREE.MeshStandardMaterial).color.set(outfit.accentColor);
    }
  }

  // --- TRACKS & RICH 3D CITY ENVIRONMENT ---
  private initTracks() {
    for (let i = 0; i < TOTAL_SEGMENTS; i++) {
      const zOffset = -i * SEGMENT_LENGTH;
      const segment = this.buildTrackSegment(zOffset, i);
      this.trackSegments.push(segment);
      this.scene.add(segment);

      if (i > 0) {
        this.populateSegment(zOffset);
      }
    }

    // Build the Grand Puisi Rakyat Checkpoint Gate
    this.checkpointGateGroup = this.buildCheckpointGate();
    this.checkpointGateGroup.position.set(0, 0, -this.nextCheckpointDistance);
    this.scene.add(this.checkpointGateGroup);
  }

  private buildTrackSegment(zOffset: number, segIndex: number): THREE.Group {
    const group = new THREE.Group();
    group.position.z = zOffset;

    // 1. Ballast Stone Roadbed
    const ballastGeo = new THREE.PlaneGeometry(9.6, SEGMENT_LENGTH);
    const ballastMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.95,
      metalness: 0.1,
    });
    const ballast = new THREE.Mesh(ballastGeo, ballastMat);
    ballast.rotation.x = -Math.PI / 2;
    ballast.receiveShadow = !this.isSoftwareGl;
    group.add(ballast);

    // 2. 3 Lanes of Railway Tracks (Rails & Wooden Sleepers)
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.25,
      metalness: 0.9,
    });
    const sleeperMat = new THREE.MeshStandardMaterial({
      color: 0x451a03, // Rich dark wood
      roughness: 0.9,
      metalness: 0.05,
    });

    LANES.forEach((laneX) => {
      // 2 Reflective Steel Rails per lane
      const railGeo = new THREE.BoxGeometry(0.08, 0.12, SEGMENT_LENGTH);
      const leftRail = new THREE.Mesh(railGeo, railMat);
      leftRail.position.set(laneX - 0.7, 0.06, -SEGMENT_LENGTH / 2);
      group.add(leftRail);

      const rightRail = new THREE.Mesh(railGeo, railMat);
      rightRail.position.set(laneX + 0.7, 0.06, -SEGMENT_LENGTH / 2);
      group.add(rightRail);

      // Wooden sleepers every 2m
      const sleeperCount = Math.floor(SEGMENT_LENGTH / 2);
      const sleeperGeo = new THREE.BoxGeometry(1.7, 0.08, 0.3);
      for (let s = 0; s < sleeperCount; s++) {
        const sleeper = new THREE.Mesh(sleeperGeo, sleeperMat);
        sleeper.position.set(laneX, 0.04, -s * 2 - 1);
        sleeper.receiveShadow = !this.isSoftwareGl;
        group.add(sleeper);
      }
    });

    // 3. Fences with Neon Glow Strips
    const fenceGeo = new THREE.BoxGeometry(0.3, 1.6, SEGMENT_LENGTH);
    const fenceMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7, metalness: 0.4 });

    const leftFence = new THREE.Mesh(fenceGeo, fenceMat);
    leftFence.position.set(-5.3, 0.8, -SEGMENT_LENGTH / 2);
    leftFence.receiveShadow = !this.isSoftwareGl;
    group.add(leftFence);

    const rightFence = new THREE.Mesh(fenceGeo, fenceMat);
    rightFence.position.set(5.3, 0.8, -SEGMENT_LENGTH / 2);
    rightFence.receiveShadow = !this.isSoftwareGl;
    group.add(rightFence);

    // Glowing Neon Warning Strip on fence tops
    const neonGeo = new THREE.BoxGeometry(0.15, 0.08, SEGMENT_LENGTH);
    const neonMatL = new THREE.MeshBasicMaterial({ color: 0x06b6d4 }); // Cyan glow left
    const neonL = new THREE.Mesh(neonGeo, neonMatL);
    neonL.position.set(-5.3, 1.65, -SEGMENT_LENGTH / 2);
    group.add(neonL);

    const neonMatR = new THREE.MeshBasicMaterial({ color: 0xf59e0b }); // Amber glow right
    const neonR = new THREE.Mesh(neonGeo, neonMatR);
    neonR.position.set(5.3, 1.65, -SEGMENT_LENGTH / 2);
    group.add(neonR);

    // 4. City Skyline Buildings flanking left and right
    const buildingCounts = 4;
    for (let b = 0; b < buildingCounts; b++) {
      const bZ = -b * (SEGMENT_LENGTH / buildingCounts) - 6;

      // Left building
      const hL = 14 + ((segIndex * 7 + b * 13) % 22);
      const wL = 7 + ((segIndex + b) % 4);
      const leftBuilding = this.createBuildingMesh(wL, hL, 9);
      leftBuilding.position.set(-11 - wL / 2, hL / 2, bZ);
      group.add(leftBuilding);

      // Right building
      const hR = 12 + ((segIndex * 11 + b * 17) % 25);
      const wR = 8 + ((segIndex * 2 + b) % 5);
      const rightBuilding = this.createBuildingMesh(wR, hR, 10);
      rightBuilding.position.set(11 + wR / 2, hR / 2, bZ);
      group.add(rightBuilding);

      // Add roadside palm / street trees
      const treeL = this.createTree();
      treeL.position.set(-6.6, 0, bZ + 3);
      group.add(treeL);

      const treeR = this.createTree();
      treeR.position.set(6.6, 0, bZ + 3);
      group.add(treeR);
    }

    // 5. Overhead Railway Gantries with Glowing Signals
    for (let g = 0; g < 2; g++) {
      const gantryGroup = this.buildGantry();
      gantryGroup.position.set(0, 0, -g * 25 - 12);
      group.add(gantryGroup);
    }

    // 6. Occasional Neon Billboard on Building Facade
    if (segIndex % 2 === 0) {
      const bannerTexts = ['JAKARTA EXPRESS', 'PUISI KELAS 9', 'SMP HEBAT', 'SASTRA JAYA'];
      const text = bannerTexts[segIndex % bannerTexts.length];
      const bannerTex = createNeonBannerTexture(text, '#0f172a', '#38bdf8');
      const billboardGeo = new THREE.PlaneGeometry(6, 1.8);
      const billboardMat = new THREE.MeshBasicMaterial({ map: bannerTex });
      const billboard = new THREE.Mesh(billboardGeo, billboardMat);
      billboard.position.set(-9.5, 9, -SEGMENT_LENGTH / 2);
      billboard.rotation.y = Math.PI / 2;
      group.add(billboard);
    }

    return group;
  }

  private createBuildingMesh(width: number, height: number, depth: number): THREE.Mesh {
    const geo = new THREE.BoxGeometry(width, height, depth);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.7,
      metalness: 0.3,
      map: this.buildingTexture,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = !this.isSoftwareGl;
    mesh.receiveShadow = !this.isSoftwareGl;
    return mesh;
  }

  // 3-Part Procedural Palm / City Tree
  private createTree(): THREE.Group {
    const tree = new THREE.Group();

    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.18, 0.28, 3.2, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1.6;
    tree.add(trunk);

    // Leaves Canopy Spheres
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.8,
      metalness: 0.1,
    });

    const leafTopGeo = new THREE.SphereGeometry(1.1, 10, 8);
    const leafTop = new THREE.Mesh(leafTopGeo, leafMat);
    leafTop.position.y = 3.6;
    tree.add(leafTop);

    const leafBottomGeo = new THREE.SphereGeometry(1.4, 10, 8);
    const leafBottom = new THREE.Mesh(leafBottomGeo, leafMat);
    leafBottom.position.y = 2.8;
    tree.add(leafBottom);

    return tree;
  }

  // Overhead Railway Trusses & Catenary Gantry
  private buildGantry(): THREE.Group {
    const gantry = new THREE.Group();
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.85, roughness: 0.3 });

    // Left and Right Posts
    const postGeo = new THREE.CylinderGeometry(0.14, 0.14, 4.8);
    const leftPost = new THREE.Mesh(postGeo, metalMat);
    leftPost.position.set(-4.9, 2.4, 0);
    gantry.add(leftPost);

    const rightPost = new THREE.Mesh(postGeo, metalMat);
    rightPost.position.set(4.9, 2.4, 0);
    gantry.add(rightPost);

    // Overhead Steel Truss Beam
    const beamGeo = new THREE.BoxGeometry(10.5, 0.35, 0.35);
    const beam = new THREE.Mesh(beamGeo, metalMat);
    beam.position.set(0, 4.6, 0);
    gantry.add(beam);

    // Overhead Traffic / Railway Signal Lamps
    const signalGeo = new THREE.SphereGeometry(0.2, 12, 12);
    const greenMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
    const lampG = new THREE.Mesh(signalGeo, greenMat);
    lampG.position.set(-1.2, 4.3, 0);
    gantry.add(lampG);

    const amberMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const lampA = new THREE.Mesh(signalGeo, amberMat);
    lampA.position.set(1.2, 4.3, 0);
    gantry.add(lampA);

    return gantry;
  }

  // --- GRAND CHECKPOINT ARCH OF WISDOM (PUISI RAKYAT GATE) ---
  private buildCheckpointGate(): THREE.Group {
    const gate = new THREE.Group();

    // Arch Pillars with Carved Gold Trim
    const pillarGeo = new THREE.BoxGeometry(1.1, 7.2, 1.1);
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.6,
      roughness: 0.25,
      emissive: 0xd97706,
      emissiveIntensity: 0.35,
    });

    const leftPillar = new THREE.Mesh(pillarGeo, pillarMat);
    leftPillar.position.set(-4.8, 3.6, 0);
    gate.add(leftPillar);

    const rightPillar = new THREE.Mesh(pillarGeo, pillarMat);
    rightPillar.position.set(4.8, 3.6, 0);
    gate.add(rightPillar);

    // Arch Header Beam
    const lintelGeo = new THREE.BoxGeometry(11.2, 1.5, 1.4);
    const lintelMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      metalness: 0.7,
      roughness: 0.2,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.2,
    });
    const lintel = new THREE.Mesh(lintelGeo, lintelMat);
    lintel.position.set(0, 6.2, 0);
    gate.add(lintel);

    // LED Signboard on Gate Header: "POS KUIS SASTRA SMP KELAS 9"
    const signTex = createNeonBannerTexture('★ POS KUIS SASTRA KELAS 9 ★', '#0f172a', '#facc15');
    const signGeo = new THREE.PlaneGeometry(8.5, 1.0);
    const signMat = new THREE.MeshBasicMaterial({ map: signTex });
    const signMesh = new THREE.Mesh(signGeo, signMat);
    signMesh.position.set(0, 6.2, 0.72);
    gate.add(signMesh);

    // 2 Giant Holographic Rotating Golden Books / Scrolls
    const bookGeo = new THREE.BoxGeometry(0.8, 1.1, 0.2);
    const bookMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.1,
      metalness: 0.8,
      emissive: 0xeab308,
      emissiveIntensity: 0.6,
    });

    const bookL = new THREE.Group();
    bookL.add(new THREE.Mesh(bookGeo, bookMat));
    bookL.position.set(-4.8, 7.8, 0);
    gate.add(bookL);
    this.holographicBooks.push(bookL);

    const bookR = new THREE.Group();
    bookR.add(new THREE.Mesh(bookGeo, bookMat));
    bookR.position.set(4.8, 7.8, 0);
    gate.add(bookR);
    this.holographicBooks.push(bookR);

    // Shimmering Laser Force Field Curtain across 3 lanes
    const laserGeo = new THREE.PlaneGeometry(9.6, 3.8);
    const laserMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.5,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      side: THREE.DoubleSide,
    });
    const laser = new THREE.Mesh(laserGeo, laserMat);
    laser.position.set(0, 1.9, 0);
    gate.add(laser);

    return gate;
  }

  // --- OBSTACLES & POWERUPS SPAWN ---
  private populateSegment(zOffset: number) {
    const numSubSections = 3;
    const subLength = SEGMENT_LENGTH / numSubSections;

    for (let s = 0; s < numSubSections; s++) {
      const zPos = zOffset - s * subLength - 8;
      // Safety zone around checkpoint gate
      if (Math.abs(zPos - (-this.nextCheckpointDistance)) < 16) {
        continue;
      }

      const openLane = Math.floor(Math.random() * 3);
      const r = Math.random();

      for (let lane = 0; lane < 3; lane++) {
        if (lane === openLane) {
          // Open lane: Spawn collectibles
          if (Math.random() < 0.15) {
            const type = Math.random() < 0.35 ? 'magnet' : (Math.random() < 0.7 ? 'shield' : 'double');
            this.spawnPowerup(lane, zPos, type);
          } else {
            // Row of 3 coins
            for (let c = 0; c < 3; c++) {
              this.spawnCoin(lane, zPos + c * 2.2);
            }
          }
        } else {
          // Blocked lane
          if (r < 0.42) {
            this.spawnTrain(lane, zPos);
          } else if (r < 0.78) {
            this.spawnLowBarrier(lane, zPos);
          } else {
            this.spawnHighBarrier(lane, zPos);
          }
        }
      }
    }
  }

  // Streamlined MRT Commuter Train with Illuminated Windows & Headlight Cones
  private spawnTrain(lane: number, z: number) {
    const group = new THREE.Group();
    const x = LANES[lane];
    group.position.set(x, 0, z);

    // 1. Train Body
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc, // Sleek white body
      roughness: 0.25,
      metalness: 0.7,
    });
    const bodyGeo = new THREE.BoxGeometry(2.15, 2.4, 7.8);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.set(0, 1.35, -3.9);
    body.castShadow = !this.isSoftwareGl;
    body.receiveShadow = !this.isSoftwareGl;
    group.add(body);

    // 2. Racing Stripes (Indonesian Commuter Blue & Orange)
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.3 });
    const stripeGeo = new THREE.BoxGeometry(2.18, 0.25, 7.8);
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.set(0, 1.1, -3.9);
    group.add(stripe);

    const blueStripeMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3 });
    const blueStripeGeo = new THREE.BoxGeometry(2.18, 0.2, 7.8);
    const blueStripe = new THREE.Mesh(blueStripeGeo, blueStripeMat);
    blueStripe.position.set(0, 0.85, -3.9);
    group.add(blueStripe);

    // 3. Dark Aerodynamic Roof
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.5 });
    const roofGeo = new THREE.BoxGeometry(2.2, 0.25, 7.8);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, 2.65, -3.9);
    group.add(roof);

    // 4. Front Cockpit Windshield (Tinted Glass)
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.9,
    });
    const frontGlassGeo = new THREE.BoxGeometry(1.8, 0.85, 0.12);
    const frontGlass = new THREE.Mesh(frontGlassGeo, glassMat);
    frontGlass.position.set(0, 1.85, 0.04);
    group.add(frontGlass);

    // 5. Dual Glowing High-Beam Headlights
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const lightGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.08, 12);
    lightGeo.rotateX(Math.PI / 2);

    const lightL = new THREE.Mesh(lightGeo, lightMat);
    lightL.position.set(-0.7, 0.85, 0.04);
    group.add(lightL);

    const lightR = new THREE.Mesh(lightGeo, lightMat);
    lightR.position.set(0.7, 0.85, 0.04);
    group.add(lightR);

    // Volumetric Headlight Light Cones shining ahead
    const coneGeo = new THREE.ConeGeometry(0.9, 5.0, 12, 1, true);
    coneGeo.rotateX(-Math.PI / 2);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const coneL = new THREE.Mesh(coneGeo, coneMat);
    coneL.position.set(-0.7, 0.85, 2.5);
    group.add(coneL);

    const coneR = new THREE.Mesh(coneGeo, coneMat);
    coneR.position.set(0.7, 0.85, 2.5);
    group.add(coneR);

    // 6. Side Passenger Windows (Glowing Yellow Interior)
    const winMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const winGeo = new THREE.BoxGeometry(0.04, 0.6, 1.1);
    for (let w = 0; w < 4; w++) {
      const zWin = -w * 1.8 - 1.2;
      const winL = new THREE.Mesh(winGeo, winMat);
      winL.position.set(-1.09, 1.6, zWin);
      group.add(winL);

      const winR = new THREE.Mesh(winGeo, winMat);
      winR.position.set(1.09, 1.6, zWin);
      group.add(winR);
    }

    this.scene.add(group);
    this.obstacles.push({ group, type: 'train', lane, z, passed: false });
  }

  // Low Barrier: Red/White Striped Road Hazard Barrier (Must Jump!)
  private spawnLowBarrier(lane: number, z: number) {
    const group = new THREE.Group();
    const x = LANES[lane];
    group.position.set(x, 0, z);

    // Side metal stands
    const standGeo = new THREE.BoxGeometry(0.12, 0.85, 0.12);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });

    const standL = new THREE.Mesh(standGeo, standMat);
    standL.position.set(-0.95, 0.42, 0);
    standL.castShadow = !this.isSoftwareGl;
    group.add(standL);

    const standR = new THREE.Mesh(standGeo, standMat);
    standR.position.set(0.95, 0.42, 0);
    standR.castShadow = !this.isSoftwareGl;
    group.add(standR);

    // Crossbar with Emissive Warning Red
    const barGeo = new THREE.BoxGeometry(2.1, 0.38, 0.16);
    const barMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xb91c1c,
      emissiveIntensity: 0.35,
      roughness: 0.3,
    });
    const bar = new THREE.Mesh(barGeo, barMat);
    bar.position.set(0, 0.58, 0);
    bar.castShadow = !this.isSoftwareGl;
    group.add(bar);

    this.scene.add(group);
    this.obstacles.push({ group, type: 'low', lane, z, passed: false });
  }

  // High Barrier: Overhead Yellow Warning Arch (Must Slide!)
  private spawnHighBarrier(lane: number, z: number) {
    const group = new THREE.Group();
    const x = LANES[lane];
    group.position.set(x, 0, z);

    const postGeo = new THREE.BoxGeometry(0.12, 2.7, 0.12);
    const postMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });

    const postL = new THREE.Mesh(postGeo, postMat);
    postL.position.set(-0.95, 1.35, 0);
    postL.castShadow = !this.isSoftwareGl;
    group.add(postL);

    const postR = new THREE.Mesh(postGeo, postMat);
    postR.position.set(0.95, 1.35, 0);
    postR.castShadow = !this.isSoftwareGl;
    group.add(postR);

    // Overhead Yellow Caution Board
    const boardGeo = new THREE.BoxGeometry(2.15, 0.95, 0.18);
    const boardMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.4,
      roughness: 0.3,
    });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.set(0, 1.9, 0);
    board.castShadow = !this.isSoftwareGl;
    group.add(board);

    this.scene.add(group);
    this.obstacles.push({ group, type: 'high', lane, z, passed: false });
  }

  // Spinning Gold Coin with Halo
  private spawnCoin(lane: number, z: number) {
    const group = new THREE.Group();
    const x = LANES[lane];
    group.position.set(x, 0.75, z);

    // Main Coin Cylinder
    const coin = new THREE.Mesh(this.coinGeometry, this.coinMaterial);
    coin.castShadow = !this.isSoftwareGl;
    group.add(coin);

    // Embossed Star Core
    const starGeo = new THREE.OctahedronGeometry(0.18, 0);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(starGeo, starMat);
    group.add(star);

    this.scene.add(group);
    this.coins.push({ mesh: group, lane, z, collected: false, initialY: 0.75 });
  }

  // Glowing 3D Powerup Items
  private spawnPowerup(lane: number, z: number, type: 'magnet' | 'shield' | 'double') {
    const group = new THREE.Group();
    const x = LANES[lane];
    group.position.set(x, 1.0, z);

    if (type === 'magnet') {
      const geo = new THREE.TorusGeometry(0.42, 0.15, 12, 18, Math.PI);
      const mat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        roughness: 0.2,
        metalness: 0.8,
        emissive: 0xdc2626,
        emissiveIntensity: 0.6,
      });
      const magnetMesh = new THREE.Mesh(geo, mat);
      magnetMesh.rotation.z = Math.PI;
      group.add(magnetMesh);
    } else if (type === 'shield') {
      const geo = new THREE.OctahedronGeometry(0.48, 1);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.1,
        metalness: 0.6,
        emissive: 0x0284c7,
        emissiveIntensity: 0.8,
      });
      const shieldMesh = new THREE.Mesh(geo, mat);
      group.add(shieldMesh);
    } else {
      const geo = new THREE.IcosahedronGeometry(0.48, 0);
      const mat = new THREE.MeshStandardMaterial({
        color: 0xa855f7,
        roughness: 0.1,
        metalness: 0.7,
        emissive: 0x9333ea,
        emissiveIntensity: 0.8,
      });
      const starMesh = new THREE.Mesh(geo, mat);
      group.add(starMesh);
    }

    this.scene.add(group);
    this.powerups.push({ group, type, lane, z, collected: false });
  }

  // --- CONTROLS ---
  public moveLeft() {
    if (!this.isRunning || this.isPaused) return;
    if (this.currentLaneIndex > 0) {
      this.currentLaneIndex--;
      this.targetX = LANES[this.currentLaneIndex];
    }
  }

  public moveRight() {
    if (!this.isRunning || this.isPaused) return;
    if (this.currentLaneIndex < 2) {
      this.currentLaneIndex++;
      this.targetX = LANES[this.currentLaneIndex];
    }
  }

  public jump() {
    if (!this.isRunning || this.isPaused) return;
    if (!this.isJumping) {
      this.isJumping = true;
      this.isSliding = false;
      this.playerVelocityY = JUMP_VELOCITY;
    }
  }

  public slide() {
    if (!this.isRunning || this.isPaused) return;
    if (this.isJumping) {
      this.playerVelocityY = -22;
    }
    this.isSliding = true;
    this.slideTimer = 0.75;
  }

  private setupEvents() {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW', 'Space'].includes(e.code)) {
        e.preventDefault();
        this.jump();
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        this.slide();
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        this.moveLeft();
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        this.moveRight();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const deltaX = e.changedTouches[0].screenX - touchStartX;
      const deltaY = e.changedTouches[0].screenY - touchStartY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (Math.max(absX, absY) > 25) {
        if (absX > absY) {
          if (deltaX > 0) this.moveRight();
          else this.moveLeft();
        } else {
          if (deltaY > 0) this.slide();
          else this.jump();
        }
      }
    };

    const canvas = this.renderer.domElement;
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd, { passive: true });

    const onResize = () => {
      if (!this.container || this.isDestroyed) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);
  }

  // --- GAME LIFECYCLE ---
  public start(checkpointInterval: number = 100) {
    this.checkpointInterval = checkpointInterval;
    this.nextCheckpointDistance = checkpointInterval;
    this.distanceRun = 0;
    this.speed = 17;
    this.targetSpeed = 17;
    this.currentLaneIndex = 1;
    this.targetX = 0;
    this.playerX = 0;
    this.playerY = 0;
    this.playerVelocityY = 0;
    this.isJumping = false;
    this.isSliding = false;
    this.hasShield = false;
    this.magnetTimer = 0;
    this.doubleTimer = 0;
    this.invincibleTimer = 0;
    this.checkpointGateActive = false;
    this.isRunning = true;
    this.isPaused = false;

    this.clearDynamicObjects();

    if (this.checkpointGateGroup) {
      this.checkpointGateGroup.position.set(0, 0, -this.nextCheckpointDistance);
    }

    for (let i = 1; i < TOTAL_SEGMENTS; i++) {
      this.populateSegment(-i * SEGMENT_LENGTH);
    }
  }

  public pause() {
    this.isPaused = true;
  }

  public resume() {
    this.isPaused = false;
    this.clock.getDelta();
  }

  public onCheckpointAnswered(correct: boolean) {
    if (correct) {
      this.invincibleTimer = 2.5;
      this.nextCheckpointDistance = this.distanceRun + this.checkpointInterval;
      this.checkpointGateGroup.position.set(0, 0, -this.nextCheckpointDistance);
      this.checkpointGateActive = false;
      this.isPaused = false;
      this.targetSpeed = Math.min(this.speed + 1.2, 28);
    } else {
      this.isPaused = false;
      this.invincibleTimer = 1.5;
    }
  }

  public giveShield() {
    this.hasShield = true;
    if (this.shieldBubble) this.shieldBubble.visible = true;
  }

  public grantInvincibility(seconds: number) {
    this.invincibleTimer = seconds;
  }

  private clearDynamicObjects() {
    this.obstacles.forEach((obs) => this.scene.remove(obs.group));
    this.obstacles = [];

    this.coins.forEach((c) => this.scene.remove(c.mesh));
    this.coins = [];

    this.powerups.forEach((p) => this.scene.remove(p.group));
    this.powerups = [];
  }

  // --- ANIMATION LOOP ---
  private startLoop() {
    const tick = () => {
      if (this.isDestroyed) return;

      const delta = Math.min(this.clock.getDelta(), 0.1);

      if (this.isRunning && !this.isPaused) {
        this.updateGame(delta);
      }

      this.renderer.render(this.scene, this.camera);

      if (this.isSoftwareGl) {
        this.afterDraw(tick);
      } else {
        this.animationFrameId = requestAnimationFrame(tick);
      }
    };

    if (this.isSoftwareGl) {
      this.afterDraw(tick);
    } else {
      this.animationFrameId = requestAnimationFrame(tick);
    }
  }

  private afterDraw(cb: () => void) {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      if (this.isDestroyed) return;
      const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (state === gl.UNSIGNALED) {
        this.animationFrameId = window.setTimeout(poll, 5);
      } else {
        if (sync) gl.deleteSync(sync);
        this.animationFrameId = window.setTimeout(cb, 70);
      }
    };
    this.animationFrameId = window.setTimeout(poll, 5);
  }

  private updateGame(delta: number) {
    // 1. Distance & Speed
    this.speed = THREE.MathUtils.damp(this.speed, this.targetSpeed, 2, delta);
    const forwardStep = this.speed * delta;
    this.distanceRun += forwardStep;
    this.callbacks.onDistanceUpdate(Math.floor(this.distanceRun));

    // 2. Lane Switching & Tilting
    this.playerX = THREE.MathUtils.damp(this.playerX, this.targetX, 14, delta);

    // 3. Jump Physics
    if (this.isJumping) {
      this.playerVelocityY += GRAVITY * delta;
      this.playerY += this.playerVelocityY * delta;

      if (this.playerY <= 0) {
        this.playerY = 0;
        this.playerVelocityY = 0;
        this.isJumping = false;
      }
    }

    // 4. Slide Physics
    if (this.isSliding) {
      this.slideTimer -= delta;
      if (this.slideTimer <= 0) {
        this.isSliding = false;
      }
    }

    // 5. Powerup Timers
    if (this.magnetTimer > 0) this.magnetTimer -= delta;
    if (this.doubleTimer > 0) this.doubleTimer -= delta;
    if (this.invincibleTimer > 0) this.invincibleTimer -= delta;

    // 6. Player Animation & Body Transforms
    this.playerGroup.position.set(this.playerX, this.playerY, 0);

    const laneTilt = (this.targetX - this.playerX) * 0.18;
    this.playerGroup.rotation.z = -laneTilt;

    const runCycle = this.distanceRun * 0.85;
    if (!this.isJumping && !this.isSliding) {
      this.leftArmGroup.rotation.x = Math.sin(runCycle) * 0.75;
      this.rightArmGroup.rotation.x = -Math.sin(runCycle) * 0.75;
      this.leftLegGroup.rotation.x = -Math.sin(runCycle) * 0.85;
      this.rightLegGroup.rotation.x = Math.sin(runCycle) * 0.85;
      this.playerGroup.scale.set(1, 1, 1);
    } else if (this.isJumping) {
      this.leftArmGroup.rotation.x = -1.2;
      this.rightArmGroup.rotation.x = -1.2;
      this.leftLegGroup.rotation.x = 0.5;
      this.rightLegGroup.rotation.x = -0.3;
      this.playerGroup.scale.set(1, 1, 1);
    } else if (this.isSliding) {
      this.leftArmGroup.rotation.x = 0;
      this.rightArmGroup.rotation.x = 0;
      this.playerGroup.scale.set(1, 0.42, 1.45);
    }

    // Shield Bubble Rotation
    this.shieldBubble.visible = this.hasShield;
    if (this.hasShield) {
      this.shieldBubble.rotation.y += delta * 2;
    }

    // Invincibility Strobe
    if (this.invincibleTimer > 0) {
      this.playerGroup.visible = Math.floor(this.invincibleTimer * 10) % 2 === 0;
    } else {
      this.playerGroup.visible = true;
    }

    // 7. Speed lines animation
    if (this.speedLinesMesh) {
      const pos = this.speedLinesMesh.geometry.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      const count = arr.length / 6;
      for (let i = 0; i < count; i++) {
        arr[i * 6 + 2] += forwardStep * 1.5;
        arr[i * 6 + 5] += forwardStep * 1.5;
        if (arr[i * 6 + 2] > 5) {
          arr[i * 6 + 2] -= 60;
          arr[i * 6 + 5] -= 60;
        }
      }
      pos.needsUpdate = true;
    }

    // 8. Holographic Books Rotation on Gate
    this.holographicBooks.forEach((book) => {
      book.rotation.y += delta * 2.5;
    });

    // 9. Track Recycling
    this.trackSegments.forEach((segment) => {
      segment.position.z += forwardStep;
      if (segment.position.z > SEGMENT_LENGTH) {
        segment.position.z -= TOTAL_SEGMENTS * SEGMENT_LENGTH;
        this.populateSegment(segment.position.z);
      }
    });

    // 10. Checkpoint Gate Tracking & Slow-Mo Checkpoint Arrival
    if (this.checkpointGateGroup) {
      this.checkpointGateGroup.position.z = -(this.nextCheckpointDistance - this.distanceRun);

      const distanceToCheckpoint = this.nextCheckpointDistance - this.distanceRun;
      if (distanceToCheckpoint <= 2.2 && !this.checkpointGateActive) {
        this.checkpointGateActive = true;
        this.isPaused = true;
        this.callbacks.onCheckpointReached(this.nextCheckpointDistance);
      }
    }

    // 11. Move & Check Obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.group.position.z += forwardStep;

      const obsZ = obs.group.position.z;
      if (obsZ > -1.2 && obsZ < 1.2 && !obs.passed) {
        const laneX = LANES[obs.lane];
        const playerInLane = Math.abs(this.playerX - laneX) < 1.1;

        if (playerInLane) {
          let hit = false;
          if (obs.type === 'low') {
            if (this.playerY < 0.72) hit = true;
          } else if (obs.type === 'high') {
            if (!this.isSliding) hit = true;
          } else if (obs.type === 'train') {
            if (this.playerY < 2.3) hit = true;
          }

          if (hit) {
            obs.passed = true;
            this.handleObstacleHit();
          }
        }
      }

      if (obsZ > 10) {
        this.scene.remove(obs.group);
        this.obstacles.splice(i, 1);
      }
    }

    // 12. Move & Check Coins
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const coin = this.coins[i];
      coin.mesh.position.z += forwardStep;
      coin.mesh.rotation.y += delta * 3.5;
      coin.mesh.position.y = coin.initialY + Math.sin(this.distanceRun * 2 + coin.z) * 0.12;

      // Magnet Attraction Effect
      if (this.magnetTimer > 0 && !coin.collected) {
        const dist = coin.mesh.position.distanceTo(this.playerGroup.position);
        if (dist < 9) {
          coin.mesh.position.lerp(this.playerGroup.position, delta * 12);
        }
      }

      const coinZ = coin.mesh.position.z;
      if (!coin.collected && Math.abs(coinZ) < 1.4) {
        const coinX = coin.mesh.position.x;
        const playerDist = Math.hypot(this.playerX - coinX, this.playerY - coin.mesh.position.y);
        if (playerDist < 1.35) {
          coin.collected = true;
          this.scene.remove(coin.mesh);
          this.coins.splice(i, 1);
          const count = this.doubleTimer > 0 ? 2 : 1;
          this.callbacks.onCoinCollected(count);
          continue;
        }
      }

      if (coinZ > 10) {
        this.scene.remove(coin.mesh);
        this.coins.splice(i, 1);
      }
    }

    // 13. Move & Check Powerups
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const p = this.powerups[i];
      p.group.position.z += forwardStep;
      p.group.rotation.y += delta * 3.2;

      const pZ = p.group.position.z;
      if (!p.collected && Math.abs(pZ) < 1.4) {
        const pX = p.group.position.x;
        if (Math.abs(this.playerX - pX) < 1.2 && Math.abs(this.playerY - p.group.position.y) < 1.5) {
          p.collected = true;
          this.scene.remove(p.group);
          this.powerups.splice(i, 1);

          if (p.type === 'magnet') {
            this.magnetTimer = 12;
          } else if (p.type === 'shield') {
            this.giveShield();
          } else if (p.type === 'double') {
            this.doubleTimer = 15;
          }
          this.callbacks.onPowerupCollected(p.type);
          continue;
        }
      }

      if (pZ > 10) {
        this.scene.remove(p.group);
        this.powerups.splice(i, 1);
      }
    }

    // 14. Camera Tracking & Dynamic Speed Sway
    this.camera.position.x = this.playerX * 0.45;
    this.camera.position.y = 3.3 + (this.playerY * 0.3);
  }

  private handleObstacleHit() {
    if (this.invincibleTimer > 0) return;

    if (this.hasShield) {
      this.hasShield = false;
      this.invincibleTimer = 1.8;
      if (this.shieldBubble) this.shieldBubble.visible = false;
      this.callbacks.onHitObstacle();
      return;
    }

    this.invincibleTimer = 2.0;
    this.speed = Math.max(12, this.speed - 3);
    this.callbacks.onHitObstacle();
  }

  // --- CLEANUP ---
  public destroy() {
    this.isDestroyed = true;
    cancelAnimationFrame(this.animationFrameId);
    clearTimeout(this.animationFrameId);

    this.clearDynamicObjects();

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }
}
