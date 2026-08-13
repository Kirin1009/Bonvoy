/**
 * Bonvoyラリー — Googleスプレッドシート同期（F-20）
 *
 * 役割: 端末のlocalStorageだけに置いていた宿泊記録を、Shunのワークスペース上の
 *       スプレッドシートへ二重化する。端末を失っても記録が残ることが最優先。
 *
 * 設計:
 *   - クライアントは action:"sync" で自分の全状態を送る。サーバはシートの内容と
 *     マージして、マージ後の全状態を返す。クライアントはそれを自分にマージする。
 *     つまり「どちらか片方にしかない記録は必ず生き残る」。上書き削除はしない。
 *   - 宿泊は hid + チェックイン日 を一意キーにする（同じ日の同じ宿は1件）。
 *   - シートは人間が読める表形式。Shunが直接Sheetsで眺めたり直したりできる。
 *
 * セットアップ手順は docs/シート同期-セットアップ.md を参照。
 */

/* ===== 設定 ===== */
var SHEET_ID = '';          // 同期先スプレッドシートのID（URLの /d/ と /edit の間）
var TOKEN    = '';          // クライアントと共有する合言葉。空のままにしない

/* ===== シート定義 ===== */
var TABS = {
  stays:  ['hid', 'ホテル名', 'チェックイン', '泊数', '価格', 'ポイント利用', 'アップグレード', '獲得ポイント', 'メモ'],
  hotels: ['hid', 'ホテル名', 'ブランド', '国', 'エリア', '立地'],
  scores: ['hid', '立地', '部屋', '食事', '施設', 'サービス', 'メモ'],
  wants:  ['hid', '登録日'],
  meta:   ['キー', '値']
};

