/*
 * SHIFTIK - offline prototype
 * Všechna data se ukládají pouze do telefonu/prohlížeče přes localStorage.
 * Pro první offline verzi není potřeba žádný server ani internet.
 */
 
const cycle = [
  { type: 'nocni', name: 'NOČNÍ 12h', time: '18:00 – 06:00', hours: 11, nightHours: 8, afternoonHours: 0 },
  { type: 'nocni', name: 'NOČNÍ 12h', time: '18:00 – 06:00', hours: 11, nightHours: 8, afternoonHours: 0 },
  { type: 'nocni', name: 'NOČNÍ 12h', time: '18:00 – 06:00', hours: 11, nightHours: 8, afternoonHours: 0 },
  { type: 'volno', name: 'VOLNO', time: 'Celý den', hours: 0, nightHours: 0, afternoonHours: 0 },
  { type: 'volno', name: 'VOLNO', time: 'Celý den', hours: 0, nightHours: 0, afternoonHours: 0 },
  { type: 'ranni', name: 'RANNÍ 12h', time: '06:00 – 18:00', hours: 11, nightHours: 0, afternoonHours: 0 },
  { type: 'ranni', name: 'RANNÍ 12h', time: '06:00 – 18:00', hours: 11, nightHours: 0, afternoonHours: 0 },
  { type: 'volno', name: 'VOLNO', time: 'Celý den', hours: 0, nightHours: 0, afternoonHours: 0 },
  { type: 'volno', name: 'VOLNO', time: 'Celý den', hours: 0, nightHours: 0, afternoonHours: 0 },
  { type: 'volno', name: 'VOLNO', time: 'Celý den', hours: 0, nightHours: 0, afternoonHours: 0 },
  { type: 'nocni', name: 'NOČNÍ 12h', time: '18:00 – 06:00', hours: 11, nightHours: 8, afternoonHours: 0 },
  { type: 'nocni', name: 'NOČNÍ 12h', time: '18:00 – 06:00', hours: 11, nightHours: 8, afternoonHours: 0 },
  { type: 'volno', name: 'VOLNO', time: 'Celý den', hours: 0, nightHours: 0, afternoonHours: 0 },
  { type: 'volno', name: 'VOLNO', time: 'Celý den', hours: 0, nightHours: 0, afternoonHours: 0 },
  { type: 'ranni', name: 'RANNÍ 12h', time: '06:00 – 18:00', hours: 11, nightHours: 0, afternoonHours: 0 },
  { type: 'ranni', name: 'RANNÍ 12h', time: '06:00 – 18:00', hours: 11, nightHours: 0, afternoonHours: 0 },
  { type: 'ranni', name: 'RANNÍ 12h', time: '06:00 – 18:00', hours: 11, nightHours: 0, afternoonHours: 0 },
  { type: 'volno', name: 'VOLNO', time: 'Celý den', hours: 0, nightHours: 0, afternoonHours: 0 },
  { type: 'volno', name: 'VOLNO', time: 'Celý den', hours: 0, nightHours: 0, afternoonHours: 0 },
  { type: 'nocni', name: 'NOČNÍ 12h', time: '18:00 – 06:00', hours: 11, nightHours: 8, afternoonHours: 0 },
  { type: 'nocni', name: 'NOČNÍ 12h', time: '18:00 – 06:00', hours: 11, nightHours: 8, afternoonHours: 0 },
  { type: 'volno', name: 'VOLNO', time: 'Celý den', hours: 0, nightHours: 0, afternoonHours: 0 },
  { type: 'volno', name: 'VOLNO', time: 'Celý den', hours: 0, nightHours: 0, afternoonHours: 0 },
  { type: 'volno', name: 'VOLNO', time: 'Celý den', hours: 0, nightHours: 0, afternoonHours: 0 },
  { type: 'ranni', name: 'RANNÍ 12h', time: '06:00 – 18:00', hours: 11, nightHours: 0, afternoonHours: 0 },
  { type: 'ranni', name: 'RANNÍ 12h', time: '06:00 – 18:00', hours: 11, nightHours: 0, afternoonHours: 0 },
  { type: 'volno', name: 'VOLNO', time: 'Celý den', hours: 0, nightHours: 0, afternoonHours: 0 },
  { type: 'volno', name: 'VOLNO', time: 'Celý den', hours: 0, nightHours: 0, afternoonHours: 0 }
];
 
const DEFAULT_SETTINGS = {
  hourlyRate: 205,
  nightBonus: 30,
  morningBonus: 0,
  afternoonBonus: 0,
  weekendBonus: 0,
  vacationRate: 307
};
 
const STORAGE_KEYS = {
  overrides: 'shiftik_overrides_v1',
  notes: 'shiftik_notes_v1',
  settings: 'shiftik_settings_v1'
};
 
const anchorDate = new Date(2026, 9, 2);
const todayDate = new Date();
let currentViewYear = todayDate.getFullYear();
let currentViewMonth = todayDate.getMonth();
let selectedDateKey = null;
 
let overrides = loadObject(STORAGE_KEYS.overrides, {});
let notes = loadObject(STORAGE_KEYS.notes, {});
let settings = loadObject(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
settings = { ...DEFAULT_SETTINGS, ...settings };
 
const monthNames = [
  'Leden/January', 'Únor/February', 'Březen/March', 'Duben/April', 'Květen/May', 'Červen/June',
  'Červenec/July', 'Srpen/August', 'Září/September', 'Říjen/October', 'Listopad/November', 'Prosinec/December'
];
 
function loadObject(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch (error) {
    console.warn('Shiftik: nepodařilo se načíst data', key, error);
    return fallback;
  }
}
 
function saveObject(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Shiftik: nepodařilo se uložit data', key, error);
  }
}
 
