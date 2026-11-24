import * as THREE from "three";
import { buildAtoms, RISE, TWIST } from "./bdna";

export interface Pose {
  /** Angstroms from the top to the bottom of the canvas. */
  span: number;
  /** 0 runs the helix left to right. -PI/2 runs it top to bottom. */
  angle: number;
  /** Where the marked pair sits, as a fraction of the canvas from its center. Positive is right and down. */
  x: number;
  y: number;
}
export interface Site { key: string; seq: string; focus: number; alt?: string }
export interface Look { ground: string; outline: string; slots: [string, string, string, string, string, string]; mark: string; markAlt: string }

export const LOOK: Look = {
  ground: "#f6b9c5", outline: "#2a1038",
  slots: ["#5b2c93", "#b91f52", "#fff3dc", "#f48fa8", "#a987d6", "#ff8d5c"],
  mark: "#ffd21f", markAlt: "#35cfa6",
};

const VERT = /* glsl */ `
in vec3 position;
in vec3 center; in float radius; in float slot; in float pair; in float flags;
uniform mat4 modelViewMatrix, projectionMatrix;
uniform float uFocus, uAlt, uLens, uGrow, uMark;
uniform vec3 uSlots[6]; uniform vec3 uMarkColor, uMarkAlt; uniform vec2 uWindow;
out vec3 vView, vCenter, vColor; out float vR, vId;
void main(){
  float strand = mod(flags, 2.);
  float bb = mod(floor(flags/2.), 2.);
  float when = floor(flags/4.);
  float r = radius;
  if(when==1.) r *= uAlt;
  if(when==2.) r *= 1.-uAlt;
  float near = 1.-smoothstep(1.2, 3.2, abs(pair-uFocus));
  r *= mix(1., bb>.5 ? .62 : 1., near*uLens);
  r *= uGrow;
  if(pair<uWindow.x || pair>uWindow.y) r = 0.;
  vec4 c = modelViewMatrix*vec4(center,1.);
  vCenter = c.xyz; vR = r;
  bool marked = abs(pair-uMark)<.5 && bb<.5;
  vColor = marked ? (when==1. ? uMarkAlt : uMarkColor) : uSlots[int(slot+.5)];
  vId = mod(pair*4.+strand*2.+bb, 251.)/255. + 1./255.;
  if(r<.02){ gl_Position = vec4(2.,2.,2.,1.); return; }
  float d = length(c.xyz);
  float k = d/sqrt(max(d*d-r*r,.01));
  vView = c.xyz + vec3(position.xy*r*k*1.04, 0.) + normalize(-c.xyz)*0.;
  gl_Position = projectionMatrix*vec4(vView,1.);
}`;

const FRAG = /* glsl */ `
precision highp float;
in vec3 vView, vCenter, vColor; in float vR, vId;
uniform mat4 projectionMatrix;
layout(location=0) out vec4 oColor;
layout(location=1) out vec4 oId;
void main(){
  vec3 rd = normalize(vView);
  float b = dot(rd, vCenter);
  float h = b*b - (dot(vCenter,vCenter) - vR*vR);
  if(h<0.) discard;
  vec3 p = rd*(b-sqrt(h));
  vec3 n = (p-vCenter)/vR;
  vec4 clip = projectionMatrix*vec4(p,1.);
  gl_FragDepth = clip.z/clip.w*.5+.5;
  float l = dot(n, normalize(vec3(-.42,.72,.62)))*.5+.5;
  float band = mix(.80, 1.0, smoothstep(.30,.42,l)) + .07*smoothstep(.80,.86,l);
  oColor = vec4(vColor*band, 1.);
  oId = vec4(vId, n.xy*.5+.5, 1.);
}`;

