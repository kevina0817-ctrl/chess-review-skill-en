// Self-contained view: fetching is performed by the build script, never by the browser.
if(D.rating_history){
 const H=D.rating_history, poolNames={rapid:'Rapid',blitz:'Blitz',bullet:'Bullet',daily:'Daily'},resultNames={win:'Win',draw:'Draw',loss:'Loss',unknown:'Unknown'};
 const standard=H.games.filter(g=>g.rules==='chess'),pools=Object.keys(poolNames).filter(k=>standard.some(g=>g.pool===k)||H.current[k]);
 const date=(t,full=false)=>new Date(t*1000).toLocaleString('en-US',full?{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}:{year:'numeric',month:'2-digit',day:'2-digit'});
 const sign=n=>(n>0?'+':'')+n;
 let displayed=[],points=[],selected=0,positions=[],plotWidth=1000;
 $('rating-section').hidden=false;$('positive-nav').hidden=false;$('positive-nav').textContent='Growth';
 $('progress-evidence').open=false;$('progress-evidence').hidden=!D.progress?.length;
 $('progress-evidence').querySelector('summary').textContent='Individual game examples · '+(D.progress||[]).length+' records';
 $('archive-summary').textContent=D.cases.length+' comparisons · '+H.games.length+' historical games';
 for(const pool of pools){const opt=document.createElement('option');opt.value=pool;opt.textContent=poolNames[pool];$('rating-pool').append(opt)}
 $('rating-pool').value=pools.includes('rapid')?'rapid':pools[0]||'';
 $('rating-sync').textContent=(H.status==='stale'?'Update failed; showing the last complete snapshot. Last successful sync: ':'Synchronized: ')+date(H.synced_at,true)+' · Official archives may be delayed.';
 $('rating-coverage').textContent='This snapshot covers '+H.archives.length+' monthly archives and '+H.games.length+' completed games; standard chess: '+standard.length+', unrated standard games: '+standard.filter(g=>!g.rated).length+'. '+(H.games.length?('End dates: '+date(H.games[0].end_time)+' to '+date(H.games.at(-1).end_time)+' . '):'')+'Only records available through the official public archives are included.';
 function choose(index){
  if(!points.length)return;
  selected=Math.max(0,Math.min(index,points.length-1));const g=points[selected];
  $('rating-slider').value=selected;$('rating-position').textContent=(selected+1)+' / '+points.length;
  $('rating-prev').disabled=selected===0;$('rating-next').disabled=selected===points.length-1;
  $('rating-detail-title').textContent=g.rating+' · '+resultNames[g.result]+' · vs. '+g.opponent;
  const all=standard.filter(x=>x.rated&&x.pool===g.pool&&Number.isFinite(x.rating)),i=all.findIndex(x=>x.id===g.id),delta=i>0?' · Change from previous rating record: '+sign(g.rating-all[i-1].rating):' · First rating record';
  $('rating-detail-meta').textContent=date(g.end_time,true)+' · Playing '+(g.side==='white'?'White':'Black')+' · Opponent post-game rating: '+(g.opponent_rating??'unknown')+' rating'+delta;
  $('rating-game-link').href=g.url;
  const [x,y]=positions[selected]||[0,0];const marker=$('rating-marker');if(marker){marker.setAttribute('cx',x);marker.setAttribute('cy',y)}
  $('rating-chart').setAttribute('aria-label',poolNames[g.pool]+' rating chart; selected: '+date(g.end_time)+', '+g.rating+' rating, '+resultNames[g.result]);
 }
 function draw(){
  const svg=$('rating-chart');if(!points.length){svg.replaceChildren();return}
  plotWidth=Math.max(280,svg.clientWidth||1000);const w=plotWidth,h=300,l=45,r=w-17,t=24,b=258;
  svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
  const min=Math.min(...points.map(g=>g.rating)),max=Math.max(...points.map(g=>g.rating)),span=Math.max(60,max-min),lo=Math.max(0,Math.floor((min-span*.12)/20)*20),hi=Math.ceil((max+span*.12)/20)*20;
  const start=points[0].end_time,end=points.at(-1).end_time;
  positions=points.map(g=>[end===start?(l+r)/2:l+(g.end_time-start)/(end-start)*(r-l),b-(g.rating-lo)/(hi-lo)*(b-t)]);
  let markup='';for(let i=0;i<=4;i++){const y=t+(b-t)*i/4,value=Math.round(hi-(hi-lo)*i/4);markup+=`<line x1="${l}" x2="${r}" y1="${y}" y2="${y}" stroke="#e2e8e1"/><text x="${l-8}" y="${y+4}" text-anchor="end" font-size="12" fill="#617168">${value}</text>`}
  markup+=`<text x="${l}" y="284" font-size="12" fill="#617168">${date(start)}</text><text x="${r}" y="284" text-anchor="end" font-size="12" fill="#617168">${end!==start?date(end):''}</text>`;
  markup+=`<polyline points="${positions.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#235c45" stroke-width="2.5" stroke-linejoin="round"/>`;
  positions.forEach(([x,y],i)=>markup+=`<circle data-index="${i}" cx="${x}" cy="${y}" r="${points.length>80?2.5:3.5}" fill="#235c45"><title>${date(points[i].end_time)} · ${points[i].rating} rating</title></circle>`);
  markup+='<circle id="rating-marker" pointer-events="none" r="6" fill="#b57b19" stroke="white" stroke-width="2"/>';
  svg.innerHTML=markup;choose(selected);
 }
 function render(){
  const pool=$('rating-pool').value,period=$('rating-period').value,cut=period==='all'?0:H.synced_at-Number(period)*86400;
  displayed=standard.filter(g=>g.pool===pool&&g.end_time>=cut);
  points=displayed.filter(g=>g.rated&&Number.isFinite(g.rating));selected=Math.max(0,points.length-1);
  const current=H.current[pool];$('rating-current').textContent=current?.rating??'—';$('rating-current-date').textContent=current?'Latest rated game: '+date(current.date):'Current rating unavailable';
  $('rating-change').textContent=points.length>=2?sign(points.at(-1).rating-points[0].rating):'—';
  $('rating-peak').textContent=points.length?Math.max(...points.map(g=>g.rating)):'—';
  const rated=displayed.filter(g=>g.rated);$('rating-count').textContent=rated.length+' games';
  $('rating-results').textContent=['win','draw','loss'].map(k=>rated.filter(g=>g.result===k).length+' '+({win:'wins',draw:'draws',loss:'losses'}[k])).join(' · ')+(rated.some(g=>g.result==='unknown')?' · Includes unknown results':'');
  $('rating-range').textContent=(points.length?date(points[0].end_time)+' — '+date(points.at(-1).end_time):'No rating records')+(rated.length>points.length?' · '+(rated.length-points.length)+' games have no rating':'');
  $('rating-chart').hidden=!points.length;$('rating-empty').hidden=!!points.length;
  $('rating-detail').hidden=!points.length;$('rating-slider').disabled=!points.length;$('rating-slider').max=Math.max(0,points.length-1);
  $('rating-prev').disabled=$('rating-next').disabled=!points.length;$('rating-position').textContent='0 / 0';
  $('rating-rows').replaceChildren();for(const g of [...displayed].reverse()){
   const tr=document.createElement('tr');for(const value of [date(g.end_time,true),g.opponent+' ('+(g.opponent_rating??'—')+')',resultNames[g.result],g.rated?(g.rating??'Missing'):'Unrated']){const td=document.createElement('td');td.textContent=value;tr.append(td)}$('rating-rows').append(tr)
  }
  draw();
 }
 $('rating-slider').oninput=e=>choose(Number(e.target.value));$('rating-prev').onclick=()=>choose(selected-1);$('rating-next').onclick=()=>choose(selected+1);
 $('rating-pool').onchange=render;$('rating-period').onchange=render;
 $('rating-chart').onclick=e=>{if(!points.length)return;if(e.target.dataset.index!==undefined){choose(Number(e.target.dataset.index));return}const bounds=e.currentTarget.getBoundingClientRect(),x=(e.clientX-bounds.left)/bounds.width*plotWidth,y=(e.clientY-bounds.top)/bounds.height*300;let best=0,dist=Infinity;positions.forEach(([px,py],i)=>{const d=(x-px)**2+(y-py)**2;if(d<dist){best=i;dist=d}});choose(best)};
 new ResizeObserver(()=>{if(!$('positive-section').hidden)draw()}).observe($('rating-chart'));
 render();
}
