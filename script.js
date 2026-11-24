
let current=0;
const slides=document.querySelectorAll('.slide');
const dots=document.getElementById('dots');

slides.forEach((s,i)=>{
 let d=document.createElement('div');
 d.className='dot'+(i===0?' active':'');
 d.onclick=()=>go(i);
 dots.appendChild(d);
});

function go(n){
 current=n;
 slides.forEach((s,i)=>s.classList.toggle('active',i===n));
 [...dots.children].forEach((d,i)=>d.classList.toggle('active',i===n));
 window.scrollTo({top:0,behavior:'smooth'});
 update();
}

function move(n){
 go(Math.max(0,Math.min(slides.length-1,current+n)));
}

function data(k){
 return JSON.parse(localStorage.getItem(k)||'[]');
}

function put(k,v){
 localStorage.setItem(k,JSON.stringify(v));
}

function safe(s){
 return String(s).replace(/[&<>"']/g,c=>({
 '&':'&amp;','<':'&lt;','>':'&gt;',
 '"':'&quot;',"'":'&#39;'
 }[c]));
}

function saveDiary(){
 let t=document.getElementById('title').value.trim();
 let s=document.getElementById('story').value.trim();

 if(!t||!s)return alert('Isi ceritamu dulu 🍓');

 let a=data('diary');
 a.unshift({t,s,date:new Date().toLocaleDateString('id-ID')});
 put('diary',a);

 document.getElementById('title').value='';
 document.getElementById('story').value='';
 update();
 alert('Diary tersimpan 🌷');
}

function pick(m,e){
 window.mood=m;
 document.querySelectorAll('.mood').forEach(x=>x.classList.remove('selected'));
 e.classList.add('selected');
 document.getElementById('selectedMood').textContent='Mood: '+m;
}

function saveMood(){
 if(!window.mood)return alert('Pilih mood dulu!');

 let a=data('mood');
 a.unshift({
  m:window.mood,
  date:new Date().toLocaleDateString('id-ID')
 });
 put('mood',a);

 window.mood=null;
 document.querySelectorAll('.mood').forEach(x=>x.classList.remove('selected'));
 document.getElementById('selectedMood').textContent='Mood berhasil disimpan!';
 update();
}

const questions=[
 'Apa hal yang paling kamu syukuri hari ini?',
 'Apa yang sedang kamu butuhkan sekarang?',
 'Hal apa yang ingin kamu lepaskan?',
 'Apa hal kecil yang membuatmu bahagia?',
 'Apa yang ingin kamu katakan kepada dirimu sendiri?'
];

let qi=0;

function nextQuestion(){
 qi=(qi+1)%questions.length;
 document.getElementById('question').textContent=questions[qi];
 document.getElementById('reflection').value='';
 document.getElementById('reply').innerHTML='';
}

function reflect(){
 let v=document.getElementById('reflection').value.trim();
 if(!v)return alert('Tuliskan sedikit isi pikiranmu 🌷');

 document.getElementById('reply').innerHTML=`
 <div class="entry">
 <h3>🌷 A Gentle Reminder</h3>
 <p>Terima kasih sudah memberi ruang untuk perasaanmu.
 Tidak perlu menghakimi diri sendiri. Cobalah pikirkan
 satu hal kecil yang bisa membantumu saat ini.</p>
 </div>`;
}

function saveThought(){
 let v=document.getElementById('thought').value.trim();
 if(!v)return alert('Tuliskan pikiranmu dahulu');

 let a=data('thought');
 a.unshift(v);
 put('thought',a);

 document.getElementById('thought').value='';
 update();
}

function update(){
 let a=data('diary');
 let m=data('mood');
 let t=data('thought');

 document.getElementById('entries').innerHTML=
 a.map(x=>`
 <div class="entry">
 <small>${safe(x.date)}</small>
 <h3>${safe(x.t)}</h3>
 <p>${safe(x.s).replace(/\n/g,'<br>')}</p>
 </div>`).join('')||'Belum ada cerita 🍓';

 document.getElementById('moods').innerHTML=
 m.map(x=>`
 <div class="entry">${safe(x.m)} · ${safe(x.date)}</div>
 `).join('')||'Belum ada mood 🌱';

 document.getElementById('thoughts').innerHTML=
 t.map(x=>`<div class="entry">${safe(x)}</div>`).join('');

 document.getElementById('countDiary').textContent=a.length;
 document.getElementById('countMood').textContent=m.length;
 document.getElementById('countThought').textContent=t.length;
}

document.addEventListener('keydown',e=>{
 if(e.key==='ArrowRight')move(1);
 if(e.key==='ArrowLeft')move(-1);
});

update();
