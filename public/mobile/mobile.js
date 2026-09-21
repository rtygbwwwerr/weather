(() => {
const side=$('side');
const icons=['<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15"/>','<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="2"/><circle cx="16" cy="12" r="2"/>','<path d="m12 3 9 5-9 5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5"/>','<circle cx="12" cy="12" r="9"/><path d="M12 10v7M12 6v2"/>'];
const nav=document.createElement('nav');nav.className='app-nav';nav.setAttribute('aria-label','主导航');
nav.innerHTML=['地图','预报','图层','关于'].map((name,i)=>`<button type="button" aria-selected="${i===0}"><svg viewBox="0 0 24 24" aria-hidden="true">${icons[i]}</svg><span>${name}</span></button>`).join('');document.body.append(nav);
const shade=document.createElement('div');shade.className='app-shade';shade.hidden=true;document.body.append(shade);
const about=document.createElement('section');about.className='info-sheet';about.hidden=true;about.setAttribute('aria-label','关于风迹');
about.innerHTML='<h2>风迹 <small>CYCLONE</small></h2><p>随身查看热带系统的未来路径。</p><p>支持集合成员、集合平均、强度着色、概率热区与逐时播放。预报时效取决于所选模型。</p><p>细线表示成员路径，亮线表示平均路径，虚线表示第 6 天以后的预报。概率热区表示所显示成员的经过比例，不是官方登陆概率。</p><p>数据：SMCA · 地图：OpenStreetMap。需要联网读取预报与底图。盘古路径可从手机文件中导入 JSON。</p><p>模型结果仅供研究参考，防灾请遵循当地气象部门正式预警。</p><button id="shareApp">分享当前预报</button><p id="shareResult" role="status"></p>';document.body.append(about);
const close=document.createElement('button');close.className='sheet-close';close.textContent='×';close.setAttribute('aria-label','关闭面板');side.querySelector('.brand').prepend(close);
function page(index){side.classList.toggle('open',index===1||index===2);about.hidden=index!==3;shade.hidden=index===0;side.inert=!(index===1||index===2);nav.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-selected',String(i===index)));if(index===2)side.querySelector('.chips').scrollIntoView({block:'center',behavior:'smooth'});if(index===1)side.scrollTop=0;if(index===0&&map)map.invalidateSize()}
nav.querySelectorAll('button').forEach((b,i)=>b.onclick=()=>page(i));shade.onclick=close.onclick=()=>page(0);document.addEventListener('keydown',e=>{if(e.key==='Escape')page(0)});$('load').addEventListener('click',()=>page(0));
const connection=document.createElement('div');connection.className='connection';connection.textContent='当前离线 · 已显示的路径可能不是最新预报';document.body.append(connection);function network(){connection.hidden=navigator.onLine}network();window.addEventListener('online',network);window.addEventListener('offline',network);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&timer)play()});
for(const id of ['model','area','run','system'])$(id).setAttribute('aria-label',({model:'预报模型',area:'洋区',run:'起报时间',system:'热带系统'})[id]);$('timeline').setAttribute('aria-label','播放预报时效');$('horizon').setAttribute('aria-label','预报天数');$('play').setAttribute('aria-label','播放或暂停路径');
$('shareApp').onclick=async()=>{const text=$('title').textContent+'\n'+$('subtitle').textContent+'\n'+$('validTime').textContent;try{if(navigator.share)await navigator.share({title:'风迹 · 热带系统路径',text});else{await navigator.clipboard.writeText(text);$('shareResult').textContent='预报摘要已复制。'}}catch(e){if(e.name!=='AbortError')$('shareResult').textContent='分享失败，请重试。'}};
page(0);
})();
