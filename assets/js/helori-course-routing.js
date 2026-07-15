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
    document.querySelectorAll('.screen').forEach(screen => {
      screen.style.removeProperty('display');
    });

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
