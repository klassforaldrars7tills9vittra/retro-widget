
// === Konfiguration ===
const SHEET_ID = '12E9MAaPikS3XavTG20juzrCkyyKSSb0Hmlsw_ZvzwwM';
const SHEET_DATA = 'Data';           // kolumner: date, value (ackumulerat)
const SHEET_MILESTONES = 'Milestones'; // kolumner: label, amount[, target]

// === Tillstånd ===
const S = { reduced:false, data:[], ms:[], target:0, lastLevel:0, bbox:null };
const E = {
  motion: document.getElementById('wb-motion'),
  current: document.getElementById('wb-current'),
  target: document.getElementById('wb-target'),
  pct: document.getElementById('wb-pct'),
  ms: document.getElementById('wb-ms'),
  coinRain: document.getElementById('wb-coinRain'),
  announcer: document.getElementById('wb-announcer'),
  fill: document.getElementById('wb-fill'),
  surfaceShade: document.getElementById('wb-surfaceShade'),
  cavity: document.getElementById('wb-cavity'),
  bubbles: document.getElementById('wb-bubbles'),
  bugs: document.getElementById('wb-bugs'),
  statusSmall: document.querySelector('.wb-footer small'),
};

// === Hjälpare ===
const SEK = n => new Intl.NumberFormat('sv-SE',{style:'currency',currency:'SEK',maximumFractionDigits:0}).format(n||0);
const cur = () => S.data.length ? +S.data[S.data.length-1].value : 0;
const NUM = x => Number(String(x).replace(/[^\d.-]/g,''));
function hhmmss(d=new Date()){return d.toLocaleTimeString('sv-SE',{hour:'2-digit',minute:'2-digit',second:'2-digit'});}
function setStatus(txt){ if(E.statusSmall){ E.statusSmall.textContent = txt; } }

// === GViz ===
function gvizUrl(sheet){ const base=`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq`; const qs=new URLSearchParams({sheet,headers:'1',tqx:'out:json'}); return base+'?'+qs.toString()+`&t=${Date.now()}`; }
async function fetchGViz(sheet){ const res=await fetch(gvizUrl(sheet),{cache:'no-store'}); const text=await res.text(); const from=text.indexOf('{'); const to=text.lastIndexOf('}')+1; const json=JSON.parse(text.slice(from,to)); const cols=json.table.cols.map(c=>(c.label||c.id||'').toString().trim().toLowerCase()); const rows=(json.table.rows||[]).map(r=>(r.c||[]).map(c=>c?(c.f??c.v):null)); return { cols, rows } }
function rowsToObjects(cols,rows){ return rows.map(r=>Object.fromEntries(cols.map((c,i)=>[c,r[i]]))); }

// === Flaskgeometri ===
function computeBBox(){ if(!E.cavity || !E.cavity.getBBox) return; const b = E.cavity.getBBox(); S.bbox = b; E.fill.setAttribute('x', b.x); E.fill.setAttribute('width', b.width); E.surfaceShade.setAttribute('x', b.x); E.surfaceShade.setAttribute('width', b.width); }

function fillBottle(){ const b = S.bbox; if(!b) return; const p = Math.max(0, Math.min(1, cur() / Math.max(1,S.target||1))); const h = Math.round(b.height * p); const y = b.y + (b.height - h); E.fill.setAttribute('y', y); E.fill.setAttribute('height', h); E.surfaceShade.setAttribute('y', y); E.pct.textContent = Math.round(p*100)+"%"; }

function renderTotals(){ E.current.textContent = SEK(cur()); E.target.textContent = SEK(S.target); }
function renderMilestones(){ const c=cur(); const nextIndex=S.ms.findIndex(m=>c<m.amount); E.ms.innerHTML=''; S.ms.forEach((m,i)=>{ const d=document.createElement('div'); d.className='ms'; if(c>=m.amount) d.classList.add('reached'); else if(i===nextIndex) d.classList.add('next'); d.textContent=`${m.label}: ${SEK(m.amount)}`; E.ms.appendChild(d); }); }

// === Myntregn ===
function coinRain(n=48){ if(S.reduced) return; const box=E.coinRain.getBoundingClientRect(); const count=Math.min(180, Math.max(20,n)); for(let i=0;i<count;i++){ const d=document.createElement('div'); d.className='coin'; const dur=1.4+Math.random()*1.2; const delay=Math.random()*0.6; const left=Math.random()*(box.width-18); const drift=(Math.random()*120-60)+'px'; d.style.left=left+'px'; d.style.setProperty('--x',drift); d.style.animation=`fall ${dur}s ${delay}s cubic-bezier(.2,.8,.2,1) both`; E.coinRain.appendChild(d); setTimeout(()=>d.remove(), (dur+delay)*1000+200); } }

