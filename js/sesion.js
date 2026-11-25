const DB={get(k){return JSON.parse(localStorage.getItem('pet_'+k)||'[]')},set(k,v){localStorage.setItem('pet_'+k,JSON.stringify(v))}};
const hash=async s=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))),b=>b.toString(16).padStart(2,'0')).join('');
function activo(){return DB.get('usuarios').find(u=>u.usuario===localStorage.getItem('pet_sesion')&&!u.inactivo)}
const pagina=location.pathname.split('/').pop();
if(['compra.html','cuenta.html','admin.html'].includes(pagina)&&!activo()) location.replace('login.html?volver='+encodeURIComponent(pagina+location.search));
if(pagina==='admin.html'&&activo()?.rol!=='admin'&&activo()) location.replace('index.html');
document.addEventListener('DOMContentLoaded',()=>{const nav=document.querySelector('.main-nav ul');if(!nav)return; const u=activo();function link(t,h,fn){const li=document.createElement('li'),a=document.createElement('a');a.textContent=t;a.href=h;if(fn)a.onclick=fn;li.append(a);nav.append(li)} if(u){link('Mi cuenta','cuenta.html');if(u.rol==='admin')link('Administración','admin.html');link('Cerrar sesión','index.html',()=>localStorage.removeItem('pet_sesion'))}else link('Iniciar sesión','login.html')});