const POST = /* glsl */ `
precision highp float;
uniform sampler2D tColor, tId, tDepth;
uniform vec2 uPx; uniform float uNear, uFar, uDist, uScale;
uniform vec3 uGround, uOutline;
in vec2 vUv; out vec4 o;
float z(vec2 u){ float d=texture(tDepth,u).r; if(d>=1.) return 1e4; return uNear*uFar/(uFar-d*(uFar-uNear)); }
float h(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); }
void main(){
  vec4 c = texture(tColor,vUv);
  float z0 = z(vUv);
  bool bg = z0>9e3;
  float edge=0., line=0.;
  float id0 = texture(tId,vUv).r;
  // Silhouettes get a heavy line, and neighboring residues a thin one.
  for(int i=0;i<8;i++){
    float a=float(i)*.785398;
    vec2 dir=vec2(cos(a),sin(a));
    float zo=z(vUv+dir*uPx*1.9*uScale);
    edge+=smoothstep(2.6,5.0, abs(zo-z0)>9e3 ? 9. : zo-z0);
    if(bg && zo<9e3) edge+=1.;
    float zi=z(vUv+dir*uPx*.9*uScale);
    float idn=texture(tId,vUv+dir*uPx*.9*uScale).r;
    if(!bg && zi<9e3 && abs(idn-id0)>.002 && zi>=z0) line+=.4;
  }
  edge=clamp(edge/2.6,0.,1.); line=min(line,.85);
  vec3 col = bg ? uGround : c.rgb;
  if(!bg){
    float occ=0., ang=h(gl_FragCoord.xy)*6.283;
    for(int i=0;i<20;i++){
      float f=(float(i)+.5)/20.; float a=ang+float(i)*2.39996;
      float zs=z(vUv+vec2(cos(a),sin(a))*uPx*uScale*(3.+44.*f));
      float dz=z0-zs;
      occ+=smoothstep(.25,2.5,dz)*(1.-smoothstep(9.,26.,dz))*(1.15-f*.6);
    }
    occ=clamp(occ/15.,0.,1.);
    vec3 sh=mix(col*col*.9, uOutline, .42);
    col=mix(col, sh, occ*.82);
    float fog=smoothstep(-2.,20., z0-uDist);
    col=mix(col,uGround,fog*.42);
    col=mix(col,uOutline,line*.62);
  }
  col=mix(col,uOutline,edge*(bg?1.:.95));
  o=vec4(pow(max(col,0.),vec3(1./2.2)),1.);
}`;

const lin = (hex: string) => { const c = new THREE.Color(); c.set(hex); return new THREE.Vector3(Math.pow(parseInt(hex.slice(1, 3), 16) / 255, 2.2), Math.pow(parseInt(hex.slice(3, 5), 16) / 255, 2.2), Math.pow(parseInt(hex.slice(5, 7), 16) / 255, 2.2)); };
const ease = (a: number, b: number, rate: number, dt: number) => a + (b - a) * (1 - Math.exp(-rate * dt));
const FOV = 17;

export class Molecule {
  readonly renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private cam = new THREE.PerspectiveCamera(FOV, 1, 1, 1000);
  private axis = new THREE.Group();
  private spinner = new THREE.Group();
  private mesh: THREE.Mesh | null = null;
  private mat: THREE.RawShaderMaterial;
  private post: THREE.RawShaderMaterial;
  private screen = new THREE.Scene();
  private flat = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private rt: THREE.WebGLRenderTarget;
  private raf = 0;
  private last = 0;
  private slow = 0;
  private ratio: number;
  private w = 2; private h = 2;

  pose: Pose;
  private goal: Pose;
  private site: Site | null = null;
  private next: Site | null = null;
  /** Position along the sequence, in base pairs. */
  private at = 0;
  private vel = 0;
  private alt = 0; private altGoal = 0;
  private spin = 0; private spinVel = 0; private held = false;
  private grow = 0;
  still = false;
  visible = true;
  /** Called after each drawn frame with the marked pair's position in CSS pixels. */
  onFrame?: (p: { x: number; y: number; settled: boolean }) => void;

