 const analytics=DATA.analytics;
 const evalByFen=new Map();
 if(analytics)for(const item of analytics.positions){const prior=evalByFen.get(item.fen);if(!prior||(item.depth||0)>=(prior.depth||0))evalByFen.set(item.fen,item)}
 let forecast=null,lessonFilter='all';
 function evalText(e){if(!e)return 'Not analyzed';if(e.terminal)return e.terminal==='draw'?'Draw by the rules':(e.terminal==='white'?'White':'Black')+' has delivered checkmate';if(e.mate!==null)return(e.mate>0?'White':'Black')+' has a mating line: M'+Math.abs(e.mate);return(e.cp>=0?'+':'−')+(Math.abs(e.cp)/100).toFixed(2)+' · White perspective'}
 function jumpToPly(n){stop();mode='replay';ply=n;selected=null;trial=null;draw()}
 function updateInsights(){
  const e=evalByFen.get(current().fen);$('eval-readout').textContent=evalText(e);$('eval-depth').textContent=e?'Depth '+(e.depth??'—'):'No engine data for this position';
  $('eval-rail').classList.toggle('flipped',flipped);$('eval-rail').classList.toggle('unknown',!e);$('eval-rail').setAttribute('aria-label',e?evalText(e):'This position has not been analyzed');
  const value=e?e.advantage:50;$('eval-white').style.height=value+'%';$('eval-black').style.height=(100-value)+'%';
  const s=current();let note=s.mate?'Checkmate has occurred.':s.check?s.turn+' is in check and must respond to the check.':e?.mate!==null&&e?.mate!==undefined?evalText(e)+': the engine found a mating line at this depth; the opponent may choose a different continuation.':'Check the opponent’s checks, captures and immediate threats first.';
  if(!s.mate&&e?.forecast?.length>1){const tactical=e.forecast.slice(1,7).find(f=>f.mate||f.check||f.san.includes('x'));if(tactical)note+=' The example includes '+tactical.san+'; replay it to explore.'}
  $('risk-text').textContent=note;$('forecast-open').disabled=!e||e.forecast.length<2;$('forecast-open').textContent=e&&e.forecast.length>1?'Explore engine line and threats →':'No engine continuation for this position';
  if(analytics){const n=DATA.states.findIndex(f=>f.fen===s.fen);const marker=$('chart-marker');marker.setAttribute('visibility',n<0?'hidden':'visible');if(n>=0){marker.setAttribute('x1',12+576*n/(DATA.states.length-1));marker.setAttribute('x2',12+576*n/(DATA.states.length-1));}$('chart-current').textContent=(mode==='forecast'?'Engine example · ':s.san?s.san+' · ':'Move '+s.number+' · '+s.turn+' to move · ')+evalText(e)}
 }
 function openForecast(){const e=evalByFen.get(current().fen);if(!e||e.forecast.length<2)return;stop();forecast=e;mode='forecast';step=0;selected=null;trial=null;draw()}
 function drawForecast(){
  $('forecast-summary').textContent='Replay one engine continuation from the selected position. Check is not checkmate; a legal example does not mean the opponent must play it.';
  $('forecast-moves').replaceChildren();forecast.forecast.forEach((f,i)=>{const b=document.createElement('button');b.textContent=i?f.san+(f.mate?' · Checkmate':f.check?' · Check':f.san.includes('x')?' · Capture':''):'Start of the line';b.classList.toggle('active',step===i);b.onclick=()=>{stop();step=i;draw()};$('forecast-moves').append(b)});
 }
 function initInsights(){
  $('forecast-open').onclick=openForecast;$('forecast-back').onclick=()=>setMode('lesson');
  for(const button of document.querySelectorAll('[data-actor-filter]'))button.onclick=()=>{lessonFilter=button.dataset.actorFilter;document.querySelectorAll('[data-actor-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelectorAll('#lesson-list button').forEach((b,i)=>b.hidden=lessonFilter!=='all'&&DATA.lessons[i].actor!==lessonFilter);const i=DATA.lessons.findIndex(l=>lessonFilter==='all'||l.actor===lessonFilter);if(i>=0)chooseLesson(i)};
  for(const b of document.querySelectorAll('[data-actor-filter]'))if(b.dataset.actorFilter!=='all')b.disabled=!DATA.lessons.some(l=>l.actor===b.dataset.actorFilter);
  if(analytics){
   $('insights').hidden=false;
   for(const [id,side] of [['stats-user',DATA.meta.user_color],['stats-opponent',DATA.meta.user_color==='white'?'black':'white']]){
    const stats=analytics.sides[side],good=new Set(DATA.lessons.filter(l=>l.positive&&l.color===side).map(l=>l.ply)).size;
    const list=$(id);list.replaceChildren();
    for(const [key,label,value,unit] of [['moves','Total moves',stats.moves,''],['blunders','Blunders',stats.blunders,''],['mistakes','Mistakes',stats.mistakes,''],['good','Good moves',good,'']]){
     const row=document.createElement('div'),term=document.createElement('dt'),count=document.createElement('dd');row.className='stat-row';term.textContent=label;count.dataset.stat=key;count.textContent=String(value);row.append(term,count);list.append(row);
    }
   }
   const points=analytics.positions.map((e,i)=>[12+576*i/(analytics.positions.length-1),12+126*(1-e.advantage/100)]);
   const svg=$('eval-chart');svg.innerHTML='<rect x="12" y="12" width="576" height="63" fill="#f2f5ed"/><rect x="12" y="75" width="576" height="63" fill="#e0e7e0"/><path d="M12 75H588" stroke="#b7c1b6" stroke-dasharray="4 4"/><path d="'+points.map(([x,y],i)=>(i?'L':'M')+x.toFixed(2)+' '+y.toFixed(2)).join(' ')+'" fill="none" stroke="#235c45" stroke-width="2.5"/><line id="chart-marker" x1="12" x2="12" y1="10" y2="140" stroke="#ad6942" stroke-width="1.5"/>';
   points.forEach(([x,y],i)=>{const dot=document.createElementNS('http://www.w3.org/2000/svg','circle');dot.setAttribute('cx',x);dot.setAttribute('cy',y);dot.setAttribute('r','4');dot.setAttribute('fill','#235c45');dot.setAttribute('tabindex','0');dot.setAttribute('role','button');const name=(DATA.states[i].san||'Starting position')+' · '+evalText(analytics.positions[i]);dot.setAttribute('aria-label',name);const title=document.createElementNS('http://www.w3.org/2000/svg','title');title.textContent=name;dot.append(title);dot.onclick=e=>{e.stopPropagation();jumpToPly(i)};dot.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();jumpToPly(i)}};svg.append(dot)});
   svg.onclick=e=>{const rect=svg.getBoundingClientRect();jumpToPly(Math.max(0,Math.min(points.length-1,Math.round(((e.clientX-rect.left)/rect.width*600-12)/576*(points.length-1)))))};
   const events=[];for(const side of [DATA.meta.user_color,DATA.meta.user_color==='white'?'black':'white']){const rows=analytics.rows.filter(r=>r.side===side);events.push(...rows.filter(r=>r.classification!=='steady').sort((a,b)=>b.loss-a.loss).slice(0,2));events.push(...rows.filter(r=>r.classification==='steady'&&DATA.lessons.some(l=>l.positive&&l.color===side&&l.ply===r.ply)).slice(-2))}
   events.sort((a,b)=>a.ply-b.ply);for(const r of events){const b=document.createElement('button');const bad=r.classification!=='steady';b.className=bad?'bad':'good';b.textContent=(r.side===DATA.meta.user_color?'Me ':'Opponent:  ')+r.move+' · '+(bad?{blunder:'Blunder',mistake:'Mistake',inaccuracy:'Inaccuracy'}[r.classification]:'Good move');b.title='Click to replay '+r.move;b.onclick=()=>jumpToPly(r.ply+1);$('insight-events').append(b)}
   $('metric-engine').textContent=(analytics.engine.name||'Stockfish')+' · Per position: '+analytics.screen_seconds+'s screening; key moves deepened for '+analytics.refine_seconds+'s per position';
  }else{$('insights').hidden=false;$('insight-grid').hidden=true;$('insight-empty').hidden=false;$('metric-method').hidden=true}
  if(DATA.opening){const o=DATA.opening;$('opening-learn').hidden=false;$('opening-name').textContent=o.eco+' · '+o.name;$('opening-line').textContent=o.line;$('opening-match').textContent='The position after '+(DATA.states[o.ply].san||'the matched move')+' matches a named opening position, including transpositions. This does not mean every later move follows theory.';$('opening-notes').textContent=o.notes||'Return to the matched position. Look at the central pawns, piece development and king safety, then explore the opening resources.';$('opening-jump').onclick=()=>{jumpToPly(o.ply);$('board').scrollIntoView({block:'center',behavior:'smooth'})};$('opening-resource').href=o.resource;$('opening-source').href=o.source;
   if(o.name.startsWith('Italian Game')){$('opening-specific').hidden=false;$('opening-specific').href='https://www.chess.com/openings/Italian-Game';$('opening-specific').textContent='Italian Game: plans and variations ↗'}
   if(o.name.startsWith('Philidor Defense')){$('opening-specific').hidden=false;$('opening-specific').href='https://www.chess.com/openings/Philidor-Defense';$('opening-specific').textContent='Philidor Defense: plans and variations ↗'}
   if(o.name.startsWith('Sicilian Defense')){$('opening-specific').hidden=false;$('opening-specific').href='https://www.chess.com/openings/Sicilian-Defense';$('opening-specific').textContent='Sicilian Defense: plans and variations ↗'}
  }
 }
