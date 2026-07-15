(() => {
  'use strict';

  const avatarFiles = {
    A: 'misti.jpg',
    B: 'flori.jpg',
    C: 'velmo.jpg',
    D: 'ambra.jpg',
    E: 'nocta.jpg',
    F: 'tealu.jpg',
    G: 'mossi.jpg'
  };

  function sameOriginAvatarUrl(key) {
    const filename = avatarFiles[key];
    if (!filename) throw new Error('Unknown Helori result');
    return new URL(`../assets/avatars/${filename}`, window.location.href).href;
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      let settled = false;

      const finish = callback => value => {
        if (settled) return;
        settled = true;
        callback(value);
      };

      image.decoding = 'async';
      image.onload = finish(() => resolve(image));
      image.onerror = finish(() => reject(new Error(`Unable to load image: ${src}`)));
      image.src = src;

      if (image.complete && image.naturalWidth > 0) {
        settled = true;
        resolve(image);
      }
    });
  }

  function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
      try {
        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else reject(new Error('Image export returned an empty file'));
        }, 'image/png', 1);
      } catch (error) {
        reject(error);
      }
    });
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const units = typeof Intl?.Segmenter === 'function'
      ? [...new Intl.Segmenter('zh-Hant', { granularity: 'word' }).segment(text)].map(item => item.segment)
      : Array.from(text);

    const lines = [];
    let line = '';

    units.forEach(unit => {
      const test = line + unit;
      if (line && ctx.measureText(test).width > maxWidth) {
        lines.push(line.trim());
        line = unit;
      } else {
        line = test;
      }
    });

    if (line) lines.push(line.trim());
    lines.forEach((value, index) => ctx.fillText(value, x, y + (index * lineHeight)));
  }

  async function createFixedStoryImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas is not supported');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#111111';
    ctx.textAlign = 'center';
    ctx.font = '500 34px serif';
    ctx.fillText('HANA SCENT ARTIST', 540, 105);
    ctx.font = '28px serif';
    ctx.fillText('FIND YOUR HELORI', 540, 162);

    const image = await loadImage(sameOriginAvatarUrl(currentKey));
    const size = 760;
    const x = (canvas.width - size) / 2;
    const y = 260;
    ctx.drawImage(image, x, y, size, size);

    ctx.strokeStyle = '#d8d8d8';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, size, size);

    ctx.fillStyle = '#666666';
    ctx.font = '28px serif';
    ctx.fillText('YOUR HELORI IS', 540, 1110);

    ctx.fillStyle = '#111111';
    ctx.font = '500 58px serif';
    ctx.fillText(currentProfile.type, 540, 1195);

    ctx.fillStyle = '#555555';
    ctx.font = '30px serif';
    ctx.fillText(currentProfile.en, 540, 1255);

    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(170, 1320);
    ctx.lineTo(910, 1320);
    ctx.stroke();

    ctx.fillStyle = '#333333';
    ctx.font = '30px serif';
    wrapText(ctx, currentProfile.scent, 540, 1400, 820, 48);

    ctx.fillStyle = '#666666';
    ctx.font = '26px serif';
    wrapText(ctx, '追蹤 @hanas.scent 並分享至限時動態，完成織品噴霧領取。', 540, 1590, 760, 42);

    ctx.fillStyle = '#111111';
    ctx.font = '24px serif';
    ctx.fillText('findyourhelori.hanascent.com', 540, 1790);

    return canvas;
  }

  async function fixedShareStory(button) {
    if (!currentProfile || !currentKey) return;

    button.disabled = true;
    button.textContent = '製作結果圖中…';

    try {
      const canvas = await createFixedStoryImage();
      const blob = await canvasToBlob(canvas);
      const filename = `my-helori-${names[currentKey].toLowerCase()}.png`;
      const file = new File([blob], filename, { type: 'image/png' });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My Helori',
          text: `我的 Helori 是 ${currentProfile.type}｜@hanas.scent`
        });
        toast('請在分享選單選擇 Instagram 限時動態');
      } else {
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = filename;
        link.href = objectUrl;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
        toast('結果圖已下載，請上傳至 Instagram 限時動態');
      }
    } catch (error) {
      if (error?.name !== 'AbortError') {
        console.warn('[Helori story hotfix]', error);
        toast('結果圖製作失敗，請重新整理頁面後再試一次');
      }
    } finally {
      button.disabled = false;
      button.textContent = '分享／下載限動結果圖';
    }
  }

  const originalButton = document.querySelector('#storyBtn');
  if (!originalButton) return;

  const replacement = originalButton.cloneNode(true);
  originalButton.replaceWith(replacement);
  replacement.addEventListener('click', () => fixedShareStory(replacement));
})();
