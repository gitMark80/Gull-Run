// Gull Run Evo — global performance + responsive movement patch.
// Injected last, inside the game IIFE, so every stage uses the same fixes.

// 1) Keep real-time movement accurate even if a phone drops frames.
// The old .024s cap caused the entire simulation to run in slow motion below ~42 FPS.
loop=function(ts){
  const elapsed=(ts-last)/1000||0;
  const dt=Math.min(.05,elapsed);
  last=ts;
  update(dt);
  draw();
  requestAnimationFrame(loop);
};

// 2) Give every evolution a little more travel speed without changing progression.
for(const s of STAGES) s.speed=Math.round(s.speed*1.12);

// 3) Reduce high-DPI fill-rate pressure on phones/tablets. This preserves crisp art
// while cutting millions of canvas pixels per frame on 3x iPhones.
const perfResize=function(){
  W=innerWidth; H=innerHeight;
  const coarse=matchMedia('(pointer:coarse)').matches;
  DPR=Math.min(devicePixelRatio||1,coarse?1.25:1.5);
  canvas.width=Math.max(1,Math.round(W*DPR));
  canvas.height=Math.max(1,Math.round(H*DPR));
  ctx.setTransform(DPR,0,0,DPR,0,0);
  ctx.imageSmoothingEnabled=true;
  ctx.imageSmoothingQuality='high';
};
addEventListener('resize',perfResize,{passive:true});
perfResize();

// 4) HUD DOM writes do not need to happen 60 times per second.
const perfUpdateHud=updateHud;
let nextHudAt=-1;
updateHud=function(){
  if(time<nextHudAt) return;
  nextHudAt=time+1/15;
  perfUpdateHud();
};

// 5) Cap burst effects so collisions/evolutions cannot create a particle storm.
const perfParticleBurst=particleBurst;
particleBurst=function(x,y,col,n){
  perfParticleBurst(x,y,col,Math.min(n,14));
  if(particles.length>90) particles.splice(0,particles.length-90);
};
