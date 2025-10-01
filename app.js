
// === Konfiguration ===
const SHEET_ID = '12E9MAaPikS3XavTG20juzrCkyyKSSb0Hmlsw_ZvzwwM';
const SHEET_DATA = 'Data';           // kolumner: date, value (ackumulerat)
const SHEET_MILESTONES = 'Milestones'; // kolumner: label, amount[, target]

// === Tillstånd ===
const S = { sound:true, reduced:false, data:[], ms:[], target:0, lastLevel:0 };
const E = {
  sound: document.getElementById('rc-sound'),
  motion: document.getElementById('rc-motion'),
  current: document.getElementById('rc-current'),
  target: document.getElementById('rc-target'),
  pct: document.getElementById('rc-pct'),
  ms: document.getElementById('rc-ms'),
  spark: document.getElementById('rc-sparkSvg'),
  coinRain: document.getElementById('rc-coinRain'),
  announcer: document.getElementById('rc-announcer'),
  fillRect: document.getElementById('rcFill'),
};

// === Ljud ===
let audioCtx; function chime(){ if(!S.sound) return; try{ audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)(); const now=audioCtx.currentTime; [880,1320,1760].forEach((f,i)=>{ const o=audioCtx.createOscillator(), g=audioCtx.createGain(); o.type='sine'; o.frequency.value=f; o.connect(g); g.connect(audioCtx.destination); const t0=now+i*0.04; g.gain.setValueAtTime(0.0001,t0); g.gain.exponentialRampToValueAtTime(0.22,t0+0.05); g.gain.exponentialRampToValueAtTime(0.0001,t0+0.9); o.start(t0); o.stop(t0+0.95); }); }catch(e){} }

// === Hjälpare ===
function SEK(n){ return new Intl.NumberFormat('sv-SE',{style:'currency',currency:'SEK',maximumFractionDigits:0}).format(n||0); }
function cur(){ return S.data.length ? +S.data[S.data.length-1].value : 0; }

// === GViz ===
function gvizUrl(sheet){ const base=`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq`; const qs=new URLSearchParams({sheet,headers:'1',tqx:'out:json',}); return base+'?'+qs.toString()+`&t=${Date.now()}`; }
async function fetchGViz(sheet){ const res=await fetch(gvizUrl(sheet),{cache:'no-store'}); const text=await res.text(); const from=text.indexOf('{'); const to=text.lastIndexOf('}')+1; const json=JSON.parse(text.slice(from,to)); const cols=json.table.cols.map(c=>(c.label||c.id||'').toString().trim().toLowerCase()); const rows=(json.table.rows||[]).map(r=>(r.c||[]).map(c=>c?(c.f??c.v):null)); return { cols, rows } }
function rowsToObjects(cols,rows){ return rows.map(r=>Object.fromEntries(cols.map((c,i)=>[c,r[i]]))); }

// === Rendering ===
function updateFigure(){
  // Justera fyllning utifrån real cavity‑bbox (beräkna dynamiskt)
  const cavity = document.getElementById('rc-cavity') || document.getElementById('rc-cavity'); // fallback
  const b = document.getElementById('rc-cavity')?.getBBox?.() || document.getElementById('rc-cavity');
}

function fillFigure(){
  // Vi vet cavity‑mått från path #rc-cavity: y=20..180, höjd=160 (enligt path ovan)
  const minY=20, maxY=180, height=160;
  const p = Math.max(0, Math.min(1, cur() / Math.max(1,S.target||1)));
  const h = Math.round(height * p);
  const y = maxY - h;
  E.fillRect.setAttribute('y', y);
  E.fillRect.setAttribute('height', h);
  E.pct.textContent = Math.round(p*100)+'%';
}

