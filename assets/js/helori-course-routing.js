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

  function activateScreen(id) {
    document.querySelectorAll('.screen').forEach(screen => {
      const active = screen.id === id;
      screen.classList.toggle('active', active);
      screen.style.display = active ? (id === 'landing' ? 'flex' : 'block') : 'none';
    });

    window.scrollTo(0, 0);
  }

  function startQuizFallback(event) {
    if (event) event.preventDefault();

    try {
      if (typeof resetState === 'function') resetState();
      if (typeof renderQuestion === 'function') renderQuestion();
    } catch (error) {
      console.warn('[Helori start fallback]', error);
    }

    activateScreen('quiz');
  }

  function currentHeloriName() {
    try {
      if (typeof currentKey === 'string' && typeof names === 'object' && names[currentKey]) {
        return names[currentKey];
      }
    } catch (_) {}

    const resultText = ($('#resName')?.textContent || '').trim();
    return resultText.split('｜')[0].trim() || 'HELORI';
  }

  function openLineWithResult(event) {
    if (event) event.preventDefault();

    const keyword = `HELORI結果｜${currentHeloriName()}`;
    const messageUrl = `https://line.me/R/oaMessage/@${LINE_ID}/?${encodeURIComponent(keyword)}`;
    const isMobile = /Android|iPhone|iPad|iPod|Line/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = messageUrl;
      return;
    }

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(keyword).catch(() => {});
    }
    window.open(LINE_HOME_URL, '_blank', 'noopener');
  }

  function installHandlers() {
    const startButton = $('#startBtn');
    if (startButton) {
      startButton.addEventListener('click', startQuizFallback);
      startButton.addEventListener('touchend', startQuizFallback, { passive: false });
    }

    const claimButton = $('#claimBtn');
    if (claimButton) {
      const replacement = claimButton.cloneNode(true);
      replacement.textContent = '到 LINE 傳送結果並領取';
      claimButton.replaceWith(replacement);
      replacement.addEventListener('click', openLineWithResult);
    }

    updateCourseButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installHandlers, { once: true });
  } else {
    installHandlers();
  }
})();
