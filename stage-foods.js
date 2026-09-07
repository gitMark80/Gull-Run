// Gull Run Evo — stage-specific evolution foods using original food artwork.
const FOOD_SETS=[
 ['hotdog','burger','pizza'],
 ['pizza','hotdog','burger'],
 ['sausageRoll','meatPie','avocadoToast'],
 ['croissant','macaron','baguette'],
 ['gelato','pasta','cannoli'],
 ['cheese','chocolate','bread'],
 ['pretzel','bratwurst','chicken'],
 ['tea','scone','fishChips'],
 ['onigiri','sushi','ramen'],
 ['dates','baklava','shawarma'],
 ['dumpling','bao','noodles'],
 ['dates','fig','teaGlass'],
 ['banana','pineapple','acai'],
 ['taco','avocado','smoothie']
];
const FOOD_RARE=['pizza','burger','meatPie','baguette','cannoli','bread','chicken','fishChips','ramen','shawarma','noodles','teaGlass','acai','smoothie'];
const FOOD_ATLAS=new Image();
FOOD_ATLAS.src='food-atlas.webp';
const C=100;
const FOOD_SPRITES={croissant:[0,0],macaron:[1,0],baguette:[2,0],gelato:[3,0],pasta:[4,0],cannoli:[5,0],cheese:[6,0],chocolate:[7,0],bread:[0,1],pretzel:[1,1],bratwurst:[2,1],chicken:[3,1],tea:[4,1],scone:[5,1],fishChips:[6,1],onigiri:[7,1],sushi:[0,2],ramen:[1,2],dates:[2,2],baklava:[3,2],shawarma:[4,2],pizza:[5,2],hotdog:[6,2],burger:[7,2],sausageRoll:[0,3],meatPie:[1,3],avocadoToast:[2,3],banana:[3,3],pineapple:[4,3],acai:[5,3],taco:[6,3],avocado:[7,3],smoothie:[0,4],dumpling:[1,4],bao:[2,4],noodles:[3,4],fig:[4,4],teaGlass:[5,4]};
function foodSet(){const n=typeof level==='number'?level:0;return FOOD_SETS[Math.max(0,Math.min(FOOD_SETS.length-1,n))]||FOOD_SETS[0]}
function pickFood(){const a=foodSet(),r=Math.random();return a[r<.4?0:r<.8?1:2]}
makeFood=function(){const n=typeof level==='number'?level:0,type=pickFood(),rare=FOOD_RARE[Math.max(0,Math.min(FOOD_RARE.length-1,n))]===type;let p={x:90,y:300},gap=-1;for(let i=0;i<80;i++){const q={x:rand(90,WORLD.w-90),y:rand(260,Math.min(WORLD.h-100,1080))},g=foods.length?foods.reduce((m,f)=>Math.min(m,dist(q,f)),Infinity):Infinity;if(g>gap){p=q;gap=g}if(g>=150)break}return{type,...p,r:rare?25:21,score:rare?25:10+(Math.random()*8|0),xp:rare?2:1,phase:rand(0,10),rare}};
const oldFoodDraw=drawFood;
drawFood=function(f){const cell=FOOD_SPRITES[f.type];if(!cell||!FOOD_ATLAS.complete||!FOOD_ATLAS.naturalWidth)return oldFoodDraw(f);const q=screen(f),bob=Math.sin(time*2.35+(f.phase||0))*4,size=72*(f.rare?1.12:1),sx=cell[0]*C,sy=cell[1]*C;ctx.save();ctx.translate(q.x,q.y+bob);ctx.shadowColor='#54ff70';ctx.shadowBlur=9;ctx.drawImage(FOOD_ATLAS,sx,sy,C,C,-size/2,-size/2,size,size);ctx.shadowBlur=0;ctx.drawImage(FOOD_ATLAS,sx,sy,C,C,-size/2,-size/2,size,size);if(f.rare){ctx.strokeStyle='rgba(255,225,105,.92)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,size*.42,0,Math.PI*2);ctx.stroke()}ctx.restore()};
