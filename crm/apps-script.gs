/**
 * KHRUSTIKS — приёмник заявок в Google Sheets
 * -----------------------------------------------------------
 * Установка:
 *   1) Открой https://sheets.google.com → создай новую таблицу «KHRUSTIKS · Заявки»
 *   2) Расширения → Apps Script
 *   3) Вставь этот файл целиком (замени содержимое Code.gs)
 *   4) Deploy → New deployment → Type: Web app
 *      Execute as: Me
 *      Who has access: Anyone
 *   5) Скопируй Web app URL и вставь его в script.js в переменную CRM_ENDPOINT
 *
 * Что делает:
 *   • При первом запуске создаёт лист «Заявки» и шапку.
 *   • Каждую заявку пишет новой строкой + подсвечивает статус «новая».
 *   • (Опционально) шлёт письмо на MANAGER_EMAIL — раскомментируй строчку внизу.
 */

const SHEET_NAME    = "Заявки";
const MANAGER_EMAIL = "";  // напр. "manager@khrustiks.ru" — оставь пустым, если письма не нужны

const HEADERS = [
  "Дата", "№ заявки", "Товар", "Цвет", "Размер", "Цена, ₽",
  "Имя", "Телефон", "Email",
  "Город", "Индекс", "Адрес", "Доставка", "Комментарий",
  "Источник", "Статус"
];

function doPost(e){
  try{
    const raw  = e.postData && e.postData.contents ? e.postData.contents : "{}";
    const data = JSON.parse(raw);

    const sheet = getSheet_();
    const row = [
      new Date(),
      data.orderNo   || "",
      data.product   || "",
      data.color     || "",
      data.size      || "",
      Number(data.price) || 0,
      data.name      || "",
      data.phone     || "",
      data.email     || "",
      data.city      || "",
      data.zip       || "",
      data.address   || "",
      data.delivery  || "",
      data.comment   || "",
      data.source    || "",
      "новая"
    ];
    sheet.appendRow(row);

    // подсвечиваем статус жёлтым
    const r = sheet.getLastRow();
    sheet.getRange(r, HEADERS.length).setBackground("#fff3b0");

    // письмо менеджеру (по желанию)
    if (MANAGER_EMAIL) {
      MailApp.sendEmail({
        to: MANAGER_EMAIL,
        subject: "KHRUSTIKS · Новая заявка " + (data.orderNo || ""),
        htmlBody:
          "<h3>Заявка " + (data.orderNo || "") + "</h3>" +
          "<p><b>Товар:</b> " + data.product + " · " + data.color + " · " + data.size + "<br>" +
          "<b>Цена:</b> " + Number(data.price).toLocaleString("ru-RU") + " ₽</p>" +
          "<p><b>Клиент:</b> " + data.name + "<br>" +
          "<b>Тел:</b> " + data.phone + "<br>" +
          "<b>Email:</b> " + data.email + "</p>" +
          "<p><b>Доставка:</b> " + data.delivery + "<br>" +
          data.city + ", " + data.zip + ", " + data.address + "</p>" +
          "<p><b>Комментарий:</b> " + (data.comment || "—") + "</p>"
      });
    }

    return json_({ok: true, orderNo: data.orderNo});
  } catch(err) {
    return json_({ok: false, error: String(err)});
  }
}

// Быстрая проверка «работает?» — открой Web app URL в браузере.
function doGet(){
  return json_({ok: true, service: "KHRUSTIKS CRM", ts: new Date().toISOString()});
}

function getSheet_(){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh){
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.getRange(1,1,1,HEADERS.length)
      .setFontWeight("bold").setBackground("#0a0a0a").setFontColor("#f4f2ee");
    sh.setFrozenRows(1);
    // ширины
    [140,110,130,90,80,110,160,160,220,140,90,320,140,240,140,90]
      .forEach((w,i) => sh.setColumnWidth(i+1, w));
  }
  return sh;
}

function json_(obj){
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
