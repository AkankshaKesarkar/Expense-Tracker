// Selectors
const expenseForm = document.getElementById('expense-form');
const expenseTable = document.getElementById('expenses');
const clearExpensesBtn = document.getElementById('clear-expenses');
const chartCanvas = document.getElementById('expense-chart');
const themeToggle = document.getElementById('theme-toggle');
const feedback = document.getElementById('feedback');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let currentSort = { key: null, ascending: true };

// Initialize Theme
const initTheme = () => {
  const isDarkMode = localStorage.getItem('theme') === 'dark';
  document.body.classList.toggle('dark-mode', isDarkMode);
  themeToggle.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
};
initTheme();

// Toggle Theme
themeToggle.addEventListener('click', () => {
  const isDarkMode = document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  themeToggle.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// Add Expense
expenseForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const description = document.getElementById('description').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;

  if (!description || !amount || !date) {
    showFeedback('All fields are required.', false);
    return;
  }

  const expense = { description, amount, category, date, id: Date.now() };
  expenses.push(expense);

  localStorage.setItem('expenses', JSON.stringify(expenses));
  renderExpenses();
  expenseForm.reset();
  showFeedback('Expense added successfully!', true);
});

// Feedback Messages
function showFeedback(message, isSuccess) {
  feedback.textContent = message;
  feedback.className = isSuccess ? 'success' : 'error';
  feedback.classList.remove('hidden');
  setTimeout(() => feedback.classList.add('hidden'), 3000);
}

// Render Expenses
function renderExpenses() {
  expenseTable.innerHTML = '';
  expenses.forEach((expense) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${expense.description}</td>
      <td>₹${expense.amount.toFixed(2)}</td>
      <td>${expense.category}</td>
      <td>${expense.date}</td>
      <td>
        <button onclick="deleteExpense(${expense.id})">Delete</button>
      </td>
    `;
    expenseTable.appendChild(row);
  });
  updateChart();
}

// Delete Expense
function deleteExpense(id) {
  expenses = expenses.filter(expense => expense.id !== id);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  renderExpenses();
  showFeedback('Expense deleted successfully!', true);
}

// Clear All Expenses
clearExpensesBtn.addEventListener('click', () => {
  expenses = [];
  localStorage.removeItem('expenses');
  renderExpenses();
  showFeedback('All expenses cleared!', true);
});

// Update Chart
function updateChart() {
  const categories = ['Food', 'Transport', 'Entertainment', 'Other'];
  const categoryTotals = categories.map(cat =>
    expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
  );

  if (window.expenseChart) window.expenseChart.destroy();

  window.expenseChart = new Chart(chartCanvas, {
    type: 'pie',
    data: {
      labels: categories,
      datasets: [{
        data: categoryTotals,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50'],
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

// Initial Render
renderExpenses();
