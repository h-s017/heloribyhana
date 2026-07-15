const SUPABASE_URL='https://uzqaodfmnrjrsbvxhlmh.supabase.co';
const SUPABASE_KEY='sb_publishable_3ukkjs-QtgauXjmOrcDAVg_XBWzh2rd';
const LINE_ID='199ywnfo';
const LINE_HOME_URL='https://line.me/R/ti/p/@199ywnfo';
const BASE='https://h-s017.github.io/heloribyhana/';

const db=window.supabase?.createClient(SUPABASE_URL,SUPABASE_KEY);
const $=selector=>document.querySelector(selector);

let currentProfile=null;
let currentKey=null;
let selectedCourse='';
let qIndex=0;
let answers=[];
let scores={A:0,B:0,C:0,D:0,E:0,F:0,G:0};
let submitting=false;

const imgs={
  A:BASE+'assets/avatars/misti.jpg',
  B:BASE+'assets/avatars/flori.jpg',
  C:BASE+'assets/avatars/velmo.jpg',
  D:BASE+'assets/avatars/ambra.jpg',
  E:BASE+'assets/avatars/nocta.jpg',
  F:BASE+'assets/avatars/tealu.jpg',
  G:BASE+'assets/avatars/mossi.jpg'
};

const names={A:'Misti',B:'Flori',C:'Velmo',D:'Ambra',E:'Nocta',F:'Tealu',G:'Mossi'};
const order=['A','B','C','D','E','F','G'];

const courseUrls={
  'HELORI 體驗課':'https://www.hanascent.com/helori/',
  '氣味藝術序曲｜專業調香師系列':'https://www.hanascent.com/overture/',
  'KPIA 大韓專業調香師證書':'https://www.hanascent.com/KPIA/'
};

const profiles={
  A:{type:'Misti｜迷絲緹',en:'Citrus Clarity · Mistvale',scent:'Citrus · Tea · Transparent Floral · White Musk',desc:'Misti 來自 Mistvale，一片總在清晨甦醒的霧色溪谷。空氣中有柑橘皮、冷露與潔淨皂感。清澈不是冷漠，是一種清醒的溫柔。'},
  B:{type:'Flori｜芙蘿莉',en:'Soft Floral Garden · Lumen Garden',scent:'Rose · Jasmine · Orange Blossom · Soft Musk',desc:'Flori 來自 Lumen Garden，一座被柔光覆蓋的花庭。花瓣、空氣與旋律在那裡緩慢交疊。細膩不是脆弱，是把美留住的能力。'},
  C:{type:'Velmo｜維爾默',en:'Woody Ground · Echo Timber Grove',scent:'Cedarwood · Sandalwood · Vetiver · Moss',desc:'Velmo 來自 Echo Timber Grove，一片有舊木、苔蘚與低音回聲的森林。氣味不急於展現，而是慢慢沉入材質與時間之中。'},
  D:{type:'Ambra｜安布拉',en:'Amber Comfort · Amber Hall',scent:'Amber · Vanilla · Resin · Soft Spice',desc:'Ambra 來自 Amber Hall，一間長年停留在黃昏光中的暖室。這裡的溫暖不是表演出來的，它就在空氣裡，一直等著你。'},
  E:{type:'Nocta｜諾克塔',en:'Noir Dramatic · Shadow Stage',scent:'Smoke · Leather · Spice · Dark Woods',desc:'Nocta 來自 Shadow Stage，一座總停在開演前一刻的劇場。有些氣味不是用來討喜的，是用來被記住的。'},
  F:{type:'Tealu｜緹露',en:'Tea & Air · White Tone Tea Hills',scent:'Tea · Green · Transparent Floral · White Musk',desc:'Tealu 來自 White Tone Tea Hills，一片介於茶園、霧氣與空白樂譜之間的地帶。留白，是它選擇說話的方式。'},
  G:{type:'Mossi｜墨茜',en:'Chypre Archive · Archive Mossland',scent:'Moss · Chypre · Bergamot · Patchouli',desc:'Mossi 來自 Archive Mossland，一處位於舊圖書館與森林交界的地帶。某些香氣，是給那些不需要解釋自己品味的人。'}
};

