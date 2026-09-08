// Gull Run Evo — approved illustrated scene overrides.
// Paris follows Sydney and now uses a dedicated illustrated background asset.
const approvedWtBackground=wtBackground;
const PARIS_BG=new Image();
let PARIS_BG_READY=false;
PARIS_BG.onload=()=>{PARIS_BG_READY=true;};
PARIS_BG.src='assets/levels/paris-illustrated.svg?v=20260907c';
function approvedParis(){
  if(PARIS_BG_READY){
    ctx.drawImage(PARIS_BG,-cam.x,-cam.y,WORLD.w,WORLD.h);
    return;
  }
  // Never show the old block-building placeholder while the illustration loads.
  const sky=ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#45aaff');sky.addColorStop(.58,'#c9eeff');sky.addColorStop(1,'#f8e4c4');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  wtClouds();
}
wtBackground=function(stage){
  if(stage&&stage.theme==='paris'){approvedParis();return;}
  approvedWtBackground(stage);
};