function saveAllData() {
  saveObject(STORAGE_KEYS.overrides, overrides);
  saveObject(STORAGE_KEYS.notes, notes);
  saveObject(STORAGE_KEYS.settings, settings);
}
 
function dateKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}
 
function getDateFromKey(key) {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month, day);
}
 
function formatMoney(value) {
  return `${Math.round(value).toLocaleString('cs-CZ')} Kč`;
}
 
function easterSunday(year) {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}
 
function isCzechHoliday(year, month, day) {
  const fixed = ['0-1', '4-1', '4-8', '6-5', '6-6', '8-28', '9-28', '10-17', '11-24', '11-25', '11-26'];
  const easter = easterSunday(year);
  const friday = new Date(year, easter.getMonth(), easter.getDate() - 2);
  const monday = new Date(year, easter.getMonth(), easter.getDate() + 1);
  const key = `${month}-${day}`;
  return fixed.includes(key)
    || key === `${friday.getMonth()}-${friday.getDate()}`
    || key === `${monday.getMonth()}-${monday.getDate()}`;
}
 
function getBaseShift(targetDate) {
  const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  const anchor = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), anchorDate.getDate());
  const diffDays = Math.round((target - anchor) / 86400000);
  const cycleIndex = ((diffDays % cycle.length) + cycle.length) % cycle.length;
  return cycle[cycleIndex];
}
 
function getShiftForDate(targetDate) {
  const key = dateKey(targetDate);
  if (Object.prototype.hasOwnProperty.call(overrides, key)) return overrides[key];
  return getBaseShift(targetDate);
}
 
function getShiftCode(shift) {
  const codes = {
    ranni: 'R',
    nocni: 'N',
    dovolenka: 'D',
    prescas: 'P',
    nemoc: 'S',
    volno: 'V'
  };
  return codes[shift.type] || 'V';
}
 
window.switchTab = function(tabName, btnElement) {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
 
  const targetPage = document.getElementById(`page-${tabName}`);
  if (targetPage) targetPage.classList.add('active');
  if (btnElement) btnElement.classList.add('active');
 
  if (tabName === 'calendar') {
    // při otevření kalendáře se vždy vrátí na aktuální měsíc
    const now = new Date();
    currentViewYear = now.getFullYear();
    currentViewMonth = now.getMonth();
    renderCalendar(currentViewYear, currentViewMonth);
  }
  if (tabName === 'salary') renderSalaryPage();
  if (tabName === 'more') renderSettings();
};
 
function renderCalendar(year, month) {
  const grid = document.getElementById('calendar-grid');
  const title = document.getElementById('calendar-month-title');
  const monthStats = document.getElementById('calendar-month-stats');
  if (!grid || !title) return;
 
  title.innerText = `${monthNames[month]} ${year}`;
 
  const stats = calculateMonthSalary(year, month);
  if (monthStats) monthStats.innerText = `${stats.hours} h (${stats.shifts} směn)`;
 
  grid.innerHTML = '';
 
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const realToday = new Date();
 
  for (let i = 0; i < startOffset; i++) {
    grid.insertAdjacentHTML('beforeend', '<div class="cal-day empty"></div>');
  }
 
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const shift = getShiftForDate(date);
    const holiday = isCzechHoliday(year, month, day);
    const key = dateKey(date);
    const isToday = date.toDateString() === realToday.toDateString();
    const todayClass = isToday ? 'is-today-cal' : '';
    const holidayClass = holiday ? 'is-holiday' : '';
    const noteBadge = notes[key] ? '<span class="note-dot">📝</span>' : '';
    const holidayBadge = `<small class="shift-code">${getShiftCode(shift)}${holiday ? ' 🇨🇿' : ''}</small>`;
 
    grid.insertAdjacentHTML('beforeend', `
      <div class="cal-day ${shift.type} ${holidayClass} ${todayClass}" onclick="openDayModal('${key}')" title="${escapeHtml(shift.name)}">
        ${noteBadge}<span class="day-num">${day}</span>${holidayBadge}
      </div>
    `);
  }
}
 
function renderWeeklyOverview() {
  const grid = document.getElementById('weekly-overview-grid');
  if (!grid) return;
 
  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset);
  const dayNames = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];
 
  grid.innerHTML = '';
 
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    const shift = getShiftForDate(d);
    const key = dateKey(d);
    const todayClass = d.toDateString() === now.toDateString() ? 'is-today' : '';
    const noteDot = notes[key] ? '<span class="weekly-note-dot">📝</span>' : '';
 
    grid.insertAdjacentHTML('beforeend', `
      <div class="weekly-day-box ${todayClass}" onclick="openDayModal('${key}')">
        ${noteDot}
        <span class="weekly-day-name">${dayNames[i]}</span>
        <span class="weekly-day-num">${d.getDate()}</span>
        <span class="weekly-shift-badge ${shift.type}">${getShiftCode(shift)}</span>
      </div>
    `);
  }
}
 
function isWeekend(date) {
  const dow = date.getDay();
  return dow === 0 || dow === 6;
}
 