const questions=[
  {zh:'走進一個陌生空間，你最先注意到的是？',en:'What do you notice first when entering an unfamiliar space?',opts:[
    ['光線、空氣感，以及整體是否乾淨舒服','Light, airiness, and whether the space feels clean',['A','F']],
    ['花藝、色彩、裝飾與細節美感','Flowers, colors, decoration, and refined visual details',['B']],
    ['木頭、皮革、紙張、家具等材質質感','Textures such as wood, leather, paper, and furniture',['C','G']],
    ['這個地方有沒有故事、轉折或不尋常的氣氛','Whether the space carries a story, contrast, or unusual atmosphere',['D','E']]
  ]},
  {zh:'如果用一種天氣形容你，你會選？',en:'If you were described as a type of weather, which would you choose?',opts:[
    ['清晨微風，明亮、清楚、沒有壓迫感','A morning breeze: bright, clear, and light',['A']],
    ['春天午後花園，柔和、細膩、有畫面','A spring afternoon garden: soft, delicate, visual',['B']],
    ['秋天森林，安靜、乾燥、有時間感','An autumn forest: quiet, dry, and time-worn',['C','G']],
    ['傍晚暖光或雨前空氣，有情緒也有神祕感','Evening warm light or pre-rain air: emotional and mysterious',['D','E','F']]
  ]},
  {zh:'你最喜歡哪一種旅行畫面？',en:'Which travel scene appeals to you most?',opts:[
    ['海邊、白色建築、乾淨明亮的城市','The seaside, white architecture, and a clean bright city',['A','F']],
    ['花園、古典建築、優雅咖啡館','Gardens, classical buildings, and elegant cafés',['B']],
    ['山林、木屋、老書店或工藝小鎮','Forests, wooden cabins, old bookstores, or craft villages',['C','G']],
    ['市集、甜點店、博物館、老宅或異國巷弄','Markets, dessert shops, museums, old houses, or foreign alleys',['D','E']]
  ]},
  {zh:'你做事情的方式比較像？',en:'Which describes the way you usually work?',opts:[
    ['先整理架構，再開始行動','I organize the structure before taking action',['A']],
    ['跟著感覺走，但很重視美感','I follow my intuition but care strongly about aesthetics',['B']],
    ['慢慢累積，喜歡穩定與深度','I build slowly and value stability and depth',['C','G']],
    ['重視現場氣氛，也喜歡做出自己的風格','I value the atmosphere and like creating my own style',['D','E','F']]
  ]},
  {zh:'你希望別人怎麼形容你？',en:'How would you like others to describe you?',opts:[
    ['乾淨、理性、有分寸','Clean, rational, and well-balanced',['A']],
    ['優雅、細膩、有品味','Elegant, delicate, and tasteful',['B']],
    ['沉穩、成熟、有深度','Calm, mature, and deep',['C','G']],
    ['溫暖、有個性、讓人印象深刻','Warm, distinctive, and memorable',['D','E','F']]
  ]},
  {zh:'當你聞到一支香，哪一種層次最容易讓你停留？',en:'When you smell a fragrance, which layer makes you linger?',opts:[
    ['清亮的開場：柑橘、茶感或潔淨皂感','A clear opening: citrus, tea, or clean soapy notes',['A','F']],
    ['柔和的花心：玫瑰、茉莉或橙花','A soft floral heart: rose, jasmine, or orange blossom',['B']],
    ['乾燥的骨架：雪松、檀木或岩蘭草','A dry woody structure: cedarwood, sandalwood, or vetiver',['C']],
    ['深色的尾韻：琥珀、苔蘚、皮革、辛香或樹脂','A darker trail: amber, moss, leather, spices, or resins',['D','E','G']]
  ]},
  {zh:'如果要創作一支香，你最想表達的是？',en:'If you were creating a fragrance, what would you most want to express?',opts:[
    ['清醒、透明、自由','Clarity, transparency, and freedom',['A','F']],
    ['美、柔軟、浪漫記憶','Beauty, softness, and romantic memory',['B']],
    ['安定、時間感、內在力量','Stability, a sense of time, and inner strength',['C','G']],
    ['溫度、陪伴、故事、神祕與轉折','Warmth, companionship, story, mystery, and contrast',['D','E']]
  ]},
  {zh:'在調香課裡，你最期待哪個部分？',en:'Which part of the perfumery class are you most looking forward to?',opts:[
    ['了解香調分類、結構和比例','Understanding fragrance families, structure, and proportions',['A','G']],
    ['聞香、形容氣味、建立感官詞彙','Smelling materials, describing scents, building vocabulary',['B','F']],
    ['學會穩定做出成熟、有質感的配方','Learning to create stable, mature, refined formulas',['C']],
    ['做出自己喜歡、能送人或有概念的作品','Creating something personal, giftable, or concept-driven',['D','E']]
  ]},
  {zh:'如果你的香氣是一段音樂，它比較接近哪一種畫面？',en:'If your fragrance were a piece of music, which scene feels closest?',opts:[
    ['古典時期的清晰結構：明亮、均衡、乾淨','Classical clarity: bright, balanced, clean, and orderly',['A','F']],
    ['印象派的光影流動：柔和、朦朧，像水光與花影','Impressionist light and motion: soft, hazy, like waterlight',['B','F']],
    ['浪漫時期的情緒敘事：溫暖、深刻，帶有記憶','Romantic emotional narrative: warm, deep, weighted with memory',['C','D']],
    ['現代電影感的張力場景：低音、陰影、戲劇性','Modern / cinematic tension: low tones, shadows, drama',['E','G']]
  ]},
  {zh:'如果用一幅畫形容你的美感，你會選？',en:'If your aesthetic were a painting, which would you choose?',opts:[
    ['大量留白與乾淨線條','A composition with generous blank space and clean lines',['A','F']],
    ['花卉、人物、柔光與裝飾性線條','Flowers, figures, soft light, and decorative lines',['B']],
    ['木頭、石材、大地色與厚實肌理','Wood, stone, earth tones, and substantial texture',['C']],
    ['暗色背景、古典肖像、舊紙張與時間感','Dark backgrounds, classical portraits, old paper, and a sense of time',['D','E','G']]
  ]}
];

