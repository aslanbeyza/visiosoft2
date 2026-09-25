import type { GalleryProductId } from './productGalleryCopy.ts'

type Vec3 = [number, number, number]

/**
 * Where a point's marker sits. `part` is a material name, or a mesh name where parts share
 * a material; `at` is a fraction of that mesh's own bounding box and `dir` the face the
 * point is on, both in the mesh's space, so the marker rides the model as it turns.
 */
export type GalleryAnchor = { id: string; part: string; at: Vec3; dir: Vec3 }

/** Camera pose for a point: a direction from the model's centre, the look-at target and an optional distance scale. */
export type GalleryFocus = { dir: Vec3; tgt: Vec3; r?: number }

export type GalleryModel = {
  src: string
  /** Largest dimension after normalising; a nudge for shapes whose largest side flatters them. */
  fit: number
  /** Keep two-triangle meshes: this model's decals are planes and it has no ground plane to drop. */
  keepPlanes?: boolean
  /** The model's own door clip, opened once the reader reaches `openFrom` and shut before it. */
  door?: { clip: string; openFrom: string }
  anchors: GalleryAnchor[]
  focus: Record<string, GalleryFocus>
}

/*
 * Ported from the LENS page (visiosoft-desing, lens/film/stage.js). Every direction there was
 * measured off the models in place: the parts come out of SolidWorks by way of Blender and
 * do not share an axis convention, so change a value only while looking at the model.
 */
