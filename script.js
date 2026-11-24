
let current=0;
let selectedMood=null;

const slides=document.querySelectorAll('.slide');
const navButtons=document.querySelectorAll('.nav');

const titles=[
 'Beranda',
 'Jurnal Pribadi',
 'Mengenali Emosi',
 'Refleksi Diri',
 'Ruang Pikiran',
 'Perkembangan Diri'
];

const questions=[
 'Apa hal yang akhir-akhir ini paling banyak memenuhi pikiranmu?',
 'Apa perasaan yang paling sering muncul belakangan ini?',
 'Apa yang sebenarnya kamu butuhkan saat ini?',
 'Apakah ada kejadian yang masih sulit kamu lupakan?',
 'Apa hal kecil yang membuatmu merasa dihargai?',
 'Bagaimana kamu biasanya menghadapi masalah?',
 'Apa yang ingin kamu sampaikan kepada dirimu sendiri?'
];

let questionIndex=0;

function getData(key){
 return JSON.parse(localStorage.getItem(key)||'[]');
}

function putData(key,value){
 localStorage.setItem(key,JSON.stringify(value));
}

function safe(value){
 return String(value).replace(/[&<>"']/g,c=>({
  '&':'&amp;',
  '<':'&lt;',
  '>':'&gt;',
  '"':'&quot;',
  "'":'&#39;'
 }[c]));
}

// MASUK KE APLIKASI
function enterApp(){
 const opening=document.getElementById('opening');
 opening.classList.add('hide');

 setTimeout(()=>{
  opening.style.display='none';
  document.getElementById('app').classList.add('show');
  go(0);
 },850);
}

// NAVIGASI
function go(n){
 current=Math.max(0,Math.min(5,n));

 slides.forEach((s,i)=>{
  s.classList.toggle('active',i===current);
 });

 navButtons.forEach((b,i)=>{
  b.classList.toggle('active',i===current);
 });

 document.getElementById('pageTitle').textContent=titles[current];

 document.getElementById('slideNumber').textContent=
 String(current+1).padStart(2,'0')+' / 06';

 window.scrollTo({top:0,behavior:'smooth'});
 update();
}

function move(n){
 go(current+n);
}

// TANGGAL
document.getElementById('date').textContent=
 new Date().toLocaleDateString('id-ID',{
  day:'numeric',
  month:'long',
  year:'numeric'
 });

// SIMPAN JURNAL
function saveDiary(){
 let title=document.getElementById('diaryTitle').value.trim();
 let text=document.getElementById('diaryText').value.trim();
 let mood=document.getElementById('diaryMood').value;
 let need=document.getElementById('diaryNeed').value.trim();

 if(!title||!text){
  alert('Silakan isi judul dan cerita jurnalmu.');
  return;
 }

 let list=getData('diaries');

 list.unshift({
  title,text,mood,need,
  date:new Date().toLocaleString('id-ID')
 });

 putData('diaries',list);

 document.getElementById('diaryTitle').value='';
 document.getElementById('diaryText').value='';
 document.getElementById('diaryNeed').value='';

 update();
 alert('Jurnal berhasil disimpan 🌷');
}

// EMOSI
function selectMood(name,element){
 selectedMood=name;

 document.querySelectorAll('.mood')
 .forEach(b=>b.classList.remove('selected'));

 element.classList.add('selected');
}

function addMood(name,note){
 let list=getData('moods');

 list.unshift({
  name,note,
  date:new Date().toLocaleString('id-ID')
 });

 putData('moods',list);
 update();
}

function saveMood(){
 if(!selectedMood){
  alert('Pilih perasaanmu terlebih dahulu.');
  return;
 }

 let note=document.getElementById('moodReason').value.trim();

 addMood(selectedMood,note);

 selectedMood=null;
 document.getElementById('moodReason').value='';

 document.querySelectorAll('.mood')
 .forEach(b=>b.classList.remove('selected'));

 alert('Catatan emosimu berhasil disimpan.');
}

function quickMood(name){
 addMood(name,'Catatan singkat dari halaman beranda.');
 document.getElementById('quickResult').textContent=
 'Catatan perasaan '+name+' berhasil disimpan.';
}