function calculateMonthSalary(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const rate = key => Number(settings[key] || 0);
  const r = { shifts: 0, hours: 0, baseSalary: 0, morningBonuses: 0, nightBonuses: 0,
              afternoonBonuses: 0, weekendBonuses: 0, vacationPay: 0 };
 
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const shift = getShiftForDate(date);
 
    if (['ranni', 'nocni', 'prescas'].includes(shift.type)) {
      const hours = Number(shift.hours) || 0;
      r.shifts++;
      r.hours += hours;
      r.baseSalary += hours * rate('hourlyRate');
      if (shift.type === 'ranni') r.morningBonuses += hours * rate('morningBonus');
      r.nightBonuses += (Number(shift.nightHours) || 0) * rate('nightBonus');
      r.afternoonBonuses += (Number(shift.afternoonHours) || 0) * rate('afternoonBonus');
 
      // Víkend: noční směna se dělí půl na půl mezi den začátku a následující den
      let weekendHours = 0;
      if (shift.type === 'nocni') {
        const next = new Date(year, month, day + 1);
        weekendHours = (isWeekend(date) ? hours / 2 : 0) + (isWeekend(next) ? hours / 2 : 0);
      } else if (isWeekend(date)) {
        weekendHours = hours;
      }
      r.weekendBonuses += weekendHours * rate('weekendBonus');
    } else if (shift.type === 'dovolenka') {
      // dovolená se platí jen za den, kdy by podle cyklu byla směna
      r.vacationPay += (Number(getBaseShift(date).hours) || 0) * rate('vacationRate');
    }
  }
 
  r.grandTotal = r.baseSalary + r.morningBonuses + r.nightBonuses + r.afternoonBonuses
               + r.weekendBonuses + r.vacationPay;
  return r;
}

// Vrátí objekt s českým i slovenským svátkem pro daný den
function getBothNamedays(month, day) {
  const key = `${month}-${day}`;
  return {
    cz: czNamedays[key] || "Žádný svátek",
    sk: skNamedays[key] || "Žádný svátek"
  };
}

window.openDayModal = function(key) {
  selectedDateKey = key;
  const date = getDateFromKey(key);
  const modal = document.getElementById('modal-overlay');
  const title = document.getElementById('modal-date-title');
  const noteInput = document.getElementById('modal-note-input');
  const currentShift = document.getElementById('modal-current-shift');
  
  if (title) title.innerText = `${date.getDate()}. ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  if (noteInput) noteInput.value = notes[key] || '';
  if (currentShift) {
    const shift = getShiftForDate(date);
    
    // Zjištění obou svátků pro kliknutý den
    const namedays = getBothNamedays(date.getMonth() + 1, date.getDate());
    
    // Výpis do modálního okna
    currentShift.innerText = `${shift.name} • ${shift.time}\n🇨🇿 CZ: ${namedays.cz} | 🇸🇰 SK: ${namedays.sk}`;
  }
  if (modal) modal.classList.add('active');
};
 
window.closeModal = function() {
  const modal = document.getElementById('modal-overlay');
  if (modal) modal.classList.remove('active');
  selectedDateKey = null;
};
 
window.saveNoteOnly = function() {
  if (!selectedDateKey) return;
  const val = document.getElementById('modal-note-input').value.trim();
  if (val) notes[selectedDateKey] = val;
  else delete notes[selectedDateKey];
 
  saveObject(STORAGE_KEYS.notes, notes);
  closeModal();
  refreshAll();
};
 
window.setDayOverride = function(type) {
  if (!selectedDateKey) return;
 
  const val = document.getElementById('modal-note-input').value.trim();
  if (val) notes[selectedDateKey] = val;
  else delete notes[selectedDateKey];
 
  if (type === 'reset') {
    delete overrides[selectedDateKey];
  } else if (type === 'dovolenka') {
    overrides[selectedDateKey] = { type: 'dovolenka', name: 'DOVOLENÁ', time: 'Celý den', hours: 0, nightHours: 0, afternoonHours: 0 };
  } else if (type === 'prescas') {
    overrides[selectedDateKey] = { type: 'prescas', name: 'PŘESČAS 12h', time: 'Extra směna', hours: 11, nightHours: 0, afternoonHours: 0 };
  } else if (type === 'nemoc') {
    overrides[selectedDateKey] = { type: 'nemoc', name: 'NEMOC / LÉKAŘ', time: 'Celý den', hours: 0, nightHours: 0, afternoonHours: 0 };
  }
 
  saveAllData();
  closeModal();
  refreshAll();
};
 
function updateHomeData() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
 
  const todayKey = dateKey(today);
  const tomorrowKey = dateKey(tomorrow);
  const todayShift = getShiftForDate(today);
  const tomorrowShift = getShiftForDate(tomorrow);
 
  const todayDateEl = document.getElementById('today-date');
  if (todayDateEl) todayDateEl.innerText = today.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
 
  const badge = document.getElementById('today-badge');
  if (badge) badge.className = `shift-badge ${todayShift.type}`;
 
  const todayShiftName = document.getElementById('today-shift-name');
  if (todayShiftName) todayShiftName.innerText = todayShift.name;
 
  const todayShiftTime = document.getElementById('today-shift-time');
  if (todayShiftTime) todayShiftTime.innerText = todayShift.time;
 
  const tomorrowShiftEl = document.getElementById('tomorrow-shift');
  if (tomorrowShiftEl) tomorrowShiftEl.innerText = `${tomorrowShift.name} (${tomorrowShift.time})`;
 
  renderWeeklyOverview();
 
  const todayNoteCard = document.getElementById('today-note-card');
  const todayNoteText = document.getElementById('today-note-text');
  if (notes[todayKey]) {
    if (todayNoteText) todayNoteText.innerText = notes[todayKey];
    if (todayNoteCard) todayNoteCard.style.display = 'block';
  } else if (todayNoteCard) todayNoteCard.style.display = 'none';
 
  const tomorrowNoteCard = document.getElementById('tomorrow-note-card');
  const tomorrowNoteText = document.getElementById('tomorrow-note-text');
  if (notes[tomorrowKey]) {
    if (tomorrowNoteText) tomorrowNoteText.innerText = notes[tomorrowKey];
    if (tomorrowNoteCard) tomorrowNoteCard.style.display = 'block';
  } else if (tomorrowNoteCard) tomorrowNoteCard.style.display = 'none';
 
  renderMonthNotes();
 
  const stats = calculateMonthSalary(today.getFullYear(), today.getMonth());
  setText('stats-shifts', `${stats.shifts} směn`);
  setText('stats-hours', `${stats.hours} h`);

  // Zde se automaticky doplní dnešní CZ a SK svátky
  const todayNamedays = getBothNamedays(today.getMonth() + 1, today.getDate());
  const czEl = document.getElementById('nameday-cz');
  if (czEl) czEl.innerText = todayNamedays.cz;

  const skEl = document.getElementById('nameday-sk');
  if (skEl) skEl.innerText = todayNamedays.sk;
}

function renderMonthNotes() {
  const card = document.getElementById('month-notes-card');
  const list = document.getElementById('month-notes-list');
  if (!card || !list) return;
 
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const found = [];
 
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${now.getFullYear()}-${now.getMonth()}-${d}`;
    if (notes[key]) {
      found.push(`<div class="month-note-item"><strong>${d}. ${monthNames[now.getMonth()]}</strong>: ${escapeHtml(notes[key])}</div>`);
    }
  }
 
  list.innerHTML = found.join('');
  card.style.display = found.length ? 'block' : 'none';
}
 
