/* Gull Run Evo — Stage Food Patch
   Paste this INSIDE the main game IIFE, after the World Tour stage code and before the final `})();`.
   It replaces generic food spawns with stage-specific collectible foods.
*/

const STAGE_FOOD_SETS = [
  { stage: 'COAST', items: ['hotdog', 'burger', 'pizza'], rare: 'pizza' },
  { stage: 'HUDSON / NEW YORK', items: ['pizza', 'hotdog', 'burger'], rare: 'burger' },
  { stage: 'SYDNEY', items: ['sausageRoll', 'meatPie', 'avocadoToast'], rare: 'meatPie' },
  { stage: 'PARIS', items: ['croissant', 'macaron', 'baguette'], rare: 'baguette' },
  { stage: 'ROME', items: ['gelato', 'pastaBowl', 'cannoli'], rare: 'cannoli' },
  { stage: 'SWISS ALPS', items: ['cheese', 'chocolate', 'breadLoaf'], rare: 'breadLoaf' },
  { stage: 'BAVARIA', items: ['pretzel', 'bratwurst', 'roastChicken'], rare: 'roastChicken' },
  { stage: 'LONDON', items: ['tea', 'scone', 'fishChips'], rare: 'fishChips' },
  { stage: 'TOKYO', items: ['onigiri', 'sushi', 'ramenBowl'], rare: 'ramenBowl' },
  { stage: 'DUBAI', items: ['dates', 'baklava', 'shawarma'], rare: 'shawarma' },
  { stage: 'GREAT WALL OF CHINA', items: ['dumpling', 'bao', 'noodleBowl'], rare: 'noodleBowl' },
  { stage: 'EGYPT PYRAMIDS', items: ['dates', 'fig', 'teaGlass'], rare: 'teaGlass' },
  { stage: 'RIO DE JANEIRO', items: ['banana', 'pineapple', 'acaiBowl'], rare: 'acaiBowl' },
  { stage: 'LOS ANGELES BEACH', items: ['taco', 'avocado', 'smoothie'], rare: 'smoothie' },
];

const FOOD_META = {
  hotdog:{kind:'hotdog',scale:1.12}, burger:{kind:'burger',scale:1.14}, pizza:{kind:'pizza',scale:1.14},
  sausageRoll:{kind:'sausageRoll',scale:1.08}, meatPie:{kind:'meatPie',scale:1.08}, avocadoToast:{kind:'avocadoToast',scale:1.06},
  croissant:{kind:'croissant',scale:1.10}, macaron:{kind:'macaron',scale:1.04}, baguette:{kind:'baguette',scale:1.18},
  gelato:{kind:'gelato',scale:1.12}, pastaBowl:{kind:'pastaBowl',scale:1.12}, cannoli:{kind:'cannoli',scale:1.08},
  cheese:{kind:'cheese',scale:1.10}, chocolate:{kind:'chocolate',scale:1.08}, breadLoaf:{kind:'breadLoaf',scale:1.10},
  pretzel:{kind:'pretzel',scale:1.08}, bratwurst:{kind:'bratwurst',scale:1.10}, roastChicken:{kind:'roastChicken',scale:1.10},
  tea:{kind:'teaCup',scale:1.00}, scone:{kind:'scone',scale:1.00}, fishChips:{kind:'fishChips',scale:1.08},
  onigiri:{kind:'onigiri',scale:1.00}, sushi:{kind:'sushi',scale:1.04}, ramenBowl:{kind:'ramenBowl',scale:1.10},
  dates:{kind:'dates',scale:1.00}, baklava:{kind:'baklava',scale:1.00}, shawarma:{kind:'shawarma',scale:1.06},
  dumpling:{kind:'dumpling',scale:1.00}, bao:{kind:'bao',scale:1.00}, noodleBowl:{kind:'noodleBowl',scale:1.08},
  fig:{kind:'fig',scale:1.00}, teaGlass:{kind:'teaGlass',scale:1.00}, banana:{kind:'banana',scale:1.04},
  pineapple:{kind:'pineapple',scale:1.00}, acaiBowl:{kind:'acaiBowl',scale:1.08}, taco:{kind:'taco',scale:1.08},
  avocado:{kind:'avocado',scale:1.00}, smoothie:{kind:'smoothie',scale:1.02}
};

