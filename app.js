const words = [
  {en:'apple', es:'manzana'},
  {en:'house', es:'casa'},
  {en:'dog', es:'perro'},
  {en:'cat', es:'gato'},
  {en:'book', es:'libro'},
  {en:'car', es:'coche'},
  {en:'water', es:'agua'},
  {en:'school', es:'escuela'},
  {en:'chair', es:'silla'},
  {en:'table', es:'mesa'},
  {en:'sun', es:'sol'},
  {en:'moon', es:'luna'},
  {en:'tree', es:'árbol'},
  {en:'window', es:'ventana'},
  {en:'door', es:'puerta'},
  {en:'flower', es:'flor'},
  {en:'city', es:'ciudad'},
  {en:'food', es:'comida'},
  {en:'friend', es:'amigo'},
  {en:'family', es:'familia'}
];

const display = document.getElementById('display');
const spinBtn = document.getElementById('spinBtn');
const listenBtn = document.getElementById('listenBtn');
const startRecBtn = document.getElementById('startRecBtn');
const msg = document.getElementById('message');
const correctEl = document.getElementById('correct');
const incorrectEl = document.getElementById('incorrect');

let current = null;
let correct = 0;
let incorrect = 0;

function normalize(s){
  return s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'').replace(/[^a-z0-9 ]/g,'').trim();
}

function levenshtein(a,b){
  const m = a.length, n = b.length;
  if(!m) return n; if(!n) return m;
  const dp = Array.from({length:m+1},()=>Array(n+1).fill(0));
  for(let i=0;i<=m;i++) dp[i][0]=i;
  for(let j=0;j<=n;j++) dp[0][j]=j;
  for(let i=1;i<=m;i++){
    for(let j=1;j<=n;j++){
      const cost = a[i-1]===b[j-1]?0:1;
      dp[i][j]=Math.min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+cost);
    }
  }
  return dp[m][n];
}

function pickRandom(){
  return words[Math.floor(Math.random()*words.length)];
}

function speak(text, lang='es-ES', onend){
  if(!('speechSynthesis' in window)){
    msg.textContent = 'Síntesis de voz no soportada en este navegador.';
    if(onend) onend();
    return;
  }
  const ut = new SpeechSynthesisUtterance(text);
  ut.lang = lang;
  ut.rate = 0.95;
  ut.onend = ()=>{ if(onend) onend(); };
  speechSynthesis.cancel();
  speechSynthesis.speak(ut);
}

let recognition = null;
let recognizing = false;
if(window.SpeechRecognition || window.webkitSpeechRecognition){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onstart = ()=>{ recognizing = true; msg.textContent = 'Escuchando...'; };
  recognition.onend = ()=>{ recognizing = false; if(!msg.textContent) msg.textContent=''; };
  recognition.onerror = (e)=>{ recognizing = false; msg.textContent = 'Error de reconocimiento: '+e.error; };
  recognition.onresult = (e)=>{
    const text = e.results[0][0].transcript || '';
    evaluateAnswer(text);
  };
  startRecBtn.disabled = false;
} else {
  msg.textContent = 'Reconocimiento de voz no soportado en este navegador.';
}

function evaluateAnswer(userText){
  const expected = normalize(current.en);
  const received = normalize(userText);
  let ok = false;
  if(received.includes(expected) || expected.includes(received)) ok = true;
  else if(levenshtein(received, expected) <= 2) ok = true;

  if(ok){
    correct++;
    correctEl.textContent = correct;
    msg.style.color = '#0a6';
    msg.textContent = `Correcto: ${current.en} — ${current.es}`;
  } else {
    incorrect++;
    incorrectEl.textContent = incorrect;
    msg.style.color = '#d33';
    msg.textContent = `Incorrecto. Escuché: "${userText}" — Respuesta: ${current.en}`;
  }
}

function startRecognition(timeout=5000){
  if(!recognition) return;
  try{
    recognition.start();
    setTimeout(()=>{ if(recognizing) recognition.stop(); }, timeout);
  }catch(e){ console.warn(e); }
}

function spin(){
  spinBtn.disabled = true;
  listenBtn.disabled = true;
  msg.textContent = '';
  const flashes = 30; let i=0;
  const interval = setInterval(()=>{
    const w = words[Math.floor(Math.random()*words.length)];
    display.textContent = w.en;
    i++;
    if(i>=flashes){
      clearInterval(interval);
      current = pickRandom();
      display.textContent = current.es;
      listenBtn.disabled = false;
      spinBtn.disabled = false;
      // hablar la pista (en español) y luego activar reconocimiento
      speak(current.es, 'es-ES', ()=>{ startRecognition(); });
    }
  },70);
}

spinBtn.addEventListener('click', ()=>{ spin(); });
listenBtn.addEventListener('click', ()=>{ if(current) speak(current.es); });
startRecBtn.addEventListener('click', ()=>{ if(current) startRecognition(); });

// Expose small helper for debugging
window._rv = {words, spin};
