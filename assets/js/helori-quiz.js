const LIFF_ID='2010125170-LLEvROMg';
const LIFF_URL='https://liff.line.me/2010125170-LLEvROMg';
const SHARE_URL='https://social-plugins.line.me/lineit/share?url='+encodeURIComponent(LIFF_URL);
const LINE_ID='199ywnfo';
const LINE_HOME_URL='https://line.me/R/ti/p/@199ywnfo';
const BASE='https://h-s017.github.io/heloribyhana/';

let liffReady=false;
let currentProfile=null;
let currentKey=null;
let qIndex=0;
let answers=[];
let scores={A:0,B:0,C:0,D:0,E:0,F:0,G:0};

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

const $=selector=>document.querySelector(selector);

function toast(message){
  const t=$('#toast');
  t.textContent=message;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2400);
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
      <button class="btn primary" id="nextBtn" type="button" ${selected?'':'disabled'}>${qIndex===questions.length-1?'查看結果':'下一題'}</button>
    </div>
  `;
  document.querySelectorAll('.opt').forEach(btn=>btn.addEventListener('click',()=>selectOption(Number(btn.dataset.i))));
  $('#prevBtn').addEventListener('click',()=>{if(qIndex>0){qIndex--;renderQuestion();}});
  $('#nextBtn').addEventListener('click',()=>{if(qIndex<questions.length-1){qIndex++;renderQuestion();}else{showResult();}});
}

function selectOption(index){
  answers[qIndex]={i:index,codes:questions[qIndex].opts[index][2]};
  renderQuestion();
  setTimeout(()=>{
    if(qIndex<questions.length-1){qIndex++;renderQuestion();}
    else{showResult();}
  },220);
}

function calculate(){
  scores={A:0,B:0,C:0,D:0,E:0,F:0,G:0};
  answers.forEach(answer=>{
    if(answer) answer.codes.forEach(key=>scores[key]++);
  });
  return order.reduce((best,key)=>scores[key]>scores[best]?key:best,'A');
}

function showResult(){
  if(answers.some(answer=>!answer)){toast('還有題目未完成');return;}
  const key=calculate();
  const profile=profiles[key];
  currentProfile=profile;
  currentKey=key;
  $('#barFill').style.width='100%';
  $('#resImg').src=imgs[key];
  $('#atlasNo').textContent='Atlas No. 0'+(order.indexOf(key)+1);
  $('#resName').textContent=profile.type;
  $('#resEn').textContent=profile.en;
  $('#scentLine').textContent='香氣方向｜'+profile.scent;
  $('#resDesc').textContent=profile.desc;
  show('result');
}

function lineMessageUrl(text){
  return 'https://line.me/R/oaMessage/@'+LINE_ID+'/?'+encodeURIComponent(text);
}

function resultText(intent){
  if(!currentProfile) return '';
  if(intent==='discount') return `領取優惠\n我的 Helori 是：${currentProfile.type}`;
  return `我的 Helori 是：${currentProfile.type}`;
}

function isMobileLine(){
  return /Android|iPhone|iPad|iPod|Line/i.test(navigator.userAgent);
}

async function copyLineText(text){
  try{
    await navigator.clipboard.writeText(text);
    toast('訊息已複製，請貼到 LINE');
  }catch(e){
    toast('請複製：'+text);
  }
}

async function openOfficialLine(intent){
  const text=resultText(intent);
  if(!text){toast('請先完成測驗');return;}
  if(isMobileLine()){
    const url=lineMessageUrl(text);
    try{
      if(window.liff&&liffReady&&liff.isInClient()){
        liff.openWindow({url,external:true});
        return;
      }
    }catch(e){console.warn(e);}
    window.location.href=url;
    return;
  }
  await copyLineText(text);
  window.open(LINE_HOME_URL,'_blank');
}

async function shareQuiz(){
  try{
    if(window.liff&&liffReady&&liff.isInClient()&&liff.isApiAvailable('shareTargetPicker')){
      await liff.shareTargetPicker([{type:'text',text:`我剛剛完成 Find Your Helori 測驗。\n來看看你的氣味角色是哪一位：\n${LIFF_URL}`}]);
      toast('已開啟分享');
      return;
    }
  }catch(e){console.warn(e);}
  window.location.href=SHARE_URL;
}

async function initLiff(){
  try{
    if(window.liff){
      await liff.init({liffId:LIFF_ID});
      liffReady=true;
    }
  }catch(e){console.warn('LIFF init failed',e);}
}

$('#startBtn').addEventListener('click',startQuiz);
$('#shareLandingBtn').addEventListener('click',shareQuiz);
$('#sendResultBtn').addEventListener('click',()=>openOfficialLine('intro'));
$('#discountBtn').addEventListener('click',()=>openOfficialLine('discount'));
$('#shareBtn').addEventListener('click',shareQuiz);
$('#resetBtn').addEventListener('click',()=>{resetState();show('landing');});
buildLanding();
resetState();
initLiff();