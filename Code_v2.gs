/** FisherHouse — Google Apps Script Web App
 *  Endpoints used by frontend:
 *   GET  ?action=getBookedDates
 *   GET  ?action=getGallery
 *   POST action=createRequest  (application/x-www-form-urlencoded)
 *
 *  Manual confirmation:
 *   - Admin changes "status" in Google Sheet (Bookings) => emails are sent automatically (installable onEdit trigger)
 *   - Or use menu FisherHouse inside the Sheet (installable onOpen trigger)
 */

const FH_CONFIG = {
  SITE_URL: 'https://vazuza-fisherhouse.ru/',
  TIMEZONE: 'Europe/Moscow',

  // Admin email for notifications
  ADMIN_EMAIL: 'booking@vazuza-fisherhouse.ru',

  // Optional: BCC for admin copies (leave empty if not needed)
  ADMIN_BCC: '',

  // Sheet names
  SHEET_BOOKINGS: 'Bookings',
  SHEET_GALLERY: 'Gallery',
  SHEET_SETTINGS: 'Settings',

  // Booking statuses
  STATUS_PENDING: 'PENDING',
  STATUS_WAITLIST: 'WAITLIST',
  STATUS_CONFIRMED: 'CONFIRMED',
  STATUS_PAID: 'PAID',
  STATUS_DECLINED: 'DECLINED',
  STATUS_CANCELLED: 'CANCELLED',

  // Which statuses block dates for regular booking
  BLOCK_BOOKED_STATUSES: ['PENDING', 'CONFIRMED'],
  BLOCK_PAID_STATUSES: ['PAID'],

  // Security for admin endpoints (optional). If empty => admin endpoints disabled (not needed for sheet-based admin)
  ADMIN_TOKEN: ''
};

const FH_HEADERS = [
  'id',
  'created_at',
  'status',
  'check_in',
  'check_out',
  'nights',
  'guests',
  'name',
  'phone',
  'email',
  'comment',
  'promo_code',
  'payment_method',
  'newsletter',
  'source',
  'updated_at'
];