function renderTotals(){ E.current.textContent = SEK(cur()); E.target.textContent = SEK(S.target); }
function renderMilestones(){ const c=cur(); const nextIndex=S.ms.findIndex(m=>c<m.amount); E.ms.innerHTML=''; S.ms.forEach((m,i)=>{ const d=document.createElement('div'); d.className='ms'; if(c>=m.amount) d.classList.add('reached'); else if(i===nextIndex) d.classList.add('next'); d.textContent=`${m.label}: ${SEK(m.amount)}`; E.ms.appendChild(d); }); }
function renderSpark(){ const w=220,h=48,p=2,svg=E.spark,data=S.data; while(svg.firstChild) svg.removeChild(svg.firstChild); if(!data.length) return; const min=Math.min(...data.map(d=>+d.value)); const max=Math.max(...data.map(d=>+d.value)); const rng=Math.max(1,max-min); const pts=data.map((d,i)=>{ const x=p+i*((w-2*p)/Math.max(1,data.length-1)); const y=h-p-((+d.value-min)/rng)*(h-2*p); return [x,y]; }); const area=document.createElementNS('http://www.w3.org/2000/svg','path'); area.setAttribute('d','M '+pts.map(p=>p.join(',')).join(' L ')+` L ${pts.at(-1)[0]},${h-p} L ${pts[0][0]},${h-p} Z`); area.setAttribute('fill','rgba(34,211,238,.12)'); const path=document.createElementNS('http://www.w3.org/2000/svg','path'); path.setAttribute('d','M '+pts.map(p=>p.join(',')).join(' L ')); path.setAttribute('fill','none'); path.setAttribute('stroke','#22d3ee'); path.setAttribute('stroke-width','2'); svg.appendChild(area); svg.appendChild(path); }

function coinRain(n=36){ if(S.reduced) return; const box=E.coinRain.getBoundingClientRect(); const count=Math.min(140,Math.max(16,n)); for(let i=0;i<count;i++){ const d=document.createElement('div'); d.className='coin'; const dur=1.4+Math.random()*0.9; const delay=Math.random()*0.6; const left=Math.random()*(box.width-18); const drift=(Math.random()*120-60)+'px'; d.style.left=left+'px'; d.style.setProperty('--x',drift); d.style.animation=`fall ${dur}s ${delay}s cubic-bezier(.2,.8,.2,1) both`; E.coinRain.appendChild(d); setTimeout(()=>d.remove(),(dur+delay)*1000+200); }}
function announce(msg){ E.announcer.textContent=''; requestAnimationFrame(()=> E.announcer.textContent=msg); }
function checkLevel(){ const c=cur(); let r=0; for(const m of S.ms){ if(c>=m.amount) r++; } if(r>S.lastLevel){ S.lastLevel=r; const label=S.ms[r-1]?.label||'delmål'; announce(`Grattis! Ni nådde ${label}!`); coinRain(44+r*6); chime(); } }
function renderAll(){ renderTotals(); fillFigure(); renderMilestones(); renderSpark(); checkLevel(); }

// === Styrning ===
E.sound?.addEventListener('change', e=> S.sound=!!e.target.checked );
function applyMotion(){ document.body.classList.toggle('reduce-motion', S.reduced); }
E.motion?.addEventListener('change', e=>{ S.reduced=!!e.target.checked; applyMotion(); });

// === Ladda data (auto vid sidladdning) ===
async function loadFromSheet(){
  const d = await fetchGViz(SHEET_DATA); const data=rowsToObjects(d.cols,d.rows).filter(o=>o.date&&o.value).map(o=>({date:String(o.date).slice(0,10), value:Number(String(o.value).replace(/[\s,]/g,''))})).sort((a,b)=> a.date.localeCompare(b.date));
  const m = await fetchGViz(SHEET_MILESTONES); const ms=rowsToObjects(m.cols,m.rows).filter(o=>o.label&&o.amount).map(o=>({label:String(o.label), amount:Number(String(o.amount).replace(/[\s,]/g,'')), target:o.target? Number(String(o.target).replace(/[\s,]/g,'')) : null})).sort((a,b)=> a.amount-b.amount);
  const explicit = ms.find(x=>!isNaN(x.target))?.target; const target = explicit || (ms.at(-1)?.amount||1);
  S.data=data; S.ms=ms.map(({label,amount})=>({label,amount})); S.target=target; S.lastLevel=0;
}

(async function init(){ const prefers=window.matchMedia('(prefers-reduced-motion: reduce)').matches; S.reduced=prefers; if(E.motion) E.motion.checked=prefers; applyMotion(); await loadFromSheet(); renderAll(); })();
