
let current=0;
let selectedMood=null;

const slides=document.querySelectorAll('.slide');
const navButtons=document.querySelectorAll('.nav');

const questions=[
 'Apa yang paling kamu rasakan hari ini?',
 'Apa hal yang akhir-akhir ini memenuhi pikiranmu?',
 'Apa yang kamu butuhkan dari dirimu sendiri?',
 'Apa hal kecil yang membuatmu merasa dihargai?',
 'Apa yang ingin kamu perbaiki secara perlahan?',
 'Siapa orang yang membuatmu merasa aman?',
 'Apa pencapaian kecil yang patut kamu syukuri?'
];

let questionIndex=0;

const affirmations=[
 'Aku berhak mendapatkan waktu untuk beristirahat.',
 'Perasaanku layak untuk didengarkan.',
 'Aku tidak harus sempurna setiap hari.',
 'Aku boleh berkembang dengan kecepatanku sendiri.',
 'Aku layak mendapatkan dukungan dan kebaikan.',
 'Satu langkah kecil tetap merupakan kemajuan.'
];

function getData(key){
 return JSON.parse(localStorage.getItem(key)||'[]');
}

function saveData(key,value){
 localStorage.setItem(key,JSON.stringify(value));
}

function safe(value){
 return String(value).replace(/[&<>"']/g,c=>({
 '&':'&amp;','<':'&lt;','>':'&gt;',
 '"':'&quot;',"'":'&#39;'
 }[c]));
}

function go(n){
 current=Math.max(0,Math.min(6,n));

 slides.forEach((slide,i)=>{
  slide.classList.toggle('active',i===current);
 });

 navButtons.forEach((button,i)=>{
  button.classList.toggle('active',i===current);
 });

 document.getElementById('pageTitle').textContent=[
 'Dashboard','Personal Diary','Mood Tracker',
 'Self Reflection','Mind Journal','Self Care','My Progress'
 ][current];

 document.getElementById('slideNumber').textContent=
 String(current+1).padStart(2,'0')+' / 07';

 window.scrollTo({top:0,behavior:'smooth'});
 update();
}

function move(n){
 go(current+n);
}

document.getElementById('today').textContent=
 new Date().toLocaleDateString('id-ID',{
  day:'numeric',month:'long',year:'numeric'
 });

function saveDiary(){
 let title=document.getElementById('diaryTitle').value.trim();
 let text=document.getElementById('diaryText').value.trim();
 let feeling=document.getElementById('diaryFeeling').value;

 if(!title||!text){
  alert('Lengkapi judul dan ceritamu.');
  return;
 }

 let list=getData('diaries');

 list.unshift({
  title,text,feeling,
  date:new Date().toLocaleString('id-ID')
 });

 saveData('diaries',list);

 document.getElementById('diaryTitle').value='';
 document.getElementById('diaryText').value='';

 update();
 alert('Diary berhasil disimpan 🌿');
}

function quickMood(name,emoji){
 selectedMood=name;
 document.getElementById('quickResult').textContent=
 emoji+' Mood kamu: '+name+'.';
 saveMoodEntry(name,'');
 alert('Mood berhasil dicatat.');
}

function chooseMood(name,emoji,element){
 selectedMood=name;
 document.querySelectorAll('.mood-options button')
 .forEach(b=>b.classList.remove('selected'));
 element.classList.add('selected');
}

function saveMoodEntry(name,note){
 let list=getData('moods');
 list.unshift({
  name,note,
  date:new Date().toLocaleString('id-ID')
 });
 saveData('moods',list);
 update();
}

function saveMood(){
 if(!selectedMood){
  alert('Pilih suasana hati terlebih dahulu.');
  return;
 }

 let note=document.getElementById('moodNote').value.trim();
 saveMoodEntry(selectedMood,note);

 selectedMood=null;
 document.getElementById('moodNote').value='';
 document.querySelectorAll('.mood-options button')
 .forEach(b=>b.classList.remove('selected'));

 alert('Mood berhasil disimpan 🌱');
}

