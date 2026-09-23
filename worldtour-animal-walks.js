// Four distinct drawn poses per World Tour animal. The feet stride at a rate
// tied to the animal's actual travel speed, so they never run in place.
const WT_ANIMAL_SPECIES={
  parisRat:'rat',parisCat:'cat',romeWolf:'wolf',romeBoar:'boar',
  swissIbex:'ibex',swissChamois:'chamois',bavariaBear:'bear',bavariaStag:'stag',
  londonFox:'fox',londonRat:'rat',tokyoTanuki:'tanuki',tokyoMacaque:'macaque',
  dubaiCamel:'camel',dubaiOryx:'oryx',wallTiger:'tiger',wallMacaque:'macaque',
  egyptJackal:'jackal',egyptCamel:'camel',rioJaguar:'jaguar',rioCapybara:'capybara',
  laCoyote:'coyote',laSeaLion:'seaLion'
};
const WT_ANIMAL_LOOK={
  rat:     {coat:'#888d98',light:'#b7bbc2',dark:'#545969',muzzle:'#d7c2ba',ear:'round',tail:'thin',bodyW:40,bodyH:22,bodyY:71,headY:59},
  cat:     {coat:'#c77d45',light:'#f2c38a',dark:'#744b39',muzzle:'#f2dac4',ear:'point',tail:'curl',bodyW:42,bodyH:24,bodyY:65,headY:51},
  wolf:    {coat:'#767f91',light:'#bfc5ce',dark:'#434a5c',muzzle:'#d0d2d3',ear:'point',tail:'bushy',bodyW:45,bodyH:26,bodyY:63,headY:48},
  boar:    {coat:'#8a5746',light:'#bc8670',dark:'#573c35',muzzle:'#d49c86',ear:'point',tail:'short',bodyW:49,bodyH:31,bodyY:68,headY:57},
  ibex:    {coat:'#ae8969',light:'#e2c5a3',dark:'#66503f',muzzle:'#e6d7c1',ear:'point',tail:'short',bodyW:43,bodyH:26,bodyY:63,headY:48,horns:'curved'},
  chamois: {coat:'#a97d54',light:'#e4bf91',dark:'#634d38',muzzle:'#eee0c9',ear:'point',tail:'short',bodyW:41,bodyH:24,bodyY:63,headY:48,horns:'hook'},
  bear:    {coat:'#745446',light:'#b18b6d',dark:'#413128',muzzle:'#c9ad8d',ear:'round',tail:'short',bodyW:51,bodyH:35,bodyY:65,headY:51},
  stag:    {coat:'#9b6647',light:'#d7a579',dark:'#5d4035',muzzle:'#e1bd9d',ear:'point',tail:'short',bodyW:44,bodyH:25,bodyY:64,headY:48,horns:'antlers'},
  fox:     {coat:'#db7739',light:'#ffbd73',dark:'#79442f',muzzle:'#fff0d9',ear:'point',tail:'fox',bodyW:42,bodyH:24,bodyY:65,headY:49},
  tanuki:  {coat:'#81745f',light:'#c5b496',dark:'#423d3c',muzzle:'#efe4cd',ear:'round',tail:'bushy',bodyW:43,bodyH:27,bodyY:67,headY:51,mask:true},
  macaque: {coat:'#8e6855',light:'#c8a083',dark:'#583e38',muzzle:'#dbb3a4',ear:'round',tail:'curl',bodyW:37,bodyH:27,bodyY:64,headY:46},
  camel:   {coat:'#c49c62',light:'#efd1a1',dark:'#80613d',muzzle:'#e9d3b0',ear:'small',tail:'short',bodyW:45,bodyH:23,bodyY:68,headY:37,hump:true},
  oryx:    {coat:'#e6ded1',light:'#fffaf0',dark:'#887b6f',muzzle:'#f8eee1',ear:'point',tail:'short',bodyW:43,bodyH:23,bodyY:64,headY:46,horns:'straight'},
  tiger:   {coat:'#e48b36',light:'#ffc87d',dark:'#673b2d',muzzle:'#ffdfb8',ear:'round',tail:'curl',bodyW:47,bodyH:28,bodyY:64,headY:49,stripes:true},
  jackal:  {coat:'#9f815a',light:'#dbc49a',dark:'#514b42',muzzle:'#e0c6a5',ear:'point',tail:'bushy',bodyW:43,bodyH:23,bodyY:63,headY:46},
  jaguar:  {coat:'#d6a34e',light:'#f4d18b',dark:'#5a4931',muzzle:'#f3dcad',ear:'round',tail:'curl',bodyW:47,bodyH:27,bodyY:65,headY:49,spots:true},
  capybara:{coat:'#a37851',light:'#d1ac7a',dark:'#604839',muzzle:'#ca9f79',ear:'small',tail:'none',bodyW:51,bodyH:31,bodyY:69,headY:57},
  coyote:  {coat:'#b29268',light:'#e4cea5',dark:'#615548',muzzle:'#e9d6ba',ear:'point',tail:'bushy',bodyW:43,bodyH:24,bodyY:63,headY:47},
  seaLion: {coat:'#876450',light:'#bc9680',dark:'#493930',muzzle:'#c6a891',ear:'none',tail:'none',bodyW:52,bodyH:28,bodyY:75,headY:62,flippers:true}
};
const WT_ANIMAL_ATLASES=new Map();
const WT_PAINTED_ATLASES=new Map();
const WT_PAINTED_FRAME={width:384,height:288};

