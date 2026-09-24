import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';
(() => {
  const MODEL_BASE = '/gate-scene/models/scene-v2/';
  const clamp = (t) => (t < 0 ? 0 : t > 1 ? 1 : t);
  const easeOut = (t) => { t = clamp(t); return 1 - Math.pow(1 - t, 3); };
  const easeIO = (t) => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  const PLATE = '34 VS 1923', PLATE_E = '34 VS 2004';
  // EXIT lane (near the viewer): car heads +z, stops at the kiosk, HGS fails, pays at kiosk, barrier opens
  const KX = { approach: [0, 2.2], scan: [2.2, 3.1], hgs: [3.1, 4.3], hgs_fail: [4.3, 5.0], pay: [5.0, 7.2], pay_ok: [7.2, 7.8], access: [7.8, 8.8], flow: [8.8, 11.8], close: [11.8, 12.9], idle: [12.9, 14.6] };
  const LOOP_X = 14.6, INIT = 1.1;
  // Alternate scenario: the HGS tag pays within a second, the barrier opens ahead of the car and it rolls through without stopping.
  const KH = { approach: [0, 2.2], scan: [2.2, 2.6], hgs_ok: [2.6, 3.1], access: [3.1, 3.5], flow: [3.5, 6.9], close: [6.9, 8.0], idle: [8.0, 9.5] };
  const LOOP_H = 9.5, CYCLE = LOOP_X + LOOP_H;   // one card-payment run, then one HGS free-flow run
  // ENTRY lane (background): quick plate read, barrier opens, car drives in
  const KE = { approach: [0, 1.9], scan: [1.9, 2.5], access: [2.5, 3.3], flow: [3.3, 5.8], close: [5.8, 6.8], idle: [6.8, 8.6] };
  const LOOP_E = 8.6, OFF_E = 4.0;
  const LANE_X = -2.7, LANE_E = 2.7;   // exit lane (x<0), entry lane (x>0); island between -1..1
  const STOP_X = -5.2;                 // exit car centre z when the driver window meets the kiosk (barrier at z=0)
  const STOP_E = 1.0;                   // entry car centre z at its stop line (heading -z): nose 2.9 m before the barrier, like the exit side

  class VsGateScene extends HTMLElement {
    connectedCallback() {
      if (this._started) return; this._started = true;
      if (!this.style.position) this.style.position = 'relative';
      this.style.display = 'block'; if (!this.style.height) this.style.height = '100%'; if (!this.style.width) this.style.width = '100%';
      const c = document.createElement('canvas');
      c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;opacity:0;transition:opacity 1.4s ease';
      this.appendChild(c); this.canvas = c;
      // One frosted capsule, aligned with the hero copy on the left.
      const glyph=(body,filled)=>`<svg width="18" height="18" viewBox="0 0 18 18" ${filled?'fill="currentColor"':'fill="none" stroke="currentColor" stroke-width="2.55" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${body}</svg>`;
      const controls=document.createElement('div');controls.className='gateControls';controls.setAttribute('role','group');controls.setAttribute('aria-label','Sahne kontrolleri');
      const control=(label,svg)=>{const b=document.createElement('button');b.type='button';b.className='gateControl';b.setAttribute('aria-label',label);b.innerHTML=svg;return b;};
      const sep=()=>{const s=document.createElement('span');s.className='gateSep';s.setAttribute('aria-hidden','true');return s;};
      const zoomOut=control('Uzaklaştır',glyph('<path d="M4.25 9h9.5"/>'));zoomOut.onclick=()=>this.zoomBy(1.25);
      const zoomIn=control('Yakınlaştır',glyph('<path d="M9 4.25v9.5M4.25 9h9.5"/>'));zoomIn.onclick=()=>this.zoomBy(.8);
      const pause=control('Animasyonu durdur','');
      const pauseSep=sep();
      const pauseIcon=p=>p?glyph('<path d="M6.2 3.6v10.8l8.1-5.4z"/>',true):glyph('<rect x="3.9" y="3.4" width="3.45" height="11.2" rx="1.15"/><rect x="10.65" y="3.4" width="3.45" height="11.2" rx="1.15"/>',true);
      const syncPause=()=>{pause.innerHTML=pauseIcon(this.userPaused);pause.setAttribute('aria-label',this.userPaused?'Animasyonu oynat':'Animasyonu durdur');pause.setAttribute('aria-pressed',String(!!this.userPaused));};
      syncPause();pause.onclick=()=>{this.userPaused=!this.userPaused;syncPause();this.syncPlayback?.();};
      controls.append(zoomOut,sep(),zoomIn,pauseSep,pause);this.appendChild(controls);
      this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      pause.hidden=this.reduced;pauseSep.hidden=this.reduced;this.visible = true; this.phase = null;
      // Click-and-drag on the hero orbits the camera; plain mouse movement does nothing. The sweep resumes 3 s after release (see applyFrame).
      this.pointerHost = this.closest('[data-hero]') || this; c.style.cursor = 'grab';
      this.dragStart = (e) => { if (e.button !== 0 || e.target.closest('a,button,input,select,textarea')) return; if (e.pointerType === 'touch') { this.touches.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (this.touches.size === 2) { const [a, b] = [...this.touches.values()]; this.pinch = { d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, z0: this.zoomTarget }; this.drag = null; if (this.steer) { this.steer.active = false; this.steer.at = this.sceneTime || 0; } return; } if (this.touches.size > 2 || e.target !== c) return; } if (e.pointerType !== 'touch') e.preventDefault(); this.drag = { id: e.pointerId, x: e.clientX, y: e.clientY, yaw: this.cam ? this.cam.yaw : 0, pitch: this.cam ? this.cam.pitch : 0 }; this.pointerHost.style.userSelect = 'none'; c.style.cursor = 'grabbing'; try { this.pointerHost.setPointerCapture(e.pointerId); } catch (_) {} };
      this.dragMove = (e) => { if (e.pointerType === 'touch' && this.touches.has(e.pointerId)) { this.touches.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (this.pinch && this.touches.size === 2) { const [a, b] = [...this.touches.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y) || 1; this.setZoom(this.pinch.z0 * this.pinch.d0 / d); return; } } const d = this.drag; if (!d || d.id !== e.pointerId) return; this.steer = { yaw: d.yaw + (e.clientX - d.x) * 0.0045, pitch: d.pitch - (e.clientY - d.y) * 0.006, at: this.sceneTime || 0, active: true }; };
      this.dragEnd = (e) => { if (e && e.pointerType === 'touch') { this.touches.delete(e.pointerId); if (this.touches.size < 2) this.pinch = null; } if (!this.drag || (e && e.pointerId !== undefined && this.drag.id !== e.pointerId)) return; this.drag = null; this.pointerHost.style.userSelect = ''; c.style.cursor = 'grab'; if (this.steer) { this.steer.active = false; this.steer.at = this.sceneTime || 0; } };
      this.pointerHost.addEventListener('pointerdown', this.dragStart); this.pointerHost.addEventListener('pointermove', this.dragMove, { passive: true }); this.pointerHost.addEventListener('pointerup', this.dragEnd); this.pointerHost.addEventListener('pointercancel', this.dragEnd);
      // Zoom: pinch on touch, ctrl+wheel (trackpad pinch) on desktop, and the +/− buttons; plain wheel keeps scrolling the page.
      this.touches = new Map(); this.pinch = null; this.zoom = 1; this.zoomTarget = 1;
      this.setZoom = (z) => { this.zoomTarget = Math.max(.45, Math.min(1.5, z)); if (this.reduced || this.userPaused) { this.zoom = this.zoomTarget; if (this.reduced) this.renderStatic?.(); else this.renderCurrent?.(); } };
      this.zoomBy = (f) => this.setZoom(this.zoomTarget * f);
      c.style.touchAction = 'pan-y'; this.pointerHost.style.touchAction = 'pan-y';
      c.addEventListener('wheel', (e) => { if (!e.ctrlKey) return; e.preventDefault(); this.zoomBy(Math.exp(e.deltaY * .01)); }, { passive: false });
      Promise.resolve().then(() => this.init(THREE, GLTFLoader, null, DRACOLoader)).catch((e) => { console.warn('gate-scene', e && e.message); this.emit('fallback'); });
    }
    disconnectedCallback() { if (this.pointerHost) { this.pointerHost.removeEventListener('pointerdown', this.dragStart); this.pointerHost.removeEventListener('pointermove', this.dragMove); this.pointerHost.removeEventListener('pointerup', this.dragEnd); this.pointerHost.removeEventListener('pointercancel', this.dragEnd); } document.removeEventListener('visibilitychange',this.visibilityHandler);this.draco?.dispose(); cancelAnimationFrame(this.raf); clearInterval(this.fallbackT); this.ro && this.ro.disconnect(); this.io && this.io.disconnect(); this.renderer && this.renderer.dispose(); this.environmentTarget && this.environmentTarget.dispose(); if (this.composer) { this.composer.passes.forEach(p => p.dispose?.()); this.composer.dispose(); } }
    emit(phase) {
      const lane0 = this.lanes ? this.lanes[0].userData : {}; const detail = { phase, plate: PLATE, vehicle: lane0.vehicle || '', colourTr: lane0.colour ? lane0.colour[0] : '', colourEn: lane0.colour ? lane0.colour[1] : '', scenario: this.scenario || 'card' };
      this.dispatchEvent(new CustomEvent('vs-phase', { detail, bubbles: true }));
      // The bubbling event reaches window once.
    }
    plateTexture(T, text = PLATE) {
      const cv = document.createElement('canvas'); cv.width = 520; cv.height = 110; const g = cv.getContext('2d');
      g.fillStyle = '#F6F7FA'; g.fillRect(0, 0, 520, 110);
      g.fillStyle = '#171B99'; g.fillRect(0, 0, 56, 110);
      g.fillStyle = '#fff'; g.font = 'bold 24px sans-serif'; g.textAlign = 'center'; g.fillText('TR', 28, 96);
      g.fillStyle = '#0A0B14'; g.font = 'bold 76px "JetBrains Mono", "Archivo", monospace'; g.textAlign = 'center'; g.fillText(text, 292, 82);
      const t = new T.CanvasTexture(cv); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; return t;
    }
    stripeTexture(T) {
      const cv = document.createElement('canvas'); cv.width = 512; cv.height = 32; const g = cv.getContext('2d');
      g.fillStyle = '#EDEAE4'; g.fillRect(0, 0, 512, 32); g.fillStyle = '#A8231C'; for (let i = 0; i < 4; i++) g.fillRect(28 + i * 124, 0, 62, 32);
      const t = new T.CanvasTexture(cv); t.colorSpace = T.SRGBColorSpace; t.wrapS = T.RepeatWrapping; return t;
    }
    roundedRect(T, w, h, r) { const s = new T.Shape(); const x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; }

    init(T, GLTFLoader, BGU, DRACOLoader) {
      const el = this;
      const renderer = new T.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
      renderer.setClearColor(0x000000, 0); renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFShadowMap;
      renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.85; this.renderer = renderer;
      const refreshStatic = () => { if (this.reduced && this.renderStatic) this.renderStatic();else if(this.userPaused&&this.renderCurrent)this.renderCurrent(); };
      const scene = new T.Scene(); scene.background = new T.Color(0x0a0b14); scene.fog = new T.Fog(0x0a0b14, 22, 60);
      const camera = new T.PerspectiveCamera(32, 1, 0.5, 100); this.camera = camera;
      // A photographic HDR environment gives curved paint, glass and metal real reflections.
      new HDRLoader().load('/gate-scene/environment/venice-sunset-1k.hdr', (hdr) => {
        const pmrem = new T.PMREMGenerator(renderer);
        this.environmentTarget = pmrem.fromEquirectangular(hdr);
        scene.environment = this.environmentTarget.texture; scene.environmentIntensity = 0.3;
        scene.environmentRotation.y = 1.2; hdr.dispose(); pmrem.dispose(); refreshStatic();
      }, undefined, (e) => console.warn('Environment unavailable', e.message));

      const M = {
        asphalt: new T.MeshStandardMaterial({ color: 0x0c1017, roughness: 0.95 }),
        curb: new T.MeshStandardMaterial({ color: 0x3a3d4d, roughness: 0.9 }),
        curbTop: new T.MeshStandardMaterial({ color: 0x474b5e, roughness: 0.9 }),
        paint: new T.MeshStandardMaterial({ color: 0xb9bcc8, roughness: 0.9 }),
        cabinet: new T.MeshStandardMaterial({ color: 0x6b6f7c, metalness: 0.4, roughness: 0.42 }),
        camBody: new T.MeshStandardMaterial({ color: 0xe6e8ee, metalness: 0.3, roughness: 0.35 }),
        camDark: new T.MeshStandardMaterial({ color: 0x1b1d28, metalness: 0.4, roughness: 0.5 }),
        camGlass: new T.MeshStandardMaterial({ color: 0x0a0d1a, metalness: 0.95, roughness: 0.05 }),
        cabinetDark: new T.MeshStandardMaterial({ color: 0x1a1c2c, metalness: 0.5, roughness: 0.5 }),
        kioskRed: new T.MeshStandardMaterial({ color: 0xc8262b, metalness: 0.35, roughness: 0.42 }),
        brand: new T.MeshStandardMaterial({ color: 0x171b99, emissive: 0x171b99, emissiveIntensity: 0.45, roughness: 0.45 }),
        arm: new T.MeshStandardMaterial({ roughness: 0.5, metalness: 0.1 }),
        pole: new T.MeshStandardMaterial({ color: 0xf1f3f5, metalness: 0.15, roughness: 0.32 }),
        carPaint: new T.MeshStandardMaterial({ color: 0x3b4fd0, metalness: 0.75, roughness: 0.28 }),
        carPaint2: new T.MeshStandardMaterial({ color: 0x9aa0b4, metalness: 0.7, roughness: 0.32 }),
        carDark: new T.MeshStandardMaterial({ color: 0x0f1018, roughness: 0.7 }),
        glass: new T.MeshStandardMaterial({ color: 0x4a5a86, metalness: 0.85, roughness: 0.08 }),
        tyre: new T.MeshStandardMaterial({ color: 0x0b0c10, roughness: 0.95 }),
        rim: new T.MeshStandardMaterial({ color: 0xa8abb6, metalness: 0.85, roughness: 0.3 }),
        head: new T.MeshStandardMaterial({ color: 0xfff6dc, emissive: 0xfff6dc, emissiveIntensity: 1.8 }),
        tail: new T.MeshStandardMaterial({ color: 0xff2a2a, emissive: 0xff2a2a, emissiveIntensity: 0.8 }),
        chrome: new T.MeshStandardMaterial({ color: 0xd0d3da, metalness: 0.95, roughness: 0.2 }),
        screen: new T.MeshStandardMaterial({ color: 0x2a30c0, emissive: 0x3a41e0, emissiveIntensity: 0.9 }),
        ledX: new T.MeshStandardMaterial({ color: 0xe0a23a, emissive: 0xe0a23a, emissiveIntensity: 2 }),
        ledE: new T.MeshStandardMaterial({ color: 0xe0a23a, emissive: 0xe0a23a, emissiveIntensity: 2 }),
        nfc: new T.MeshStandardMaterial({ color: 0x0a0b14, emissive: 0x3fd9a0, emissiveIntensity: 0 }),
        ir: new T.MeshStandardMaterial({ color: 0x3a0a10, emissive: 0x8a1020, emissiveIntensity: 0.6, roughness: 0.4 }),
        scan: new T.MeshBasicMaterial({ color: 0x7a80ff, transparent: true, opacity: 0, side: T.DoubleSide, depthWrite: false }),
        plate: new T.MeshStandardMaterial({ map: this.plateTexture(T), roughness: 0.45, emissive: 0xffffff, emissiveIntensity: 0 }),
        plateE: new T.MeshStandardMaterial({ map: this.plateTexture(T, PLATE_E), roughness: 0.45 })
      };
      M.plate.emissiveMap = M.plate.map;
      const loader = GLTFLoader ? new GLTFLoader() : null;
      const sceneCache = new Map();
      const fetchScene = (url) => { if (!sceneCache.has(url)) sceneCache.set(url, loader.loadAsync(url).then(g => g.scene)); return sceneCache.get(url).then(s => s.clone(true)); };
      if(loader&&DRACOLoader){this.draco=new DRACOLoader().setDecoderPath('/gate-scene/draco/').setWorkerLimit(1);loader.setDRACOLoader(this.draco);}
      // loadModel(file, {height, yaw, offset, onReady}) → group whose bottom sits at y=0 and footprint is centred at x/z=0
      const loadModel = (file, opt) => {
        const holder = new T.Group();
        if (!loader) return holder;
        fetchScene(opt.url || MODEL_BASE + file + "?v=9").then((m) => {
          m.traverse((o) => {
            if (!o.isMesh) return;
            o.castShadow = !!opt.shadow; o.receiveShadow = !!opt.shadow;
            for (const mt of (Array.isArray(o.material) ? o.material : [o.material])) {
              if (!mt) continue;
              // Preserve imported normal maps, clearcoat and interior materials.
              if (mt.vertexColors) { mt.vertexColors = false; mt.needsUpdate = true; }
              if (/Vidrios|glass|window|glazing/i.test(mt.name || '')) {
                mt.color.setHex(0x667681); mt.metalness = 0.15; mt.roughness = 0.12;
                mt.transparent = true; mt.opacity = 0.65; mt.transmission = 0; mt.depthWrite = false;
              }
              if (mt.map) mt.map.anisotropy = Math.min(2, renderer.capabilities.getMaxAnisotropy());
            }
          });
          if (opt.raw) { holder.add(m); opt.onReady && opt.onReady(m); refreshStatic(); return; }
          if (opt.yaw) m.rotation.y = opt.yaw;
          m.updateMatrixWorld(true);
          const bb = new T.Box3().setFromObject(m); const size = new T.Vector3(); bb.getSize(size);
          const sc = opt.length ? opt.length / size.z : opt.height / size.y; m.scale.setScalar(sc); m.updateMatrixWorld(true);
          bb.setFromObject(m); const c = new T.Vector3(); bb.getCenter(c);
          m.position.set(-c.x, -bb.min.y, -c.z);
          if (opt.offset) m.position.add(new T.Vector3(...opt.offset));
          holder.add(m); m.updateMatrixWorld(true); bb.setFromObject(m); opt.onReady && opt.onReady(m, bb); refreshStatic();
        }, (e) => console.warn('gate-scene model', file, e));
        return holder;
      };
      const box = (w, h, d, m, x, y, z, parent, shadow = true) => { const g = new T.Mesh(new T.BoxGeometry(w, h, d), m); g.position.set(x, y, z); g.castShadow = shadow; g.receiveShadow = shadow; (parent || scene).add(g); return g; };

      // ---------- ground, island, lanes
      const ground = new T.Mesh(new T.PlaneGeometry(180, 180), M.asphalt); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
      // One continuous island: no intersecting top slab beneath equipment feet.
      box(2.0, 0.16, 22, M.curb, 0, 0.08, 1, scene);
      // Deterministic microtexture breaks the uniform CG road surface.
      const grain = new Uint8Array(256 * 256 * 4); let seed = 1923;
      for (let i = 0; i < grain.length; i += 4) { seed = (1664525 * seed + 1013904223) >>> 0; const v = 100 + (seed % 75); grain[i] = grain[i+1] = grain[i+2] = v; grain[i+3] = 255; }
      const road = new T.DataTexture(grain, 256, 256); road.wrapS = road.wrapT = T.RepeatWrapping; road.repeat.set(110, 110); road.magFilter = T.LinearFilter; road.minFilter = T.LinearMipmapLinearFilter; road.generateMipmaps = true; road.needsUpdate = true;
      M.asphalt.bumpMap = road; M.asphalt.bumpScale = 0.018; M.asphalt.roughness = 0.84;
      M.curb.roughness = 0.87;
      // Lane edge lines run to the horizon. Each side lot has two 5.5 m openings in the edge line: on the entry road (x>0, traffic heading -z)
      // the entrance comes first (z -21…-26.5) and the exit later (z -39…-44.5); on the exit road (x<0, heading +z) the order is mirrored.
      [4.6,-4.6].forEach(x=>{box(.12,.008,91,M.paint,x,.006,24.5,scene,false);box(.12,.008,12.5,M.paint,x,.006,-32.75,scene,false);box(.12,.008,51.5,M.paint,x,.006,-70.25,scene,false);});
      box(3.4, 0.01, 0.16, M.paint, LANE_X, 0.007, STOP_X + 2.5, scene, false);
      box(3.4, 0.01, 0.16, M.paint, LANE_E, 0.007, STOP_E - 2.5, scene, false);
      const arrow = (x, z, dir, rotY = 0) => { const g = new T.Group(); g.rotation.y = rotY; box(0.14, 0.01, 1.3, M.paint, 0, 0, 0, g, false); const a = box(0.14, 0.01, 0.6, M.paint, -0.2, 0, dir * 0.8, g, false); a.rotation.y = dir * 0.7; const b = box(0.14, 0.01, 0.6, M.paint, 0.2, 0, dir * 0.8, g, false); b.rotation.y = -dir * 0.7; g.position.set(x, 0.008, z); scene.add(g); };
      arrow(LANE_X, -9, 1); arrow(LANE_X, -15, 1); arrow(LANE_X, 4, 1); arrow(LANE_E, 4, -1); arrow(LANE_E, 12, -1); arrow(LANE_E, -9, -1); arrow(LANE_E, -15, -1);
      // Opening arrows: into the lot at the entrance, out to the road at the exit; aisle arrows follow the lot's circulation.
      arrow(6.6, -23.75, 1, Math.PI / 2); arrow(6.6, -41.75, 1, -Math.PI / 2); arrow(6.45, -32.75, -1); arrow(6.45, -50, -1);
      arrow(-6.6, -41.75, 1, -Math.PI / 2); arrow(-6.6, -23.75, 1, Math.PI / 2); arrow(-6.45, -32.75, 1); arrow(-6.45, -50, 1);

      // Quiet background parking bays, rendered as one instanced mesh.
      const bayLines=[];
      for(const side of [-1,1]){
        const x=side*8.3;
        bayLines.push([x+side*5.1,.009,-35.75,.09,.008,43.5]);   // bay end line
        bayLines.push([x,.009,-35.75,.09,.008,43.5]);            // bay front line along the side aisle
        for(let i=0;i<16;i++)bayLines.push([x+side*2.55,.009,-14-i*2.9,5.1,.008,.085]);
        // Broken "give way" line across both openings in the lane edge line.
        for(const c of [-23.75,-41.75])for(let i=0;i<4;i++)bayLines.push([side*4.6,.009,c-2.1+i*1.4,.12,.008,.7]);
      }
      // Centre line between the two lanes beyond the island, dashed to the horizon on both ends.
      for(let z=-95;z<-12;z+=4)bayLines.push([0,.009,z,.12,.008,2]);
      for(let z=14;z<70;z+=4)bayLines.push([0,.009,z,.12,.008,2]);
      const distantPaint=new T.MeshStandardMaterial({color:0x626978,roughness:.97});
      const bays=new T.InstancedMesh(new T.BoxGeometry(1,1,1),distantPaint,bayLines.length),bayTransform=new T.Object3D();
      bayLines.forEach(([x,y,z,w,h,d],i)=>{bayTransform.position.set(x,y,z);bayTransform.scale.set(w,h,d);bayTransform.updateMatrix();bays.setMatrixAt(i,bayTransform.matrix);});bays.instanceMatrix.needsUpdate=true;scene.add(bays);
      // Rack cabinet on the service island, outside both vehicle paths.
      box(.75,.08,.75,M.curbTop,.25,.20,-8.8,scene,true);
      const rack=loadModel('rack.glb',{height:.775,yaw:0,shadow:false,url:'/gate-scene/models/products/rack.glb?v=2',onReady:m=>{m.traverse(o=>{if(!o.isMesh)return;for(const material of(Array.isArray(o.material)?o.material:[o.material])){material.roughness=Math.max(material.roughness||0,.65);material.metalness=Math.min(material.metalness||0,.3);material.envMapIntensity=.25;}});}});
      rack.position.set(.25,.24,-8.8);scene.add(rack);
      // Cabling: a thin trunking channel runs along the island from the rack cabinet to every device; runs that cross a lane go
      // underground through marked entry/exit flanges (island edge → totem plinth).
      const ductMat=new T.MeshStandardMaterial({color:0x2b2e35,roughness:.6,metalness:.2}),flangeMat=new T.MeshStandardMaterial({color:0x1a1c22,roughness:.45,metalness:.45});
      const duct=(pts,y=.1725)=>{for(let i=1;i<pts.length;i++){const [x0,z0]=pts[i-1],[x1,z1]=pts[i];const dx=x1-x0,dz=z1-z0;const seg=new T.Mesh(new T.BoxGeometry(.04,.025,Math.hypot(dx,dz)+.04),ductMat);seg.position.set((x0+x1)/2,y,(z0+z1)/2);seg.rotation.y=Math.atan2(dx,dz);seg.receiveShadow=true;scene.add(seg);}};
      const flange=(x,z,y=.166)=>{const f=new T.Mesh(new T.CylinderGeometry(.05,.05,.012,20),flangeMat);f.position.set(x,y,z);scene.add(f);};
      duct([[.25,-8.4],[.4,-8.4],[.4,.4]]);                                  // trunk: rack → island end
      duct([[.4,-5],[-.5,-5]]);duct([[.4,-4.2],[.55,-4.2]]);duct([[.4,-3.35],[.18,-3.35]]);   // kiosk, entry barrier, entry mast
      duct([[.4,-.2],[.12,-.2]]);duct([[.4,.15],[-.5,.15]]);               // exit mast, exit barrier
      duct([[.4,.4],[-.85,.4]]);flange(-.85,.4);flange(-4.9,.5,.006);duct([[-4.9,.5],[-5.05,.5]],.012);        // exit totem: down at the island edge, up at the plinth
      duct([[.4,-4.7],[.85,-4.7]]);flange(.85,-4.7);flange(4.9,-4.7,.006);duct([[4.9,-4.7],[5.05,-4.7]],.012); // entry totem

      // Four economical luminaires: simple boxes, no extra shadow maps or dynamic lights.
      const lampSteel=new T.MeshStandardMaterial({color:0x78818c,metalness:.35,roughness:.65});
      const lampGlow=new T.MeshStandardMaterial({color:0xffe7b4,emissive:0xffdb9b,emissiveIntensity:1.4,roughness:.9});
      for(const [x,z] of [[-13.9,-16.5],[13.9,-16.5],[-13.9,-27],[13.9,-27],[-13.9,-45],[13.9,-45]]){
        box(.32,.09,.32,M.curb,x,.045,z,scene,false);
        box(.075,4,.075,lampSteel,x,2,z,scene,false);
        const side=x<0?1:-1;
        box(.72,.06,.10,lampSteel,x+side*.32,3.97,z,scene,false);
        box(.65,.055,.26,lampSteel,x+side*.62,3.93,z,scene,false);
        box(.56,.012,.21,lampGlow,x+side*.62,3.897,z,scene,false);
      }
      const lightCanvas=document.createElement('canvas');lightCanvas.width=128;lightCanvas.height=128;const lightCtx=lightCanvas.getContext('2d'),falloff=lightCtx.createRadialGradient(64,64,0,64,64,64);falloff.addColorStop(0,'rgba(255,222,167,.13)');falloff.addColorStop(1,'rgba(255,222,167,0)');lightCtx.fillStyle=falloff;lightCtx.fillRect(0,0,128,128);
      const lightMap=new T.CanvasTexture(lightCanvas),poolMaterial=new T.MeshBasicMaterial({map:lightMap,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1});
      for(const [x,z] of [[-11.5,-16.5],[11.5,-16.5],[-11.5,-27],[11.5,-27],[-11.5,-45],[11.5,-45]]){const pool=new T.Mesh(new T.PlaneGeometry(7,7),poolMaterial);pool.rotation.x=-Math.PI/2;pool.position.set(x,.004,z);scene.add(pool);}

      // Real Toger LED totems stand on the driver's right, beyond the road edge: the display greets, the board below lists the tariff.
      const ledDisplays={};
      const TARIFF=[['0 – 1 saat','₺80'],['1 – 3 saat','₺140'],['3 – 8 saat','₺220'],['8 – 24 saat','₺320'],['Aylık abonelik','₺3.900']];
      const advertisingPanel=(x,z,lane,waitingZ,entry)=>{
        const group=new T.Group();group.position.set(x,.09,z);group.rotation.y=Math.atan2(lane-x,waitingZ-z);
        box(.9,.09,.725,M.curb,x,.045,z,scene,false);
        // LED display (2:1): black matrix, red type; the lines follow the lane's state (plate, amount, paid / welcome).
        const cv=document.createElement('canvas');cv.width=1024;cv.height=512;const ctx=cv.getContext('2d');
        const map=new T.CanvasTexture(cv);map.colorSpace=T.SRGBColorSpace;map.flipY=false;map.anisotropy=4;
        const screen=new T.MeshStandardMaterial({map,emissiveMap:map,emissive:0xffffff,emissiveIntensity:1.5,color:0x000000,roughness:.55});
        const display={last:'',set:(lines)=>{const key=lines.join('|');if(key===display.last)return;display.last=key;ctx.fillStyle='#050505';ctx.fillRect(0,0,1024,512);ctx.textAlign='center';ctx.fillStyle='#ff2a2a';ctx.shadowColor='#ff2a2a';ctx.shadowBlur=18;ctx.font='700 150px "JetBrains Mono", monospace';ctx.fillText(lines[0],512,lines[1]?222:300);if(lines[1]){ctx.font='700 88px "JetBrains Mono", monospace';ctx.fillText(lines[1],512,392);}ctx.shadowBlur=0;
          // LED pixel grid: dark gaps between the emitters.
          ctx.fillStyle='rgba(0,0,0,.35)';for(let y=0;y<512;y+=8)ctx.fillRect(0,y,1024,3);for(let x=0;x<1024;x+=8)ctx.fillRect(x,0,3,512);map.needsUpdate=true;}};
        display.set(entry?['GİRİŞ','HOŞ GELDİNİZ']:['ÇIKIŞ','HAZIR']);ledDisplays[entry?'entry':'exit']=display;
        // Tariff board on the body below the display (portrait): rows in blue on white.
        const bc=document.createElement('canvas');bc.width=512;bc.height=768;const bx=bc.getContext('2d');bx.fillStyle='#F6F7FA';bx.fillRect(0,0,512,768);bx.fillStyle='#171B99';bx.fillRect(0,0,512,10);bx.textAlign='center';bx.font='700 40px sans-serif';bx.fillText('FİYAT TARİFESİ',256,86);bx.fillRect(48,112,416,2);bx.font='500 30px sans-serif';TARIFF.forEach(([label,price],i)=>{const y=176+i*104;bx.fillStyle='#171B99';bx.textAlign='left';bx.fillText(label,48,y);bx.textAlign='right';bx.font='700 32px sans-serif';bx.fillText(price,464,y);bx.font='500 30px sans-serif';bx.fillStyle='#C9CCD8';bx.fillRect(48,y+30,416,1);});bx.font='500 22px sans-serif';bx.textAlign='center';bx.fillStyle='#5C6079';bx.fillText('KDV dahil · parkbiz.com.tr',256,730);
        const boardMap=new T.CanvasTexture(bc);boardMap.colorSpace=T.SRGBColorSpace;boardMap.anisotropy=4;
        const board=new T.Mesh(new T.PlaneGeometry(.66,1.0),new T.MeshStandardMaterial({map:boardMap,emissiveMap:boardMap,emissive:0xffffff,emissiveIntensity:.18,roughness:.85}));
        board.position.set(0,1.075,.048);group.add(board);
        group.add(loadModel('led.glb',{height:2.0625,shadow:false,url:'/gate-scene/models/products/led.glb?v=1',onReady:m=>m.traverse(o=>{if(!o.isMesh)return;const tune=mat=>{if(/^Material_(aj2b9rit5|qss9nnqqs)/.test(mat.name))return screen;mat.roughness=Math.max(mat.roughness||0,.6);mat.metalness=Math.min(mat.metalness||0,.3);return mat;};o.material=Array.isArray(o.material)?o.material.map(tune):tune(o.material);})}));scene.add(group);
      };
      advertisingPanel(-5.4,.5,LANE_X,STOP_X,false);
      advertisingPanel(5.4,-4.7,LANE_E,STOP_E,true);

      // ---------- Blender-authored barrier: rounded cabinet, fixings, reflective arm and safety edge.
      const barrier = (x, z, dir, ledMat) => {
        const g = new T.Group(); g.position.set(x, 0.163, z); g.rotation.y = dir < 0 ? Math.PI : 0;
        const state = { hinge: new T.Group(), dir: 1 };
        g.add(loadModel('barrier.glb', { raw: true, shadow: true, onReady: (m) => {
          state.hinge = m.getObjectByName('ArmPivot') || state.hinge;
          // Dahua-style cabinet: one plain #626262 body (cap included), no visible fixings, bolts, louvres or indicators.
          const bodyGrey = new T.MeshStandardMaterial({ name: 'Cabinet grey', color: 0x626262, roughness: 0.3, metalness: 0.35, envMapIntensity: 1.0 });
          m.traverse((o) => { if (!o.isMesh || !o.material) return; const n = o.material.name || '';
            if (o.name === 'Cap seam' || /^(Door fixing|Anchor bolt|Cooling louvre)/.test(o.name)) { o.visible = false; return; }
            if (n === 'Silver grey powdercoat') o.material = bodyGrey;
            else if (n === 'Graphite polymer') { o.material.color.setHex(0x2a2c31); o.material.roughness = 0.5; }
            else if (n === 'Brushed aluminium') { o.material.color.setHex(0x8b9097); o.material.metalness = 0.8; o.material.roughness = 0.4; } });
        } }));
        scene.add(g); return state;
      };
      const gateX = barrier(-0.68, 0, -1, M.ledX);
      const gateE = barrier(0.68, -4.2, 1, M.ledE);

      // Camera mast: the filled Visio housing hangs ahead of the mast with its rear face touching the mast's front face, 20 cm below
      // the mast top, and pitches 12° down about that contact line. Nothing else on the mast.
      // visiosoft2: the CAD housing spells TOGER as cut-outs in the red shell over a white core. Cover
      // them with a shell-coloured patch and lay a PARKBIZ decal on both sides instead (housing-local units ≈ mm; text reads toward -y on +x, +y on -x).
      const brandCanvas=document.createElement('canvas');brandCanvas.width=1024;brandCanvas.height=256;
      const brandMap=new T.CanvasTexture(brandCanvas);brandMap.colorSpace=T.SRGBColorSpace;brandMap.anisotropy=4;
      const drawBrand=()=>{const c=brandCanvas.getContext('2d');c.clearRect(0,0,1024,256);c.fillStyle='#e9eaee';c.textAlign='center';c.textBaseline='middle';
        c.font='800 195px "Archivo Variable", "Archivo", sans-serif';const w=c.measureText('PARKBIZ').width;if(w>980)c.font='800 '+Math.floor(195*980/w)+'px "Archivo Variable", "Archivo", sans-serif';
        c.fillText('PARKBIZ',512,138);brandMap.needsUpdate=true;};
      drawBrand();document.fonts?.ready.then(()=>{drawBrand();refreshStatic();});
      const brandMaterial=new T.MeshStandardMaterial({map:brandMap,transparent:true,depthWrite:false,roughness:.55,polygonOffset:true,polygonOffsetFactor:-2});
      const rebrandHousing=(m)=>{let shell=null,core=null;m.traverse((o)=>{if(!o.isMesh||!o.material)return;if(o.material.name==='Malzeme <belirli değil>.008')shell=o;else if(o.material.name==='Material_i7izraoej')core=o;});
        if(!shell||!core)return;
        // Only the lettering is patched: the core's white trim elsewhere on the housing stays visible.
        const patchMaterial=shell.material.clone();patchMaterial.polygonOffset=true;patchMaterial.polygonOffsetFactor=-1;
        for(const side of [1,-1]){const basis=new T.Matrix4().makeBasis(new T.Vector3(0,-side,0),new T.Vector3(0,0,-1),new T.Vector3(side,0,0));
          const patch=new T.Mesh(new T.PlaneGeometry(200,52),patchMaterial);patch.receiveShadow=true;patch.matrixAutoUpdate=false;patch.matrix.copy(basis).setPosition(side>0?88.9:-87.6,-8,-102);shell.parent.add(patch);
          const d=new T.Mesh(new T.PlaneGeometry(250,62.5),brandMaterial);d.receiveShadow=true;d.matrixAutoUpdate=false;d.matrix.copy(basis).setPosition(side>0?89.2:-87.9,-8,-102);shell.parent.add(d);}};
      const cameraUnit = (x,z,target,yawCorrection=0) => {
        const g=new T.Group();g.position.set(x,.163,z);
        const post=loadModel('camera-post.glb',{raw:true,shadow:true});post.scale.y=.82;g.add(post);
        const mount=new T.Group();mount.position.set(0,1.271,0);
        mount.rotation.y=Math.atan2(target[0]-x,target[2]-z)+yawCorrection;
        const head=new T.Group();head.position.set(0,-.17,.043);head.rotation.x=12*Math.PI/180;
        // The housing's rear mounting plate (4 mm, at the back of the bounding box) sits on the pole face: centre 29.4 cm ahead of it.
        const housing=loadModel('cam-filled.glb',{height:.34,shadow:true,onReady:rebrandHousing});housing.position.set(0,0,.294);head.add(housing);mount.add(head);
        g.add(mount);scene.add(g);
      };
      cameraUnit(.05,-.2,[LANE_X,.45,STOP_X+2.3]);
      cameraUnit(.12,-3.35,[LANE_E,.45,STOP_E-2.3],-15*Math.PI/180);
      const kiosk=new T.Group();kiosk.position.set(-.66,.164,STOP_X+.35);
      // Use the CAD's portrait tablet surface: 154 × 243 mm before model scaling (~13 inch).
      const screenCanvas=document.createElement('canvas');screenCanvas.width=256;screenCanvas.height=400;
      const sx=screenCanvas.getContext('2d');sx.fillStyle='#11172b';sx.fillRect(0,0,256,400);
      sx.fillStyle='#f1f4ff';sx.font='bold 22px sans-serif';sx.textAlign='center';sx.fillText('PARKBIZ',128,52);
      sx.font='16px sans-serif';sx.fillText('İyi yolculuklar',128,138);sx.fillText('34 VS 1923',128,186);
      sx.fillStyle='#363faf';sx.fillRect(28,244,200,66);sx.fillStyle='#fff';sx.fillText('Temassız ödeme',128,283);
      const tabletMap=new T.CanvasTexture(screenCanvas);tabletMap.colorSpace=T.SRGBColorSpace;tabletMap.flipY=false;
      const tablet=new T.MeshStandardMaterial({map:tabletMap,roughness:.75,metalness:0,emissive:0xffffff,emissiveMap:tabletMap,emissiveIntensity:.18});
      kiosk.add(loadModel('kiosk-filled.glb',{height:2.076,yaw:-Math.PI/2,shadow:true,onReady:m=>m.traverse(o=>{if(!o.isMesh||!o.material)return;const n=o.material.name||'';if(n==='tabletscreen')o.material=tablet;else if(n==='posscrenn'){o.material.emissive=new T.Color(0x9fb4ff);o.material.emissiveMap=o.material.map||null;o.material.emissiveIntensity=.35;}})}));scene.add(kiosk);

      // ---------- vehicles: hollowed bodies from tools/gltf/prepare-car.mjs (front +z, wheels as RollingWheel0-3 pivoting at the hubs).
      // Plate positions [y, z] were measured once against each bumper (no runtime raycasts: they caused hitches while models arrived).
      const VEHICLES = [
        { file: 'tesla-model-3.glb', name: 'Tesla Model 3', plates: { front: [0.42, 2.29], rear: [0.745, -2.263] } },
        { file: 'porsche-911.glb', name: 'Porsche 911', plates: { front: [0.34, 2.02], rear: [0.42, -2.0] } },
        { file: 'alfa-giulietta.glb', name: 'Alfa Romeo Giulietta', plates: { front: [0.42, 2.37], rear: [0.84, -2.31] } },   // pointed nose and rounded tail: plates sit a little proud of the surface
        { file: 'ford-focus.glb', name: 'Ford Focus', plates: { front: [0.42, 2.317], rear: [0.74, -2.258] } }
      ];
      const PALETTE = [0xd9dce2, 0x1f2a44, 0x7a1f1f, 0x2b2d33, 0x2e5a4a, 0x6f7480, 0xb8a98b, 0x162b5c];
      const COLOURS = { 0xd9dce2: ['Beyaz', 'White'], 0x1f2a44: ['Lacivert', 'Navy'], 0x7a1f1f: ['Bordo', 'Burgundy'], 0x2b2d33: ['Siyah', 'Black'], 0x2e5a4a: ['Yeşil', 'Green'], 0x6f7480: ['Gri', 'Grey'], 0xb8a98b: ['Bej', 'Beige'], 0x162b5c: ['Mavi', 'Blue'] };
      const makeCar = (spec, hex, plateMat = M.plate, shadow = true) => {
        const car = new T.Group(); car.userData.wheels = []; car.userData.paints = []; car.userData.ready = false;
        car.add(loadModel(spec.file, { length: 4.65, shadow, onReady: (m, bb) => {
          m.traverse((o) => {
            if (/^RollingWheel[0-3]$/.test(o.name)) car.userData.wheels.push(o);
            if (!o.isMesh || !o.material) return;
            const mt = o.material;
            if (/^Paint(?:\.\d+)?$/.test(mt.name || '')) {
              const paint = new T.MeshPhysicalMaterial({ name: 'Vehicle finish', color: hex, metalness: 0.18, roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.26, envMapIntensity: 0.55 });
              o.material = paint; car.userData.paints.push(paint);
            } else if (/Vidrios|glass|window|glazing/i.test(mt.name || '')) {
              // Dark, glossy glazing keeps the hollow cabin out of sight.
              mt.color.setHex(0x161c28); mt.opacity = 0.88; mt.roughness = 0.12; mt.metalness = 0.25; mt.envMapIntensity = 0.8;
            } else if (mt.isMeshStandardMaterial) { mt.envMapIntensity = Math.min(mt.envMapIntensity || 1, 0.6); }
          });
          car.userData.height = bb.max.y;
          const plate = new T.Mesh(new T.PlaneGeometry(0.48, 0.102), plateMat); plate.position.set(0, spec.plates.front[0], spec.plates.front[1]); car.add(plate);
          const rear = plate.clone(); rear.rotation.y = Math.PI; rear.position.set(0, spec.plates.rear[0], spec.plates.rear[1]); car.add(rear);
          // Warm the GPU while the car is still hidden: compile its shader programs and upload its textures now, not on its first visible frame.
          m.traverse((o) => { if (!o.isMesh || !o.material) return; for (const mt of (Array.isArray(o.material) ? o.material : [o.material])) for (const key of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap']) if (mt[key]) renderer.initTexture(mt[key]); });
          renderer.compileAsync(car, camera, scene).catch(() => {});
          car.userData.ready = true;
        } }));
        car.userData.tint = color => car.userData.paints.forEach(m => m.color.setHex(color));
        return car;
      };
      // Each lane keeps one instance per model and shows one at a time; models load in sequence so the first car appears quickly.
      const lane = (x, yaw, first, plateMat) => {
        const g = new T.Group(); g.position.x = x; g.rotation.y = yaw; g.userData.fleet = []; g.userData.active = 0; g.userData.wheels = [];
        VEHICLES.forEach((_, i) => {
          const spec = VEHICLES[(i + first) % VEHICLES.length];
          const build = () => { const car = makeCar(spec, PALETTE[(i * 3 + first) % PALETTE.length], plateMat); car.visible = i === 0; g.userData.fleet[i] = car; g.add(car); if (i === 0) { g.userData.wheels = car.userData.wheels; g.userData.vehicle = spec.name; g.userData.colour = COLOURS[PALETTE[(i * 3 + first) % PALETTE.length]] || ['', '']; } };
          if (i === 0) build(); else setTimeout(build, 2500 + i * 1800);
        });
        g.userData.show = (loop, hex) => {
          const f = g.userData.fleet, want = loop % VEHICLES.length, pick = f[want] && f[want].userData.ready ? want : g.userData.active;
          f.forEach((c, k) => { if (c) c.visible = k === pick; }); g.userData.active = pick; g.userData.wheels = f[pick].userData.wheels; g.userData.vehicle = VEHICLES[(pick + first) % VEHICLES.length].name; g.userData.colour = COLOURS[hex] || ['', '']; f[pick].userData.tint(hex);
        };
        return g;
      };
      const carX = lane(LANE_X, 0, 0, M.plate); scene.add(carX); el.lastLoopX = -1; el.lastLoopE = -1;
      const carE = lane(LANE_E, Math.PI, 2, M.plateE); scene.add(carE);
      el.lanes = [carX, carE];
      // A few parked cars in the background bays: clones of models already loaded (no extra download), no shadow maps.
      // [side, bay index, model, colour, nose-in]
      const PARKED = [[-1, 1, 2, 0x6f7480, true], [-1, 5, 0, 0x2b2d33, true], [1, 3, 2, 0xd9dce2, false], [1, 8, 2, 0x7a1f1f, true], [-1, 11, 2, 0x1f2a44, true]];
      PARKED.forEach(([side, i, model, hex, noseIn], k) => setTimeout(() => { const car = makeCar(VEHICLES[model], hex, M.plateE, false); car.position.set(side * 10.85, 0, -15.45 - i * 2.9); car.rotation.y = (side > 0) === noseIn ? Math.PI / 2 : -Math.PI / 2; scene.add(car); }, 9500 + k * 700));

      // ---------- scan planes
      const mkScan = (x) => { const s = new T.Mesh(new T.PlaneGeometry(2.4, 1.6), M.scan.clone()); s.position.set(x, 0.8, 0); scene.add(s); const l = new T.PointLight(0x7a80ff, 0, 6, 2); l.position.set(x, 1.4, 0); scene.add(l); return { s, l }; };
      const scanX = mkScan(LANE_X), scanE = mkScan(LANE_E);

      // ---------- lights
      scene.add(new T.HemisphereLight(0xb9c9ed, 0x15121d, 0.65));
      const sun = new T.DirectionalLight(0xffeee0, 1.6); sun.position.set(-7, 11, 7); sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 2, far: 34 }); sun.shadow.bias = -0.00008; sun.shadow.normalBias = 0.018; sun.shadow.radius = 3; scene.add(sun);
      const fill = new T.DirectionalLight(0x6b70c0, 0.45); fill.position.set(6, 4, -4); scene.add(fill);
      const edge = new T.DirectionalLight(0xffc69c, 0.65); edge.position.set(3, 6, -8); scene.add(edge);
      const lamp = new T.PointLight(0xdfe4ff, 7, 16, 1.6); lamp.position.set(0, 4.4, -1.5); scene.add(lamp);

      // Single forward pass: avoid multi-pass AO and multisampled half-float targets.
      const resize = () => { const w = el.clientWidth || 1, h = el.clientHeight || 1; renderer.setPixelRatio(Math.min(devicePixelRatio || 1, w < 600 ? 1 : 1.25)); renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); el.aspect = w / h; if (el.composer) { el.composer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.25)); el.composer.setSize(w,h); el.aoPass.enabled = w >= 760; } refreshStatic(); };
      resize(); this.ro = new ResizeObserver(resize); this.ro.observe(el);
      this.io = new IntersectionObserver((e) => { el.visible = e[0].isIntersecting; el.syncPlayback?.(); }, { threshold: 0.02 }); this.io.observe(el);

      const setPhase = (p) => { if (p !== el.phase) { el.phase = p; el.emit(p); } };
      const phaseAt = (K, t) => { for (const k in K) if (t >= K[k][0] && t < K[k][1]) return k; return 'idle'; };
      const seg = (K, t, k) => (t - K[k][0]) / (K[k][1] - K[k][0]);
      const setLed = (m, hex, i) => { m.color.setHex(hex); m.emissive.setHex(hex); m.emissiveIntensity = i; };
      const setScreen = (hex, i) => { M.screen.color.setHex(hex); M.screen.emissive.setHex(hex); M.screen.emissiveIntensity = i; };
      const scanPass = (sc, s, laneStop) => { const tri = s < 0.5 ? s * 2 : 2 - s * 2; const z = laneStop + 2.2 - 4.4 * tri; const a = 0.3 * Math.sin(Math.PI * s); sc.s.position.z = z; sc.s.material.opacity = a; sc.s.visible = false; sc.l.intensity = 0; sc.l.position.z = z; };

      const axle=new T.Vector3(1,0,0),spin=new T.Quaternion();
      const applyFrame = (T0) => {
        const initP = clamp(T0 / INIT);
        const tc = T0 < INIT ? -1 : (T0 - INIT) % CYCLE; const hgsRun = tc >= LOOP_X; const K = hgsRun ? KH : KX; const t = tc < 0 ? -1 : hgsRun ? tc - LOOP_X : tc;
        const ph = T0 < INIT ? 'init' : phaseAt(K, t); el.scenario = hgsRun ? 'hgs' : 'card';
        // ---- exit lane
        let cz = -28, arm = 0, glow = 0, led = 0xe0a23a, ledI = 1.2 + Math.sin(T0 * 6) * 0.6, scr = [0x2a30c0, 0.9], nfcI = 0;
        scanX.s.visible = false; scanX.l.intensity = 0;
        if (ph !== 'init' && hgsRun) {
          // Free flow: the car only slows down; the tag is read and charged while it creeps, the arm is up before the nose reaches it.
          const creep = (from, to, k) => from + (to - from) * seg(K, t, k);
          if (ph === 'approach') { const s = seg(K, t, 'approach'); cz = -28 + (28 + STOP_X - 1.2) * (1 - Math.pow(1 - s, 2)); }
          else if (ph === 'scan') { cz = creep(STOP_X - 1.2, STOP_X - .8, 'scan'); scanPass(scanX, seg(K, t, 'scan'), cz + 2.4); glow = 0.8 * Math.sin(Math.PI * seg(K, t, 'scan')); led = 0x7a80ff; ledI = 1 + Math.sin(T0 * 22); }
          else if (ph === 'hgs_ok') { cz = creep(STOP_X - .8, STOP_X - .1, 'hgs_ok'); glow = 0.6; led = 0x3fd9a0; ledI = 2.2; scr = [0x3fd9a0, 1.6]; }
          else if (ph === 'access') { cz = creep(STOP_X - .1, STOP_X + .8, 'access'); arm = easeIO(seg(K, t, 'access')); led = 0x3fd9a0; ledI = 2.2; scr = [0x3fd9a0, 1.4]; }
          else if (ph === 'flow') { const s = seg(K, t, 'flow'); cz = STOP_X + .8 + 34 * Math.pow(s, 1.5); arm = 1 - easeIO(clamp((cz - 2.5) / 9)); led = arm > .5 ? 0x3fd9a0 : 0xe0a23a; ledI = 2; scr = [0x3fd9a0, 1.0]; }
          else if (ph === 'close') { cz = 44; arm = 0; led = 0xe0a23a; ledI = 1.6; }
          else { cz = -28; led = 0xe0a23a; ledI = 1.4 + Math.sin(T0 * 3) * 0.4; const li = Math.floor((T0 - INIT) / CYCLE) * 2 + 1; if (li !== el.lastLoopX) { el.lastLoopX = li; carX.userData.show(li, PALETTE[(li * 3 + 1) % PALETTE.length]); } }
        } else if (ph !== 'init') {
          if (ph === 'approach') cz = -28 + (28 + STOP_X) * easeOut(seg(KX, t, 'approach'));
          else if (ph === 'scan') { cz = STOP_X; scanPass(scanX, seg(KX, t, 'scan'), STOP_X + 2.4); glow = 0.8 * Math.sin(Math.PI * seg(KX, t, 'scan')); led = 0x7a80ff; ledI = 1 + Math.sin(T0 * 22); }
          else if (ph === 'hgs') { cz = STOP_X; glow = 0.6; led = 0x7a80ff; ledI = 1.2 + Math.sin(T0 * 10) * 0.8; scr = [0x3a41e0, 1.1]; }
          else if (ph === 'hgs_fail') { cz = STOP_X; led = 0xe0533a; ledI = 1.4 + Math.sin(T0 * 18) * 1.2; scr = [0xe0a23a, 1.4]; }
          else if (ph === 'pay') { cz = STOP_X; const s = seg(KX, t, 'pay'); led = 0xe0a23a; ledI = 1.6; scr = [0xe0a23a, 1.4]; nfcI = s > 0.55 ? 1.6 + Math.sin(T0 * 14) * 0.8 : 0; }
          else if (ph === 'pay_ok') { cz = STOP_X; led = 0x3fd9a0; ledI = 2.2; scr = [0x3fd9a0, 1.6]; nfcI = 2; }
          else if (ph === 'access') { cz = STOP_X; arm = easeIO(seg(KX, t, 'access')); led = 0x3fd9a0; ledI = 2.2; scr = [0x3fd9a0, 1.4]; }
          else if (ph === 'flow') { const s = seg(KX, t, 'flow'); cz = STOP_X + 34 * Math.pow(s, 1.6); arm = 1 - easeIO(clamp((cz - 2.5) / 9)); led = arm > .5 ? 0x3fd9a0 : 0xe0a23a; ledI = 2; scr = [0x3fd9a0, 1.0]; } // the arm drops once the tail clears it
          else if (ph === 'close') { cz = 44; arm = 0; led = 0xe0a23a; ledI = 1.6; }
          else { cz = -28; led = 0xe0a23a; ledI = 1.4 + Math.sin(T0 * 3) * 0.4; const li = Math.floor((T0 - INIT) / CYCLE) * 2; if (li !== el.lastLoopX) { el.lastLoopX = li; carX.userData.show(li, PALETTE[(li * 3 + 1) % PALETTE.length]); } }
        }
        const travelX = cz - carX.position.z;
        if (Math.abs(travelX) < 4) for (const wheel of carX.userData.wheels) wheel.quaternion.premultiply(spin.setFromAxisAngle(axle, travelX / 0.34));
        carX.position.z = cz; carX.visible = cz > -27.5 && cz < 36;
        gateX.hinge.rotation.z = gateX.dir * arm * (Math.PI / 2) * 0.98;
        setLed(M.ledX, led, ledI); setScreen(scr[0], scr[1]); M.nfc.emissiveIntensity = nfcI;
        ledDisplays.exit?.set(ph === 'scan' ? [PLATE, 'PLAKA OKUNDU'] : ph === 'hgs_ok' ? [PLATE, 'HGS ÖDENDİ ₺150,00'] : ph === 'hgs' ? [PLATE, 'HGS SORGULANIYOR'] : ph === 'hgs_fail' ? [PLATE, 'HGS YETERSİZ · KİOSK'] : ph === 'pay' ? [PLATE, 'ÜCRET ₺150,00'] : ph === 'pay_ok' || ph === 'access' ? [PLATE, 'ÖDENDİ ₺150,00'] : ph === 'flow' ? ['ÖDENDİ', 'İYİ YOLCULUKLAR'] : ['ÇIKIŞ', 'HAZIR']);
        M.plate.emissiveIntensity = glow * 0.55; M.brand.emissiveIntensity = 0.45 + glow * 0.8;
        // ---- entry lane (independent loop)
        let ez = 30, earm = 0, eled = 0xe0a23a, eledI = 1.4;
        scanE.s.visible = false; scanE.l.intensity = 0;
        if (ph !== 'init') {
          const te = (T0 - INIT + OFF_E) % LOOP_E; const pe = phaseAt(KE, te);
          if (pe === 'approach') ez = 30 - (30 - STOP_E) * easeOut(seg(KE, te, 'approach'));
          else if (pe === 'scan') { ez = STOP_E; scanPass(scanE, seg(KE, te, 'scan'), STOP_E - 2.4); eled = 0x7a80ff; eledI = 1 + Math.sin(T0 * 22); }
          else if (pe === 'access') { ez = STOP_E; earm = easeIO(seg(KE, te, 'access')); eled = 0x3fd9a0; eledI = 2.2; }
          else if (pe === 'flow') { const s = seg(KE, te, 'flow'); ez = STOP_E - 34 * Math.pow(s, 1.5); earm = 1 - easeIO(clamp((-6.6 - ez) / 9)); eled = earm > .5 ? 0x3fd9a0 : 0xe0a23a; eledI = 2; }
          else if (pe === 'close') { ez = -40; earm = 0; }
          else { ez = 30; const le = Math.floor((T0 - INIT - OFF_E) / LOOP_E); if (le !== el.lastLoopE) { el.lastLoopE = le; carE.userData.show(le, PALETTE[(le * 3 + 2) % PALETTE.length]); } }
        }
        const travelE=ez-carE.position.z;
        if(Math.abs(travelE)<4)for(const wheel of carE.userData.wheels)wheel.quaternion.premultiply(spin.setFromAxisAngle(axle,-travelE/.34));
        carE.position.z = ez; carE.visible = ez < 29.5 && ez > -34;
        gateE.hinge.rotation.z = gateE.dir * earm * (Math.PI / 2) * 0.98;
        setLed(M.ledE, eled, eledI);
        { const pe = ph === 'init' ? 'idle' : phaseAt(KE, (T0 - INIT + OFF_E) % LOOP_E); ledDisplays.entry?.set(pe === 'scan' ? [PLATE_E, 'PLAKA OKUNDU'] : pe === 'access' || pe === 'flow' ? [PLATE_E, 'HOŞ GELDİNİZ'] : ['GİRİŞ', 'HOŞ GELDİNİZ']); }
        // ---- viewer camera: starts further back on the front-left, sweeps 140° in a 60 s round trip; a drag steers it and the sweep folds back in 3 s after release.
        const far = el.aspect < 1 ? 1.75 : el.aspect < 1.4 ? 1.3 : 1;
        const dt = Math.max(0, Math.min(T0 - (el.prevT0 ?? T0), .1)); el.prevT0 = T0;
        const cam = el.cam || (el.cam = { phase: 0, yaw: 0, pitch: 0, steering: false });
        const SWEEP = 140 * Math.PI / 180, START = -18 * Math.PI / 180, PERIOD = 60;
        const auto = SWEEP * (1 - Math.cos(cam.phase)) / 2;
        const st = el.steer; const steering = !this.reduced && !!st && (st.active || (T0 - st.at) < 3);
        if (steering) {
          const k = 1 - Math.exp(-dt * 9);
          cam.yaw += (Math.max(-auto, Math.min(SWEEP - auto, st.yaw)) - cam.yaw) * k; cam.pitch += (Math.max(-1.2, Math.min(2.2, st.pitch)) - cam.pitch) * k; cam.steering = true;
        } else {
          if (cam.steering) {
            // Fold the steered angle into the sweep so the orbit carries on from where the viewer left it.
            const theta = Math.max(0, Math.min(SWEEP, auto + cam.yaw));
            const p0 = Math.acos(Math.max(-1, Math.min(1, 1 - 2 * theta / SWEEP)));
            cam.phase = Math.sin(cam.phase) >= 0 ? p0 : Math.PI * 2 - p0; cam.yaw = 0; cam.steering = false;
          }
          cam.pitch += (0 - cam.pitch) * (1 - Math.exp(-dt * .5));
          if (!this.reduced) cam.phase += dt * Math.PI * 2 / PERIOD;
        }
        const orbit = START + (this.reduced ? 0 : SWEEP * (1 - Math.cos(cam.phase)) / 2 + cam.yaw);
        const focusX=-3.6+1.2*(far-1),focusZ=-2,dx=(-10.6*far)-focusX,dz=12.9*far-focusZ;
        el.zoom=(el.zoom||1)+((el.zoomTarget||1)-(el.zoom||1))*(1-Math.exp(-dt*10)); const zf=el.zoom;
        camera.position.set(focusX+(dx*Math.cos(orbit)+dz*Math.sin(orbit))*zf,(5.6+cam.pitch)*far*zf,focusZ+(-dx*Math.sin(orbit)+dz*Math.cos(orbit))*zf);
        camera.lookAt(focusX,(el.clientWidth<600?.65:-.15)+.4*(1-initP)-cam.pitch*.35,focusZ);
        el.sceneTime=T0;
        renderer.render(scene, camera);
        if(Math.floor(T0)!==el.statsSecond){el.statsSecond=Math.floor(T0);el.dataset.orbitDegrees=String(Math.round(orbit*180/Math.PI));el.dataset.drawCalls=String(renderer.info.render.calls);el.dataset.triangles=String(renderer.info.render.triangles);}
        return ph;
      };

      this.canvas.style.opacity = '1';
      this.dataset.quality='forward-paced';
      this.renderCurrent=()=>applyFrame(this.sceneTime||0);
      this.renderStatic = () => applyFrame(INIT + KX.access[1] - 0.01);
      if (this.reduced) {
        this.renderStatic(); setPhase('static'); return;
      }
      // Frame pacing: render on a fixed cadence of display ticks (visiosoft2: ~30 fps cap — every 2nd tick at 60 Hz, every 4th at 120 Hz) rather than a wall-clock
      // threshold, which alternated between 2- and 3-tick gaps and made the camera sweep stutter. Heavy frames step down to half rate.
      let elapsed = 0, previous = performance.now(), ticks = 0, skip = 0, cost = 0, gap = 16.7;
      const tick = now => {el.raf=0;if(!el.visible||document.hidden||el.userPaused)return;const delta=Math.min((now-previous)/1000,.1);gap+=((now-previous)-gap)*.1;previous=now;elapsed+=delta;ticks++;
        if(ticks%(skip+1)===0){const t0=performance.now();setPhase(applyFrame(elapsed));cost+=(performance.now()-t0-cost)*.05;const budget=gap*(skip+1);const minSkip=Math.max(0,Math.round(33.3/gap)-1);if(cost>budget*.75&&skip<minSkip+2)skip++;else if(cost<budget*.3&&skip>minSkip)skip--;if(skip<minSkip)skip=minSkip;el.dataset.frameSkip=String(skip);}
        el.raf=requestAnimationFrame(tick);};
      this.syncPlayback=()=>{const running=el.visible&&!document.hidden&&!el.userPaused;el.dataset.playback=running?'running':'paused';if(el.visible&&!document.hidden&&!el.userPaused){if(!el.raf){previous=performance.now();el.raf=requestAnimationFrame(tick);}}else{cancelAnimationFrame(el.raf);el.raf=0;}};
      this.visibilityHandler=()=>this.syncPlayback();document.addEventListener('visibilitychange',this.visibilityHandler);setPhase('init');this.syncPlayback();

    }
  }
  if (!customElements.get('vs-gate-scene')) customElements.define('vs-gate-scene', VsGateScene);
})();
