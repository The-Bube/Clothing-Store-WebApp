console.log("Dashboard JS loaded");

// ---------- NAVIGATION ----------
const navButtons = document.querySelectorAll('.nav-btn');
const sections = {
  overview: document.getElementById('overview-section'),
  orders: document.getElementById('orders-section'),
  inventory: document.getElementById('inventory-section'),
  customers: document.getElementById('customers-section')
};

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // active button
    navButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // visible section
    const target = btn.dataset.section;
    Object.entries(sections).forEach(([name, el]) => {
      el.classList.toggle('visible', name === target);
    });
  });
});

// ---------- HELPERS ----------
function money(v) {
  const n = Number(v || 0);
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

// ---------- OVERVIEW (View10, View6, View9) ----------
async function loadOverview() {
  try {
    const [v10Res, v6Res, v9Res] = await Promise.all([
      fetch('/api/view10'),
      fetch('/api/view6'),
      fetch('/api/view9')
    ]);

    const [v10, v6, v9] = await Promise.all([
      v10Res.json(), v6Res.json(), v9Res.json()
    ]);

    // KPIs
    const totalRevenue = v10.reduce((sum, row) => sum + Number(row.TotalSpent || 0), 0);
    const totalCompletedOrders = v10.reduce((sum, row) => sum + Number(row.CompletedOrders || 0), 0);
    const pendingCount = v6.length;
    const lowStockCount = v9.length;

    document.getElementById('kpi-total-revenue').textContent = money(totalRevenue);
    document.getElementById('kpi-completed-orders').textContent = totalCompletedOrders;
    document.getElementById('kpi-pending-orders').textContent = pendingCount;
    document.getElementById('kpi-low-stock').textContent = lowStockCount;

    // Top customers table (View10)
    const tbody = document.getElementById('overview-top-customers');
    tbody.innerHTML = '';
    v10
      .sort((a, b) => b.TotalSpent - a.TotalSpent)
      .slice(0, 5)
      .forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${row.full_name}</td>
          <td>${row.CompletedOrders}</td>
          <td>${money(row.TotalSpent)}</td>
        `;
        tbody.appendChild(tr);
      });
  } catch (err) {
    console.error("Error loading overview:", err);
  }
}

// ---------- ORDERS (View1, View3, View8) ----------
async function loadOrders() {
  try {
    const [v8Res, v3Res, v1Res] = await Promise.all([
      fetch('/api/view8'),
      fetch('/api/view3'),
      fetch('/api/view1')
    ]);
    const [v8, v3, v1] = await Promise.all([
      v8Res.json(), v3Res.json(), v1Res.json()
    ]);

    // Maps by order_id
    const comparisonMap = new Map(v3.map(r => [r.order_id, r.Comparison]));
    const customerMap = new Map(v1.map(r => [r.order_id, r.CustomerName]));
    const statusMap = new Map(v1.map(r => [r.order_id, r.OrderStatus]));

    const tbody = document.getElementById('orders-table');
    tbody.innerHTML = '';

    v8.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${customerMap.get(row.order_id) || ''}</td>
        <td>${row.order_id}</td>
        <td>${statusMap.get(row.order_id) || ''}</td>
        <td>${row.TotalItems}</td>
        <td>${money(row.TotalCost)}</td>
        <td>${comparisonMap.get(row.order_id) || ''}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading orders:", err);
  }
}

// ---------- INVENTORY (View7 & View9) ----------
async function loadInventory() {
  try {
    const [v7Res, v9Res] = await Promise.all([
      fetch('/api/view7'),
      fetch('/api/view9')
    ]);
    const [v7, v9] = await Promise.all([v7Res.json(), v9Res.json()]);

    // KPIs
    const totalValue = v7.reduce((sum, row) => sum + Number(row.TotalValue || 0), 0);
    const locationsCount = v7.length;

    document.getElementById('inv-total-value').textContent = money(totalValue);
    document.getElementById('inv-locations-count').textContent = locationsCount;

    // Inventory by location table
    const locBody = document.getElementById('inv-by-location');
    locBody.innerHTML = '';
    v7.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.location}</td>
        <td>${money(row.TotalValue)}</td>
      `;
      locBody.appendChild(tr);
    });

    // Low stock products table
    const lowBody = document.getElementById('inv-low-stock');
    lowBody.innerHTML = '';
    v9.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.ProductName}</td>
        <td>${row.quantity}</td>
        <td>${row.reorder_level}</td>
        <td>${row.location}</td>
      `;
      lowBody.appendChild(tr);
    });

    // Chart: inventory value by location (View7)
    const labels = v7.map(row => row.location);
    const values = v7.map(row => Number(row.TotalValue || 0));
    const ctx = document.getElementById('inv-chart');

    // Chart is loaded from CDN in HTML
    // eslint-disable-next-line no-undef
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Inventory Value ($)',
          data: values
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

  } catch (err) {
    console.error("Error loading inventory:", err);
  }
}

// ---------- CUSTOMERS (View5) ----------
async function loadCustomers() {
  try {
    const res = await fetch('/api/view5');
    const rows = await res.json();
    const tbody = document.getElementById('customers-table');
    tbody.innerHTML = '';
    rows.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${row.full_name}</td><td>${row.UserType}</td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading customers:", err);
  }
}

// ---------- INITIAL LOAD ----------
loadOverview();
loadOrders();
loadInventory();
loadCustomers();
