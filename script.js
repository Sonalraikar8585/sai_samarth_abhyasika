// ----------------- Utilities -----------------
function getFeesData() {
  return JSON.parse(localStorage.getItem('feesData')) || [];
}
function saveFeesData(data) {
  localStorage.setItem('feesData', JSON.stringify(data));
}
function getHistory() {
  return JSON.parse(localStorage.getItem('feesHistory')) || {};
}
function saveHistory(history) {
  localStorage.setItem('feesHistory', JSON.stringify(history));
}

function initializeSlotsIfNeeded() {
  let slots = JSON.parse(localStorage.getItem('slots'));
  if (!slots) {
    slots = { morning: Array(80).fill(null), afternoon: Array(80).fill(null) };
    localStorage.setItem('slots', JSON.stringify(slots));
  }
}
function getSlots() {
  initializeSlotsIfNeeded();
  return JSON.parse(localStorage.getItem('slots'));
}
function saveSlots(data) {
  localStorage.setItem('slots', JSON.stringify(data));
}

// ----------------- Date helpers -----------------
function formatDateToDDMMYY(dateStr) {
  const d = new Date(dateStr);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}-${mm}-${yy}`;
}
function getNextMonthDate(dateStr) {
  const date = new Date(dateStr);
  date.setMonth(date.getMonth() + 1);
  return date;
}
function isDue(paidDateStr) {
  const paidDate = new Date(paidDateStr);
  const nextDue = new Date(paidDate);
  nextDue.setMonth(nextDue.getMonth() + 1);
  const today = new Date();
  today.setHours(0,0,0,0);

  // due for today, tomorrow or past
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const dueCheck = new Date(nextDue);
  return dueCheck <= tomorrow;
}

// ----------------- FEES PAGE -----------------
function displayFees() {
  const feesTable = document.getElementById('feesTable')?.querySelector('tbody');
  if (!feesTable) return;
  let data = getFeesData();

  data.sort((a, b) => getNextMonthDate(a.paidDate) - getNextMonthDate(b.paidDate));
  saveFeesData(data);

  feesTable.innerHTML = '';
  data.forEach((item, index) => {
    const paidDateFormatted = formatDateToDDMMYY(item.paidDate);
    const nextDate = getNextMonthDate(item.paidDate);
    const nextDateFormatted = formatDateToDDMMYY(nextDate);
    const due = isDue(item.paidDate);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index+1}</td>
      <td>${item.name}</td>
      <td>${item.timing}</td>
      <td>${paidDateFormatted}</td>
      <td>${item.tableNo}</td>
      <td class="${due ? 'red-text' : ''}">
        ${nextDateFormatted}
        ${due ? '<br><span class="alert"> Fees to be collected!</span>' : ''}
      </td>
      <td>${!item.paid ? `<input type="checkbox" onchange="markAsPaid('${item.name}')" />` : '✅ Paid'}</td>
      <td><button onclick="removeFee('${item.name}')">Remove</button></td>
    `;
    feesTable.appendChild(tr);
  });
}



function markAsPaid(name) {
  const data = getFeesData();
  const entry = data.find(f => f.name === name);
  if (!entry) return;

  const history = getHistory();
  if (!history[entry.name]) history[entry.name] = [];
  history[entry.name].push({
    paidDate: new Date().toISOString().split('T')[0],
    timing: entry.timing,
    tableNo: entry.tableNo
  });
  saveHistory(history);

  const nextDate = getNextMonthDate(entry.paidDate);
  entry.paidDate = nextDate.toISOString().split('T')[0];
  entry.paid = false;

  saveFeesData(data);
  displayFees();
  displayHistory();
}

function displayHistory() {
  const container = document.getElementById("historyContainer");
  if (!container) return;
  const history = getHistory();
  container.innerHTML = '';
  Object.keys(history).forEach(name => {
    const div = document.createElement('div');
    div.className = 'history-block';
    div.innerHTML = `<h3>${name}</h3><ul>` +
      history[name].map((r, idx) => `
        <li>
          Paid on: ${formatDateToDDMMYY(r.paidDate)} | Timing: ${r.timing}
          <button onclick="removeHistoryEntry('${name}', ${idx})">Remove</button>
        </li>
      `).join('') +
      `</ul>`;
    container.appendChild(div);
  });
}

