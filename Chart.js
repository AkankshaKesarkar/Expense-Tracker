function updateChart() {
    const categories = ['Food', 'Transport', 'Entertainment'];
    const categoryTotals = categories.map(
      (cat) => expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
    );
  
    if (window.expenseChart) {
      window.expenseChart.destroy(); // Destroy previous chart instance
    }
  
    window.expenseChart = new Chart(chartCanvas, {
      type: 'pie',
      data: {
        labels: categories,
        datasets: [{
          label: 'Expenses by Category',
          data: categoryTotals,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        }]
      }
    });
  }
  