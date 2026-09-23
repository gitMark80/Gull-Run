// Developer-only level jump. Append after the other game expansions inside the IIFE.
if(new URLSearchParams(location.search).get('dev')==='1'){
  const developerStageNames=LEVELS.map((item,index)=>`${index+1}. ${item.name}`);
  const originalDeveloperPlay=playBtn.onclick;

  function findDeveloperStage(value){
    const key=String(value??'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'');
    if(/^\d+$/.test(key)){
      const number=Number(key);
      return number>=1&&number<=LEVELS.length?number-1:-1;
    }
    return LEVELS.findIndex(item=>item.name.toLowerCase().replace(/[^a-z0-9]+/g,'')===key);
  }

  function createDeveloperSelect(){
    const select=document.createElement('select');
    select.setAttribute('aria-label','Developer stage');
    select.style.cssText='max-width:100%;padding:8px;border:2px solid #143c69;border-radius:8px;background:#fff;color:#143c69;font:700 14px system-ui';
    developerStageNames.forEach((name,index)=>{
      const option=document.createElement('option');
      option.value=String(index);
      option.textContent=name;
      select.appendChild(option);
    });
    return select;
  }

  const overlayDeveloperControls=document.createElement('div');
  overlayDeveloperControls.style.cssText='margin:12px 0;padding:10px;border:2px solid #143c69;border-radius:12px;background:#e7f4ff;display:grid;gap:6px';
  const overlayDeveloperLabel=document.createElement('label');
  overlayDeveloperLabel.textContent='DEVELOPER: START AT STAGE';
  overlayDeveloperLabel.style.cssText='font:900 12px system-ui;letter-spacing:.04em';
  const overlayDeveloperSelect=createDeveloperSelect();
  overlayDeveloperLabel.appendChild(overlayDeveloperSelect);
  overlayDeveloperControls.appendChild(overlayDeveloperLabel);
  document.querySelector('#overlay .card').insertBefore(overlayDeveloperControls,playBtn);

  const inGameDeveloperControls=document.createElement('div');
  inGameDeveloperControls.style.cssText='position:absolute;top:max(104px,calc(env(safe-area-inset-top) + 104px));right:8px;display:flex;gap:5px;align-items:center;padding:5px;border:2px solid #9fd8ff;border-radius:10px;background:#143c69ec;pointer-events:auto;text-shadow:none';
  const inGameDeveloperSelect=createDeveloperSelect();
  const jumpButton=document.createElement('button');
  jumpButton.textContent='JUMP';
  jumpButton.setAttribute('aria-label','Jump to selected stage');
  jumpButton.style.cssText='padding:8px;border-radius:8px;font-size:12px;box-shadow:none';
  inGameDeveloperControls.appendChild(inGameDeveloperSelect);
  inGameDeveloperControls.appendChild(jumpButton);
  hud.appendChild(inGameDeveloperControls);

  function setDeveloperSelection(index){
    overlayDeveloperSelect.value=String(index);
    inGameDeveloperSelect.value=String(index);
  }
  const initialDeveloperStage=findDeveloperStage(new URLSearchParams(location.search).get('stage'));
  setDeveloperSelection(initialDeveloperStage<0?0:initialDeveloperStage);
  overlayDeveloperSelect.onchange=()=>setDeveloperSelection(Number(overlayDeveloperSelect.value));
  inGameDeveloperSelect.onchange=()=>setDeveloperSelection(Number(inGameDeveloperSelect.value));
  inGameDeveloperControls.addEventListener('keydown',event=>event.stopPropagation());
  inGameDeveloperControls.addEventListener('keyup',event=>event.stopPropagation());
  overlayDeveloperControls.addEventListener('keydown',event=>event.stopPropagation());
  overlayDeveloperControls.addEventListener('keyup',event=>event.stopPropagation());

  function applyDeveloperStage(index){
    level=index;
    seed();
    Object.assign(player,{x:320,y:WORLD.ocean+170,vx:0,vy:0,hp:100,inv:index?2:0,xp:0,stage:0,frame:0,edge:0,laser:0});
    cam.x=0;
    cam.y=clamp(player.y-H/2,0,Math.max(0,WORLD.h-H));
    levelNoticeUntil=time+4;
    if(index>=3)loadWorldTourScene(WT[index-3].theme);
    nextHudAt=-1;
    updateHud();
  }

  playBtn.onclick=function(event){
    const result=originalDeveloperPlay.call(this,event);
    const index=Number(overlayDeveloperSelect.value);
    if(playing&&Number.isInteger(index)&&index>=0&&index<LEVELS.length)applyDeveloperStage(index);
    return result;
  };
  jumpButton.onclick=()=>playBtn.onclick();

  globalThis.gullRunDev=Object.freeze({
    stages:developerStageNames,
    currentStage:()=>developerStageNames[level],
    jumpTo(value){
      const index=findDeveloperStage(value);
      if(index<0||playBtn.disabled)return false;
      setDeveloperSelection(index);
      playBtn.onclick();
      return true;
    }
  });
}