// handle add from fees form
document.getElementById('feesForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const timing = document.getElementById('timing').value;
  const paidDate = document.getElementById('paidDate').value;
  const tableNo = parseInt(document.getElementById('tableNo').value, 10);

  if (!name || !timing || !paidDate || !tableNo) return;

  let fees = getFeesData();
  let slots = getSlots();

  if (fees.some(f => f.name.toLowerCase() === name.toLowerCase())) {
    alert('Student with this name already exists.');
    return;
  }

  const idx = tableNo - 1;
  if (timing === 'morning') {
    if (slots.morning[idx]) { alert('Seat taken.'); return; }
    slots.morning[idx] = { name, timing };
  } else if (timing === 'afternoon') {
    if (slots.afternoon[idx]) { alert('Seat taken.'); return; }
    slots.afternoon[idx] = { name, timing };
  } else if (timing === 'full') {
    if (slots.morning[idx] || slots.afternoon[idx]) { alert('Seat taken.'); return; }
    slots.morning[idx] = { name, timing: 'full' };
    slots.afternoon[idx] = { name, timing: 'full' };
  }

  saveSlots(slots);

  fees.push({ name, timing, paidDate, tableNo, paid: false });
  saveFeesData(fees);

  this.reset();
  displayFees();
  displaySeats();
});

// ----------------- SLOTS PAGE -----------------
function displaySeats() {
  const slots = getSlots();
  ['morning','afternoon'].forEach(slot => {
    const container = document.getElementById(slot + 'Table');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 80; i++) {
      const student = slots[slot][i];
      const seat = document.createElement('div');
      seat.className = 'seat';
      if (student) {
        seat.classList.add('occupied');

        // Apply CSS classes for colors instead of inline styles
        if (student.timing === 'morning') seat.classList.add('seat-morning');
        else if (student.timing === 'afternoon') seat.classList.add('seat-afternoon');
        else if (student.timing === 'full') seat.classList.add('seat-full');

        seat.innerHTML = `
          <strong>${i+1}</strong><br>
          ${student.name}<br>
          <small>(${student.timing})</small><br>
          <button onclick="removeSeat('${slot}', ${i}, '${student.name}')">Remove</button>
        `;
      } else {
        seat.innerHTML = `<strong>${i+1}</strong><br><em>Empty</em>`;
      }
      container.appendChild(seat);
    }
  });
}

function removeFee(name) {
  if (!confirm(`Are you sure you want to remove ${name}?`)) return;

  let data = getFeesData();
  let slots = getSlots();
  let history = getHistory();

  const student = data.find(f => f.name === name);
  if (!student) return;

  const idx = student.tableNo - 1;
  if (student.timing === 'morning') slots.morning[idx] = null;
  else if (student.timing === 'afternoon') slots.afternoon[idx] = null;
  else if (student.timing === 'full') {
    slots.morning[idx] = null;
    slots.afternoon[idx] = null;
  }
  saveSlots(slots);

  data = data.filter(f => f.name !== name);
  saveFeesData(data);

  delete history[name];
  saveHistory(history);

  displayFees();
  displaySeats();
  displayHistory();
}

function removeHistoryEntry(name, index) {
  if (!confirm(`Are you sure you want to delete this history entry for ${name}?`)) return;

  const history = getHistory();
  if (history[name]) {
    history[name].splice(index,1);
    if (history[name].length === 0) delete history[name];
    saveHistory(history);
    displayHistory();
  }
}

function removeSeat(slot, index, name) {
  if (!confirm(`Are you sure you want to remove ${name} from seat ${index+1} (${slot})?`)) return;

  let slots = getSlots();
  let fees = getFeesData();
  let history = getHistory();

  const occupant = slots[slot][index];
  if (!occupant) return;

  if (occupant.timing === 'full') {
    slots.morning[index] = null;
    slots.afternoon[index] = null;
  } else {
    slots[slot][index] = null;
  }
  saveSlots(slots);

  fees = fees.filter(f => f.name !== name);
  saveFeesData(fees);

  delete history[name];
  saveHistory(history);

  displaySeats();
  displayFees();
  displayHistory();
}


// ----------------- Init -----------------
initializeSlotsIfNeeded();
displaySeats();
displayFees();
displayHistory();  