function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) ? String(e.parameter.action) : '';
    if (action === 'getBookedDates') return fh_getBookedDates_();
    if (action === 'getGallery') return fh_getGallery_();

    // Optional admin endpoint (disabled by default unless ADMIN_TOKEN is set)
    if (action === 'adminSetStatus') return fh_adminSetStatus_(e);

    return fh_json_({ ok: true, action: action || 'none', message: 'FisherHouse Web App is running' });
  } catch (err) {
    return fh_json_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function doPost(e) {
  try {
    const p = (e && e.parameter) ? e.parameter : {};
    const action = p.action ? String(p.action) : '';
    if (action === 'createRequest') return fh_createRequest_(p);

    return fh_json_({ ok: false, error: 'Unknown action', action });
  } catch (err) {
    return fh_json_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

/* =========================
   Setup / Spreadsheet
========================= */

function setup() {
  // 1) Ensure spreadsheet exists (create if missing)
  const ss = fh_getOrCreateSpreadsheet_();

  // 2) Ensure required sheets
  fh_ensureSheet_(ss, FH_CONFIG.SHEET_BOOKINGS, FH_HEADERS);
  fh_ensureGallerySheet_(ss);
  fh_ensureSettingsSheet_(ss);

  // 3) Install triggers (onEdit + onOpen)
  fh_installTriggers_(ss.getId());

  return 'OK. Spreadsheet: ' + ss.getUrl();
}

function fh_getOrCreateSpreadsheet_() {
  const props = PropertiesService.getScriptProperties();
  let ssId = props.getProperty('SPREADSHEET_ID');

  if (ssId) {
    return SpreadsheetApp.openById(ssId);
  }

  // Create new spreadsheet and store its ID
  const ss = SpreadsheetApp.create('FisherHouse — Bookings');
  ssId = ss.getId();
  props.setProperty('SPREADSHEET_ID', ssId);

  return ss;
}

function fh_getSpreadsheet_() {
  const props = PropertiesService.getScriptProperties();
  const ssId = props.getProperty('SPREADSHEET_ID');
  if (!ssId) {
    throw new Error('SPREADSHEET_ID is not set. Run setup() first.');
  }
  return SpreadsheetApp.openById(ssId);
}

function fh_ensureSheet_(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);

  // Ensure header row
  const firstRow = sh.getRange(1, 1, 1, headers.length).getValues()[0];
  const needHeaders = firstRow.join('||') !== headers.join('||');
  if (needHeaders) {
    sh.clear();
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    sh.setFrozenRows(1);
    sh.autoResizeColumns(1, headers.length);
  }

  // Styling (light)
  sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
}

function fh_ensureGallerySheet_(ss) {
  let sh = ss.getSheetByName(FH_CONFIG.SHEET_GALLERY);
  if (!sh) sh = ss.insertSheet(FH_CONFIG.SHEET_GALLERY);

  const headers = ['url', 'caption'];
  const firstRow = sh.getRange(1, 1, 1, headers.length).getValues()[0];
  if (firstRow.join('||') !== headers.join('||')) {
    sh.clear();
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    sh.setFrozenRows(1);
    sh.autoResizeColumns(1, headers.length);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
}

function fh_ensureSettingsSheet_(ss) {
  let sh = ss.getSheetByName(FH_CONFIG.SHEET_SETTINGS);
  if (!sh) sh = ss.insertSheet(FH_CONFIG.SHEET_SETTINGS);

  const headers = ['key', 'value'];
  const firstRow = sh.getRange(1, 1, 1, headers.length).getValues()[0];
  if (firstRow.join('||') !== headers.join('||')) {
    sh.clear();
    sh.getRange(1, 1, 1, 2).setValues([headers]);
    sh.setFrozenRows(1);
    sh.autoResizeColumns(1, 2);
    sh.getRange(1, 1, 1, 2).setFontWeight('bold');

    // Default rows
    sh.getRange(2, 1, 6, 2).setValues([
      ['ADMIN_EMAIL', FH_CONFIG.ADMIN_EMAIL],
      ['ADMIN_BCC', FH_CONFIG.ADMIN_BCC],
      ['SITE_URL', FH_CONFIG.SITE_URL],
      ['TIMEZONE', FH_CONFIG.TIMEZONE],
      ['ADMIN_TOKEN', FH_CONFIG.ADMIN_TOKEN],
      ['NOTE', 'You can edit values here. Script reads these first, then falls back to constants.']
    ]);
  }
}

function fh_readSettings_() {
  const ss = fh_getSpreadsheet_();
  const sh = ss.getSheetByName(FH_CONFIG.SHEET_SETTINGS);
  const map = {};
  if (!sh) return map;

  const values = sh.getDataRange().getValues();
  for (let i = 2; i <= values.length; i++) {
    const key = values[i - 1][0];
    const val = values[i - 1][1];
    if (key) map[String(key).trim()] = (val === undefined || val === null) ? '' : String(val).trim();
  }
  return map;
}

function fh_cfg_(key) {
  const s = fh_readSettings_();
  if (s[key] !== undefined && s[key] !== '') return s[key];
  return FH_CONFIG[key] !== undefined ? FH_CONFIG[key] : '';
}

/* =========================
   Triggers + Admin Menu
========================= */

function fh_installTriggers_(spreadsheetId) {
  // Remove existing triggers for this project (safe cleanup)
  const triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }

  ScriptApp.newTrigger('onOpenHandler')
    .forSpreadsheet(spreadsheetId)
    .onOpen()
    .create();

  ScriptApp.newTrigger('onEditHandler')
    .forSpreadsheet(spreadsheetId)
    .onEdit()
    .create();
}

function onOpenHandler(e) {
  try {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('FisherHouse')
      .addItem('Подтвердить выбранную заявку', 'adminConfirmSelected')
      .addItem('Пометить как оплачено', 'adminMarkPaidSelected')
      .addItem('Отклонить выбранную заявку', 'adminDeclineSelected')
      .addSeparator()
      .addItem('Открыть сайт', 'adminOpenSite')
      .addToUi();
  } catch (err) {
    // ignore
  }
}

function adminOpenSite() {
  const url = fh_cfg_('SITE_URL');
  SpreadsheetApp.getUi().alert('Сайт: ' + url);
}

function adminConfirmSelected() { fh_setStatusForSelectedRow_(FH_CONFIG.STATUS_CONFIRMED); }
function adminMarkPaidSelected() { fh_setStatusForSelectedRow_(FH_CONFIG.STATUS_PAID); }
function adminDeclineSelected() { fh_setStatusForSelectedRow_(FH_CONFIG.STATUS_DECLINED); }

function fh_setStatusForSelectedRow_(status) {
  const ss = fh_getSpreadsheet_();
  const sh = ss.getSheetByName(FH_CONFIG.SHEET_BOOKINGS);
  if (!sh) throw new Error('Bookings sheet not found');

  const range = ss.getActiveRange();
  if (!range) {
    SpreadsheetApp.getUi().alert('Сначала выделите строку заявки.');
    return;
  }

  const row = range.getRow();
  if (row <= 1) {
    SpreadsheetApp.getUi().alert('Выделите строку заявки (не заголовок).');
    return;
  }

  const statusCol = fh_colIndex_(FH_HEADERS, 'status');
  const updatedAtCol = fh_colIndex_(FH_HEADERS, 'updated_at');

  sh.getRange(row, statusCol).setValue(status);
  sh.getRange(row, updatedAtCol).setValue(fh_now_());

  SpreadsheetApp.getUi().alert('Статус обновлен: ' + status);
}

/* =========================
   Sheet onEdit => Emails on status change
========================= */

function onEditHandler(e) {
  try {
    if (!e || !e.range) return;
    const sh = e.range.getSheet();
    if (sh.getName() !== FH_CONFIG.SHEET_BOOKINGS) return;

    const row = e.range.getRow();
    const col = e.range.getColumn();
    if (row <= 1) return;

    const statusCol = fh_colIndex_(FH_HEADERS, 'status');
    if (col !== statusCol) return;

    const newStatus = String(e.value || '').trim();
    const oldStatus = String(e.oldValue || '').trim();

    if (!newStatus || newStatus === oldStatus) return;

    const ss = sh.getParent();
    const rowData = fh_getRowObject_(sh, row);

    // Always notify admin about status change
    fh_emailAdminStatusChange_(rowData, oldStatus, newStatus, ss.getUrl());

    // Notify client only for meaningful statuses
    if (rowData.email) {
      if (newStatus === FH_CONFIG.STATUS_CONFIRMED) fh_emailClientConfirmed_(rowData);
      if (newStatus === FH_CONFIG.STATUS_PAID) fh_emailClientPaid_(rowData);
      if (newStatus === FH_CONFIG.STATUS_DECLINED) fh_emailClientDeclined_(rowData);
      if (newStatus === FH_CONFIG.STATUS_CANCELLED) fh_emailClientCancelled_(rowData);
    }
  } catch (err) {
    // ignore
  }
}

/* =========================
   API actions
========================= */

function fh_getBookedDates_() {
  const ss = fh_getSpreadsheet_();
  const sh = ss.getSheetByName(FH_CONFIG.SHEET_BOOKINGS);
  if (!sh) return fh_json_({ booked: [], paid: [], updatedAt: fh_now_() });

  const values = sh.getDataRange().getValues();
  if (values.length <= 1) return fh_json_({ booked: [], paid: [], updatedAt: fh_now_() });

  const idxStatus = fh_idx_(values[0], 'status');
  const idxIn = fh_idx_(values[0], 'check_in');
  const idxOut = fh_idx_(values[0], 'check_out');

  const bookedSet = {};
  const paidSet = {};

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const status = String(row[idxStatus] || '').trim();
    const sIn = String(row[idxIn] || '').trim();
    const sOut = String(row[idxOut] || '').trim();
    if (!status || !sIn || !sOut) continue;

    const dIn = fh_parseDate_(sIn);
    const dOut = fh_parseDate_(sOut);
    if (!dIn || !dOut) continue;

    const dateKeys = fh_dateRangeInclusiveKeys_(dIn, dOut);

    if (FH_CONFIG.BLOCK_BOOKED_STATUSES.indexOf(status) >= 0) {
      for (let k = 0; k < dateKeys.length; k++) bookedSet[dateKeys[k]] = true;
    }
    if (FH_CONFIG.BLOCK_PAID_STATUSES.indexOf(status) >= 0) {
      for (let k = 0; k < dateKeys.length; k++) paidSet[dateKeys[k]] = true;
    }
  }

  const booked = Object.keys(bookedSet).sort();
  const paid = Object.keys(paidSet).sort();

  return fh_json_({ booked, paid, updatedAt: fh_now_() });
}

function fh_getGallery_() {
  const ss = fh_getSpreadsheet_();
  const sh = ss.getSheetByName(FH_CONFIG.SHEET_GALLERY);
  if (!sh) return fh_jsonArray_([]);

  const values = sh.getDataRange().getValues();
  if (values.length <= 1) return fh_jsonArray_([]);

  const idxUrl = fh_idx_(values[0], 'url');
  const idxCaption = fh_idx_(values[0], 'caption');

  const out = [];
  for (let i = 1; i < values.length; i++) {
    const url = String(values[i][idxUrl] || '').trim();
    const caption = String(values[i][idxCaption] || '').trim();
    if (!url) continue;
    out.push({ url, caption });
  }

  return fh_jsonArray_(out);
}

function fh_createRequest_(p) {
  // Validate
  const checkIn = String(p.checkIn || '').trim();
  const checkOut = String(p.checkOut || '').trim();
  const name = String(p.name || '').trim();
  const phone = String(p.phone || '').trim();
  const email = String(p.email || '').trim();

  if (!checkIn || !checkOut) return fh_json_({ ok: false, error: 'Missing dates' });
  if (!name) return fh_json_({ ok: false, error: 'Missing name' });
  if (!phone) return fh_json_({ ok: false, error: 'Missing phone' });
  if (!email) return fh_json_({ ok: false, error: 'Missing email' });

  const dIn = fh_parseDate_(checkIn);
  const dOut = fh_parseDate_(checkOut);
  if (!dIn || !dOut) return fh_json_({ ok: false, error: 'Invalid date format' });

  const nights = fh_diffDays_(dIn, dOut);
  const guests = Number(p.guests || 0) || 0;

  const commentRaw = String(p.comment || '').trim();
  const isWaitlist = commentRaw.indexOf('[WAITLIST]') === 0;
  const status = isWaitlist ? FH_CONFIG.STATUS_WAITLIST : FH_CONFIG.STATUS_PENDING;

  const rowObj = {
    id: fh_shortId_(),
    created_at: fh_now_(),
    status: status,
    check_in: checkIn,
    check_out: checkOut,
    nights: nights,
    guests: guests,
    name: name,
    phone: phone,
    email: email,
    comment: commentRaw,
    promo_code: String(p.promoCode || '').trim(),
    payment_method: String(p.paymentMethod || '').trim(),
    newsletter: String(p.newsletter || '').trim(),
    source: 'landing',
    updated_at: fh_now_()
  };

  // Write to sheet
  const ss = fh_getSpreadsheet_();
  const sh = ss.getSheetByName(FH_CONFIG.SHEET_BOOKINGS);
  if (!sh) throw new Error('Bookings sheet not found');

  const row = FH_HEADERS.map(h => rowObj[h] !== undefined ? rowObj[h] : '');
  sh.appendRow(row);

  // Emails
  const sheetUrl = ss.getUrl();
  fh_emailAdminNewRequest_(rowObj, sheetUrl);
  fh_emailClientNewRequest_(rowObj);

  return fh_json_({ ok: true, id: rowObj.id, status: rowObj.status });
}

/* =========================
   Optional admin endpoint (URL)
   GET ?action=adminSetStatus&id=XXX&status=CONFIRMED&token=...
========================= */

function fh_adminSetStatus_(e) {
  const token = String((e && e.parameter && e.parameter.token) ? e.parameter.token : '').trim();
  const required = String(fh_cfg_('ADMIN_TOKEN') || '').trim();
  if (!required) {
    return fh_json_({ ok: false, error: 'ADMIN_TOKEN is not set. Admin endpoint disabled.' });
  }
  if (!token || token !== required) {
    return fh_json_({ ok: false, error: 'Unauthorized' });
  }

  const id = String(e.parameter.id || '').trim();
  const status = String(e.parameter.status || '').trim();
  if (!id || !status) return fh_json_({ ok: false, error: 'Missing id/status' });

  const ss = fh_getSpreadsheet_();
  const sh = ss.getSheetByName(FH_CONFIG.SHEET_BOOKINGS);
  if (!sh) return fh_json_({ ok: false, error: 'Bookings sheet not found' });

  const data = sh.getDataRange().getValues();
  const header = data[0];
  const idxId = fh_idx_(header, 'id');
  const idxStatus = fh_idx_(header, 'status');
  const idxUpdated = fh_idx_(header, 'updated_at');

  for (let i = 1; i < data.length; i++) {
    const rowId = String(data[i][idxId] || '').trim();
    if (rowId === id) {
      sh.getRange(i + 1, idxStatus + 1).setValue(status);
      sh.getRange(i + 1, idxUpdated + 1).setValue(fh_now_());
      return fh_json_({ ok: true, id, status });
    }
  }

  return fh_json_({ ok: false, error: 'Booking not found', id });
}

/* =========================
   Emails
========================= */

function fh_emailAdminNewRequest_(b, sheetUrl) {
  const to = fh_cfg_('ADMIN_EMAIL');
  if (!to) return;

  const subj = (b.status === FH_CONFIG.STATUS_WAITLIST)
    ? ('FisherHouse — Лист ожидания: ' + b.name + ' (' + b.check_in + ' → ' + b.check_out + ')')
    : ('FisherHouse — Новая заявка: ' + b.name + ' (' + b.check_in + ' → ' + b.check_out + ')');

  const body =
    'Новая заявка с сайта FisherHouse\n\n' +
    'ID: ' + b.id + '\n' +
    'Статус: ' + b.status + '\n' +
    'Даты: ' + b.check_in + ' → ' + b.check_out + '\n' +
    'Ночей: ' + b.nights + '\n' +
    'Гостей: ' + b.guests + '\n\n' +
    'Имя: ' + b.name + '\n' +
    'Телефон: ' + b.phone + '\n' +
    'Email: ' + b.email + '\n' +
    'Оплата: ' + (b.payment_method || '—') + '\n' +
    'Промокод: ' + (b.promo_code || '—') + '\n' +
    'Newsletter: ' + (b.newsletter || '—') + '\n\n' +
    'Комментарий:\n' + (b.comment || '—') + '\n\n' +
    'Таблица заявок:\n' + sheetUrl + '\n';

  MailApp.sendEmail({
    to: to,
    bcc: fh_cfg_('ADMIN_BCC') || '',
    subject: subj,
    body: body
  });
}

function fh_emailClientNewRequest_(b) {
  const to = b.email;
  if (!to) return;

  const subj = (b.status === FH_CONFIG.STATUS_WAITLIST)
    ? 'FisherHouse — вы добавлены в лист ожидания'
    : 'FisherHouse — заявка получена';

  const body =
    'Здравствуйте, ' + b.name + '!\n\n' +
    (b.status === FH_CONFIG.STATUS_WAITLIST
      ? ('Мы получили вашу заявку на лист ожидания.\n' +
         'Как только освободится окно на ваши даты — мы свяжемся с вами.\n\n')
      : ('Мы получили вашу заявку и свяжемся для подтверждения бронирования.\n\n')) +
    'Даты: ' + b.check_in + ' → ' + b.check_out + '\n' +
    'Гостей: ' + b.guests + '\n' +
    'ID заявки: ' + b.id + '\n\n' +
    'Если вы уже оплатили — отправьте чек (скриншот) в Telegram-бот (как на странице бронирования).\n\n' +
    'Контакты:\n' +
    '+7 (996) 415-94-05\n' +
    'booking@vazuza-fisherhouse.ru\n\n' +
    'Сайт: ' + fh_cfg_('SITE_URL') + '\n';

  MailApp.sendEmail({
    to: to,
    subject: subj,
    body: body
  });
}

function fh_emailAdminStatusChange_(b, oldStatus, newStatus, sheetUrl) {
  const to = fh_cfg_('ADMIN_EMAIL');
  if (!to) return;

  const subj = 'FisherHouse — статус изменен: ' + b.id + ' (' + oldStatus + ' → ' + newStatus + ')';

  const body =
    'Изменение статуса заявки\n\n' +
    'ID: ' + b.id + '\n' +
    'Было: ' + oldStatus + '\n' +
    'Стало: ' + newStatus + '\n\n' +
    'Имя: ' + b.name + '\n' +
    'Телефон: ' + b.phone + '\n' +
    'Email: ' + b.email + '\n' +
    'Даты: ' + b.check_in + ' → ' + b.check_out + '\n\n' +
    'Таблица:\n' + sheetUrl + '\n';

  MailApp.sendEmail({
    to: to,
    bcc: fh_cfg_('ADMIN_BCC') || '',
    subject: subj,
    body: body
  });
}

function fh_emailClientConfirmed_(b) {
  const to = b.email;
  if (!to) return;

  const subj = 'FisherHouse — бронирование подтверждено';
  const body =
    'Здравствуйте, ' + b.name + '!\n\n' +
    'Ваше бронирование подтверждено.\n\n' +
    'Даты: ' + b.check_in + ' → ' + b.check_out + '\n' +
    'Гостей: ' + b.guests + '\n' +
    'ID: ' + b.id + '\n\n' +
    'Если требуется дополнительная информация — ответьте на это письмо.\n\n' +
    'Контакты:\n' +
    '+7 (996) 415-94-05\n' +
    'booking@vazuza-fisherhouse.ru\n\n' +
    'Сайт: ' + fh_cfg_('SITE_URL') + '\n';

  MailApp.sendEmail({ to, subject: subj, body });
}

function fh_emailClientPaid_(b) {
  const to = b.email;
  if (!to) return;

  const subj = 'FisherHouse — оплата отмечена';
  const body =
    'Здравствуйте, ' + b.name + '!\n\n' +
    'Мы отметили оплату по вашей заявке.\n\n' +
    'Даты: ' + b.check_in + ' → ' + b.check_out + '\n' +
    'ID: ' + b.id + '\n\n' +
    'Спасибо! Если есть вопросы — ответьте на это письмо.\n';

  MailApp.sendEmail({ to, subject: subj, body });
}

function fh_emailClientDeclined_(b) {
  const to = b.email;
  if (!to) return;

  const subj = 'FisherHouse — по заявке требуется уточнение';
  const body =
    'Здравствуйте, ' + b.name + '!\n\n' +
    'По вашей заявке мы пока не можем подтвердить бронирование на выбранные даты.\n' +
    'Пожалуйста, ответьте на это письмо или свяжитесь с нами — подберем альтернативные варианты.\n\n' +
    'Контакты:\n' +
    '+7 (996) 415-94-05\n' +
    'booking@vazuza-fisherhouse.ru\n';

  MailApp.sendEmail({ to, subject: subj, body });
}

function fh_emailClientCancelled_(b) {
  const to = b.email;
  if (!to) return;

  const subj = 'FisherHouse — бронирование отменено';
  const body =
    'Здравствуйте, ' + b.name + '!\n\n' +
    'Ваше бронирование отменено.\n\n' +
    'Даты: ' + b.check_in + ' → ' + b.check_out + '\n' +
    'ID: ' + b.id + '\n\n' +
    'Если это произошло по ошибке — ответьте на это письмо.\n';

  MailApp.sendEmail({ to, subject: subj, body });
}

/* =========================
   Helpers
========================= */

function fh_json_(obj) {
  const out = ContentService.createTextOutput(JSON.stringify(obj));
  out.setMimeType(ContentService.MimeType.JSON);
  return out;
}

function fh_jsonArray_(arr) {
  const out = ContentService.createTextOutput(JSON.stringify(arr));
  out.setMimeType(ContentService.MimeType.JSON);
  return out;
}

function fh_now_() {
  return Utilities.formatDate(new Date(), fh_cfg_('TIMEZONE') || FH_CONFIG.TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
}

function fh_shortId_() {
  // Short readable id
  const u = Utilities.getUuid().replace(/-/g, '').slice(0, 10).toUpperCase();
  return 'FH-' + u;
}

function fh_parseDate_(s) {
  // Expect "YYYY-MM-DD"
  const m = String(s || '').trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const d = Number(m[3]);
  const dt = new Date(y, mo, d);
  dt.setHours(0, 0, 0, 0);
  return dt;
}

function fh_dateKey_(d) {
  // Return string safe for JS new Date(...) in local timezone:
  // "YYYY-MM-DDT00:00:00"
  const key = Utilities.formatDate(d, fh_cfg_('TIMEZONE') || FH_CONFIG.TIMEZONE, 'yyyy-MM-dd');
  return key + 'T00:00:00';
}

function fh_dateRangeInclusiveKeys_(d1, d2) {
  const a = [];
  const cur = new Date(d1.getTime());
  cur.setHours(0, 0, 0, 0);
  const end = new Date(d2.getTime());
  end.setHours(0, 0, 0, 0);

  // If reversed, swap
  if (cur.getTime() > end.getTime()) {
    const tmp = cur.getTime();
    cur.setTime(end.getTime());
    end.setTime(tmp);
  }

  while (cur.getTime() <= end.getTime()) {
    a.push(fh_dateKey_(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return a;
}

function fh_diffDays_(d1, d2) {
  // Nights approximation (checkOut - checkIn). If same day => 0.
  const ms = d2.getTime() - d1.getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function fh_idx_(headerRow, name) {
  const n = String(name).trim().toLowerCase();
  for (let i = 0; i < headerRow.length; i++) {
    if (String(headerRow[i] || '').trim().toLowerCase() === n) return i;
  }
  return -1;
}

function fh_colIndex_(headers, name) {
  for (let i = 0; i < headers.length; i++) {
    if (headers[i] === name) return i + 1; // 1-based for Sheets
  }
  throw new Error('Header not found: ' + name);
}

function fh_getRowObject_(sh, row) {
  const header = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  const vals = sh.getRange(row, 1, 1, sh.getLastColumn()).getValues()[0];
  const obj = {};
  for (let i = 0; i < header.length; i++) {
    const key = String(header[i] || '').trim();
    if (!key) continue;
    obj[key] = vals[i];
  }
  return obj;
}
