// password-login.js - Password Authentication
// This file handles user login by verifying their password after their email has been confirmed
// Users arrive here after entering their email on the login page

// Wait for the DOM to fully load before executing any code
// This ensures all HTML elements are available before we try to access them
document.addEventListener('DOMContentLoaded', () => {
  // Get a reference to the password form element from the HTML
  const form = document.getElementById('password-form');
  // Get a reference to the password input field from the HTML
  const passwordInput = document.getElementById('password-input');
  // Retrieve the user's email from session storage
  // Session storage was set on the previous login page when the user entered their email
  const email = sessionStorage.getItem('userEmail');
  
  // Security check: verify that an email exists in session storage
  // If no email is found, the user skipped the email verification step (suspicious)
  if (!email) {
    // Redirect to the login page so the user can start the process again
    window.location.href = '/login.html'; // fallback if no email
  }
  
  // Attach an event listener to the password form to handle submission
  form.addEventListener('submit', async (e) => {
    // Prevent the default form submission behavior (page refresh)
    e.preventDefault();
    // Get the password value from the input field and remove extra whitespace
    const password = passwordInput.value.trim();
    
    // Validate that the user entered a password before proceeding
    if (!password) return alert('Please enter your password');
    
    try {
      // Send a POST request to the server with the email and password
      // POST method is used because we're sending sensitive authentication data
      const response = await fetch('/api/login', {
        method: 'POST', // Specify that we're posting data
        headers: { 'Content-Type': 'application/json' }, // Specify that we're sending JSON
        // Send both the email (retrieved earlier) and the password entered by the user
        body: JSON.stringify({ email, password })
      });
      
      // Parse the server's response as JSON
      const result = await response.json();
      
      // Check if the login was successful (server verified correct email and password)
      if (result.success) {
        // Store the user's full name in local storage for display throughout the application
        localStorage.setItem('loggedInUser', result.user.full_name);
        // Store the user's ID in local storage for API requests and identification
        localStorage.setItem('userId', result.user.user_id);
        // Store the user's role ID in local storage to determine access level and permissions
        localStorage.setItem('userRole', result.user.role_id);
        
        // Check the user's role to determine where to redirect them
        // role_id 2 indicates an admin/staff member with elevated permissions
        if (result.user.role_id === 2) {
          // Admin user - redirect to the admin dashboard where they can manage the system
          window.location.href = '/dashboard.html';
        } else {
          // Regular customer user - redirect to the main shopping page
          window.location.href = '/index.html';
        }
      } else {
        // If the login failed (incorrect password or other error), show the error message
        // result.message contains the specific error from the server
        alert(result.message || 'Incorrect password');
        // Clear the password input field so the user can try again
        passwordInput.value = '';
      }
    } catch (err) {
      // If a network error occurs (connection failed, server down, etc.)
      console.error('Login error:', err);
      // Show a generic error message to the user
      alert('Server error. Please try again later.');
    }
  });
});