function activeFoodSet(){
  const i = (typeof level === 'number' ? level : 0);
  return STAGE_FOOD_SETS[Math.max(0, Math.min(STAGE_FOOD_SETS.length - 1, i))] || STAGE_FOOD_SETS[0];
}

function pickStageFood(){
  const set = activeFoodSet();
  const r = Math.random();
  if(r < 0.40) return set.items[0];
  if(r < 0.80) return set.items[1];
  return set.items[2];
}

const stageFoodOriginalMakeFood = makeFood;
makeFood = function(){
  const set = activeFoodSet();
  const type = pickStageFood();
  const rare = type === set.rare;
  const zone = Math.random();
  const y = zone < 0.35 ? rand(180,390) : zone < 0.75 ? rand(520,640) : rand(690,810);
  const meta = FOOD_META[type] || { scale: 1.0, kind: 'fish' };
  return {
    type,
    x: rand(90, WORLD.w - 90),
    y,
    r: rare ? 30 : 26,
    scale: meta.scale || 1,
    rare,
    score: rare ? 18 + (Math.random() * 8 | 0) : 10 + (Math.random() * 8 | 0),
    xp: rare ? 2 : 1,
    bob: rand(0, Math.PI * 2)
  };
};

function foodGlowStart(){
  ctx.shadowColor = '#64ff7a';
  ctx.shadowBlur = 10;
  ctx.strokeStyle = '#69ff76';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
}
function foodGlowEnd(){ ctx.shadowBlur = 0; }
function rr(x,y,w,h,r){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); }
function ellipse(x,y,rx,ry){ ctx.beginPath(); ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2); }
function circle(x,y,r){ ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); }