// === Bubbler & nyckelpigor ===
let bubbleTimer; const BUG_COUNT = 8; const bugs = [];
function spawnBubble(){ if(S.reduced) return; const b=S.bbox; if(!b) return; const cx = b.x + Math.random()*b.width; const r = 2 + Math.random()*4; const startY = b.y + b.height - 4; const life = 1800 + Math.random()*1800; const c = document.createElementNS('http://www.w3.org/2000/svg','circle'); c.setAttribute('cx', cx); c.setAttribute('cy', startY); c.setAttribute('r', r); c.setAttribute('fill','url(#wb-bubble)'); c.style.opacity='0.85'; E.bubbles.appendChild(c); const drift = (Math.random()*12 - 6);
  const t0 = performance.now(); function tick(t){ const dt = t - t0; const k = Math.min(1, dt/life); const y = startY - k*S.bbox.height*0.9; const x = cx + drift*Math.sin(k*Math.PI*2); c.setAttribute('cy', y); c.setAttribute('cx', x); c.style.opacity = String(0.85*(1-k)); if(dt < life){ requestAnimationFrame(tick); } else { c.remove(); } }
  requestAnimationFrame(tick);
}
function initBugs(){ const b=S.bbox; if(!b) return; E.bugs.innerHTML=''; bugs.length=0; for(let i=0;i<BUG_COUNT;i++){ const img=document.createElementNS('http://www.w3.org/2000/svg','image'); img.setAttributeNS('http://www.w3.org/1999/xlink','href','assets/ladybug.svg'); const x = b.x + 6 + Math.random()*(b.width-12); const y = b.y + 6 + Math.random()*(b.height*0.8); img.setAttribute('x', x); img.setAttribute('y', y); img.setAttribute('width', 20); img.setAttribute('height', 16); img.style.opacity='0.9'; E.bugs.appendChild(img); const dir = Math.random()<0.5? -1: 1; const amp = 6+Math.random()*10; const speed = 4000 + Math.random()*5000; const baseRot = Math.random()*20-10; bugs.push({img,x,y,dir,amp,speed,baseRot,t0:performance.now()+Math.random()*1000}); }
}
function animateBugs(){ if(S.reduced) return; function step(t){ for(const bug of bugs){ const k = ((t - bug.t0) % bug.speed)/bug.speed; const yy = bug.y + Math.sin(k*2*Math.PI)*bug.amp; const xx = bug.x + Math.cos(k*2*Math.PI)*bug.amp*0.6*bug.dir; const rot = bug.baseRot + Math.sin(k*2*Math.PI)*6*bug.dir; bug.img.setAttribute('x', xx); bug.img.setAttribute('y', yy); bug.img.setAttribute('transform',`rotate(${rot} ${xx+10} ${yy+8})`); } requestAnimationFrame(step);} requestAnimationFrame(step); }
function startFluidFX(){ if(S.reduced) return; clearInterval(bubbleTimer); bubbleTimer = setInterval(spawnBubble, 320); initBugs(); animateBugs(); }

// === Delmålscheck ===
function checkLevel(){ const c=cur(); let r=0; for(const m of S.ms){ if(c>=m.amount) r++; } if(r>S.lastLevel){ S.lastLevel=r; const label=S.ms[r-1]?.label||'delmål'; announce(`Grattis! Ni nådde ${label}!`); coinRain(54+r*10); } }
function announce(msg){ E.announcer.textContent=''; requestAnimationFrame(()=> E.announcer.textContent=msg); }

function renderAll(){ renderTotals(); fillBottle(); renderMilestones(); checkLevel(); }

// === Styrning ===
function applyMotion(){ document.body.classList.toggle('reduce-motion', S.reduced); }
E.motion?.addEventListener('change', e=>{ S.reduced=!!e.target.checked; applyMotion(); });

// === Ladda data (auto) ===
async function loadFromSheet(){
  const d = await fetchGViz(SHEET_DATA); const dObjs = rowsToObjects(d.cols.map(c=>c.toLowerCase()), d.rows);
  const data = dObjs.map(o=>({ date: String(o.date||o['datum']||'').slice(0,10), value: NUM(o.value||o['värde']||o['varde']) }))
    .filter(o=>o.date && !isNaN(o.value))
    .sort((a,b)=> a.date.localeCompare(b.date));
  const m = await fetchGViz(SHEET_MILESTONES); const mObjs=rowsToObjects(m.cols.map(c=>c.toLowerCase()), m.rows);
  const ms = mObjs.map(o=>({ label: String(o.label||o['etikett']||''), amount: NUM(o.amount||o['belopp']), target: NUM(o.target||o['mål']||o['mal']) }))
    .filter(o=>o.label && !isNaN(o.amount))
    .sort((a,b)=> a.amount-b.amount);
  const explicit = ms.find(x=>!isNaN(x.target))?.target; const target = explicit || (ms.at(-1)?.amount||1);
  S.data=data; S.ms=ms.map(({label,amount})=>({label,amount})); S.target=target; S.lastLevel=0;
}

// === Auto-refresh (NYTT) ===
async function refreshNow(silent=false){ try{ if(!silent) setStatus('Hämtar…'); await loadFromSheet(); renderAll(); setStatus(`Senast uppdaterad ${hhmmss()}`); } catch(e){ console.error('Uppdateringsfel:', e); setStatus('Fel vid uppdatering – försök igen'); } }

// Polla var 60 s
const REFRESH_MS = 60000; setInterval(()=>refreshNow(true), REFRESH_MS);
// Hämta när sidan blir aktiv igen
document.addEventListener('visibilitychange', ()=>{ if(document.visibilityState==='visible') refreshNow(true); });

// === Init ===
(async function init(){ const prefers=window.matchMedia('(prefers-reduced-motion: reduce)').matches; S.reduced=prefers; if(E.motion) E.motion.checked=prefers; applyMotion(); computeBBox(); setStatus('Hämtar…'); await loadFromSheet(); computeBBox(); renderAll(); startFluidFX(); setStatus(`Senast uppdaterad ${hhmmss()}`); })();