function toast(message){
  const t=$('#toast');
  t.textContent=message;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2600);
}

function show(id){
  document.querySelectorAll('.screen').forEach(screen=>screen.classList.remove('active'));
  $('#'+id).classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}

function resetState(){
  qIndex=0;
  answers=new Array(questions.length).fill(null);
  scores={A:0,B:0,C:0,D:0,E:0,F:0,G:0};
  currentProfile=null;
  currentKey=null;
  selectedCourse='';
  submitting=false;
  $('#leadForm')?.reset();
  setFormMessage('');
}

function buildLanding(){
  $('#constellation').innerHTML=order.map(key=>`
    <div class="mini">
      <div class="avatar"><img src="${imgs[key]}" alt="${names[key]}"></div>
      <span>${names[key]}</span>
    </div>
  `).join('');
}

function startQuiz(){
  resetState();
  show('quiz');
  renderQuestion();
}

function renderQuestion(){
  const q=questions[qIndex];
  const selected=answers[qIndex];
  $('#counter').textContent=String(qIndex+1).padStart(2,'0')+' / '+questions.length;
  $('#barFill').style.width=(qIndex/questions.length*100)+'%';
  $('#questionCard').innerHTML=`
    <div class="q-no">${String(qIndex+1).padStart(2,'0')}</div>
    <div class="q-zh">${q.zh}</div>
    <div class="q-en">${q.en}</div>
    <div class="opts">
      ${q.opts.map((option,index)=>`
        <button class="opt ${selected&&selected.i===index?'selected':''}" data-i="${index}" type="button">
          <b>${String.fromCharCode(65+index)}</b>${option[0]}
          <small>${option[1]}</small>
        </button>
      `).join('')}
    </div>
    <div class="nav">
      <button class="btn" id="prevBtn" type="button" ${qIndex===0?'disabled':''}>上一題</button>
      <button class="btn primary" id="nextBtn" type="button" ${selected?'':'disabled'}>${qIndex===questions.length-1?'完成測驗':'下一題'}</button>
    </div>
  `;
  document.querySelectorAll('.opt').forEach(btn=>btn.addEventListener('click',()=>selectOption(Number(btn.dataset.i))));
  $('#prevBtn').addEventListener('click',()=>{if(qIndex>0){qIndex--;renderQuestion();}});
  $('#nextBtn').addEventListener('click',()=>{if(qIndex<questions.length-1){qIndex++;renderQuestion();}else{prepareLeadGate();}});
}

function selectOption(index){
  answers[qIndex]={i:index,codes:questions[qIndex].opts[index][2]};
  renderQuestion();
  setTimeout(()=>{
    if(qIndex<questions.length-1){qIndex++;renderQuestion();}
    else{prepareLeadGate();}
  },220);
}

function calculate(){
  scores={A:0,B:0,C:0,D:0,E:0,F:0,G:0};
  answers.forEach(answer=>{
    if(answer) answer.codes.forEach(key=>scores[key]++);
  });
  return order.reduce((best,key)=>scores[key]>scores[best]?key:best,'A');
}