  constructor(private canvas: HTMLCanvasElement, pose: Pose, private look: Look = LOOK) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.pose = { ...pose }; this.goal = { ...pose };
    this.ratio = Math.min(2, Math.max(1.5, window.devicePixelRatio || 1));
    this.rt = new THREE.WebGLRenderTarget(2, 2, { count: 2, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, depthTexture: new THREE.DepthTexture(2, 2, THREE.UnsignedIntType) });
    this.mat = new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3, vertexShader: VERT, fragmentShader: FRAG,
      uniforms: {
        uFocus: { value: 0 }, uMark: { value: -99 }, uAlt: { value: 0 }, uLens: { value: 1 }, uGrow: { value: 0 }, uWindow: { value: new THREE.Vector2(-1e3, 1e3) },
        uSlots: { value: look.slots.map(lin) }, uMarkColor: { value: lin(look.mark) }, uMarkAlt: { value: lin(look.markAlt) },
      },
    });
    this.post = new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3, depthTest: false, depthWrite: false,
      vertexShader: "in vec3 position; out vec2 vUv; void main(){ vUv=position.xy*.5+.5; gl_Position=vec4(position.xy,0.,1.); }",
      fragmentShader: POST,
      uniforms: {
        tColor: { value: this.rt.textures[0] }, tId: { value: this.rt.textures[1] }, tDepth: { value: this.rt.depthTexture },
        uPx: { value: new THREE.Vector2() }, uNear: { value: 1 }, uFar: { value: 2 }, uDist: { value: 1 }, uScale: { value: 1 },
        uGround: { value: lin(look.ground) }, uOutline: { value: lin(look.outline) },
      },
    });
    const tri = new THREE.BufferGeometry();
    tri.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));
    const quad = new THREE.Mesh(tri, this.post); quad.frustumCulled = false;
    this.screen.add(quad);
    this.axis.add(this.spinner); this.scene.add(this.axis);
    this.raf = requestAnimationFrame(this.tick);
  }

  setPose(p: Partial<Pose>, now = false) { Object.assign(this.goal, p); if (now) Object.assign(this.pose, p); }
  setAlt(on: boolean) { this.altGoal = on ? 1 : 0; if (this.still) this.alt = this.altGoal; }

  go(site: Site, alt = false) {
    this.altGoal = alt ? 1 : 0;
    if (!this.site) { this.load(site); this.at = site.focus; this.alt = this.altGoal; return; }
    if (site.key === this.site.key) { this.next = null; return; }
    if (this.still) { this.load(site); this.at = site.focus; this.alt = this.altGoal; return; }
    this.next = site;
  }

  press(on: boolean) { this.held = on; }
  turn(radians: number) { this.spin += radians; this.spinVel = radians * 40; }

  private load(site: Site) {
    this.site = site; this.next = null;
    const atoms = buildAtoms(site.seq, site.focus, site.alt), n = atoms.length;
    const center = new Float32Array(n * 3), radius = new Float32Array(n), slot = new Float32Array(n), pair = new Float32Array(n), flags = new Float32Array(n);
    atoms.forEach((a, i) => {
      center.set([a.x, a.y, a.z], i * 3);
      radius[i] = a.radius; slot[i] = a.slot; pair[i] = a.pair;
      flags[i] = a.strand + (a.backbone ? 2 : 0) + (a.when === 1 ? 4 : a.when === -1 ? 8 : 0);
    });
    const g = new THREE.InstancedBufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0]), 3));
    g.setIndex([0, 1, 2, 0, 2, 3]);
    g.setAttribute("center", new THREE.InstancedBufferAttribute(center, 3));
    for (const [k, v] of [["radius", radius], ["slot", slot], ["pair", pair], ["flags", flags]] as const) g.setAttribute(k, new THREE.InstancedBufferAttribute(v, 1));
    g.instanceCount = n;
    if (this.mesh) { this.mesh.geometry.dispose(); this.mesh.geometry = g; }
    else { this.mesh = new THREE.Mesh(g, this.mat); this.mesh.frustumCulled = false; this.spinner.add(this.mesh); }
    this.mat.uniforms.uMark.value = site.focus;
  }

  private size() {
    const r = this.canvas.getBoundingClientRect(), w = Math.max(2, Math.round(r.width)), h = Math.max(2, Math.round(r.height));
    const W = Math.round(w * this.ratio), H = Math.round(h * this.ratio);
    if (W === this.rt.width && H === this.rt.height) return;
    this.w = w; this.h = h;
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(W, H, false);
    this.rt.setSize(W, H);
    this.cam.aspect = W / H;
    this.post.uniforms.uPx.value.set(1 / W, 1 / H);
    this.post.uniforms.uScale.value = this.ratio;
  }

  private tick = (now: number) => {
    this.raf = requestAnimationFrame(this.tick);
    if (!this.visible || !this.site) { this.last = now; return; }
    const raw = (now - this.last) / 1000, dt = Math.min(raw, 0.2);
    this.last = now;
    // Drop resolution on machines that cannot keep up.
    this.slow = raw > 0.028 && raw < 0.25 ? this.slow + 1 : Math.max(0, this.slow - 0.5);
    if (this.slow > 45 && this.ratio > 1) { this.ratio = Math.max(1, this.ratio - 0.5); this.slow = 0; }
    this.size();

    const k = this.still ? 1e3 : 3.4, p = this.pose, g = this.goal;
    p.span = ease(p.span, g.span, k, dt); p.angle = ease(p.angle, g.angle, k, dt); p.x = ease(p.x, g.x, k, dt); p.y = ease(p.y, g.y, k, dt);
    this.grow = this.still ? 1 : ease(this.grow, 1, 2.6, dt);
    this.alt = ease(this.alt, this.altGoal, this.still ? 1e3 : 7, dt);

    // Leaving: run off the end of this stretch, then arrive along the next one.
    if (this.next) {
      this.vel = Math.min(this.vel + 190 * dt, 70);
      this.at += this.vel * dt;
      if (this.at > this.site.focus + 11) { const n = this.next; this.load(n); this.at = n.focus - 16; this.alt = this.altGoal; this.vel = 0; }
    } else { this.at = ease(this.at, this.site.focus, this.still ? 1e3 : 3.3, dt); this.vel = 0; }

    if (!this.held) { this.spin += this.spinVel * dt; this.spinVel *= Math.exp(-3.5 * dt); if (Math.abs(this.spinVel) < 0.02) this.spin = ease(this.spin, Math.round(this.spin / (2 * Math.PI)) * 2 * Math.PI, 0.5, dt); }
    const sway = this.still ? 0 : Math.sin(now / 2600) * 0.22;
    this.axis.rotation.set(0, 0, p.angle + 0.0);
    this.spinner.rotation.x = -Math.PI / 2 + 0.55 + sway + this.spin - TWIST * this.at;
    if (this.mesh) this.mesh.position.x = -RISE * this.at;

    const half = Math.tan((FOV * Math.PI) / 360), dist = p.span / 2 / half;
    this.cam.position.set(0, 0, dist); this.cam.near = Math.max(1, dist - 60); this.cam.far = dist + 60;
    this.cam.updateProjectionMatrix();
    // Shift the picture without changing the perspective.
    this.cam.projectionMatrix.elements[8] = -p.x * 2;
    this.cam.projectionMatrix.elements[9] = p.y * 2;
    this.cam.projectionMatrixInverse.copy(this.cam.projectionMatrix).invert();

    const u = this.mat.uniforms, q = this.post.uniforms;
    u.uFocus.value = this.next ? -99 : this.site.focus; u.uAlt.value = this.alt; u.uGrow.value = this.grow;
    u.uLens.value = ease(u.uLens.value, this.next ? 0 : 1, 5, dt);
    q.uNear.value = this.cam.near; q.uFar.value = this.cam.far; q.uDist.value = dist;
    this.renderer.setRenderTarget(this.rt); this.renderer.setClearColor(0x000000, 0); this.renderer.clear(); this.renderer.render(this.scene, this.cam);
    this.renderer.setRenderTarget(null); this.renderer.render(this.screen, this.flat);
    this.onFrame?.({ x: (0.5 + p.x) * this.w, y: (0.5 + p.y) * this.h, settled: !this.next && Math.abs(this.at - this.site.focus) < 0.6 });
  };

  dispose() {
    cancelAnimationFrame(this.raf);
    this.mesh?.geometry.dispose(); this.mat.dispose(); this.post.dispose(); this.rt.dispose(); this.renderer.dispose();
  }
}