// REFLEKSI DIRI
function nextQuestion(){
 questionIndex=(questionIndex+1)%questions.length;

 document.getElementById('question').textContent=
 questions[questionIndex];

 document.getElementById('questionNumber').textContent=
 'PERTANYAAN '+String(questionIndex+1).padStart(2,'0');

 document.getElementById('reflectionAnswer').value='';
}

function saveReflection(){
 let answer=document.getElementById('reflectionAnswer').value.trim();

 if(!answer){
  alert('Silakan isi jawaban refleksimu.');
  return;
 }

 let list=getData('reflections');

 list.unshift({
  question:questions[questionIndex],
  answer,
  date:new Date().toLocaleString('id-ID')
 });

 putData('reflections',list);

 document.getElementById('reflectionAnswer').value='';
 update();

 alert('Refleksi berhasil disimpan 🌱');
}

// RUANG PIKIRAN
function saveMind(){
 let text=document.getElementById('mindText').value.trim();
 let control=document.getElementById('mindControl').value.trim();

 if(!text){
  alert('Tuliskan isi pikiranmu terlebih dahulu.');
  return;
 }

 let list=getData('minds');

 list.unshift({
  text,control,
  date:new Date().toLocaleString('id-ID')
 });

 putData('minds',list);

 document.getElementById('mindText').value='';
 document.getElementById('mindControl').value='';

 update();
 alert('Catatan berhasil disimpan.');
}

// MENAMPILKAN DATA
function update(){
 let diaries=getData('diaries');
 let moods=getData('moods');
 let reflections=getData('reflections');
 let minds=getData('minds');

 document.getElementById('totalDiary').textContent=diaries.length;
 document.getElementById('totalMood').textContent=moods.length;
 document.getElementById('totalReflection').textContent=reflections.length;

 document.getElementById('growthDiary').textContent=diaries.length;
 document.getElementById('growthMood').textContent=moods.length;
 document.getElementById('growthReflection').textContent=reflections.length;
 document.getElementById('growthMind').textContent=minds.length;

 document.getElementById('diaryList').innerHTML=
 diaries.map(d=>`
 <div class="entry">
  <small>${safe(d.date)}</small>
  <h3>${safe(d.title)}</h3>
  <p>${safe(d.text)}</p>
  <small>Perasaan: ${safe(d.mood)}</small>
  <p>Kebutuhan: ${safe(d.need)}</p>
 </div>
 `).join('')||'Belum ada jurnal yang tersimpan.';

 document.getElementById('moodList').innerHTML=
 moods.map(m=>`
 <div class="entry">
  <b>${safe(m.name)}</b>
  <small>${safe(m.date)}</small>
  <p>${safe(m.note)}</p>
 </div>
 `).join('')||'Belum ada catatan emosi.';

 document.getElementById('reflectionList').innerHTML=
 reflections.map(r=>`
 <div class="entry">
  <small>${safe(r.date)}</small>
  <h3>${safe(r.question)}</h3>
  <p>${safe(r.answer)}</p>
 </div>
 `).join('')||'Belum ada refleksi diri.';

 document.getElementById('mindList').innerHTML=
 minds.map(m=>`
 <div class="entry">
  <small>${safe(m.date)}</small>
  <p>${safe(m.text)}</p>
  <p>Hal yang bisa dikendalikan: ${safe(m.control)}</p>
 </div>
 `).join('')||'Belum ada catatan pikiran.';

 document.getElementById('growthMessage').textContent=
 diaries.length+reflections.length+moods.length+minds.length+
 ' catatan telah kamu kumpulkan dalam perjalanan mengenali diri.';
}

// UNDUH DATA
function exportData(){
 let content={
  jurnal:getData('diaries'),
  emosi:getData('moods'),
  refleksi:getData('reflections'),
  pikiran:getData('minds')
 };

 let file=new Blob(
  [JSON.stringify(content,null,2)],
  {type:'application/json'}
 );

 let url=URL.createObjectURL(file);
 let link=document.createElement('a');

 link.href=url;
 link.download='catatan-berry-matcha.json';
 link.click();

 URL.revokeObjectURL(url);
}

// TOMBOL KEYBOARD
document.addEventListener('keydown',e=>{
 if(e.key==='ArrowRight')move(1);
 if(e.key==='ArrowLeft')move(-1);
});

update();