function prepareLeadGate(){
  if(answers.some(answer=>!answer)){toast('還有題目未完成');return;}
  currentKey=calculate();
  currentProfile=profiles[currentKey];
  $('#barFill').style.width='100%';
  show('lead');
  setTimeout(()=>$('#leadName')?.focus(),350);
}

function getSource(){
  const params=new URLSearchParams(location.search);
  const raw=`${params.get('utm_source')||''} ${params.get('source')||''} ${params.get('ref')||''}`.toLowerCase();
  const ref=(document.referrer||'').toLowerCase();
  const value=`${raw} ${ref}`;
  if(/instagram|ig|l\.instagram/.test(value)) return 'Instagram';
  if(/line|lin\.ee|liff/.test(value)) return 'LINE';
  if(/google|gclid/.test(value)) return 'Google';
  if(!ref&&!raw) return 'Direct';
  return 'Other';
}

function setFormMessage(message,type='error'){
  const el=$('#formMessage');
  if(!el) return;
  el.textContent=message;
  el.classList.toggle('success',type==='success');
}

function validateLead(){
  const name=$('#leadName').value.trim();
  const email=$('#leadEmail').value.trim();
  const interest=document.querySelector('input[name="courseInterest"]:checked')?.value||'';
  const consent=$('#leadConsent').checked;

  if(!name) return {error:'請填寫姓名。'};
  if(!email||!$('#leadEmail').checkValidity()) return {error:'請填寫有效的 Email。'};
  if(!interest) return {error:'請選擇最想學習的課程方向。'};
  if(!consent) return {error:'請勾選個人資料使用同意。'};
  return {name,email,interest};
}

async function submitLead(event){
  event.preventDefault();
  if(submitting) return;

  const data=validateLead();
  if(data.error){
    setFormMessage(data.error);
    return;
  }
  if(!db){
    setFormMessage('資料服務尚未載入，請重新整理後再試。');
    return;
  }
  if(!currentKey||!currentProfile){
    setFormMessage('測驗結果已失效，請重新完成測驗。');
    return;
  }

  submitting=true;
  const button=$('#submitLeadBtn');
  button.disabled=true;
  button.textContent='送出中…';
  setFormMessage('');

  try{
    const {error}=await db.from('helori_course_leads').insert({
      name:data.name,
      email:data.email.toLowerCase(),
      course_interest:data.interest,
      result_key:currentKey,
      result_type:currentProfile.type,
      source:getSource(),
      path:`${location.hostname}${location.pathname}${location.search}`.slice(0,500),
      consent_at:new Date().toISOString(),
      metadata:{
        answer_indexes:answers.map(answer=>answer?.i??null),
        flow:'course_briefing'
      }
    });

    if(error) throw error;
    selectedCourse=data.interest;
    setFormMessage('資料已送出，正在揭曉你的 Helori。','success');
    setTimeout(renderResult,420);
  }catch(error){
    console.warn('[Helori lead]',error?.message||error);
    setFormMessage('目前無法送出，請檢查網路後再試一次。你的答案仍會保留。');
  }finally{
    submitting=false;
    button.disabled=false;
    button.textContent='送出並查看答案';
  }
}

function renderResult(){
  if(!currentKey||!currentProfile) return;
  $('#resImg').src=imgs[currentKey];
  $('#atlasNo').textContent='Atlas No. 0'+(order.indexOf(currentKey)+1);
  $('#resName').textContent=currentProfile.type;
  $('#resEn').textContent=currentProfile.en;
  $('#scentLine').textContent='香氣方向｜'+currentProfile.scent;
  $('#resDesc').textContent=currentProfile.desc;
  const courseBtn=$('#courseBtn');
  courseBtn.href=courseUrls[selectedCourse]||'https://www.hanascent.com/';
  courseBtn.textContent=`查看課程｜${selectedCourse}`;
  show('result');
}

function isMobileLine(){
  return /Android|iPhone|iPad|iPod|Line/i.test(navigator.userAgent);
}

async function copyLineText(text){
  try{
    await navigator.clipboard.writeText(text);
    toast('訊息已複製，請貼到 LINE 並附上限動截圖');
  }catch(_){
    toast('請將結果與限動截圖傳送至官方 LINE');
  }
}

async function openClaimLine(){
  if(!currentProfile) return;
  const name=$('#leadName').value.trim();
  const text=`你好，我是 ${name}。
我的 Helori 是：${currentProfile.type}
想了解的課程：${selectedCourse}
我已追蹤 @hanas.scent 並分享限時動態，附上截圖領取織品噴霧。`;
  const url='https://line.me/R/oaMessage/@'+LINE_ID+'/?'+encodeURIComponent(text);
  if(isMobileLine()){
    window.location.href=url;
    return;
  }
  await copyLineText(text);
  window.open(LINE_HOME_URL,'_blank');
}

