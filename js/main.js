const ENDPOINT=""; // URL de la Cloud Function (ver README)
const $=(s,r=document)=>[...r.querySelectorAll(s)];
const m=$('.menu')[0],n=$('nav')[0];
m.onclick=()=>m.setAttribute('aria-expanded',n.classList.toggle('open'));
$('[data-filter]').forEach(b=>b.onclick=()=>{$('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',x===b));
$('.tile[data-style]').forEach(t=>t.hidden=b.dataset.filter!=='all'&&t.dataset.style!==b.dataset.filter)});
$('[data-tab]').forEach(b=>b.onclick=()=>{$('[data-tab]').forEach(x=>x.setAttribute('aria-selected',x===b));
$('.panel').forEach((p,i)=>p.hidden=i!=b.dataset.tab)});
const f=document.getElementById('f');
if(f){const d=new URLSearchParams(location.search).get('diseno');if(d){f.diseno.value=d;f.servicio.value='Flash'}
f.onsubmit=async e=>{e.preventDefault();const s=$('.status',f)[0];
if(!f.checkValidity()){s.textContent='Revisa los campos obligatorios y confirma que eres mayor de 18 años.';return}
if(!ENDPOINT){s.textContent='Modo demostración: configura ENDPOINT en js/main.js.';return}
try{const r=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(f)))});
if(!r.ok)throw 0;f.reset();s.textContent='Solicitud enviada. Te respondemos en 24 horas.'}
catch{s.textContent='No se pudo enviar. Escríbenos por WhatsApp.'}}}