export const galleryModels: Record<GalleryProductId, GalleryModel> = {
  rackkabin: {
    src: '/models/gallery/rack-kabin.glb',
    fit: 0.82,
    door: { clip: 'KapakAcilis', openFrom: 'nano' },
    anchors: [
      { id: 'door', part: 'LockChrome', at: [0.5, 0.5, 0.5], dir: [1, 0, 0] },
      { id: 'vent', part: 'LouverAluminium', at: [0.5, 0.5, 0.5], dir: [1, 0.15, 0] },
      { id: 'body', part: 'DKP', at: [0.5, 0.08, 0.95], dir: [1, -0.15, 0] },
      { id: 'nano', part: 'JON_FanBlack', at: [0.5, 1, 0.5], dir: [0, 1, -0.35] },
      { id: 'modem', part: 'OrangePlastic', at: [0.5, 0.5, 0.5], dir: [1, 0.35, 0] },
      { id: 'poe', part: 'PoESwitchBody', at: [0.5, 0.7, 0.9], dir: [1, 0, -0.3] },
      { id: 'relay', part: 'RelayBlue', at: [0.5, 0.9, 0.5], dir: [0.8, 0.6, 0] },
    ],
    // outside points look at the door's face; inside ones are squarer on and closer (`r`)
    focus: {
      door: { dir: [0.34, 0.16, 0.93], tgt: [0, 0.05, 0] },
      vent: { dir: [0.88, 0.26, 0.4], tgt: [0, 0.12, 0] },
      body: { dir: [0.42, 0.08, 0.9], tgt: [0, -0.18, 0] },
      nano: { dir: [0.06, 0.5, 0.86], tgt: [0, -0.04, 0], r: 0.74 },
      modem: { dir: [0.1, 0.28, 0.95], tgt: [0, 0.02, 0], r: 0.76 },
      poe: { dir: [0.08, 0.2, 0.98], tgt: [0, -0.08, 0], r: 0.76 },
      relay: { dir: [0.05, 0.44, 0.9], tgt: [0, 0.02, 0], r: 0.72 },
    },
  },
  kiosk: {
    src: '/models/gallery/kiosk.glb',
    fit: 1,
    anchors: [
      { id: 'screen', part: 'pleksi1', at: [0.5, 0.5, 0.5], dir: [0, 0.1, 1] },
      { id: 'pos', part: 'PICO_PAY.004', at: [0.5, 0.5, 0.5], dir: [0, 0.2, 1] },
      { id: 'voice', part: 'PaletteMaterial001', at: [0.5, 0.84, 0.92], dir: [0, 0.2, 1] },
      { id: 'relay', part: 'PaletteMaterial001', at: [0.5, 0.15, 0.95], dir: [0, 0, 1] },
    ],
    focus: {
      screen: { dir: [0.2, 0.25, 0.95], tgt: [0, 0.14, 0.1] },
      pos: { dir: [0.5, 0.2, 0.84], tgt: [0, -0.05, 0.1] },
      voice: { dir: [0.3, 0.45, 0.84], tgt: [0, 0.3, 0.1] },
      relay: { dir: [0.35, 0.1, 0.93], tgt: [0, -0.22, 0.1] },
    },
  },
  // Parts share a handful of materials, so anchors name the meshes. The model faces −Z in its
  // own space (its root turns it to +Z), so a face-on `dir` here is −Z.
  kamerastandi: {
    src: '/models/gallery/kamera-standi.glb',
    fit: 0.8,
    keepPlanes: true,
    anchors: [
      { id: 'anpr', part: 'Cam_L_Lens', at: [0.5, 0.5, 1], dir: [0, 0, 1] },
      { id: 'bracket', part: 'Bracket_Clamp', at: [0.5, 0.5, 0], dir: [0, 0.3, -1] },
      { id: 'ir', part: 'IR_Face', at: [0.5, 0.5, 0.5], dir: [0, 0, -1] },
      { id: 'led', part: 'LED_Face', at: [0.5, 0.5, 0.5], dir: [0, 0, -1] },
      { id: 'canopy', part: 'Stand_Canopy', at: [0.5, 1, 0.5], dir: [0, 1, -0.4] },
      { id: 'pole', part: 'Stand_Pole', at: [0, 0.6, 0.5], dir: [-1, 0, -0.3] },
      { id: 'base', part: 'Brand_Plinth', at: [0.5, 0.5, 0.5], dir: [0, 1, 0] },
    ],
    focus: {
      anpr: { dir: [0.35, 0.3, 0.89], tgt: [0.04, 0.24, 0.08], r: 0.88 },
      bracket: { dir: [0.5, 0.45, 0.74], tgt: [0, 0.24, -0.04] },
      ir: { dir: [0.2, 0.2, 0.96], tgt: [0, 0.22, 0], r: 0.82 },
      led: { dir: [0.25, 0.1, 0.96], tgt: [0, 0.07, -0.02], r: 0.85 },
      canopy: { dir: [0.4, 0.6, 0.69], tgt: [0, 0.34, -0.06] },
      pole: { dir: [0.55, 0.15, 0.82], tgt: [0, 0.04, -0.08] },
      base: { dir: [0.3, -0.05, 0.95], tgt: [0, -0.24, -0.04], r: 0.9 },
    },
  },
  camera: {
    src: '/models/gallery/camera.glb',
    fit: 0.85,
    anchors: [
      { id: 'lens', part: 'M_camera', at: [0.5, 0.5, 0.98], dir: [0, 0, 1] },
      { id: 'ir', part: 'M_camera', at: [0.5, 0.85, 0.9], dir: [0, 0.4, 0.9] },
      { id: 'housing', part: 'M_camera', at: [0.5, 0.98, 0.45], dir: [0, 1, 0] },
      { id: 'net', part: 'M_camera', at: [0.5, 0.4, 0.02], dir: [0, 0, -1] },
    ],
    focus: {
      lens: { dir: [0.35, 0.25, 0.9], tgt: [0, 0, 0.2] },
      ir: { dir: [0.2, 0.55, 0.81], tgt: [0, 0.1, 0.2] },
      housing: { dir: [0.4, 0.85, 0.35], tgt: [0, 0.05, 0] },
      net: { dir: [-0.5, 0.35, -0.79], tgt: [0, 0, -0.2] },
    },
  },
}
