"use client";

import { useEffect, useRef } from "react";

/**
 * A Giemsa-stained blood smear, drawn in a fragment shader.
 * Color is absorbance: each layer of dye removes light, so overlapping cells darken the way they do on glass.
 */
const FRAG = `
precision highp float;
uniform vec2 res; uniform float scale; uniform vec2 pan; uniform float t;
float h1(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
vec2 h2(vec2 p){ float n=h1(p); return vec2(n,h1(p+n+17.1)); }
float vn(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h1(i),h1(i+vec2(1,0)),f.x),mix(h1(i+vec2(0,1)),h1(i+vec2(1,1)),f.x),f.y); }
float fbm(vec2 p){ float a=.5,s=0.; for(int i=0;i<5;i++){ s+=a*vn(p); p=p*2.03+7.1; a*=.5; } return s; }
float smin(float a,float b,float k){ float h=clamp(.5+.5*(b-a)/k,0.,1.); return mix(b,a,h)-k*h*(1.-h); }
const vec3 EOSIN=vec3(.09,.72,.45), GIEMSA=vec3(.86,1.42,.34), CYTO=vec3(.20,.34,.10);

vec2 wp(int i){ return i==0?vec2(0.):i==1?vec2(-5.6,3.1):i==2?vec2(4.9,-4.2):i==3?vec2(6.4,5.3):vec2(-4.7,-6.2); }
float lobes(vec2 q,int i){
  if(i==0){ float d=length(q-vec2(.02,.0))-.40; d=smin(d,length(q-vec2(-.46,.36))-.30,.16); d=smin(d,length(q-vec2(.44,.42))-.30,.16); d=smin(d,length(q-vec2(.34,-.46))-.27,.16); return d; }
  if(i==1||i==4) return length(q*vec2(1.,1.06)-vec2(.05,.03))-.66;
  float d=length(q-vec2(-.36,.16))-.34; d=smin(d,length(q-vec2(.1,-.36))-.31,.17); return smin(d,length(q-vec2(.42,.2))-.32,.14);
}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*res)/min(res.x,res.y)*2.;
  vec2 p=uv*scale+pan;
  float px=scale*2./min(res.x,res.y);
  vec3 od=vec3(.014,.045,.030)+vec3(.012,.03,.012)*fbm(p*.7);
  float keep=1.;
  for(int i=0;i<5;i++){ float d=length(p-wp(i)); keep*=smoothstep(1.0,1.12,d); }

  vec2 g=floor(p);
  for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){
    vec2 c=g+vec2(float(x),float(y)); vec2 r=h2(c); float k=h1(c+3.7);
    if(k<.13) continue;
    vec2 o=c+.5+(r-.5)*.46+.03*vec2(sin(t*.23+k*30.),cos(t*.19+k*20.));
    bool skip=false; for(int i=0;i<5;i++) if(length(o-wp(i))<1.34) skip=true; if(skip) continue;
    vec2 q=p-o; float a=atan(q.y,q.x);
    float R=.465*(.9+.2*h1(c+9.))*(1.+.035*sin(a*2.+k*40.)+.018*sin(a*3.+k*11.));
    float d=length(q), m=1.-smoothstep(R-max(px,.012),R+max(px,.012),d);
    float u=d/R;
    float th=mix(.30,1.,smoothstep(.05,.70,u))*(1.-.18*smoothstep(.82,1.,u));
    th*=.82+.3*h1(c+21.)+.10*(fbm(p*9.+k*9.)-.5);
    od+=EOSIN*m*th*.80;
    od+=vec3(.05,.16,.10)*m*smoothstep(.93,1.,u);
    od-=.028*smoothstep(.07,0.,abs(d-R-.05));
  }
  vec2 pg=floor(p*.62); vec2 pr=h2(pg+50.);
  if(h1(pg+80.)>.66){ vec2 o=(pg+.2+.6*pr)/.62; float d=length(p-o)+.05*(fbm(p*14.)-.5); od+=vec3(.5,.78,.2)*(1.-smoothstep(.07,.12,d))*keep*(.6+.6*vn(p*26.)); }

  for(int i=0;i<5;i++){
    vec2 q=p-wp(i); float w=.045*(fbm(q*2.2+float(i)*9.)-.5);
    float d=length(q)+w, m=1.-smoothstep(.98-max(px,.02),1.0+max(px,.02),d);
    if(m<=0.) continue;
    float gr=smoothstep(.50,.80,vn(q*15.+float(i)*5.+.8*vec2(vn(q*7.),vn(q*7.+9.))))*.7+smoothstep(.55,.9,vn(q*27.+3.))*.3;
    od+=m*(CYTO*(.55+.4*fbm(q*5.))+vec3(.08,.26,.10)*gr*.55);
    od+=m*CYTO*.5*smoothstep(.90,1.,d);
    float n=lobes(q+.03*vec2(fbm(q*3.)-.5,fbm(q*3.+4.)-.5),i);
    float nm=1.-smoothstep(-max(px,.012),max(px,.016),n);
    float chrom=fbm(q*6.5+float(i)*3.)*.75+fbm(q*19.)*.42;
    od+=GIEMSA*nm*(.42+1.15*smoothstep(.28,.86,chrom));
    od+=GIEMSA*nm*.30*smoothstep(-.07,0.,n);
  }
  vec3 col=vec3(1.,.985,.965)*exp(-max(od,0.)*1.12);
  float v=length(uv); col*=mix(vec3(1.),vec3(.86,.70,.80),smoothstep(.70,1.04,v));
  col+=(h1(gl_FragCoord.xy+fract(t))-.5)*.012;
  gl_FragColor=vec4(col,1.);
}`;