function renderSalaryPage() {
  const stats = calculateMonthSalary(currentViewYear, currentViewMonth);
 
  setText('salary-page-total', formatMoney(stats.grandTotal));
  setText('salary-page-month', `${monthNames[currentViewMonth]} ${currentViewYear}`);
  setText('salary-detail-hours', `${stats.hours} h`);
  setText('salary-detail-shifts', `${stats.shifts} směn`);
  setText('salary-detail-base', formatMoney(stats.baseSalary));
  setText('salary-detail-morning', `+${formatMoney(stats.morningBonuses)}`);
  setText('salary-detail-afternoon', `+${formatMoney(stats.afternoonBonuses)}`);
  setText('salary-detail-night', `+${formatMoney(stats.nightBonuses)}`);
  setText('salary-detail-weekend', `+${formatMoney(stats.weekendBonuses)}`);
  setText('salary-detail-vacation', `+${formatMoney(stats.vacationPay)}`);
 
  setText('salary-hourly-label', `Základní mzda (${settings.hourlyRate} Kč/h):`);
  setText('salary-morning-label', `Příplatek za ranní (+${settings.morningBonus} Kč/h):`);
  setText('salary-afternoon-label', `Příplatek za odpolední (+${settings.afternoonBonus} Kč/h):`);
  setText('salary-night-label', `Příplatek za noční (+${settings.nightBonus} Kč/h):`);
  setText('salary-weekend-label', `Příplatek za víkend (+${settings.weekendBonus} Kč/h):`);
}
 
function renderSettings() {
  setInputValue('setting-hourly-rate', settings.hourlyRate);
  setInputValue('setting-morning-bonus', settings.morningBonus);
  setInputValue('setting-night-bonus', settings.nightBonus);
  setInputValue('setting-weekend-bonus', settings.weekendBonus);
  setInputValue('setting-afternoon-bonus', settings.afternoonBonus);
  setInputValue('setting-vacation-rate', settings.vacationRate);
}
 
window.saveSettings = function() {
  settings.hourlyRate = positiveNumber('setting-hourly-rate', settings.hourlyRate);
  settings.morningBonus = positiveNumber('setting-morning-bonus', settings.morningBonus);
  settings.nightBonus = positiveNumber('setting-night-bonus', settings.nightBonus);
  settings.weekendBonus = positiveNumber('setting-weekend-bonus', settings.weekendBonus);
  settings.afternoonBonus = positiveNumber('setting-afternoon-bonus', settings.afternoonBonus);
  settings.vacationRate = positiveNumber('setting-vacation-rate', settings.vacationRate);
  saveObject(STORAGE_KEYS.settings, settings);
  refreshAll();
  showToast('Nastavení uloženo');
};
 
window.resetAllData = function() {
  const confirmed = window.confirm('Opravdu chceš smazat všechny vlastní změny, poznámky a nastavení?');
  if (!confirmed) return;
 
  overrides = {};
  notes = {};
  settings = { ...DEFAULT_SETTINGS };
  saveAllData();
  refreshAll();
  renderSettings();
  showToast('Data byla obnovena');
};
 
function positiveNumber(id, fallback) {
  const value = Number(document.getElementById(id)?.value);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}
 
function setInputValue(id, value) {
  const input = document.getElementById(id);
  if (input) input.value = value;
}
 
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value;
}
 
function refreshAll() {
  updateHomeData();
  renderCalendar(currentViewYear, currentViewMonth);
  renderSalaryPage();
  renderSettings();
}
 
function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
 
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerText = message;
  toast.classList.add('show');
  clearTimeout(window.shiftikToastTimer);
  window.shiftikToastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}
 
window.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeModal();
});
 
window.addEventListener('click', event => {
  const modal = document.getElementById('modal-overlay');
  if (event.target === modal) closeModal();
});
 
window.addEventListener('load', () => {
  refreshAll();
 
  const prevBtn = document.getElementById('prev-month');
  const nextBtn = document.getElementById('next-month');
 
  if (prevBtn) {
    prevBtn.onclick = () => {
      currentViewMonth--;
      if (currentViewMonth < 0) {
        currentViewMonth = 11;
        currentViewYear--;
      }
      refreshAll();
    };
  }
 
  if (nextBtn) {
    nextBtn.onclick = () => {
      currentViewMonth++;
      if (currentViewMonth > 11) {
        currentViewMonth = 0;
        currentViewYear++;
      }
      refreshAll();
    };
  }
});

