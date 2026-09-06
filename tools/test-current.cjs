const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=Array.from({length:13},(_,i)=>fs.readFileSync('game-v9-part'+String(i).padStart(2,'0')+'.txt','utf8')).join('');
let script=html.match(/<script>([\s\S]*)<\/script>/)[1];
script=script.replace('})();','globalThis.test={start,update,seed,makeFood,visibleAirTarget,edible,get:()=>({player,foods,enemies,ufos,planes,lasers,cam}),setTargets:(u,p)=>{ufos=u;planes=p;foods=[];healthDrops=[];enemies=[];grounds=[];boats=[];}};})();');
const nodes=new Map(),ctx=new Proxy({getImageData:()=>({data:new Uint8ClampedArray(0)}),createLinearGradient:()=>({addColorStop(){}})},{get:(o,k)=>o[k]||(()=>{})});
function node(){return {style:{},hidden:false,getContext:()=>ctx,addEventListener(){},setAttribute(){}}}
const env={console,innerWidth:390,innerHeight:844,devicePixelRatio:1,localStorage:{getItem:()=>0},document:{getElementById:id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id)},createElement:node,addEventListener(){}},Image:class {complete=false;set src(s){this.naturalWidth=1024;this.naturalHeight=3072;}},addEventListener(){},requestAnimationFrame(){}};
vm.createContext(env);vm.runInContext(script,env);const t=env.test;t.start();let s=t.get();assert(!nodes.get('overlay').hidden===false);assert(s.enemies.every(e=>e.kind!=='ptero'));assert(s.foods.every(f=>f.type!=='fish'));assert(s.foods.length===55);assert(s.foods.every((f,i)=>s.foods.every((g,j)=>i===j||Math.hypot(f.x-g.x,f.y-g.y)>=150)));
s.player.stage=6;s.player.x=195;s.player.y=400;s.cam.x=0;s.cam.y=0;
const off={kind:'ufo',x:450,y:400,size:82,hp:2,vx:0,phase:0};t.setTargets([off],[]);t.update(0);assert(off.hp===2,'Offscreen UFO must not be shot');
const plane={kind:'plane',x:300,y:400,size:118,hp:2,vx:0,phase:0};t.setTargets([], [plane]);t.update(0);assert(plane.hp===1,'Visible plane should be shot');s.player.laser=0;t.update(0);assert(plane.hp===2,'Destroyed plane respawns');
assert(t.edible({kind:'crow'}));s.player.stage=0;assert(!t.edible({kind:'crow'}));console.log('PASS: startup, spacing, fish/pterodactyl removal, visible-only lasers, plane damage and respawn, enemy edibility.');