function nextQuestion(){
 questionIndex=(questionIndex+1)%questions.length;
 document.getElementById('question').textContent=
 questions[questionIndex];

 document.getElementById('qNumber').textContent=
 'QUESTION '+String(questionIndex+1).padStart(2,'0');
}

function saveReflection(){
 let answer=document.getElementById('reflectionAnswer').value.trim();

 if(!answer){
  alert('Tuliskan jawaban refleksimu terlebih dahulu.');
  return;
 }

 let list=getData('reflections');

 list.unshift({
  question:questions[questionIndex],
  answer,
  date:new Date().toLocaleString('id-ID')
 });

 saveData('reflections',list);
 document.getElementById('reflectionAnswer').value='';

 update();
 alert('Refleksi berhasil disimpan.');
}

function saveMind(){
 let text=document.getElementById('mindText').value.trim();

 if(!text){
  alert('Tuliskan pikiranmu terlebih dahulu.');
  return;
 }

 let list=getData('minds');
 list.unshift({
  text,
  date:new Date().toLocaleString('id-ID')
 });

 saveData('minds',list);
 document.getElementById('mindText').value='';

 update();
 alert('Catatan berhasil disimpan.');
}

function newAffirmation(){
 let index=Math.floor(Math.random()*affirmations.length);
 document.getElementById('affirmation').textContent=
 affirmations[index];
}

function update(){
 let diaries=getData('diaries');
 let moods=getData('moods');
 let reflections=getData('reflections');
 let minds=getData('minds');

 document.getElementById('dashDiary').textContent=diaries.length;
 document.getElementById('dashMood').textContent=moods.length;
 document.getElementById('dashReflection').textContent=reflections.length;

 document.getElementById('progressDiary').textContent=diaries.length;
 document.getElementById('progressMood').textContent=moods.length;
 document.getElementById('progressReflection').textContent=reflections.length;
 document.getElementById('progressMind').textContent=minds.length;

 document.getElementById('diaryList').innerHTML=
 diaries.map(d=>`
 <div class="entry">
 <small>${safe(d.date)}</small>
 <h3>${safe(d.title)}</h3>
 <p>${safe(d.text).replace(/\n/g,'<br>')}</p>
 <small>Mood: ${safe(d.feeling)}</small>
 </div>`).join('')||'Belum ada diary.';

 document.getElementById('moodList').innerHTML=
 moods.map(m=>`
 <div class="entry">
 <b>${safe(m.name)}</b>
 <small>${safe(m.date)}</small>
 <p>${safe(m.note)}</p>
 </div>`).join('')||'Belum ada catatan mood.';

 document.getElementById('reflectionList').innerHTML=
 reflections.map(r=>`
 <div class="entry">
 <small>${safe(r.date)}</small>
 <h3>${safe(r.question)}</h3>
 <p>${safe(r.answer)}</p>
 </div>`).join('')||'Belum ada refleksi.';

 document.getElementById('mindList').innerHTML=
 minds.map(m=>`
 <div class="entry">
 <small>${safe(m.date)}</small>
 <p>${safe(m.text)}</p>
 </div>`).join('')||'Belum ada catatan.';

 document.getElementById('recentDiary').innerHTML=
 diaries.length?
 `<div class="entry"><b>${safe(diaries[0].title)}</b>
 <p>${safe(diaries[0].date)}</p></div>`:
 'Belum ada cerita hari ini.';

 document.getElementById('growthMessage').textContent=
 diaries.length+reflections.length+moods.length+
 ' catatan perjalanan dirimu telah tersimpan.';
}

function exportData(){
 let content={
  diaries:getData('diaries'),
  moods:getData('moods'),
  reflections:getData('reflections'),
  minds:getData('minds')
 };

 let file=new Blob(
  [JSON.stringify(content,null,2)],
  {type:'application/json'}
 );

 let url=URL.createObjectURL(file);
 let link=document.createElement('a');

 link.href=url;
 link.download='berry-matcha-my-data.json';
 link.click();

 URL.revokeObjectURL(url);
}

document.addEventListener('keydown',e=>{
 if(e.key==='ArrowRight')move(1);
 if(e.key==='ArrowLeft')move(-1);
});

update();
