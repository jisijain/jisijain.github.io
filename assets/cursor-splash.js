/*!
 * Fluid cursor — WebGL fluid simulation
 * Adapted from WebGL Fluid Simulation (MIT) by Pavel Dobryakov
 * Palette: portfolio warm-red theme #b32434 / #c8384a / #7a1420
 */
(function () {
  'use strict';
  if (window.matchMedia('(pointer: coarse)').matches) return;

  /* ---------- canvas ---------- */
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:.45;';
  document.body.appendChild(canvas);
  setSize();

  /* ---------- GL context ---------- */
  const opt = { alpha:true, depth:false, stencil:false, antialias:false, preserveDrawingBuffer:false };
  let gl = canvas.getContext('webgl2', opt);
  const isGL2 = !!gl;
  if (!gl) gl = canvas.getContext('webgl', opt) || canvas.getContext('experimental-webgl', opt);
  if (!gl) return;

  let linFilt, hfExt;
  if (isGL2) {
    gl.getExtension('EXT_color_buffer_float');
    linFilt = !!gl.getExtension('OES_texture_float_linear');
  } else {
    hfExt   = gl.getExtension('OES_texture_half_float');
    linFilt = !!gl.getExtension('OES_texture_half_float_linear');
  }

  const HF   = isGL2 ? gl.HALF_FLOAT : (hfExt ? hfExt.HALF_FLOAT_OES : gl.UNSIGNED_BYTE);
  const RGBA = isGL2 ? { i: gl.RGBA16F, f: gl.RGBA } : { i: gl.RGBA, f: gl.RGBA };
  const RG   = isGL2 ? { i: gl.RG16F,   f: gl.RG   } : { i: gl.RGBA, f: gl.RGBA };
  const R1   = isGL2 ? { i: gl.R16F,    f: gl.RED  } : { i: gl.RGBA, f: gl.RGBA };
  const FILT = linFilt ? gl.LINEAR : gl.NEAREST;

  /* ---------- config ---------- */
  const DD = 7, VD = 2.5, PR = 0.1, PI = 20, CU = 3, SR = 0.15, SF = 2500;

  /* ---------- shaders ---------- */
  const VS = `precision highp float;
attribute vec2 aPosition;
varying vec2 vUv,vL,vR,vT,vB;
uniform vec2 texelSize;
void main(){
  vUv=aPosition*.5+.5;
  vL=vUv-vec2(texelSize.x,0.);vR=vUv+vec2(texelSize.x,0.);
  vT=vUv+vec2(0.,texelSize.y);vB=vUv-vec2(0.,texelSize.y);
  gl_Position=vec4(aPosition,0.,1.);
}`;

  const FS = {
    display:`precision highp float;
varying vec2 vUv,vL,vR,vT,vB;uniform sampler2D uTexture;uniform vec2 texelSize;
void main(){
  vec3 c=texture2D(uTexture,vUv).rgb;
  vec3 lc=texture2D(uTexture,vL).rgb,rc=texture2D(uTexture,vR).rgb;
  vec3 tc=texture2D(uTexture,vT).rgb,bc=texture2D(uTexture,vB).rgb;
  float dx=length(rc)-length(lc),dy=length(tc)-length(bc);
  vec3 n=normalize(vec3(dx,dy,length(texelSize)));
  c*=clamp(dot(n,vec3(0.,0.,1.))+.7,.7,1.);
  gl_FragColor=vec4(c,max(c.r,max(c.g,c.b)));
}`,
    splat:`precision highp float;
varying vec2 vUv;uniform sampler2D uTarget;uniform float aspectRatio,radius;
uniform vec3 color;uniform vec2 point;
void main(){
  vec2 p=vUv-point;p.x*=aspectRatio;
  gl_FragColor=vec4(texture2D(uTarget,vUv).xyz+exp(-dot(p,p)/radius)*color,1.);
}`,
    advect:`precision highp float;
varying vec2 vUv;uniform sampler2D uVelocity,uSource;
uniform vec2 texelSize,dyeTexelSize;uniform float dt,dissipation;
vec4 bil(sampler2D s,vec2 uv,vec2 ts){
  vec2 st=uv/ts-.5,f=fract(st),i=floor(st);
  return mix(mix(texture2D(s,(i+vec2(.5,.5))*ts),texture2D(s,(i+vec2(1.5,.5))*ts),f.x),
             mix(texture2D(s,(i+vec2(.5,1.5))*ts),texture2D(s,(i+vec2(1.5,1.5))*ts),f.x),f.y);
}
void main(){
  vec2 co=vUv-dt*bil(uVelocity,vUv,texelSize).xy*texelSize;
  gl_FragColor=bil(uSource,co,dyeTexelSize)/(1.+dissipation*dt);
}`,
    div:`precision mediump float;
varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity;
void main(){
  float L=texture2D(uVelocity,vL).x,R=texture2D(uVelocity,vR).x;
  float T=texture2D(uVelocity,vT).y,B=texture2D(uVelocity,vB).y;
  vec2 C=texture2D(uVelocity,vUv).xy;
  if(vL.x<0.)L=-C.x;if(vR.x>1.)R=-C.x;if(vT.y>1.)T=-C.y;if(vB.y<0.)B=-C.y;
  gl_FragColor=vec4(.5*(R-L+T-B),0.,0.,1.);
}`,
    curl:`precision mediump float;
varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity;
void main(){
  gl_FragColor=vec4(.5*(texture2D(uVelocity,vR).y-texture2D(uVelocity,vL).y
    -texture2D(uVelocity,vT).x+texture2D(uVelocity,vB).x),0.,0.,1.);
}`,
    vort:`precision highp float;
varying vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity,uCurl;
uniform float curl,dt;
void main(){
  float L=texture2D(uCurl,vL).x,R=texture2D(uCurl,vR).x;
  float T=texture2D(uCurl,vT).x,B=texture2D(uCurl,vB).x,C=texture2D(uCurl,vUv).x;
  vec2 f=.5*vec2(abs(T)-abs(B),abs(R)-abs(L));
  f=f/(length(f)+.0001)*curl*C;f.y*=-1.;
  gl_FragColor=vec4(clamp(texture2D(uVelocity,vUv).xy+f*dt,-1e3,1e3),0.,1.);
}`,
    pres:`precision mediump float;
varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uPressure,uDivergence;
void main(){
  gl_FragColor=vec4((texture2D(uPressure,vL).x+texture2D(uPressure,vR).x
    +texture2D(uPressure,vT).x+texture2D(uPressure,vB).x
    -texture2D(uDivergence,vUv).x)*.25,0.,0.,1.);
}`,
    grad:`precision mediump float;
varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uPressure,uVelocity;
void main(){
  gl_FragColor=vec4(texture2D(uVelocity,vUv).xy
    -vec2(texture2D(uPressure,vR).x-texture2D(uPressure,vL).x,
          texture2D(uPressure,vT).x-texture2D(uPressure,vB).x),0.,1.);
}`,
    clear:`precision mediump float;
varying vec2 vUv;uniform sampler2D uTexture;uniform float value;
void main(){ gl_FragColor=value*texture2D(uTexture,vUv); }`
  };

  /* ---------- compile + link ---------- */
  function mkShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s); return s;
  }
  function mkProg(fsSrc) {
    const p = gl.createProgram();
    gl.attachShader(p, vs); gl.attachShader(p, mkShader(gl.FRAGMENT_SHADER, fsSrc));
    gl.bindAttribLocation(p, 0, 'aPosition'); gl.linkProgram(p);
    const u = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) { const { name } = gl.getActiveUniform(p, i); u[name] = gl.getUniformLocation(p, name); }
    return { p, u };
  }
  const vs = mkShader(gl.VERTEX_SHADER, VS);
  const P  = { display:mkProg(FS.display), splat:mkProg(FS.splat), advect:mkProg(FS.advect),
               div:mkProg(FS.div), curl:mkProg(FS.curl), vort:mkProg(FS.vort),
               pres:mkProg(FS.pres), grad:mkProg(FS.grad), clear:mkProg(FS.clear) };

  /* ---------- quad ---------- */
  const vbuf = gl.createBuffer(), ibuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,-1,1,1,1,1,-1]), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2,0,2,3]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  function blit(tgt) {
    if (tgt) { gl.viewport(0,0,tgt.w,tgt.h); gl.bindFramebuffer(gl.FRAMEBUFFER,tgt.fbo); }
    else     { gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight); gl.bindFramebuffer(gl.FRAMEBUFFER,null); }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }

  /* ---------- FBOs ---------- */
  function mkFBO(w, h, ifmt, fmt, type, filt) {
    gl.activeTexture(gl.TEXTURE0);
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filt);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filt);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, ifmt, w, h, 0, fmt, type, null);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.viewport(0,0,w,h); gl.clear(gl.COLOR_BUFFER_BIT);
    return { fbo, tex, w, h, tx:1/w, ty:1/h,
      attach(id){ gl.activeTexture(gl.TEXTURE0+id); gl.bindTexture(gl.TEXTURE_2D,tex); return id; } };
  }
  function mkDFBO(w, h, ifmt, fmt, type, filt) {
    let a = mkFBO(w,h,ifmt,fmt,type,filt), b = mkFBO(w,h,ifmt,fmt,type,filt);
    return { w, h, tx:a.tx, ty:a.ty,
      get read(){ return a; }, get write(){ return b; },
      swap(){ const t=a; a=b; b=t; } };
  }
  function res(r) {
    const ar = gl.drawingBufferWidth / gl.drawingBufferHeight;
    return ar > 1 ? { w: Math.round(r*ar), h: r } : { w: r, h: Math.round(r/ar) };
  }

  const sR = res(128), dR = res(512);
  let den = mkDFBO(dR.w, dR.h, RGBA.i, RGBA.f, HF, FILT);
  let vel = mkDFBO(sR.w, sR.h, RG.i,   RG.f,   HF, FILT);
  let dv  = mkFBO (sR.w, sR.h, R1.i,   R1.f,   HF, gl.NEAREST);
  let cu  = mkFBO (sR.w, sR.h, R1.i,   R1.f,   HF, gl.NEAREST);
  let pr  = mkDFBO(sR.w, sR.h, R1.i,   R1.f,   HF, gl.NEAREST);

  /* ---------- color palette ---------- */
  const PAL = [
    [0.702,0.141,0.204], // #b32434
    [0.784,0.220,0.290], // #c8384a
    [0.860,0.300,0.360], // bright crimson
    [0.478,0.078,0.125], // #7a1420
    [0.950,0.760,0.680], // warm cream highlight
    [0.620,0.100,0.160], // mid red
  ];
  function genCol() {
    const b = PAL[Math.floor(Math.random()*PAL.length)];
    return { r:b[0], g:b[1], b:b[2] };
  }

  /* ---------- pointer ---------- */
  let px=0, py=0, pdx=0, pdy=0, col=genCol(), colT=0;

  document.addEventListener('mousemove', e => {
    const nx = e.clientX/canvas.width, ny = 1 - e.clientY/canvas.height;
    const ar = canvas.width/canvas.height;
    pdx = (nx-px) * (ar>1?1:ar);
    pdy = (ny-py) * (ar>1?1/ar:1);
    px=nx; py=ny;
  });

  /* ---------- loop ---------- */
  let lastT = performance.now();

  function step(now) {
    const dt = Math.min((now-lastT)/1000, 0.016);
    lastT = now;
    setSize();
    gl.disable(gl.BLEND);

    // curl
    gl.useProgram(P.curl.p);
    gl.uniform2f(P.curl.u.texelSize, vel.tx, vel.ty);
    gl.uniform1i(P.curl.u.uVelocity, vel.read.attach(0));
    blit(cu);

    // vorticity
    gl.useProgram(P.vort.p);
    gl.uniform2f(P.vort.u.texelSize, vel.tx, vel.ty);
    gl.uniform1i(P.vort.u.uVelocity, vel.read.attach(0));
    gl.uniform1i(P.vort.u.uCurl,     cu.attach(1));
    gl.uniform1f(P.vort.u.curl, CU); gl.uniform1f(P.vort.u.dt, dt);
    blit(vel.write); vel.swap();

    // divergence
    gl.useProgram(P.div.p);
    gl.uniform2f(P.div.u.texelSize, vel.tx, vel.ty);
    gl.uniform1i(P.div.u.uVelocity, vel.read.attach(0));
    blit(dv);

    // clear pressure
    gl.useProgram(P.clear.p);
    gl.uniform1i(P.clear.u.uTexture, pr.read.attach(0));
    gl.uniform1f(P.clear.u.value, PR);
    blit(pr.write); pr.swap();

    // pressure solve
    gl.useProgram(P.pres.p);
    gl.uniform2f(P.pres.u.texelSize, vel.tx, vel.ty);
    gl.uniform1i(P.pres.u.uDivergence, dv.attach(0));
    for (let i=0; i<PI; i++) {
      gl.uniform1i(P.pres.u.uPressure, pr.read.attach(1));
      blit(pr.write); pr.swap();
    }

    // gradient subtract
    gl.useProgram(P.grad.p);
    gl.uniform2f(P.grad.u.texelSize, vel.tx, vel.ty);
    gl.uniform1i(P.grad.u.uPressure, pr.read.attach(0));
    gl.uniform1i(P.grad.u.uVelocity, vel.read.attach(1));
    blit(vel.write); vel.swap();

    // advect velocity
    gl.useProgram(P.advect.p);
    gl.uniform2f(P.advect.u.texelSize, vel.tx, vel.ty);
    gl.uniform2f(P.advect.u.dyeTexelSize, vel.tx, vel.ty);
    gl.uniform1i(P.advect.u.uVelocity, vel.read.attach(0));
    gl.uniform1i(P.advect.u.uSource,   vel.read.attach(0));
    gl.uniform1f(P.advect.u.dt, dt);
    gl.uniform1f(P.advect.u.dissipation, VD);
    blit(vel.write); vel.swap();

    // advect density
    gl.uniform2f(P.advect.u.dyeTexelSize, den.tx, den.ty);
    gl.uniform1i(P.advect.u.uVelocity, vel.read.attach(0));
    gl.uniform1i(P.advect.u.uSource,   den.read.attach(1));
    gl.uniform1f(P.advect.u.dissipation, DD);
    blit(den.write); den.swap();

    // cycle color
    colT += dt * 10;
    if (colT >= 1) { colT=0; col=genCol(); }

    // splat on movement
    if (Math.abs(pdx) > 0 || Math.abs(pdy) > 0) {
      splat(px, py, pdx*SF, pdy*SF, col);
      pdx = pdy = 0;
    }

    // render to transparent canvas
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(P.display.p);
    gl.uniform2f(P.display.u.texelSize, 1/den.w, 1/den.h);
    gl.uniform1i(P.display.u.uTexture, den.read.attach(0));
    blit(null);

    requestAnimationFrame(step);
  }

  function splat(x, y, dx, dy, c) {
    const ar = canvas.width/canvas.height;
    const r  = SR * (ar>1?ar:1) * 0.01;
    gl.useProgram(P.splat.p);
    gl.uniform1i(P.splat.u.uTarget, vel.read.attach(0));
    gl.uniform1f(P.splat.u.aspectRatio, ar);
    gl.uniform2f(P.splat.u.point, x, y);
    gl.uniform3f(P.splat.u.color, dx, dy, 0);
    gl.uniform1f(P.splat.u.radius, r);
    blit(vel.write); vel.swap();

    gl.uniform1i(P.splat.u.uTarget, den.read.attach(0));
    gl.uniform3f(P.splat.u.color, c.r, c.g, c.b);
    blit(den.write); den.swap();
  }

  function setSize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width!==w || canvas.height!==h) { canvas.width=w; canvas.height=h; }
  }

  requestAnimationFrame(step);
})();