function loadImage(src){
  return new Promise((resolve,reject)=>{
    const image=new Image();
    image.onload=()=>resolve(image);
    image.onerror=reject;
    image.src=src;
  });
}

function canvasToBlob(canvas){
  return new Promise(resolve=>canvas.toBlob(resolve,'image/png',1));
}

async function createStoryImage(){
  const canvas=document.createElement('canvas');
  canvas.width=1080;
  canvas.height=1920;
  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#ffffff';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.fillStyle='#111111';
  ctx.textAlign='center';
  ctx.font='500 34px serif';
  ctx.fillText('HANA SCENT ARTIST',540,105);
  ctx.font='28px serif';
  ctx.fillText('FIND YOUR HELORI',540,162);

  const image=await loadImage(imgs[currentKey]);
  const size=760;
  const x=(canvas.width-size)/2;
  const y=260;
  ctx.drawImage(image,x,y,size,size);

  ctx.strokeStyle='#d8d8d8';
  ctx.lineWidth=2;
  ctx.strokeRect(x,y,size,size);

  ctx.fillStyle='#666666';
  ctx.font='28px serif';
  ctx.fillText('YOUR HELORI IS',540,1110);

  ctx.fillStyle='#111111';
  ctx.font='500 58px serif';
  ctx.fillText(currentProfile.type,540,1195);

  ctx.fillStyle='#555555';
  ctx.font='30px serif';
  ctx.fillText(currentProfile.en,540,1255);

  ctx.strokeStyle='#111111';
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.moveTo(170,1320);
  ctx.lineTo(910,1320);
  ctx.stroke();

  ctx.fillStyle='#333333';
  ctx.font='30px serif';
  wrapCanvasText(ctx,currentProfile.scent,540,1400,820,48);

  ctx.fillStyle='#666666';
  ctx.font='26px serif';
  wrapCanvasText(ctx,'追蹤 @hanas.scent 並分享至限時動態，完成織品噴霧領取。',540,1590,760,42);

  ctx.fillStyle='#111111';
  ctx.font='24px serif';
  ctx.fillText('findyourhelori.hanascent.com',540,1790);
  return canvas;
}

function wrapCanvasText(ctx,text,x,y,maxWidth,lineHeight){
  const words=text.split(' ');
  const lines=[];
  let line='';
  words.forEach(word=>{
    const test=line?`${line} ${word}`:word;
    if(ctx.measureText(test).width>maxWidth&&line){
      lines.push(line);
      line=word;
    }else{
      line=test;
    }
  });
  if(line) lines.push(line);
  lines.forEach((value,index)=>ctx.fillText(value,x,y+(index*lineHeight)));
}

async function shareStory(){
  if(!currentProfile) return;
  const button=$('#storyBtn');
  button.disabled=true;
  button.textContent='製作結果圖中…';

  try{
    const canvas=await createStoryImage();
    const blob=await canvasToBlob(canvas);
    if(!blob) throw new Error('Image export failed');
    const filename=`my-helori-${names[currentKey].toLowerCase()}.png`;
    const file=new File([blob],filename,{type:'image/png'});

    if(navigator.share&&navigator.canShare?.({files:[file]})){
      await navigator.share({
        files:[file],
        title:'My Helori',
        text:`我的 Helori 是 ${currentProfile.type}｜@hanas.scent`
      });
      toast('請在分享選單選擇 Instagram 限時動態');
    }else{
      const link=document.createElement('a');
      link.download=filename;
      link.href=URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(()=>URL.revokeObjectURL(link.href),1200);
      toast('結果圖已下載，請上傳至 Instagram 限時動態');
    }
  }catch(error){
    if(error?.name!=='AbortError'){
      console.warn('[Helori story]',error);
      toast('結果圖製作失敗，請截圖目前頁面分享');
    }
  }finally{
    button.disabled=false;
    button.textContent='分享／下載限動結果圖';
  }
}

$('#startBtn').addEventListener('click',startQuiz);
$('#leadForm').addEventListener('submit',submitLead);
$('#backToQuizBtn').addEventListener('click',()=>{qIndex=questions.length-1;show('quiz');renderQuestion();});
$('#storyBtn').addEventListener('click',shareStory);
$('#claimBtn').addEventListener('click',openClaimLine);
$('#resetBtn').addEventListener('click',()=>{resetState();show('landing');});

buildLanding();
resetState();