function doPost(e) {
  try {
    var req = JSON.parse(e.postData.contents);
    if (!TOKEN || req.token !== TOKEN) return json({ ok: false, error: 'bad token' });

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var lock = LockService.getScriptLock();
    lock.waitLock(20000);                       // 端末2台の同時同期で行が壊れるのを防ぐ
    try {
      var remote = readState(ss);
      var merged = (req.action === 'pull') ? remote : mergeState(remote, req.state || {});
      if (req.action !== 'pull') writeState(ss, merged);
      return json({ ok: true, state: merged, syncedAt: new Date().toISOString() });
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json({ ok: true, service: 'bonvoy-sync', note: 'POSTで同期します' });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ===== 読み書き ===== */

function sheetOf(ss, name) {
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(TABS[name]);
    sh.setFrozenRows(1);
  } else if (sh.getLastRow() === 0) {
    sh.appendRow(TABS[name]);
    sh.setFrozenRows(1);
  }
  return sh;
}

function rowsOf(sh) {
  var last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2, 1, last - 1, sh.getLastColumn()).getValues();
}

/**
 * 日付は何が来ても 'yyyy-MM-dd' に正規化する。
 * Sheetsは '2026-08-11' を書き込むと勝手に日付型のセルにするので、読み戻すとDateで返る。
 * これを素通しすると 'Tue Aug 11 2026 00:00:00 GMT+0700' のような別のキーになり、
 * 同じ宿泊がもう1件として増える（v1.3.1で実際に倍増した）。ここで必ず潰す。
 */
function asDate(v) {
  var tz = Session.getScriptTimeZone() || 'Asia/Tokyo';
  if (v instanceof Date) return Utilities.formatDate(v, tz, 'yyyy-MM-dd');
  var s = String(v == null ? '' : v).trim();
  if (!s) return '';
  var m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return m[1] + '-' + m[2] + '-' + m[3];
  // "Tue Aug 11 2026 00:00:00 GMT+0700" — 時差で1日ずれないよう暦の日付をそのまま拾う
  var MON = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
              Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
  m = s.match(/^[A-Za-z]{3}\s+([A-Za-z]{3})\s+(\d{1,2})\s+(\d{4})/);
  if (m && MON[m[1]]) {
    return m[3] + '-' + ('0' + MON[m[1]]).slice(-2) + '-' + ('0' + m[2]).slice(-2);
  }
  var d = new Date(s);
  return isNaN(d.getTime()) ? '' : Utilities.formatDate(d, tz, 'yyyy-MM-dd');
}

function num(v) { return (v === '' || v === null || v === undefined) ? undefined : Number(v); }
function bool(v) { return v === true || v === 'TRUE' || v === 'true' || v === 1 || v === '1'; }

function readState(ss) {
  var st = { stays: {}, hotels: {}, scores: {}, wants: {}, bonus: {}, radius: 800, car: 'm3' };

  rowsOf(sheetOf(ss, 'stays')).forEach(function (r) {
    var hid = String(r[0] || '').trim(), d = asDate(r[2]);
    if (!hid || !d) return;
    var s = { d: d, n: num(r[3]) || 1 };
    if (num(r[4]) !== undefined) s.price = num(r[4]);
    if (bool(r[5])) s.pts = true;
    if (bool(r[6])) s.upg = true;
    if (num(r[7]) !== undefined) s.earn = num(r[7]);
    if (String(r[8] || '').trim()) s.memo = String(r[8]).trim();
    (st.stays[hid] = st.stays[hid] || []).push(s);
  });

  rowsOf(sheetOf(ss, 'hotels')).forEach(function (r) {
    var hid = String(r[0] || '').trim(); if (!hid) return;
    st.hotels[hid] = {
      name: String(r[1] || ''), brand: String(r[2] || ''),
      country: String(r[3] || ''), city: String(r[4] || ''), loc: String(r[5] || 'city')
    };
  });

  rowsOf(sheetOf(ss, 'scores')).forEach(function (r) {
    var hid = String(r[0] || '').trim(); if (!hid) return;
    var sc = {};
    ['loc', 'room', 'meal', 'fac', 'svc'].forEach(function (k, i) {
      if (num(r[i + 1]) !== undefined) sc[k] = num(r[i + 1]);
    });
    if (String(r[6] || '').trim()) sc.memo = String(r[6]).trim();
    st.scores[hid] = sc;
  });

  rowsOf(sheetOf(ss, 'wants')).forEach(function (r) {
    var hid = String(r[0] || '').trim(); if (!hid) return;
    st.wants[hid] = asDate(r[1]);
  });

  rowsOf(sheetOf(ss, 'meta')).forEach(function (r) {
    var k = String(r[0] || '').trim();
    if (k === 'radius') st.radius = Number(r[1]) || 800;
    if (k === 'car') st.car = String(r[1] || 'm3');
    var mb = k.match(/^ボーナス泊 (\d{4})$/);           // 「ボーナス泊 2026」= 15
    if (mb) st.bonus[mb[1]] = Number(r[1]) || 0;
  });

  return st;
}

/**
 * マージ規則:
 *   stays  — hid + チェックイン日 の和集合。両方にある場合はローカル側を採る
 *            （手元で泊数や価格を直した直後の同期を尊重するため）
 *   hotels / scores / wants — 和集合。両方にある場合はローカル側
 *   radius / car — ローカル側（端末ごとの好み）
 * どの規則でも「片方にしかない記録が消える」ことはない。
 */
function mergeState(remote, local) {
  var out = { stays: {}, hotels: {}, scores: {}, wants: {}, bonus: {},
              radius: local.radius || remote.radius || 800,
              car: local.car || remote.car || 'm3' };
  // ボーナス泊は年ごとの手入力。和集合でローカル優先（端末で直した直後を尊重する）
  Object.keys(remote.bonus || {}).forEach(function (y) { out.bonus[y] = remote.bonus[y]; });
  Object.keys(local.bonus  || {}).forEach(function (y) { out.bonus[y] = local.bonus[y]; });

  var hids = {};
  Object.keys(remote.stays || {}).forEach(function (h) { hids[h] = 1; });
  Object.keys(local.stays  || {}).forEach(function (h) { hids[h] = 1; });

  Object.keys(hids).forEach(function (hid) {
    var byDate = {};
    var put = function (s) {                    // キーは必ず正規化した日付。ここが崩れると重複が生える
      if (!s) return;
      var d = asDate(s.d);
      if (!d) return;
      s.d = d;
      byDate[d] = s;
    };
    (remote.stays[hid] || []).forEach(put);
    (local.stays[hid]  || []).forEach(put);     // 同日はローカルが後勝ち
    var list = Object.keys(byDate).sort().map(function (d) { return byDate[d]; });
    if (list.length) out.stays[hid] = list;
  });

  ['hotels', 'scores', 'wants'].forEach(function (k) {
    var m = {};
    Object.keys(remote[k] || {}).forEach(function (h) { m[h] = remote[k][h]; });
    Object.keys(local[k]  || {}).forEach(function (h) { m[h] = local[k][h]; });
    out[k] = m;
  });

  return out;
}

function writeState(ss, st) {
  var rows;

  rows = [];
  Object.keys(st.stays).sort().forEach(function (hid) {
    st.stays[hid].forEach(function (s) {
      rows.push([hid, (st.hotels[hid] || {}).name || '', asDate(s.d), s.n || 1,
                 s.price === undefined ? '' : s.price, s.pts ? 'TRUE' : '',
                 s.upg ? 'TRUE' : '', s.earn === undefined ? '' : s.earn, s.memo || '']);
    });
  });
  var shStays = sheetOf(ss, 'stays');
  forceText(shStays, 3);
  replaceRows(shStays, rows);

  rows = Object.keys(st.hotels).sort().map(function (hid) {
    var h = st.hotels[hid];
    return [hid, h.name || '', h.brand || '', h.country || '', h.city || '', h.loc || 'city'];
  });
  replaceRows(sheetOf(ss, 'hotels'), rows);

  rows = Object.keys(st.scores).sort().map(function (hid) {
    var s = st.scores[hid] || {};
    return [hid, s.loc || '', s.room || '', s.meal || '', s.fac || '', s.svc || '', s.memo || ''];
  });
  replaceRows(sheetOf(ss, 'scores'), rows);

  rows = Object.keys(st.wants).sort().map(function (hid) { return [hid, asDate(st.wants[hid])]; });
  var shWants = sheetOf(ss, 'wants');
  forceText(shWants, 2);
  replaceRows(shWants, rows);

  var meta = [['radius', st.radius], ['car', st.car]];
  Object.keys(st.bonus || {}).sort().forEach(function (y) {
    meta.push(['ボーナス泊 ' + y, st.bonus[y]]);
  });
  replaceRows(sheetOf(ss, 'meta'), meta.concat([
    ['最終同期', Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd HH:mm:ss')],
    ['宿泊件数', Object.keys(st.stays).reduce(function (a, h) { return a + st.stays[h].length; }, 0)],
    ['通算泊数', Object.keys(st.stays).reduce(function (a, h) {
      return a + st.stays[h].reduce(function (b, s) { return b + (s.n || 1); }, 0); }, 0)]
  ]));
}

function forceText(sh, col) {                   // 日付列を書式「書式なしテキスト」に固定して自動日付化を止める
  sh.getRange(1, col, sh.getMaxRows(), 1).setNumberFormat('@');
}

function replaceRows(sh, rows) {
  var last = sh.getLastRow();
  if (last > 1) sh.getRange(2, 1, last - 1, sh.getLastColumn()).clearContent();
  if (rows.length) {
    sh.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  }
}

/* ===== 動作確認用（エディタから実行する） ===== */
function testReadWrite() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var st = readState(ss);
  Logger.log('宿: %s件 / 宿泊: %s件', Object.keys(st.hotels).length, Object.keys(st.stays).length);
  writeState(ss, st);
  Logger.log('書き戻し完了');
}
