/**
 * Attendify 3D - Three.js Visual Centerpiece
 * Smooth, lightweight, high-performance 3D academic crystal with orbital rings
 */

const ThreeHero = {
  scene: null,
  camera: null,
  renderer: null,
  mesh: null,
  wireframe: null,
  ringGroup: null,
  particles: null,
  targetRotationX: 0,
  targetRotationY: 0,
  animId: null,

  init(containerId = 'threejs-hero-canvas-wrap') {
    const container = document.getElementById(containerId);
    if (!container || typeof THREE === 'undefined') return;

    // Clean up any existing canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 420;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.z = 4.8;

    // 3. Renderer with antialias and alpha
    try {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.domElement.id = 'threejs-hero-canvas';
      container.appendChild(this.renderer.domElement);
    } catch (e) {
      console.warn("WebGL not initialized:", e);
      return;
    }

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.5);
    this.scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x38bdf8, 3.5, 50);
    pointLight1.position.set(4, 5, 4);
    this.scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x818cf8, 2.8, 50);
    pointLight2.position.set(-4, -4, 3);
    this.scene.add(pointLight2);

    const cyanRim = new THREE.PointLight(0x06b6d4, 2.0, 30);
    cyanRim.position.set(0, -3, -2);
    this.scene.add(cyanRim);

    // 5. Central Polyhedral Academic Core (Icosahedron)
    const geometry = new THREE.IcosahedronGeometry(1.4, 0);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x0b1329,
      emissive: 0x0284c7,
      emissiveIntensity: 0.22,
      roughness: 0.1,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.92
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);

    // 6. Glowing Wireframe Shell
    const wireGeo = new THREE.IcosahedronGeometry(1.41, 0);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.65
    });
    this.wireframe = new THREE.Mesh(wireGeo, wireMat);
    this.scene.add(this.wireframe);

    // 7. Orbital Gyroscopic Rings
    this.ringGroup = new THREE.Group();

    const ring1Geo = new THREE.TorusGeometry(1.9, 0.02, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    this.ringGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.15, 0.018, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.4 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    this.ringGroup.add(ring2);

    this.scene.add(this.ringGroup);

    // 8. Orbiting Quantum Spark Particles
    const pCount = 90;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount; i++) {
      const radius = 2.4 + Math.random() * 1.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      pPositions[i * 3] = radius * Math.cos(phi) * Math.cos(theta);
      pPositions[i * 3 + 1] = radius * Math.sin(phi);
      pPositions[i * 3 + 2] = radius * Math.cos(phi) * Math.sin(theta);
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.055,
      transparent: true,
      opacity: 0.8
    });
    this.particles = new THREE.Points(pGeo, pMat);
    this.scene.add(this.particles);

    // 9. Interactive Mouse Tilt Tracking
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      this.targetRotationY = x * 0.75;
      this.targetRotationX = y * 0.75;
    });

    container.addEventListener('mouseleave', () => {
      this.targetRotationX = 0;
      this.targetRotationY = 0;
    });

    // 10. Resize handler
    window.addEventListener('resize', () => {
      if (!container || !this.renderer || !this.camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
      }
    });

    this.animate();
  },

  animate() {
    this.animId = requestAnimationFrame(() => this.animate());

    if (!this.mesh || !this.renderer || !this.scene || !this.camera) return;

    // Smooth inertia interpolation
    this.mesh.rotation.y += 0.007;
    this.mesh.rotation.x += 0.004;

    this.wireframe.rotation.y = this.mesh.rotation.y;
    this.wireframe.rotation.x = this.mesh.rotation.x;

    if (this.ringGroup) {
      this.ringGroup.rotation.y += 0.005;
      this.ringGroup.rotation.x += 0.002;
    }

    if (this.particles) {
      this.particles.rotation.y += 0.002;
    }

    // Interactive mouse parallax
    this.scene.rotation.y += (this.targetRotationY - this.scene.rotation.y) * 0.05;
    this.scene.rotation.x += (this.targetRotationX - this.scene.rotation.x) * 0.05;

    this.renderer.render(this.scene, this.camera);
  },

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.remove();
    }
  }
};
