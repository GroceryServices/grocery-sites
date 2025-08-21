\
async function loadStore(){
  try{
    const res = await fetch('/config/store.json',{cache:'no-store'});
    if(!res.ok) return null;
    return await res.json();
  }catch{return null;}
}
function headerHTML(store,active){
  const nav=[
    ["Home","/index.html","home"],
    ["Weekly Ad","/weekly-ad/index.html","ad"],
    ["About","/about/index.html","about"],
    ["Coupons","/coupons/index.html","coupons"],
    ["Departments","/departments/index.html","departments"],
    ["Employment","/employment/index.html","employment"],
    ["Join Us","/join-us/index.html","join"],
    ["Contact Us","/contact-us/index.html","contact"]
  ].map(([t,h,k])=>`<a class="${active===k?'active':''}" href="${h}">${t}</a>`).join('');
  return `<header class="header"><div class="wrap topbar">
    <div class="logo" style="font-weight:800">${store.store_name||'Your Store'}<span style="font-size:12px;opacity:.85;margin-left:8px">${store.city||''} ${store.state||''}</span></div>
    <nav class="nav">${nav}</nav>
  </div></header>`;
}
function footerHTML(store){
  return `<footer><div class="wrap footer-inner">© ${(new Date()).getFullYear()} ${store.store_name||'Your Store'} • ${store.address_line1||''} ${store.city||''}, ${store.state||''} ${store.zip||''} • ${store.phone||''}</div></footer>`;
}
async function mountChrome(active){
  const store = await loadStore() || {};
  document.querySelectorAll('[data-header]').forEach(n=>n.innerHTML=headerHTML(store,active));
  document.querySelectorAll('[data-footer]').forEach(n=>n.innerHTML=footerHTML(store));
}
async function loadWeeklyAd(){
  const res = await fetch('/config/store.json',{cache:'no-store'});
  if(!res.ok) return;
  const store = await res.json();
  const base = (store.weeklyAd?.currentBaseUrl||'').replace(/\/+$/,'')+'/';
  const exts=['jpg','jpeg','png','webp'];
  const max=store.weeklyAd?.maxPages||12;
  const root=document.getElementById('ad-images');
  if(!base||!root){return;}
  let shown=false;
  const imgOk = (u)=>new Promise(ok=>{const i=new Image();i.onload=()=>ok(true);i.onerror=()=>ok(false);i.src=u+(u.includes('?')?'&':'?')+'t='+Date.now();});
  for(let i=1;i<=max;i++){
    let found=false;
    for(const e of exts){
      const url=`${base}page${i}.${e}`;
      /* eslint-disable no-await-in-loop */
      if(await imgOk(url)){ const el=document.createElement('img'); el.src=url; el.alt=`Ad page ${i}`; el.className='ad-img'; root.appendChild(el); shown=true; found=true; break; }
    }
    if(!found && shown) break;
  }
  if(!shown){ root.innerHTML=`<p style="text-align:center;color:#6b7280">No ad images found in <code>${base}</code>. Upload page1.jpg, page2.jpg...</p>`; }
}