function wtPaintedAtlas(type){
  if(WT_PAINTED_ATLASES.has(type))return WT_PAINTED_ATLASES.get(type);
  const image=new Image();
  WT_PAINTED_ATLASES.set(type,image);
  image.src=`assets/animal-sprites/${type}.webp?v=20260923c`;
  return image;
}

function wtAnimalEllipse(g,x,y,rx,ry,fill,outline='#283440',width=2.5){
  g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fillStyle=fill;g.fill();
  if(outline){g.strokeStyle=outline;g.lineWidth=width;g.stroke();}
}
function wtAnimalLine(g,points,color,width,outline){
  g.beginPath();g.moveTo(points[0][0],points[0][1]);
  for(let i=1;i<points.length;i++)g.lineTo(points[i][0],points[i][1]);
  g.lineCap='round';g.lineJoin='round';
  if(outline){g.strokeStyle=outline;g.lineWidth=width+3;g.stroke();}
  g.strokeStyle=color;g.lineWidth=width;g.stroke();
}
function wtAnimalLeg(g,s,hip,offset,back,footY){
  const swing=[-12,-5,12,5][offset],lift=[0,6,0,3][offset];
  const x=hip+swing,coat=back?s.dark:s.coat;
  wtAnimalLine(g,[[hip,s.bodyY+10],[hip+swing*.35,s.bodyY+28],[x,footY-lift]],coat,s.flippers?12:9,s.dark);
  wtAnimalEllipse(g,x+4,footY-lift,8,s.flippers?5:4,coat,s.dark,2);
}
function wtAnimalTail(g,s,type,frame){
  const wave=[0,-5,0,5][frame],y=s.bodyY;
  if(s.tail==='none')return;
  if(s.tail==='thin'||s.tail==='curl'){
    g.beginPath();g.moveTo(-s.bodyW+1,y+2);
    g.bezierCurveTo(-66,y-10+wave,-69,y+31+wave,-88,y+8+wave);
    g.strokeStyle=s.tail==='thin'?'#dfabaf':s.dark;g.lineWidth=s.tail==='thin'?5:12;g.lineCap='round';g.stroke();
    if(s.tail==='curl')wtAnimalEllipse(g,-84,y+8+wave,8,7,s.light,s.dark,2);
  }else if(s.tail==='bushy'||s.tail==='fox'){
    g.beginPath();g.moveTo(-s.bodyW+4,y+3);g.quadraticCurveTo(-67,y-23+wave,-84,y-23+wave);
    g.quadraticCurveTo(-73,y+6+wave,-58,y+14);g.closePath();
    g.fillStyle=s.tail==='fox'?s.coat:s.dark;g.fill();g.strokeStyle=s.dark;g.lineWidth=2;g.stroke();
    if(s.tail==='fox')wtAnimalEllipse(g,-81,y-20+wave,7,6,'#fff3df',null);
  }else{
    wtAnimalLine(g,[[-s.bodyW,y],[-s.bodyW-13,y+8+wave]],s.dark,5);
  }
}
function wtAnimalEars(g,s){
  if(s.ear==='none')return;
  const x=42,y=s.headY-16;
  if(s.ear==='point'){
    for(const dx of [-12,12]){
      g.beginPath();g.moveTo(x+dx-8,y+5);g.lineTo(x+dx-5,y-20);g.lineTo(x+dx+9,y+3);g.closePath();
      g.fillStyle=s.dark;g.fill();g.strokeStyle='#283440';g.lineWidth=2;g.stroke();
      g.beginPath();g.moveTo(x+dx-3,y+1);g.lineTo(x+dx-2,y-11);g.lineTo(x+dx+4,y+1);g.closePath();g.fillStyle=s.muzzle;g.fill();
    }
  }else{
    for(const dx of [-13,12])wtAnimalEllipse(g,x+dx,y-4,s.ear==='small'?6:9,s.ear==='small'?7:10,s.dark,'#283440',2);
  }
}
function wtAnimalHorns(g,s){
  if(!s.horns)return;
  const x=39,y=s.headY-16;
  g.lineCap='round';g.lineJoin='round';g.strokeStyle=s.horns==='antlers'?'#604634':'#4c4944';g.lineWidth=5;
  for(const dx of [-10,8]){
    g.beginPath();g.moveTo(x+dx,y);
    if(s.horns==='curved')g.bezierCurveTo(x+dx-12,y-20,x+dx-19,y-27,x+dx-8,y-42);
    else if(s.horns==='hook')g.bezierCurveTo(x+dx+1,y-22,x+dx+2,y-29,x+dx-7,y-28);
    else if(s.horns==='straight')g.lineTo(x+dx+(dx>0?8:-8),y-43);
    else{
      g.lineTo(x+dx+(dx>0?12:-12),y-34);
      g.moveTo(x+dx+(dx>0?6:-6),y-17);g.lineTo(x+dx+(dx>0?19:-19),y-27);
      g.moveTo(x+dx+(dx>0?9:-9),y-27);g.lineTo(x+dx+(dx>0?5:-5),y-40);
    }
    g.stroke();
  }
}
function wtAnimalMarkings(g,s){
  if(s.stripes){
    for(const x of [-35,-17,4,20])wtAnimalLine(g,[[x,s.bodyY-s.bodyH+5],[x+6,s.bodyY-3]],s.dark,5);
    for(const x of [36,50])wtAnimalLine(g,[[x,s.headY-10],[x+5,s.headY-2]],s.dark,3);
  }
  if(s.spots){
    for(const [x,y] of [[-37,-8],[-17,-13],[4,-8],[20,3],[-28,10],[-3,11]]){
      wtAnimalEllipse(g,x,s.bodyY+y,3.2,2.7,s.dark,null);
      wtAnimalEllipse(g,x+1,s.bodyY+y,1,1,s.light,null);
    }
  }
}
function wtAnimalHead(g,s,type){
  const y=s.headY;
  if(s.hump){
    g.beginPath();g.moveTo(16,s.bodyY+12);g.quadraticCurveTo(24,y-15,33,y-10);g.lineTo(45,y+10);g.closePath();
    g.fillStyle=s.coat;g.fill();g.strokeStyle=s.dark;g.lineWidth=2.5;g.stroke();
  }
  wtAnimalEars(g,s);wtAnimalHorns(g,s);
  wtAnimalEllipse(g,42,y,type==='capybara'?23:21,type==='camel'?15:19,s.coat);
  if(s.mask)wtAnimalEllipse(g,50,y-2,18,10,s.dark,null);
  wtAnimalEllipse(g,59,y+9,type==='boar'?17:15,type==='capybara'?11:9,s.muzzle);
  if(type==='boar'){
    wtAnimalEllipse(g,68,y+10,12,9,s.dark,null);
    wtAnimalEllipse(g,64,y+9,2,2,s.muzzle,null);
    wtAnimalEllipse(g,72,y+9,2,2,s.muzzle,null);
    wtAnimalLine(g,[[54,y+14],[60,y+5]],'#fff4d3',5,s.dark);
  }else{
    wtAnimalEllipse(g,72,y+6,4,3,s.dark,null);
  }
  wtAnimalEllipse(g,50,y-5,3.3,3.6,'#1b2530',null);
  wtAnimalEllipse(g,49,y-6,1.2,1.2,'#fff',null);
  if(type==='rat'||type==='cat'||type==='seaLion'){
    g.strokeStyle=s.dark;g.lineWidth=1.6;
    for(const dy of [0,5]){
      g.beginPath();g.moveTo(64,y+11+dy);g.lineTo(85,y+6+dy);g.moveTo(63,y+12+dy);g.lineTo(85,y+15+dy);g.stroke();
    }
  }
}
function wtDrawAnimalFrame(g,type,frame){
  const s=WT_ANIMAL_LOOK[type];
  const bob=[0,-3,0,-2][frame];
  g.save();g.translate(90,0);
  wtAnimalEllipse(g,0,117,63,5,'rgba(30,39,51,.20)',null);
  g.translate(0,bob);
  wtAnimalTail(g,s,type,frame);
  if(s.flippers){
    wtAnimalLeg(g,s,-29,(frame+2)%4,true,112-bob);
    wtAnimalLeg(g,s,25,frame,false,112-bob);
  }else{
    wtAnimalLeg(g,s,-30,(frame+2)%4,true,112-bob);
    wtAnimalLeg(g,s,23,frame,true,112-bob);
  }
  if(s.hump){
    for(const x of [-22,11])wtAnimalEllipse(g,x,s.bodyY-19,20,23,s.coat,s.dark,2);
  }
  const shade=g.createLinearGradient(0,s.bodyY-s.bodyH,0,s.bodyY+s.bodyH);
  shade.addColorStop(0,s.light);shade.addColorStop(.6,s.coat);shade.addColorStop(1,s.dark);
  wtAnimalEllipse(g,-7,s.bodyY,s.bodyW,s.bodyH,shade);
  wtAnimalMarkings(g,s);
  if(!s.flippers){
    wtAnimalLeg(g,s,-25,frame,false,112-bob);
    wtAnimalLeg(g,s,29,(frame+2)%4,false,112-bob);
  }else{
    wtAnimalLine(g,[[5,s.bodyY+8],[24+[-11,0,11,0][frame],108-bob]],s.dark,13);
  }
  wtAnimalHead(g,s,type);
  g.restore();
}
function wtAnimalAtlas(kind){
  if(WT_ANIMAL_ATLASES.has(kind))return WT_ANIMAL_ATLASES.get(kind);
  const type=WT_ANIMAL_SPECIES[kind];
  const atlas=document.createElement('canvas');
  atlas.width=176*4;atlas.height=152;
  const graphics=atlas.getContext('2d');
  for(let frame=0;frame<4;frame++){
    graphics.save();graphics.translate(frame*176,12);
    wtDrawAnimalFrame(graphics,type,frame);
    graphics.restore();
  }
  WT_ANIMAL_ATLASES.set(kind,atlas);
  return atlas;
}
const wtPreviousGroundDraw=drawGroundEnemy;
drawGroundEnemy=function(animal){
  if(!WT_ANIMAL_SPECIES[animal.kind])return wtPreviousGroundDraw(animal);
  const position=screen(animal),type=WT_ANIMAL_SPECIES[animal.kind];
  const painted=type!=='rat'?wtPaintedAtlas(type):null;
  const ready=painted&&painted.complete&&painted.naturalWidth>=WT_PAINTED_FRAME.width*4;
  const sprite=ready?painted:wtAnimalAtlas(animal.kind),speed=Math.abs(animal.vx);
  const fps=speed<1?0:clamp(speed/8,3.2,4.4);
  const frame=(Math.floor(time*fps+animal.phase)%4+4)%4;
  ctx.save();ctx.translate(position.x,position.y);
  if(animal.vx<0)ctx.scale(-1,1);
  ctx.shadowColor=player&&player.stage===6?'#55ff72':'#ff405a';
  ctx.shadowBlur=8;
  if(ready){
    const h=animal.size*1.23,w=h*WT_PAINTED_FRAME.width/WT_PAINTED_FRAME.height;
    ctx.drawImage(sprite,frame*WT_PAINTED_FRAME.width,0,WT_PAINTED_FRAME.width,WT_PAINTED_FRAME.height,-w/2,-animal.size*.49,w,h);
  }else{
    ctx.drawImage(sprite,frame*176,0,176,152,-animal.size*.66,-animal.size*.47,animal.size*1.32,animal.size*1.1875);
  }
  ctx.restore();
};