export const VIEW = [8.2, 2.1, 0.16] as const;

export default function Smear({ level, still }: { level: number; still: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const want = useRef(level);
  useEffect(() => { want.current = level; }, [level]);

  useEffect(() => {
    const cv = ref.current;
    const gl = cv?.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!cv || !gl) return;
    const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}"));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const at = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(at);
    gl.vertexAttribPointer(at, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = U("res"), uScale = U("scale"), uPan = U("pan"), uT = U("t");

    let s = Math.log(VIEW[want.current]), panX = 0, panY = 0, vx = 0, vy = 0, seen = true, raf = 0, held = false, lx = 0, ly = 0, drawn = "", last = 0;
    const size = () => {
      const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio, 1.5);
      const w = Math.max(2, Math.round(r.width * d)), hh = Math.max(2, Math.round(r.height * d));
      if (cv.width !== w || cv.height !== hh) { cv.width = w; cv.height = hh; gl.viewport(0, 0, w, hh); drawn = ""; }
    };
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!seen || now - last < 15) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      size();
      const goal = Math.log(VIEW[want.current]);
      s = still ? goal : s + (goal - s) * (1 - Math.exp(-2.6 * dt));
      const scale = Math.exp(s);
      if (!held) {
        panX += vx; panY += vy; vx *= 0.92; vy *= 0.92;
        if (want.current > 0) { const k = 1 - Math.exp(-3.5 * dt); panX -= panX * k; panY -= panY * k; }
      }
      const t = still ? 4 : now / 1000;
      const key = `${cv.width},${scale.toFixed(4)},${panX.toFixed(3)},${panY.toFixed(3)},${still ? 0 : t.toFixed(2)}`;
      if (key === drawn || (want.current === 2 && scale < VIEW[2] * 1.02 && drawn)) return;
      drawn = key;
      gl.uniform2f(uRes, cv.width, cv.height); gl.uniform1f(uScale, scale); gl.uniform2f(uPan, panX, panY); gl.uniform1f(uT, t);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; });
    io.observe(cv);
    const down = (e: PointerEvent) => { held = true; lx = e.clientX; ly = e.clientY; };
    const move = (e: PointerEvent) => {
      if (!held) return;
      const k = (Math.exp(s) * 2) / cv.getBoundingClientRect().width;
      vx = -(e.clientX - lx) * k; vy = (e.clientY - ly) * k; lx = e.clientX; ly = e.clientY;
      panX = Math.max(-9, Math.min(9, panX + vx)); panY = Math.max(-9, Math.min(9, panY + vy));
    };
    const up = () => { held = false; };
    cv.addEventListener("pointerdown", down); addEventListener("pointermove", move); addEventListener("pointerup", up); addEventListener("pointercancel", up);
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); io.disconnect(); cv.removeEventListener("pointerdown", down); removeEventListener("pointermove", move); removeEventListener("pointerup", up); removeEventListener("pointercancel", up); };
  }, [still]);

  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} aria-hidden="true" />;
}
