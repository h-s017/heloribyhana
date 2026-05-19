Find Your Helori｜v11 上傳說明

這版修正重點：
1. 「到官方 LINE 查看完整檔案」完全不再使用 liff.sendMessages()。
2. 改用 LINE 官方帳號 oaMessage 連結：
   https://line.me/R/oaMessage/@hscent/?...
3. 在 LIFF 內會使用 liff.openWindow({ external:true }) 打開官方 LINE，避免訊息留在朋友聊天室。
4. 帶入的關鍵字格式：
   查看Flori｜芙蘿莉的完整檔案

上傳方式：
1. 到 GitHub repo：h-s017/heloribyhana
2. 上傳這包裡的 index.html，覆蓋原本的 index.html
3. Commit changes
4. 等 GitHub Pages 更新
5. 用這個測試：
   https://liff.line.me/2010125170-LLEvROMg?v=11

重要：
若你仍看到舊行為，通常是 GitHub Pages / LINE LIFF 快取。
請確認網址後方是 ?v=11，並重新開啟 LINE App 測試。
