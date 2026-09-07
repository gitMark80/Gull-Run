// Gull Run Evo — approved scene overrides.
// Paris follows Sydney. This replaces the temporary block-building placeholder with
// the approved Seine / Eiffel Tower / bridges / tour boats / promenade scene.
const approvedWtBackground=wtBackground;
function parisBridge(cx,y,w=520){
  ctx.save();ctx.translate(-cam.x,-cam.y);
  ctx.fillStyle='#c8b28d';ctx.strokeStyle='#6f665b';ctx.lineWidth=6;
  ctx.beginPath();ctx.moveTo(cx-w/2,y);ctx.lineTo(cx+w/2,y);ctx.lineTo(cx+w/2,y+52);
  for(let i=2;i>=0;i--){const x=cx-w/2+85+i*175;ctx.lineTo(x+75,y+52);ctx.arc(x,y+52,75,0,Math.PI,true);ctx.lineTo(x-75,y+52);}ctx.closePath();ctx.fill();ctx.stroke();
  ctx.strokeStyle='#59544c';ctx.lineWidth=4;for(let x=cx-w/2+25;x<cx+w/2;x+=38){ctx.beginPath();ctx.moveTo(x,y-13);ctx.lineTo(x,y+3);ctx.stroke();}
  ctx.restore();
}
function parisBoat(x,y,s=1){ctx.save();ctx.translate(x-cam.x,y-cam.y);ctx.scale(s,s);ctx.fillStyle='#f7f4ea';ctx.strokeStyle='#354a59';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-90,10);ctx.lineTo(92,10);ctx.lineTo(66,42);ctx.lineTo(-62,42);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#2c6e91';ctx.fillRect(-55,-28,108,38);ctx.fillStyle='#bfe8ff';for(let i=0;i<5;i++)ctx.fillRect(-45+i*21,-19,14,16);ctx.fillStyle='#d6443d';ctx.fillRect(-5,-42,8,14);ctx.restore();}
function parisTree(x,y,s=1){ctx.save();ctx.translate(x-cam.x,y-cam.y);ctx.scale(s,s);ctx.fillStyle='#6f4a2d';ctx.fillRect(-7,0,14,78);for(const p of [[0,-18,48],[32,5,37],[-32,8,39]]){ctx.fillStyle='#4f8d52';ctx.beginPath();ctx.arc(p[0],p[1],p[2],0,Math.PI*2);ctx.fill();}ctx.restore();}
function approvedParis(){
  // warm blue Paris sky
  const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#55adff');sky.addColorStop(.58,'#cceeff');sky.addColorStop(1,'#f4e7ca');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);wtClouds();
  // distant Paris roofline: varied silhouettes, mansard roofs and domes — not placeholder blocks
  ctx.save();ctx.translate(-cam.x,-cam.y);ctx.fillStyle='#b8a894';for(let x=0,i=0;x<WORLD.w;x+=170,i++){const base=700,h=72+(i*37%85),w=142;ctx.fillRect(x,base-h,w,h);ctx.fillStyle=i%3===0?'#596878':'#725f58';ctx.beginPath();ctx.moveTo(x-8,base-h);ctx.lineTo(x+w/2,base-h-35-(i%2)*20);ctx.lineTo(x+w+8,base-h);ctx.closePath();ctx.fill();ctx.fillStyle='#b8a894';}
  ctx.restore();
  // Seine
  wtWater(700,'#278ec4');
  // embankments and promenades
  wtRect(0,900,WORLD.w,300,'#c9b79a');wtRect(0,900,WORLD.w,18,'#8c7862');
  for(let x=80;x<WORLD.w;x+=300)parisTree(x,875,.75);
  // bridges and Eiffel Tower landmarks repeated through the scrolling stage
  for(const x of [1100,3150,5050])parisBridge(x,760,560);
  for(const x of [650,2700,4550])wtEiffel(x);
  // sightseeing boats on the river
  parisBoat(1550,815,1);parisBoat(3700,835,.9);
  // promenade lamps
  ctx.save();ctx.translate(-cam.x,-cam.y);for(let x=180;x<WORLD.w;x+=440){ctx.strokeStyle='#30363b';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(x,900);ctx.lineTo(x,815);ctx.stroke();ctx.fillStyle='#ffe9a8';ctx.beginPath();ctx.arc(x,805,12,0,Math.PI*2);ctx.fill();}ctx.restore();
}
wtBackground=function(stage){if(stage&&stage.theme==='paris'){approvedParis();return;}approvedWtBackground(stage);};
