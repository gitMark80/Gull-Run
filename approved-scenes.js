// Gull Run Evo — full illustrated World Tour backgrounds.
// Paris follows Sydney. Every World Tour stage now uses a dedicated scene asset.
const approvedWtBackground=wtBackground;
const WORLD_TOUR_SCENE_FILES={
  paris:'assets/levels/world-tour/paris.webp?v=20260909a',
  rome:'assets/levels/world-tour/rome.webp?v=20260909a',
  swiss:'assets/levels/world-tour/swiss-alps.webp?v=20260909a',
  bavaria:'assets/levels/world-tour/bavaria.webp?v=20260909a',
  london:'assets/levels/world-tour/london.webp?v=20260909a',
  tokyo:'assets/levels/world-tour/tokyo.webp?v=20260909a',
  dubai:'assets/levels/world-tour/dubai.webp?v=20260909a',
  wall:'assets/levels/world-tour/great-wall.webp?v=20260909a',
  egypt:'assets/levels/world-tour/egypt.webp?v=20260909a',
  rio:'assets/levels/world-tour/rio.webp?v=20260909a',
  la:'assets/levels/world-tour/los-angeles.webp?v=20260909a'
};
const worldTourSceneCache=new Map();

function loadWorldTourScene(theme){
  if(worldTourSceneCache.has(theme))return worldTourSceneCache.get(theme);
  const src=WORLD_TOUR_SCENE_FILES[theme];
  if(!src)return null;
  const image=new Image();
  const scene={image,ready:false,failed:false};
  image.decoding='async';
  image.onload=()=>{scene.ready=true;scene.failed=false;};
  image.onerror=()=>{scene.ready=false;scene.failed=true;};
  image.src=src;
  worldTourSceneCache.set(theme,scene);
  return scene;
}

function releaseDistantWorldTourScenes(currentIndex){
  const keep=new Set([WT[currentIndex]?.theme,WT[currentIndex+1]?.theme].filter(Boolean));
  for(const [theme,scene] of worldTourSceneCache){
    if(keep.has(theme))continue;
    scene.image.onload=null;
    scene.image.onerror=null;
    scene.image.src='';
    worldTourSceneCache.delete(theme);
  }
}

function resetWorldTourScenes(){
  for(const scene of worldTourSceneCache.values()){
    scene.image.onload=null;
    scene.image.onerror=null;
    scene.image.src='';
  }
  worldTourSceneCache.clear();
}

function drawWorldTourScene(image){
  ctx.drawImage(image,0,0,image.naturalWidth,image.naturalHeight,-cam.x,-cam.y,WORLD.w,WORLD.h);
}

function drawIllustratedLoadingScene(){
  // Sydney is already loaded before the player can reach the World Tour, so a
  // finished illustration remains visible even during a slow scene download.
  if(sydneyReady&&sydneyAtlas.naturalWidth){
    drawWorldTourScene(sydneyAtlas);
    return;
  }
  approvedWtBackground({theme:'swiss'});
}

wtBackground=function(stage){
  const index=WT.findIndex(item=>item.theme===stage?.theme);
  if(index<0){approvedWtBackground(stage);return;}
  const scene=loadWorldTourScene(stage.theme);
  const nextTheme=WT[index+1]?.theme;
  if(nextTheme)loadWorldTourScene(nextTheme);
  releaseDistantWorldTourScenes(index);
  if(scene?.ready&&scene.image.naturalWidth){
    drawWorldTourScene(scene.image);
    return;
  }
  drawIllustratedLoadingScene();
};

// Begin loading Paris during the three opening stages. Later scenes are loaded
// one stage ahead, keeping mobile memory use low while transitions stay instant.
loadWorldTourScene('paris');
const approvedPlayHandler=playBtn.onclick;
playBtn.onclick=function(event){
  if(level>0||worldTourSceneCache.size>1)resetWorldTourScenes();
  loadWorldTourScene('paris');
  return approvedPlayHandler.call(this,event);
};
