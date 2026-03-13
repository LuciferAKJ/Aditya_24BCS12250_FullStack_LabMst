let expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
let editingId = null;

function addExpense() {
  const name   = document.getElementById('expName').value.trim();
  const amount = parseFloat(document.getElementById('expAmount').value);
  const cat    = document.getElementById('expCategory').value;

  if (!name || isNaN(amount) || amount <= 0) {
    showToast('Fill all fields correctly!'); return;
  }
  expenses.push({ id: Date.now(), name, amount, category: cat });
  saveAndRender();
  clearForm();
  showToast('Expense added!');
}
function deleteExpense(id) {
  expenses = expenses.filter(e => e.id !== id);
  if (editingId === id) cancelEdit();
  saveAndRender();
  showToast('🗑️ Deleted!');
}
function startEdit(id) {
  const exp = expenses.find(e => e.id === id);
  if (!exp) return;

  editingId = id;
  document.getElementById('expName').value= exp.name;
  document.getElementById('expAmount').value= exp.amount;
  document.getElementById('expCategory').value = exp.category;

  document.getElementById('formTitle').textContent= 'Edit Expense';
  document.getElementById('btnAdd').disabled= true;
  document.getElementById('btnUpdate').disabled= false;
  document.getElementById('btnCancel').style.display= 'inline-block';

  renderList();
  document.getElementById('expName').focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function updateExpense() {
  if (editingId === null) return;
  const name   = document.getElementById('expName').value.trim();
  const amount = parseFloat(document.getElementById('expAmount').value);
  const cat    = document.getElementById('expCategory').value;

  if (!name || isNaN(amount) || amount <= 0) {
    showToast('Fill all fields correctly!'); return;
  }
  const idx = expenses.findIndex(e => e.id === editingId);
  if (idx !== -1) {
    expenses[idx].name     = name;
    expenses[idx].amount   = amount;
    expenses[idx].category = cat;
  }

  cancelEdit();
  saveAndRender();
  showToast('Updated!');
}
function cancelEdit() {
  editingId = null;
  clearForm();
  document.getElementById('formTitle').textContent= 'Add Expense';
  document.getElementById('btnAdd').disabled= false;
  document.getElementById('btnUpdate').disabled= true;
  document.getElementById('btnCancel').style.display= 'none';
  renderList();
}
function clearForm() {
  document.getElementById('expName').value= '';
  document.getElementById('expAmount').value= '';
  document.getElementById('expCategory').value = 'Food';
}
function saveAndRender() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
  renderList();
  updateStats();
}
function updateStats() {
  const sum = cat => expenses
    .filter(e => e.category === cat)
    .reduce((s, e) => s + e.amount, 0);
  document.getElementById('statFood').textContent= '$'+ sum('Food').toFixed(2);
  document.getElementById('statTravel').textContent= '$'+ sum('Travel').toFixed(2);
  document.getElementById('statShopping').textContent = '$'+ sum('Shopping').toFixed(2);

  const grand = expenses.reduce((s, e) => s + e.amount, 0);
  document.getElementById('grandTotal').textContent  = '$' + grand.toFixed(2);
  document.getElementById('headerTotal').textContent = 'Total: $' + grand.toFixed(2);
  document.getElementById('totalRow').style.display  = expenses.length ? 'flex' : 'none';
  document.getElementById('countBadge').textContent  = expenses.length + ' item' + (expenses.length !== 1?'s':'');
}
function renderList() {
  const list = document.getElementById('expenseList');

  if (expenses.length === 0) {
    list.innerHTML = '<div class="empty"><span> Yeahhhh!!! </span>No expenses yet. Add one above!</div>';
    return;
  }
  list.innerHTML = expenses.map(e => `
    <div class="item ${editingId === e.id ? 'editing' : ''}">
      <span class="pill ${e.category}">${e.category}</span>
      <span class="exp-name">${e.name}</span>
      <span class="exp-amount">$${e.amount.toFixed(2)}</span>
      <div class="actions">
        <button class="btn-edit"   onclick="startEdit(${e.id})">Edit</button>
        <button class="btn-delete" onclick="deleteExpense(${e.id})">Delete</button>
      </div>
    </div>
  `).join('');
}
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
}
saveAndRender();