// ==========================================
// 1. ČESKÝ KALENDÁŘ SVÁTKŮ
// ==========================================
const czNamedays = {
  // LEDEN
  "1-1": "Nový rok / Aarona", "1-2": "Karina", "1-3": "Radmila", "1-4": "Diana", "1-5": "Dalimil",
  "1-6": "Tři Králové", "1-7": "Vilma", "1-8": "Čestmír", "1-9": "Vladan", "1-10": "Břetislav",
  "1-11": "Bohdana", "1-12": "Pravoslav", "1-13": "Edita", "1-14": "Radovan", "1-15": "Alice",
  "1-16": "Ctirad", "1-17": "Drahoslav", "1-18": "Vladislav", "1-19": "Doubravka", "1-20": "Ilona",
  "1-21": "Běla", "1-22": "Slavomír", "1-23": "Zdeněk", "1-24": "Milena", "1-25": "Miloš",
  "1-26": "Zora", "1-27": "Ingrid", "1-28": "Otýlie", "1-29": "Zdislava", "1-30": "Robin", "1-31": "Marika",

  // ÚNOR
  "2-1": "Hynek", "2-2": "Nela", "2-3": "Blažej", "2-4": "Jarmila", "2-5": "Dobromila",
  "2-6": "Vanda", "2-7": "Veronika", "2-8": "Milada", "2-9": "Apolena", "2-10": "Mojmír",
  "2-11": "Božena", "2-12": "Slavěna", "2-13": "Věnceslav", "2-14": "Valentýn", "2-15": "Jiřina",
  "2-16": "Ljuba", "2-17": "Miloslava", "2-18": "Gizela", "2-19": "Patrik", "2-20": "Oldřich",
  "2-21": "Lenka", "2-22": "Petr", "2-23": "Svatopluk", "2-24": "Matěj", "2-25": "Liliana",
  "2-26": "Dorota", "2-27": "Alexandr", "2-28": "Lumír", "2-29": "Horymír",

  // BŘEZEN
  "3-1": "Bedřich", "3-2": "Anežka", "3-3": "Kamil", "3-4": "Stela", "3-5": "Kazimír",
  "3-6": "Miroslav", "3-7": "Tomáš", "3-8": "Gabriela", "3-9": "Františka", "3-10": "Viktorie",
  "3-11": "Anděla", "3-12": "Řehoř", "3-13": "Růžena", "3-14": "Rút / Ida", "3-15": "Elena / Herbert",
  "3-16": "Vlastimil", "3-17": "Eduard", "3-18": "Josefína", "3-19": "Josef", "3-20": "Světlana",
  "3-21": "Radek", "3-22": "Leona", "3-23": "Ivona", "3-24": "Gabriel", "3-25": "Marián",
  "3-26": "Emanuel", "3-27": "Dita", "3-28": "Soňa", "3-29": "Taťána", "3-30": "Arnošt", "3-31": "Kvido",

  // DUBEN
  "4-1": "Hugo", "4-2": "Erika", "4-3": "Richard", "4-4": "Ivana", "4-5": "Miroslava",
  "4-6": "Vendula", "4-7": "Heřman / Hermína", "4-8": "Ema", "4-9": "Dušan", "4-10": "Darja",
  "4-11": "Izabela", "4-12": "Julius", "4-13": "Aleš", "4-14": "Vincenc", "4-15": "Anastázie",
  "4-16": "Irena", "4-17": "Rudolf", "4-18": "Valérie", "4-19": "Rostislav", "4-20": "Marcela",
  "4-21": "Alexandra", "4-22": "Evžen", "4-23": "Vojtěch", "4-24": "Jiří", "4-25": "Marek",
  "4-26": "Ota", "4-27": "Jaroslav", "4-28": "Vlastislav", "4-29": "Robert", "4-30": "Blahoslav",

  // KVĚTEN
  "5-1": "Svátek práce", "5-2": "Zikmund", "5-3": "Alexej", "5-4": "Květoslav", "5-5": "Klaudie",
  "5-6": "Radoslav", "5-7": "Stanislav", "5-8": "Den osvobození", "5-9": "Ctibor", "5-10": "Blažena",
  "5-11": "Svatava", "5-12": "Pankrác", "5-13": "Servác", "5-14": "Bonifác", "5-15": "Žofie",
  "5-16": "Přemysl", "5-17": "Aneta", "5-18": "Nataša", "5-19": "Ivo", "5-20": "Zbyšek",
  "5-21": "Monika", "5-22": "Emil", "5-23": "Vladimír", "5-24": "Jana", "5-25": "Viola",
  "5-26": "Filip", "5-27": "Valdemar", "5-28": "Vilém", "5-29": "Maxim", "5-30": "Ferdinand", "5-31": "Kamila",

  // ČERVEN
  "6-1": "Laura", "6-2": "Jarmil", "6-3": "Tamara", "6-4": "Dalibor", "6-5": "Dobroslav",
  "6-6": "Norbert", "6-7": "Iveta / Slavoj", "6-8": "Medard", "6-9": "Viktor", "6-10": "Otta",
  "6-11": "Bruno", "6-12": "Antonie", "6-13": "Antonín", "6-14": "Roland", "6-15": "Vít",
  "6-16": "Zbyněk", "6-17": "Adolf", "6-18": "Milan", "6-19": "Leoše", "6-20": "Květa",
  "6-21": "Alois", "6-22": "Pavla", "6-23": "Zdeňka", "6-24": "Jan", "6-25": "Ivan",
  "6-26": "Adriana", "6-27": "Ladislav", "6-28": "Lubomír", "6-29": "Petr a Pavel", "6-30": "Šárka",

  // ČERVENEC
  "7-1": "Jaroslava", "7-2": "Patricie", "7-3": "Radomír", "7-4": "Prokop", "7-5": "Cyril a Metoděj",
  "7-6": "Jan Hus", "7-7": "Bohuslav", "7-8": "Nora", "7-9": "Drahoslava", "7-10": "Libuše / Amálie",
  "7-11": "Olga", "7-12": "Bořek", "7-13": "Markéta", "7-14": "Karolína", "7-15": "Jindřich",
  "7-16": "Luboš", "7-17": "Martina", "7-18": "Drahomíra", "7-19": "Čeněk", "7-20": "Ilja",
  "7-21": "Vítězslav", "7-22": "Magdaléna", "7-23": "Libor", "7-24": "Kristýna", "7-25": "Jakub",
  "7-26": "Anna", "7-27": "Věroslav", "7-28": "Viktorie", "7-29": "Marta", "7-30": "Bořivoj", "7-31": "Ignác",

  // SRPEN
  "8-1": "Oskar", "8-2": "Gustav", "8-3": "Miluše", "8-4": "Dominik", "8-5": "Kristián",
  "8-6": "Oldřiška", "8-7": "Lada", "8-8": "Soběslav", "8-9": "Roman", "8-10": "Vavřinec",
  "8-11": "Zuzana", "8-12": "Klára", "8-13": "Alena", "8-14": "Alan", "8-15": "Hana",
  "8-16": "Jáchym", "8-17": "Petra", "8-18": "Helena", "8-19": "Ludvík", "8-20": "Bernard",
  "8-21": "Johana", "8-22": "Bohuslava", "8-23": "Sandra", "8-24": "Bartoloměj", "8-25": "Radim",
  "8-26": "Luděk", "8-27": "Otakar", "8-28": "Augustýn", "8-29": "Evelína", "8-30": "Vladěna", "8-31": "Pavlína",

  // ZÁŘÍ
  "9-1": "Linda / Samuel", "9-2": "Adéla", "9-3": "Bronislav", "9-4": "Jindřiška", "9-5": "Boris",
  "9-6": "Boleslav", "9-7": "Regína", "9-8": "Mariana", "9-9": "Daniela", "9-10": "Irma",
  "9-11": "Denisa", "9-12": "Marie", "9-13": "Lubor", "9-14": "Radka", "9-15": "Jolana",
  "9-16": "Ludmila", "9-17": "Nadežda", "9-18": "Kryštof", "9-19": "Zita", "9-20": "Oleg",
  "9-21": "Matouš", "9-22": "Darina", "9-23": "Berta", "9-24": "Jaromír", "9-25": "Zlata",
  "9-26": "Andrea", "9-27": "Jonáš", "9-28": "Václav", "9-29": "Michal", "9-30": "Jeroným",

  // ŘÍJEN
  "10-1": "Igor", "10-2": "Olivie / Oliver", "10-3": "Bohumil", "10-4": "František", "10-5": "Eliška",
  "10-6": "Hanuš", "10-7": "Justýna", "10-8": "Věra", "10-9": "Štefan / Sára", "10-10": "Marina",
  "10-11": "Andrej", "10-12": "Marcel", "10-13": "Renáta", "10-14": "Agáta", "10-15": "Tereza",
  "10-16": "Havel", "10-17": "Hedvika", "10-18": "Lukáš", "10-19": "Michaela", "10-20": "Vendelín",
  "10-21": "Brigita", "10-22": "Sabina", "10-23": "Teodor", "10-24": "Nina", "10-25": "Beáta",
  "10-26": "Erik", "10-27": "Šarlota / Zoe", "10-28": "Státní svátek", "10-29": "Silvie", "10-30": "Tadeáš", "10-31": "Štěpánka",

  // LISTOPAD
  "11-1": "Felix", "11-2": "Památka zesnulých", "11-3": "Hubert", "11-4": "Karel", "11-5": "Miriam",
  "11-6": "Liběna", "11-7": "Saskie", "11-8": "Bohumír", "11-9": "Bohdan", "11-10": "Evžen",
  "11-11": "Martin", "11-12": "Benedikt", "11-13": "Tibor", "11-14": "Sáva", "11-15": "Leopold",
  "11-16": "Otmar", "11-17": "Mahulena", "11-18": "Romana", "11-19": "Alžběta", "11-20": "Nikola",
  "11-21": "Albert", "11-22": "Cecílie", "11-23": "Klement", "11-24": "Zina", "11-25": "Kateřina",
  "11-26": "Artur", "11-27": "Xenie", "11-28": "René", "11-29": "Zinaida", "11-30": "Ondřej",

  // PROSINEC
  "12-1": "Iva", "12-2": "Blanka", "12-3": "Svatoslav", "12-4": "Barbora", "12-5": "Jitka",
  "12-6": "Mikuláš", "12-7": "Ambrož", "12-8": "Květoslava", "12-9": "Vratislav", "12-10": "Julie",
  "12-11": "Dana", "12-12": "Simona", "12-13": "Lucie", "12-14": "Lýdie", "12-15": "Radana",
  "12-16": "Albína", "12-17": "Daniel", "12-18": "Miloslav", "12-19": "Ester", "12-20": "Dagmar",
  "12-21": "Natálie", "12-22": "Šimon", "12-23": "Vlasta", "12-24": "Adam a Eva", "12-25": "1. svátek vánoční",
  "12-26": "Štěpán", "12-27": "Žaneta", "12-28": "Bohumila", "12-29": "Judita", "12-30": "David", "12-31": "Silvestr"
};