function drawBurgerIcon(){ ctx.fillStyle='#f2b35c'; rr(-19,-17,38,10,8); ctx.fill(); ctx.stroke(); ctx.fillStyle='#58b748'; rr(-16,-7,32,5,4); ctx.fill(); ctx.fillStyle='#7f4721'; rr(-16,-2,32,8,4); ctx.fill(); ctx.fillStyle='#f1cf53'; rr(-12,3,24,5,3); ctx.fill(); ctx.fillStyle='#f2b35c'; rr(-20,7,40,11,8); ctx.fill(); ctx.stroke(); }
function drawHotdogIcon(){ ctx.fillStyle='#f1b55d'; rr(-22,-10,44,20,10); ctx.fill(); ctx.stroke(); ctx.fillStyle='#d9533f'; rr(-18,-5,36,10,8); ctx.fill(); ctx.strokeStyle='#f3d34f'; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(-12,-1); ctx.bezierCurveTo(-7,-8,-1,6,6,-2); ctx.bezierCurveTo(10,-7,13,3,16,-1); ctx.stroke(); }
function drawPizzaIcon(){ ctx.fillStyle='#efc980'; ctx.beginPath(); ctx.moveTo(-20,-12); ctx.lineTo(22,0); ctx.lineTo(-12,20); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle='#d85a3d'; ctx.beginPath(); ctx.moveTo(-16,-8); ctx.lineTo(14,0); ctx.lineTo(-10,14); ctx.closePath(); ctx.fill(); ctx.fillStyle='#f5e68b'; ctx.beginPath(); ctx.moveTo(-14,-7); ctx.lineTo(13,0); ctx.lineTo(-9,12); ctx.closePath(); ctx.fill(); ctx.fillStyle='#b52d2d'; circle(-4,-2,3.5); ctx.fill(); circle(7,2,3.5); ctx.fill(); circle(-1,9,3.5); ctx.fill(); }
function drawCroissantIcon(){ ctx.fillStyle='#df8a34'; ellipse(-5,0,18,12); ctx.fill(); ellipse(8,-1,12,9); ctx.fill(); ellipse(-14,2,10,8); ctx.fill(); }
function drawMacaronIcon(){ ctx.fillStyle='#f36f93'; rr(-16,-12,32,8,6); ctx.fill(); rr(-16,4,32,8,6); ctx.fill(); ctx.fillStyle='#ffd9e5'; rr(-15,-4,30,8,4); ctx.fill(); }
function drawBaguetteIcon(){ ctx.save(); ctx.rotate(-0.35); ctx.fillStyle='#d28d3b'; rr(-24,-7,48,14,7); ctx.fill(); ctx.stroke(); ctx.strokeStyle='#f0d085'; ctx.lineWidth=2; for(let x=-12;x<=14;x+=10){ctx.beginPath();ctx.moveTo(x,-5);ctx.lineTo(x-4,5);ctx.stroke();} ctx.restore(); }
function drawGelatoIcon(){ ctx.fillStyle='#d39a4f'; ctx.beginPath();ctx.moveTo(0,18);ctx.lineTo(-9,-4);ctx.lineTo(9,-4);ctx.closePath();ctx.fill();ctx.fillStyle='#f7efca';circle(-6,-9,7);ctx.fill();ctx.fillStyle='#88d166';circle(0,-13,7);ctx.fill();ctx.fillStyle='#ff4d89';circle(7,-8,7);ctx.fill(); }
function drawPastaBowlIcon(){ ctx.fillStyle='#f2f5ff'; rr(-18,3,36,14,0);ctx.fill();ctx.stroke();ctx.fillStyle='#cc4737';ellipse(0,-3,14,6);ctx.fill();ctx.strokeStyle='#f3cb62';ctx.lineWidth=3;for(let i=-10;i<=10;i+=5){ctx.beginPath();ctx.arc(i,-1,7,.2,2.9);ctx.stroke();} }
function drawCannoliIcon(){ ctx.fillStyle='#b77031'; rr(-18,-8,36,16,8);ctx.fill();ctx.stroke();ctx.fillStyle='#fff7eb';circle(-18,0,6);ctx.fill();circle(18,0,6);ctx.fill(); }
function drawCheeseIcon(){ ctx.fillStyle='#f2c84f'; ctx.beginPath();ctx.moveTo(-20,14);ctx.lineTo(-20,-12);ctx.lineTo(18,-2);ctx.lineTo(18,14);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#e1ae31';circle(-7,0,3);ctx.fill();circle(1,7,2.5);ctx.fill(); }
function drawChocolateIcon(){ ctx.fillStyle='#7d4325'; rr(-19,-10,16,22,2);ctx.fill();rr(-2,-10,16,22,2);ctx.fill(); }
function drawBreadLoafIcon(){ ctx.fillStyle='#b77639'; ellipse(0,-2,18,12);ctx.fill();rr(-18,-2,36,18,8);ctx.fill();ctx.stroke(); }
function drawPretzelIcon(){ ctx.strokeStyle='#bb742f';ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(-12,-3);ctx.bezierCurveTo(-24,-18,-4,-24,0,-4);ctx.bezierCurveTo(4,-24,24,-18,12,-3);ctx.bezierCurveTo(4,8,4,16,0,6);ctx.bezierCurveTo(-4,16,-4,8,-12,-3);ctx.stroke(); }
function drawRoastChickenIcon(){ ctx.fillStyle='#ad622e';ellipse(-4,1,16,12);ctx.fill();ctx.stroke();ctx.fillStyle='#efe9db';rr(9,-3,10,6,3);ctx.fill(); }
function drawTeaCupIcon(){ ctx.fillStyle='#f4f7fc';rr(-16,-6,24,16,5);ctx.fill();ctx.stroke();ctx.fillStyle='#b96931';rr(-14,-5,20,8,4);ctx.fill(); }
function drawTeaGlassIcon(){ ctx.fillStyle='#b75e2d';ctx.beginPath();ctx.moveTo(-10,-12);ctx.lineTo(10,-12);ctx.lineTo(7,12);ctx.lineTo(-7,12);ctx.closePath();ctx.fill();ctx.stroke(); }
function drawSconeIcon(){ ctx.fillStyle='#ddb074';ellipse(0,0,17,13);ctx.fill();ctx.stroke();ctx.fillStyle='#fff';rr(-10,-1,20,5,3);ctx.fill();ctx.fillStyle='#cb3145';rr(-9,2,18,4,2);ctx.fill(); }
function drawFishChipsIcon(){ ctx.fillStyle='#ece2c5';ctx.beginPath();ctx.moveTo(-18,10);ctx.lineTo(-6,-14);ctx.lineTo(20,10);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#f1c14f';for(let x=-8;x<=6;x+=6){rr(x,-8,4,12,1);ctx.fill();}ctx.fillStyle='#d39a47';ellipse(8,-1,8,12);ctx.fill(); }
function drawOnigiriIcon(){ ctx.fillStyle='#fafafa';ctx.beginPath();ctx.moveTo(0,-18);ctx.lineTo(-16,12);ctx.lineTo(16,12);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#24303f';rr(-8,4,16,8,2);ctx.fill(); }
function drawSushiIcon(){ ctx.fillStyle='#f8f8f3';rr(-18,-4,18,10,4);ctx.fill();rr(3,-4,15,10,4);ctx.fill();ctx.fillStyle='#ff8458';ellipse(-9,-8,10,6);ctx.fill();ctx.fillStyle='#ef5560';ellipse(10,-8,8,6);ctx.fill(); }
function drawRamenBowlIcon(){ drawPastaBowlIcon();ctx.fillStyle='#fff';circle(10,-5,4);ctx.fill();ctx.fillStyle='#f2c83f';circle(10,-5,2.5);ctx.fill(); }
function drawDatesIcon(){ ctx.fillStyle='#8e4f2d';ellipse(-8,-4,6,10);ctx.fill();ellipse(3,2,6,10);ctx.fill();ellipse(12,-5,6,10);ctx.fill(); }
function drawBaklavaIcon(){ ctx.fillStyle='#dba356';rr(-16,-12,32,24,2);ctx.fill();ctx.stroke(); }
function drawShawarmaIcon(){ ctx.fillStyle='#efd1a0';ctx.beginPath();ctx.moveTo(-18,-12);ctx.lineTo(15,-8);ctx.lineTo(8,16);ctx.lineTo(-14,14);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#7f4c25';rr(-6,-4,12,12,3);ctx.fill(); }
function drawDumplingIcon(){ ctx.fillStyle='#ecd3a6';ellipse(0,0,15,11);ctx.fill();ctx.stroke(); }
function drawBaoIcon(){ ctx.fillStyle='#f7f3ea';ellipse(0,2,16,13);ctx.fill();ctx.stroke(); }
function drawFigIcon(){ ctx.fillStyle='#7a3b84';ellipse(-5,0,10,13);ctx.fill();ctx.fillStyle='#d03b4d';ellipse(7,2,9,11);ctx.fill(); }
function drawBananaIcon(){ ctx.strokeStyle='#efc438';ctx.lineWidth=8;ctx.beginPath();ctx.arc(-4,2,16,.2,2.2);ctx.stroke(); }
function drawPineappleIcon(){ ctx.fillStyle='#f0cb55';ellipse(0,2,14,15);ctx.fill();ctx.stroke();ctx.strokeStyle='#5dbb54';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,-14);ctx.lineTo(-4,-22);ctx.moveTo(0,-14);ctx.lineTo(4,-22);ctx.stroke(); }
function drawAcaiBowlIcon(){ ctx.fillStyle='#6f3a5e';rr(-16,0,32,14,0);ctx.fill();ctx.stroke();ctx.fillStyle='#7b1e7a';ellipse(0,-3,14,6);ctx.fill(); }
function drawTacoIcon(){ ctx.fillStyle='#efc267';ctx.beginPath();ctx.moveTo(-16,-8);ctx.quadraticCurveTo(0,-18,16,-8);ctx.lineTo(16,10);ctx.quadraticCurveTo(0,2,-16,10);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#61b84e';rr(-12,-6,24,4,2);ctx.fill(); }
function drawAvocadoIcon(){ ctx.fillStyle='#406436';ellipse(0,0,15,20);ctx.fill();ctx.fillStyle='#b9d666';ellipse(0,0,11,16);ctx.fill();ctx.fillStyle='#99602e';circle(0,4,5);ctx.fill(); }
function drawSmoothieIcon(){ ctx.fillStyle='#ef6aa4';ctx.beginPath();ctx.moveTo(-12,-12);ctx.lineTo(12,-12);ctx.lineTo(9,14);ctx.lineTo(-9,14);ctx.closePath();ctx.fill();ctx.stroke(); }
function drawSausageRollIcon(){ ctx.fillStyle='#d6a15c';rr(-20,-8,40,16,7);ctx.fill();ctx.stroke();ctx.fillStyle='#8f5128';rr(-15,-3,30,6,3);ctx.fill(); }
function drawMeatPieIcon(){ ctx.fillStyle='#d4a15f';ellipse(0,2,18,14);ctx.fill();rr(-18,2,36,12,6);ctx.fill();ctx.stroke(); }
function drawAvocadoToastIcon(){ ctx.fillStyle='#c28a4a';rr(-18,-12,36,24,5);ctx.fill();ctx.stroke();ctx.fillStyle='#79c75a';rr(-13,-7,26,14,4);ctx.fill();ctx.fillStyle='#c43135';circle(5,-1,3);ctx.fill();circle(-2,2,3);ctx.fill(); }

function drawFoodByKind(kind){
  const f={burger:drawBurgerIcon,hotdog:drawHotdogIcon,pizza:drawPizzaIcon,sausageRoll:drawSausageRollIcon,meatPie:drawMeatPieIcon,avocadoToast:drawAvocadoToastIcon,croissant:drawCroissantIcon,macaron:drawMacaronIcon,baguette:drawBaguetteIcon,gelato:drawGelatoIcon,pastaBowl:drawPastaBowlIcon,cannoli:drawCannoliIcon,cheese:drawCheeseIcon,chocolate:drawChocolateIcon,breadLoaf:drawBreadLoafIcon,pretzel:drawPretzelIcon,bratwurst:drawHotdogIcon,roastChicken:drawRoastChickenIcon,teaCup:drawTeaCupIcon,scone:drawSconeIcon,fishChips:drawFishChipsIcon,onigiri:drawOnigiriIcon,sushi:drawSushiIcon,ramenBowl:drawRamenBowlIcon,dates:drawDatesIcon,baklava:drawBaklavaIcon,shawarma:drawShawarmaIcon,dumpling:drawDumplingIcon,bao:drawBaoIcon,noodleBowl:drawPastaBowlIcon,fig:drawFigIcon,teaGlass:drawTeaGlassIcon,banana:drawBananaIcon,pineapple:drawPineappleIcon,acaiBowl:drawAcaiBowlIcon,taco:drawTacoIcon,avocado:drawAvocadoIcon,smoothie:drawSmoothieIcon};
  (f[kind]||drawBurgerIcon)();
}

const stageFoodOriginalDrawFood = drawFood;
drawFood = function(f){
  const meta = FOOD_META[f.type];
  if(!meta) return stageFoodOriginalDrawFood(f);
  const q = screen(f);
  ctx.save();
  ctx.translate(q.x, q.y + Math.sin(time * 2.2 + (f.bob || 0)) * 4);
  ctx.scale((f.scale || 1) * 1.15, (f.scale || 1) * 1.15);
  foodGlowStart();
  drawFoodByKind(meta.kind);
  foodGlowEnd();
  if(f.rare){ ctx.strokeStyle='rgba(255,230,120,.95)'; ctx.lineWidth=2; ellipse(0,0,22,22); ctx.stroke(); }
  ctx.restore();
};
