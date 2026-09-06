const fs=require('fs');
for(const code of ['1f354','1f32d','1f355','26f5']){
 let svg=fs.readFileSync(`assets/twemoji/${code}.svg`,'utf8');
 const colors=[...new Set([...svg.matchAll(/fill="(#[0-9A-Fa-f]{6})"/g)].map(m=>m[1]))];
 const mix=(c,n)=>'#'+c.slice(1).match(/../g).map(v=>Math.max(0,Math.min(255,parseInt(v,16)+n)).toString(16).padStart(2,'0')).join('');
 let defs=colors.map((c,i)=>`<linearGradient id="g${i}" x2=".35" y2="1"><stop stop-color="${mix(c,32)}"/><stop offset=".4" stop-color="${c}"/><stop offset="1" stop-color="${mix(c,-45)}"/></linearGradient>`).join('');
 colors.forEach((c,i)=>svg=svg.replaceAll(`fill="${c}"`,`fill="url(#g${i})"`));
 if(code==='26f5'){
 svg=svg.replace('</svg>','<g fill="none" stroke="#724921" stroke-width=".35" opacity=".7"><path d="M7 18Q12 16 17.5 17M10 13Q14 12 18 12M21 9Q25 10 27 12M21 15Q27 15 30 17M5 27H33M8 29H30"/></g><g fill="#173d62" stroke="#fff3c4" stroke-width=".4"><circle cx="16" cy="28" r=".9"/><circle cx="21" cy="28" r=".9"/><circle cx="26" cy="28" r=".9"/></g><path d="M19 3L32 23M19 5L5 23" fill="none" stroke="#fff7d7" stroke-width=".35"/><path d="M3 33Q9 31 15 33T33 33" fill="none" stroke="#ddfaff" stroke-width=".6"/></svg>');
 }else{
 defs+='<filter id="edge" x="-20%" y="-20%" width="140%" height="140%"><feMorphology in="SourceAlpha" operator="dilate" radius="1.1" result="wide"/><feFlood flood-color="#53ef62"/><feComposite in2="wide" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
 svg=svg.replace(/(<svg[^>]*>)/,'$1<g filter="url(#edge)">').replace('</svg>','</g></svg>');
 }
 svg=svg.replace(/(<svg[^>]*>)/,`$1<defs>${defs}</defs>`).replace('viewBox="0 0 36 36"','viewBox="-2 -2 40 40"');
 fs.writeFileSync(`assets/twemoji/${code}-detailed.svg`,svg);
}
