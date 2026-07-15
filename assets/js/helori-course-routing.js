(() => {
  'use strict';

  const COURSE_URL = 'https://hanascent.com/courses/';
  const LINE_ID = '199ywnfo';
  const LINE_HOME_URL = `https://line.me/R/ti/p/@${LINE_ID}`;
  const $ = selector => document.querySelector(selector);

  function updateCourseButton() {
    const button = $('#courseBtn');
    if (!button) return;
    button.href = COURSE_URL;
    button.textContent = '查看課程';
  }

  function currentHeloriName() {
    try {
      if (typeof currentKey === 'string' && typeof names === 'object' && names[currentKey]) {
        return names[currentKey];
      }
    } catch (_) {}

    const resultText = ($('#resName') && $('#resName').textContent || '').trim();
    return resultText.split('｜')[0].trim() || 'HELORI';
  }

  function isMobileLine() {
    return /Android|iPhone|iPad|iPod|Line/i.test(navigator.userAgent);
  }

  async function copyLineKeyword(keyword) {
    try {
      await navigator.clipboard.writeText(keyword);
      toast('結果關鍵字已複製，請貼到 LINE 後送出');
    } catch (_) {
      toast(`請在 LINE 傳送：${keyword}`);
    }
  }

  async function openLineWithResult() {
    const heloriName = currentHeloriName();
    const keyword = `HELORI結果｜${heloriName}`;
    const url = `https://line.me/R/oaMessage/@${LINE_ID}/?${encodeURIComponent(keyword)}`;

    if (isMobileLine()) {
      window.location.href = url;
      return;
    }

    await copyLineKeyword(keyword);
    window.open(LINE_HOME_URL, '_blank', 'noopener');
  }

  function replaceClaimButtonHandler() {
    const original = $('#claimBtn');
    if (!original) return;

    const replacement = original.cloneNode(true);
    replacement.textContent = '到 LINE 傳送結果並領取';
    original.replaceWith(replacement);
    replacement.addEventListener('click', openLineWithResult);
  }

  function activateScreen(id) {
    const screens = document.querySelectorAll('.screen');
    for (let index = 0; index < screens.length; index += 1) {
      const screen = screens[index];
      const active = screen.id === id;
      screen.classList.toggle('active', active);
      screen.style.display = active ? (id === 'landing' ? 'flex' : 'block') : 'none';
    }

    try {
      window.scrollTo(0, 0);
    } catch (_) {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }

  function installMobileStartFix() {
    const original = $('#startBtn');
    if (!original) return;

    const replacement = original.cloneNode(true);
    original.replaceWith(replacement);

    let lastTouchAt = 0;

    function enterQuiz(event) {
      if (event && typeof event.preventDefault === 'function') event.preventDefault();

      try {
        if (typeof resetState === 'function') resetState();
        if (typeof renderQuestion === 'function') renderQuestion();
        activateScreen('quiz');
      } catch (error) {
        console.warn('[Helori mobile start]', error);
        const landing = $('#landing');
        const quiz = $('#quiz');
        if (landing) {
          landing.classList.remove('active');
          landing.style.display = 'none';
        }
        if (quiz) {
          quiz.classList.add('active');
          quiz.style.display = 'block';
        }
        toast('測驗載入中，請再點一次開始按鈕');
      }
    }

    replacement.addEventListener('touchend', event => {
      lastTouchAt = Date.now();
      enterQuiz(event);
    }, { passive: false });

    replacement.addEventListener('click', event => {
      if (Date.now() - lastTouchAt < 700) return;
      enterQuiz(event);
    });
  }

  try {
    show = activateScreen;
  } catch (_) {}

  updateCourseButton();
  replaceClaimButtonHandler();
  installMobileStartFix();

  const resultScreen = $('#result');
  if (resultScreen) {
    const observer = new MutationObserver(updateCourseButton);
    observer.observe(resultScreen, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true
    });
  }
})();