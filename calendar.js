// ==========================================
// 設定項目: 表示したい年月と特別休業日を指定
// ==========================================
const TARGET_YEAR = 2026;
const TARGET_MONTH = 8; // 8月
const CUSTOM_CLOSED_DAYS = [20,29]; // 臨時休業日があれば配列に指定（例: [13, 14, 15]）

function generateCalendar(year, month) {
  const titleElem = document.getElementById('calendar-title');
  const tbody = document.getElementById('calendar-body');

  if (!titleElem || !tbody) return;

  titleElem.textContent = `${year}年 ${month}月 スケジュール`;
  tbody.innerHTML = '';

  // 月の初日と末日の計算
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const prevLastDay = new Date(year, month - 1, 0);

  const startDayOfWeek = firstDay.getDay(); // 0: 日曜, 1: 月曜...
  const totalDays = lastDay.getDate();
  const prevTotalDays = prevLastDay.getDate();

  const today = new Date();
  const isCurrentMonth = (today.getFullYear() === year && today.getMonth() + 1 === month);
  const todayDate = today.getDate();

  let date = 1;
  let nextMonthDate = 1;

  // 6週分（最大42マス）ループ
  for (let week = 0; week < 6; week++) {
    const row = document.createElement('tr');

    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      const cell = document.createElement('td');

      if (week === 0 && dayOfWeek < startDayOfWeek) {
        // 前月の日付
        cell.textContent = prevTotalDays - startDayOfWeek + dayOfWeek + 1;
        cell.className = 'other-month';
      } else if (date > totalDays) {
        // 翌月の日付
        cell.textContent = nextMonthDate++;
        cell.className = 'other-month';
      } else {
        // 当月の日付
        cell.textContent = date;

        // 休業判定（日曜または個別指定日）
        const isSunday = (dayOfWeek === 0);
        const isCustomClosed = CUSTOM_CLOSED_DAYS.includes(date);

        if (isSunday || isCustomClosed) {
          cell.classList.add('closed');
        } else {
          cell.classList.add('open');
        }

        // 本日判定
        if (isCurrentMonth && date === todayDate) {
          cell.classList.add('today');
        }

        date++;
      }
      row.appendChild(cell);
    }

    tbody.appendChild(row);

    // 全ての日付を描画し終えて、行の終わりなら終了
    if (date > totalDays && nextMonthDate > 1 && (week >= 4)) {
      break;
    }
  }
}

// ページの読み込み完了時にカレンダーを生成
document.addEventListener('DOMContentLoaded', () => {
  generateCalendar(TARGET_YEAR, TARGET_MONTH);
});