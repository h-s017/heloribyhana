Keylume Scent Atlas｜圖片外掛＋資料回傳版

檔案結構：
- index.html
- assets/characters/ 七張 IP 圖片
- Code.gs  Google Apps Script 回傳 Google Sheet 程式碼

GitHub Pages 上傳：
1. 將 index.html 與 assets 資料夾一起上傳到 repository 根目錄。
2. 保留 assets/characters/ 的資料夾結構。
3. GitHub Pages 會讀取 index.html。

Google Sheet 回傳：
1. 到 Google Sheet → 擴充功能 → Apps Script。
2. 將 Code.gs 內容貼上。
3. 部署 → 新增部署作業 → 類型選「網頁應用程式」。
4. 執行身分：我。
5. 誰可以存取：任何人。
6. 部署後複製 Web App URL。
7. 本版 index.html 已設定為你提供的 Web App URL：
   https://script.google.com/macros/s/AKfycbzZ-i9zat_U57yJmHkTnEhIYsxNU3l5UMpmHCLkivz06PVtrccQhfS6SzTwnoewTO5t/exec

注意：
- 不要直接按 Apps Script 的 doPost 執行；那會沒有 postData。
- 要測試請執行 testDoPost，或從網頁正式送出測驗。
