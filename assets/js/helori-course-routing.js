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

  updateCourseButton();
  replaceClaimButtonHandler();

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