// ==========================================
// 2. SLOVENSKÝ KALENDÁŘ SVÁTKŮ
// ==========================================
const skNamedays = {
  // JANUÁR
  "1-1": "Nový rok", "1-2": "Alexandra / Karina", "1-3": "Daniela", "1-4": "Drahoslav", "1-5": "Andrea",
  "1-6": "Antónia", "1-7": "Bohuslava", "1-8": "Severín", "1-9": "Alexej", "1-10": "Dáša",
  "1-11": "Malvína", "1-12": "Ernest", "1-13": "Rastislav", "1-14": "Radovan", "1-15": "Dobroslav",
  "1-16": "Kristína", "1-17": "Nataša", "1-18": "Bohdana", "1-19": "Drahomíra", "1-20": "Dalibor",
  "1-21": "Vincent", "1-22": "Zora", "1-23": "Miloš", "1-24": "Timotej", "1-25": "Gejza",
  "1-26": "Tamara", "1-27": "Bohuš", "1-28": "Alfonz", "1-29": "Gašpar", "1-30": "Ema", "1-31": "Emil",

  // FEBRUÁR
  "2-1": "Tatiana", "2-2": "Erika / Erik", "2-3": "Blažej", "2-4": "Veronika", "2-5": "Agáta",
  "2-6": "Dorota", "2-7": "Vanda", "2-8": "Zoja", "2-9": "Zdenko", "2-10": "Gabriela",
  "2-11": "Dezider", "2-12": "Perla", "2-13": "Arpád", "2-14": "Valentín", "2-15": "Pravoslav",
  "2-16": "Ida / Liana", "2-17": "Miloslava", "2-18": "Jaromír", "2-19": "Vlasta", "2-20": "Lívia",
  "2-21": "Eleonóra", "2-22": "Etela", "2-23": "Viktor", "2-24": "Matej", "2-25": "Frederik / Frederika",
  "2-26": "Viktor Tichomír", "2-27": "Alojz", "2-28": "Kvetoslava", "2-29": "Radomír",

  // MAREC
  "3-1": "Albín", "3-2": "Anetta", "3-3": "Bohumil", "3-4": "Kazimír", "3-5": "Fridrich",
  "3-6": "Radoslav", "3-7": "Tomáš", "3-8": "Alan / Alana", "3-9": "Františka", "3-10": "Branislav / Bruno",
  "3-11": "Angela / Angelika", "3-12": "Gregor", "3-13": "Vlastimil", "3-14": "Matilda", "3-15": "Svetlana",
  "3-16": "Boleslav", "3-17": "Ľubica", "3-18": "Eduard", "3-19": "Jozef", "3-20": "Víťazoslav",
  "3-21": "Blahoslav", "3-22": "Beňadik", "3-23": "Adrián", "3-24": "Gabriel", "3-25": "Marián",
  "3-26": "Eman / Emanuel", "3-27": "Alena", "3-28": "Soňa", "3-29": "Miroslav", "3-30": "Vieroslava", "3-31": "Benjamín",

  // APRÍL
  "4-1": "Hugo", "4-2": "Zita", "4-3": "Richard", "4-4": "Izidor", "4-5": "Miroslava",
  "4-6": "Irena", "4-7": "Zoltán", "4-8": "Albert", "4-9": "Milena", "4-10": "Igor",
  "4-11": "Július", "4-12": "Estera", "4-13": "Aleš", "4-14": "Justína", "4-15": "Fedor",
  "4-16": "Dana / Danica", "4-17": "Rudolf", "4-18": "Valér", "4-19": "Jela", "4-20": "Marcel",
  "4-21": "Ervín", "4-22": "Slavomír", "4-23": "Vojtech", "4-24": "Juraj", "4-25": "Marek",
  "4-26": "Jaroslava", "4-27": "Jaroslav", "4-28": "Jarmila", "4-29": "Lea", "4-30": "Anastázia",

  // MÁJ
  "5-1": "Svátek práce", "5-2": "Žigmund", "5-3": "Galina", "5-4": "Florián", "5-5": "Lesana / Lesia",
  "5-6": "Hermína", "5-7": "Monika", "5-8": "Ingrida", "5-9": "Roland", "5-10": "Viktória",
  "5-11": "Blažena", "5-12": "Pankrác", "5-13": "Servác", "5-14": "Bonifác", "5-15": "Žofia / Sofia",
  "5-16": "Svetozár", "5-17": "Gizela", "5-18": "Viola", "5-19": "Gertrúda", "5-20": "Bernard",
  "5-21": "Zina", "5-22": "Júlia / Juliána", "5-23": "Želmíra", "5-24": "Ela", "5-25": "Urban",
  "5-26": "Dušan", "5-27": "Iveta", "5-28": "Viliam", "5-29": "Vilma", "5-30": "Ferdinand", "5-31": "Petronela",

  // JÚN
  "6-1": "Žaneta", "6-2": "Xénia", "6-3": "Karolína", "6-4": "Lenka", "6-5": "Laura",
  "6-6": "Norbert", "6-7": "Róbert", "6-8": "Medard", "6-9": "Stanislava", "6-10": "Margaréta",
  "6-11": "Dobroslava", "6-12": "Zlatko", "6-13": "Anton", "6-14": "Vasil", "6-15": "Vít",
  "6-16": "Blanka", "6-17": "Adolf", "6-18": "Vratislav", "6-19": "Alfréd", "6-20": "Valéria",
  "6-21": "Alojz", "6-22": "Paulína", "6-23": "Sidónia", "6-24": "Ján", "6-25": "Tadeáš",
  "6-26": "Adriána", "6-27": "Ladislav / Ladislava", "6-28": "Beáta", "6-29": "Peter a Pavol", "6-30": "Melánia",

  // JÚL
  "7-1": "Diana", "7-2": "Berta", "7-3": "Miloslav", "7-4": "Prokop", "7-5": "Cyril a Metod",
  "7-6": "Patrik / Patrícia", "7-7": "Oliver", "7-8": "Ivan", "7-9": "Lujza", "7-10": "Amália",
  "7-11": "Milota", "7-12": "Nina", "7-13": "Margita", "7-14": "Kamil", "7-15": "Henrich",
  "7-16": "Drahomír", "7-17": "Bohuslav", "7-18": "Kamila", "7-19": "Dušana", "7-20": "Iľa / Eliáš",
  "7-21": "Daniel", "7-22": "Magdaléna", "7-23": "Oľga", "7-24": "Vladimír", "7-25": "Jakub",
  "7-26": "Anna / Hana", "7-27": "Božena", "7-28": "Krištof", "7-29": "Marta", "7-30": "Libuša", "7-31": "Ignác",

  // AUGUST
  "8-1": "Božidara", "8-2": "Gustáv", "8-3": "Jerguš", "8-4": "Dominik / Dominika", "8-5": "Hortenzia",
  "8-6": "Jozefína", "8-7": "Štefánia", "8-8": "Oskár", "8-9": "Ľubomíra", "8-10": "Vavrinec",
  "8-11": "Zuzana", "8-12": "Darina", "8-13": "Ľubomír", "8-14": "Mojmír", "8-15": "Marcela",
  "8-16": "Leonard", "8-17": "Milica", "8-18": "Elena / Helena", "8-19": "Lýdia", "8-20": "Anabela",
  "8-21": "Jana", "8-22": "Tichomír", "8-23": "Filip", "8-24": "Bartolomej", "8-25": "Ľudovít",
  "8-26": "Samuel", "8-27": "Silvia", "8-28": "Augustín", "8-29": "Nikola / Nikol", "8-30": "Rúth", "8-31": "Nora",

  // SEPTEMBER
  "9-1": "Drahoslava", "9-2": "Linda / Rebeka", "9-3": "Belo", "9-4": "Rozália", "9-5": "Regína",
  "9-6": "Alica", "9-7": "Marianna", "9-8": "Miriama", "9-9": "Martina", "9-10": "Oleg",
  "9-11": "Bystrík", "9-12": "Mária", "9-13": "Ctibor", "9-14": "Ľudomil", "9-15": "Jolana",
  "9-16": "Ľudmila", "9-17": "Olympia", "9-18": "Eugénia", "9-19": "Konštantín", "9-20": "Ľuboslav",
  "9-21": "Matúš", "9-22": "Mórica", "9-23": "Zdenka", "9-24": "Ľubor", "9-25": "Vladislav",
  "9-26": "Edita", "9-27": "Cyprián", "9-28": "Václav", "9-29": "Michal / Michaela", "9-30": "Jarolím",

  // OKTÓBER
  "10-1": "Arnold", "10-2": "Levoslav", "10-3": "Stela", "10-4": "František", "10-5": "Viera",
  "10-6": "Natália", "10-7": "Eliška", "10-8": "Brigita", "10-9": "Dionýz", "10-10": "Slavomíra",
  "10-11": "Valentína", "10-12": "Maximilián", "10-13": "Koloman", "10-14": "Boris", "10-15": "Terézia",
  "10-16": "Vladimíra", "10-17": "Hedviga", "10-18": "Lukáš", "10-19": "Kristián", "10-20": "Vendelín",
  "10-21": "Uršuľa", "10-22": "Sergej", "10-23": "Alojzia", "10-24": "Kvetoslava", "10-25": "Aurel",
  "10-26": "Demeter", "10-27": "Sabína", "10-28": "Dobromila", "10-29": "Klára", "10-30": "Šimon / Šimona", "10-31": "Aurélia",

  // NOVEMBER
  "11-1": "Denis / Denisa", "11-2": "Pamiatka zosnulých", "11-3": "Hubert", "11-4": "Karol", "11-5": "Imrich",
  "11-6": "Renáta", "11-7": "René", "11-8": "Bohumír", "11-9": "Teodor", "11-10": "Tibor",
  "11-11": "Martin / Maroš", "11-12": "Svätopluk", "11-13": "Stanislav", "11-14": "Irma", "11-15": "Leopold",
  "11-16": "Agnesa", "11-17": "Klaudia", "11-18": "Eugen", "11-19": "Alžbeta", "11-20": "Felix",
  "11-21": "Elvíra", "11-22": "Cecília", "11-23": "Klement", "11-24": "Emília", "11-25": "Katarína",
  "11-26": "Kornel", "11-27": "Milan", "11-28": "Henrieta", "11-29": "Vratko", "11-30": "Andrej / Ondrej",

  // DECEMBER
  "12-1": "Edita", "12-2": "Bibiána", "12-3": "Oldrich", "12-4": "Barbora / Barbara", "12-5": "Oto",
  "12-6": "Mikuláš", "12-7": "Ambróz", "12-8": "Marína", "12-9": "Izabela", "12-10": "Radúz",
  "12-11": "Hilda", "12-12": "Otília", "12-13": "Lucia", "12-14": "Branislava", "12-15": "Ivica",
  "12-16": "Albína", "12-17": "Kornélia", "12-18": "Sláva", "12-19": "Judita", "12-20": "Dagmara",
  "12-21": "Bohdan", "12-22": "Adela", "12-23": "Nadežda", "12-24": "Adam a Eva", "12-25": "1. sviatok vianočný",
  "12-26": "Štefan", "12-27": "Filoména", "12-28": "Ivana / Iveta", "12-29": "Milada", "12-30": "Dávid", "12-31": "Silvester"
};


// ==========================================
// 3. FUNKCE PRO ZOBRAZENÍ SVÁTKU
// ==========================================
function displayTodayNameday(country = 'CZ') {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const key = `${month}-${day}`;

  // Vybereme kalendář podle státu ('CZ' nebo 'SK')
  const calendar = (country === 'SK') ? skNamedays : czNamedays;
  const holidayName = calendar[key] || "Neznámo";

  // Vložení jména do HTML
  const element = document.getElementById('nameday-today');
  if (element) {
    element.textContent = holidayName;
  }
};

// Spuštění při načtení stránky (Předchozí hodnota je 'CZ'. Pokud chcete SK, přepište na 'SK')
document.addEventListener('DOMContentLoaded', () => {
  displayTodayNameday('CZ'); 
});

