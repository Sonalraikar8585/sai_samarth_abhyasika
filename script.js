// ----------------- Utilities -----------------
function getFeesData() {
  return JSON.parse(localStorage.getItem('feesData')) || [];
}
function saveFeesData(data) {
  localStorage.setItem('feesData', JSON.stringify(data));
}
<<<<<<< HEAD
function getHistory() {
  return JSON.parse(localStorage.getItem('feesHistory')) || {};
}
function saveHistory(history) {
  localStorage.setItem('feesHistory', JSON.stringify(history));
}
=======
>>>>>>> fcf48633d3accef5bc8c03f36ebc7c27782e24fb

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

<<<<<<< HEAD
// ----------------- Date helpers -----------------
=======
// ----------------- Date helpers (from your original) -----------------
>>>>>>> fcf48633d3accef5bc8c03f36ebc7c27782e24fb
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
<<<<<<< HEAD

  // due for today, tomorrow or past
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const dueCheck = new Date(nextDue);
  return dueCheck <= tomorrow;
=======
  const dueCheck = new Date(nextDue.setDate(nextDue.getDate() - 1));
  return today >= dueCheck;
>>>>>>> fcf48633d3accef5bc8c03f36ebc7c27782e24fb
}

// ----------------- FEES PAGE -----------------
function displayFees() {
  const feesTable = document.getElementById('feesTable')?.querySelector('tbody');
  if (!feesTable) return;
<<<<<<< HEAD
  let data = getFeesData();

  data.sort((a, b) => getNextMonthDate(a.paidDate) - getNextMonthDate(b.paidDate));
  saveFeesData(data);

=======
  const data = getFeesData();
>>>>>>> fcf48633d3accef5bc8c03f36ebc7c27782e24fb
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
<<<<<<< HEAD
      <td>${!item.paid ? `<input type="checkbox" onchange="markAsPaid('${item.name}')" />` : '✅ Paid'}</td>
      <td><button onclick="removeFee('${item.name}')">Remove</button></td>
=======
      <td>${!item.paid ? `<input type="checkbox" onchange="markAsPaid(${index})" />` : '✅ Paid'}</td>
      <td>
        <button onclick="removeFee(${index})">Remove</button>
      </td>
>>>>>>> fcf48633d3accef5bc8c03f36ebc7c27782e24fb
    `;
    feesTable.appendChild(tr);
  });
}

<<<<<<< HEAD
function removeFee(name) {
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

  // Remove from fees
  data = data.filter(f => f.name !== name);
  saveFeesData(data);

  // Remove from history
  delete history[name];
  saveHistory(history);

  displayFees();
  displaySeats();
  displayHistory();
}

function markAsPaid(name) {
  const data = getFeesData();
  const entry = data.find(f => f.name === name);
  if (!entry) return;

  const history = getHistory();
=======
function removeFee(index) {
  const data = getFeesData();
  const student = data[index];
  if (!student) return;
  // free slots
  const slots = getSlots();
  if (student.timing === 'morning') {
    slots.morning[student.tableNo - 1] = null;
  } else if (student.timing === 'evening') {
    slots.afternoon[student.tableNo - 1] = null;
  } else if (student.timing === 'full') {
    slots.morning[student.tableNo - 1] = null;
    slots.afternoon[student.tableNo - 1] = null;
  }
  saveSlots(slots);

  data.splice(index,1);
  saveFeesData(data);
  displayFees();
  displaySeats(); // update slots view if open
}

function markAsPaid(index) {
  const data = getFeesData();
  const entry = data[index];
  if (!entry) return;

  // Record payment history
  const history = JSON.parse(localStorage.getItem('feesHistory')) || {};
>>>>>>> fcf48633d3accef5bc8c03f36ebc7c27782e24fb
  if (!history[entry.name]) history[entry.name] = [];
  history[entry.name].push({
    paidDate: new Date().toISOString().split('T')[0],
    timing: entry.timing,
    tableNo: entry.tableNo
  });
<<<<<<< HEAD
  saveHistory(history);

  const nextDate = getNextMonthDate(entry.paidDate);
  entry.paidDate = nextDate.toISOString().split('T')[0];
=======
  localStorage.setItem('feesHistory', JSON.stringify(history));

  // Advance the paidDate → becomes new "last paid"
  const nextDate = getNextMonthDate(entry.paidDate);
  entry.paidDate = nextDate.toISOString().split('T')[0];

  // Reset paid flag for next month
>>>>>>> fcf48633d3accef5bc8c03f36ebc7c27782e24fb
  entry.paid = false;

  saveFeesData(data);
  displayFees();
  displayHistory();
}

function displayHistory() {
  const container = document.getElementById("historyContainer");
  if (!container) return;
<<<<<<< HEAD
  const history = getHistory();
=======
  const history = JSON.parse(localStorage.getItem('feesHistory')) || {};
>>>>>>> fcf48633d3accef5bc8c03f36ebc7c27782e24fb
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
function removeHistoryEntry(name, index) {
<<<<<<< HEAD
  const history = getHistory();
  if (history[name]) {
    history[name].splice(index,1);
    if (history[name].length === 0) delete history[name];
    saveHistory(history);
=======
  const history = JSON.parse(localStorage.getItem('feesHistory')) || {};
  if (history[name]) {
    history[name].splice(index,1);
    if (history[name].length === 0) delete history[name];
    localStorage.setItem('feesHistory', JSON.stringify(history));
>>>>>>> fcf48633d3accef5bc8c03f36ebc7c27782e24fb
    displayHistory();
  }
}

// handle add from fees form
document.getElementById('feesForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const timing = document.getElementById('timing').value;
  const paidDate = document.getElementById('paidDate').value;
  const tableNo = parseInt(document.getElementById('tableNo').value, 10);

  if (!name || !timing || !paidDate || !tableNo) return;

<<<<<<< HEAD
  let fees = getFeesData();
  let slots = getSlots();

=======
  // duplicate name check
  const fees = getFeesData();
>>>>>>> fcf48633d3accef5bc8c03f36ebc7c27782e24fb
  if (fees.some(f => f.name.toLowerCase() === name.toLowerCase())) {
    alert('Student with this name already exists.');
    return;
  }

<<<<<<< HEAD
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
=======
  // check seat availability
  const slots = getSlots();
  if (timing === 'morning') {
    if (slots.morning[tableNo - 1]) { alert('Selected table already taken for Morning.'); return; }
    slots.morning[tableNo - 1] = { name, timing };
  } else if (timing === 'evening') {
    if (slots.afternoon[tableNo - 1]) { alert('Selected table already taken for Evening/Afternoon.'); return; }
    slots.afternoon[tableNo - 1] = { name, timing };
  } else if (timing === 'full') {
    // full-day occupies both morning and afternoon seat numbers
    if (slots.morning[tableNo - 1] || slots.afternoon[tableNo - 1]) {
      alert('Selected table already taken for Full Day (one of the slots is occupied).');
      return;
    }
    slots.morning[tableNo - 1] = { name, timing: 'full' };
    slots.afternoon[tableNo - 1] = { name, timing: 'full' };
>>>>>>> fcf48633d3accef5bc8c03f36ebc7c27782e24fb
  }

  saveSlots(slots);

  fees.push({ name, timing, paidDate, tableNo, paid: false });
  saveFeesData(fees);

  this.reset();
  displayFees();
  displaySeats();
});

<<<<<<< HEAD
=======
// initial render on fees page
displayFees();
displayHistory();


>>>>>>> fcf48633d3accef5bc8c03f36ebc7c27782e24fb
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
<<<<<<< HEAD

        // Apply CSS classes for colors instead of inline styles
        if (student.timing === 'morning') seat.classList.add('seat-morning');
        else if (student.timing === 'afternoon') seat.classList.add('seat-afternoon');
=======
        // add color classes depending on timing/full
        if (student.timing === 'morning') seat.classList.add('seat-morning');
        else if (student.timing === 'evening') seat.classList.add('seat-evening');
>>>>>>> fcf48633d3accef5bc8c03f36ebc7c27782e24fb
        else if (student.timing === 'full') seat.classList.add('seat-full');

        seat.innerHTML = `
          <strong>${i+1}</strong><br>
          ${student.name}<br>
          <small>(${student.timing})</small><br>
<<<<<<< HEAD
          <button onclick="removeSeat('${slot}', ${i}, '${student.name}')">Remove</button>
=======
          <button onclick="removeSeat('${slot}', ${i})">Remove</button>
>>>>>>> fcf48633d3accef5bc8c03f36ebc7c27782e24fb
        `;
      } else {
        seat.innerHTML = `<strong>${i+1}</strong><br><em>Empty</em>`;
      }
      container.appendChild(seat);
    }
  });
}

<<<<<<< HEAD

function removeSeat(slot, index, name) {
  let slots = getSlots();
  let fees = getFeesData();
  let history = getHistory();

  const occupant = slots[slot][index];
  if (!occupant) return;

  if (occupant.timing === 'full') {
=======
function assignSeatManual(event, slot) {
  event.preventDefault();
  const seatId = document.getElementById(slot + 'Seat');
  const nameId = document.getElementById(slot + 'Name');
  const seatNo = parseInt(seatId.value, 10) - 1;
  const name = nameId.value.trim();
  if (seatNo < 0 || seatNo >= 80 || !name) { alert('Invalid input'); return; }

  const slots = getSlots();
  if (slots[slot][seatNo]) { alert('Seat already taken!'); return; }
  // also ensure name not already present
  const fees = getFeesData();
  if (fees.some(f => f.name.toLowerCase() === name.toLowerCase())) {
    // if student exists in fees but not yet assigned here, you might want to allow manual override; we'll prevent duplicates to follow requirement.
    alert('Student already exists in fees list. Use Fees page to add (or remove first).');
    return;
  }

  // manual assignment sets timing depending on slot
  const timing = (slot === 'morning') ? 'morning' : 'evening';
  slots[slot][seatNo] = { name, timing };
  saveSlots(slots);
  displaySeats();
  seatId.value = '';
  nameId.value = '';
}

function removeSeat(slot, index) {
  const slots = getSlots();
  const occupant = slots[slot][index];
  if (!occupant) return;
  // remove corresponding fees entry if exists
  const fees = getFeesData();
  const foundIndex = fees.findIndex(f => f.name === occupant.name && (
    (occupant.timing === 'morning' && f.timing === 'morning') ||
    (occupant.timing === 'evening' && f.timing === 'evening') ||
    (occupant.timing === 'full' && f.timing === 'full')
  ));
  // If full-day, remove both morning and afternoon seat for that table
  if (occupant.timing === 'full') {
    // free both
>>>>>>> fcf48633d3accef5bc8c03f36ebc7c27782e24fb
    slots.morning[index] = null;
    slots.afternoon[index] = null;
  } else {
    slots[slot][index] = null;
  }
  saveSlots(slots);

<<<<<<< HEAD
  // Remove fees entry
  fees = fees.filter(f => f.name !== name);
  saveFeesData(fees);

  // Remove from history
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
=======
  if (foundIndex !== -1) {
    fees.splice(foundIndex,1);
    saveFeesData(fees);
  }

  displaySeats();
}

// init
initializeSlotsIfNeeded();
displaySeats();
>>>>>>> fcf48633d3accef5bc8c03f36ebc7c27782e24fb
