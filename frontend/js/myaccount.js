let currentUser = null;

document.addEventListener('DOMContentLoaded', function() {
  checkAuth();
});

async function checkAuth() {
  try {
    const response = await fetch('/api/auth/status');
    const result = await response.json();
    
    if (!result.authenticated) {
      alert('Please login to access your account');
      window.location.href = '/login.html';
      return;
    }
    
    await loadUserData();
    await loadOrders();
    
  } catch (error) {
    console.error('Auth check error:', error);
    alert('Error checking authentication');
    window.location.href = '/login.html';
  }
}

async function loadUserData() {
  try {
    const response = await fetch('/api/user');
    const result = await response.json();
    
    if (result.success) {
      currentUser = result.user;
      displayUserInfo();
    } else {
      alert('Error loading user data');
      window.location.href = '/login.html';
    }
    
  } catch (error) {
    console.error('Load user error:', error);
    alert('Error loading user data');
  }
}

function displayUserInfo() {
  document.getElementById('display-name').textContent = currentUser.full_name;
  document.getElementById('display-email').textContent = currentUser.email;
  document.getElementById('display-phone').textContent = currentUser.phone || 'Not provided';
}

function toggleEdit() {
  const editSection = document.getElementById('edit-section');
  editSection.classList.toggle('active');
}

async function changePassword() {
  const currentPassword = document.getElementById('current-password').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  
  if (!currentPassword || !newPassword || !confirmPassword) {
    showMessage('password-message', 'All password fields are required', 'error');
    return;
  }
  
  if (newPassword.length < 6) {
    showMessage('password-message', 'New password must be at least 6 characters', 'error');
    return;
  }
  
  if (newPassword !== confirmPassword) {
    showMessage('password-message', 'New passwords do not match', 'error');
    return;
  }
  
  try {
    const response = await fetch('/api/user/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        oldPassword: currentPassword,
        newPassword: newPassword
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      showMessage('password-message', 'Password changed successfully!', 'success');
      document.getElementById('current-password').value = '';
      document.getElementById('new-password').value = '';
      document.getElementById('confirm-password').value = '';
    } else {
      showMessage('password-message', result.message || 'Failed to change password', 'error');
    }
    
  } catch (error) {
    console.error('Password change error:', error);
    showMessage('password-message', 'Connection error. Please try again.', 'error');
  }
}

function confirmDeleteAccount() {
  const confirmation = prompt('This action cannot be undone. Type "DELETE" to confirm account deletion:');
  
  if (confirmation === 'DELETE') {
    deleteAccount();
  } else if (confirmation !== null) {
    alert('Account deletion cancelled. You must type "DELETE" exactly.');
  }
}

async function deleteAccount() {
  try {
    const response = await fetch('/api/user/delete', {
      method: 'DELETE'
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('Your account has been deleted. We\'re sorry to see you go!');
      localStorage.clear();
      window.location.href = '/index.html';
    } else {
      alert(result.message || 'Failed to delete account');
    }
    
  } catch (error) {
    console.error('Delete account error:', error);
    alert('Connection error. Please try again.');
  }
}

async function logout() {
  if (!confirm('Are you sure you want to log out?')) {
    return;
  }
  
  try {
    await fetch('/api/logout', { method: 'POST' });
    localStorage.clear();
    alert('You have been logged out successfully');
    window.location.href = '/index.html';
  } catch (error) {
    console.error('Logout error:', error);
    localStorage.clear();
    window.location.href = '/index.html';
  }
}

async function loadOrders() {
  try {
    console.log('Loading orders...');
    const response = await fetch('/api/user/orders');
    
    if (!response.ok) {
      console.error('Response error:', response.status, response.statusText);
      return;
    }
    
    const result = await response.json();
    console.log('Orders response:', result);
    
    if (result.success && result.orders) {
      const orders = result.orders;
      console.log('Total orders:', orders.length);
      console.log('Full order data:', JSON.stringify(orders, null, 2));
      console.log('Order statuses:', orders.map(o => o.status));
      
      const currentOrders = orders.filter(o => {
        const status = o.status?.toLowerCase() || '';
        return status === 'processing' || status === 'shipped' || status === 'pending';
      });
      
      const orderHistory = orders.filter(o => {
        const status = o.status?.toLowerCase() || '';
        return status === 'completed' || status === 'delivered' || status === 'cancelled';
      });
      
      console.log('Current orders:', currentOrders.length);
      console.log('Order history:', orderHistory.length);
      
      displayOrders('current-orders-list', currentOrders);
      displayOrders('order-history-list', orderHistory);
    } else {
      console.error('Failed to load orders:', result.message || 'No success flag');
    }
    
  } catch (error) {
    console.error('Load orders error:', error);
  }
}

function displayOrders(containerId, orders) {
  const container = document.getElementById(containerId);
  
  if (orders.length === 0) {
    container.innerHTML = '<p class="text-muted">No orders</p>';
    return;
  }
  
  container.innerHTML = orders.map(order => `
    <div class="order-item">
      <div><strong>${order.order_id}</strong></div>
      <div>${formatDate(order.order_date)} - ${order.item_count} items</div>
      <div>$${(parseFloat(order.total_amount) || 0).toFixed(2)}</div>
      <div class="status status-${order.status.toLowerCase()}">${order.status}</div>
    </div>
  `).join('');
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function showMessage(elementId, message, type) {
  const element = document.getElementById(elementId);
  element.textContent = message;
  element.className = `message ${type} active`;
  
  setTimeout(() => {
    element.classList.remove('active');
  }, 5000);
}