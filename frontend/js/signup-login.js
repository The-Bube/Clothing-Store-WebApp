// signup-login.js - User Registration
// This file handles new user account creation (sign up)
// Users arrive here after entering an email that doesn't exist in the database

// Wait for the DOM to fully load before executing any code
// This ensures all HTML elements are available before we try to access them
document.addEventListener('DOMContentLoaded', () => {
  // Get a reference to the signup form element from the HTML
  // This form contains fields for full name, phone, and password
  const form = document.getElementById('signup-form');
  // Get a reference to the full name input field from the HTML
  // This is where the user enters their complete name
  const fullnameInput = document.getElementById('fullname-input');
  // Get a reference to the phone input field from the HTML
  // This is where the user enters their contact phone number
  const phoneInput = document.getElementById('phone-input');
  // Get a reference to the password input field from the HTML
  // This is where the user enters their desired password for the account
  const passwordInput = document.getElementById('password-input');
  // Retrieve the user's email from session storage
  // Session storage was set on the previous login page when the user entered their email
  // This email is used to create the new account
  const email = sessionStorage.getItem('userEmail');

  // Security check: verify that an email exists in session storage
  // If no email is found, the user skipped the email verification step (suspicious activity)
  if (!email) {
    // Redirect to the login page so the user can start the process from the beginning
    window.location.href = '/login.html'; // fallback if no email in session storage
  }

  // Attach an event listener to the signup form to handle submission
  form.addEventListener('submit', async (e) => {
    // Prevent the default form submission behavior (page refresh)
    e.preventDefault();
    // Get the full name value from the input field and remove extra whitespace
    const fullName = fullnameInput.value.trim();
    // Get the phone number value from the input field and remove extra whitespace
    const phone = phoneInput.value.trim();
    // Get the password value from the input field and remove extra whitespace
    const password = passwordInput.value.trim();

    // Validate that all required fields have been filled in by the user
    if (!fullName || !phone || !password || password.length < 6) {
      // Show an alert if any field is empty or password is less than 6 characters
      // This prevents weak passwords and ensures all required data is collected
      return alert('Please fill all fields and make sure password is at least 6 characters.');
    }

    try {
      // Send a POST request to the server to create a new user account
      // POST method is used because we're sending data to create a new resource
      const response = await fetch('/api/register', {
        method: 'POST', // Specify that we're posting data
        headers: { 'Content-Type': 'application/json' }, // Specify that we're sending JSON
        // Send the user's registration information to the server
        body: JSON.stringify({ 
          fullName,  // The user's full name
          email,     // The email from session storage (verified to not exist)
          phone,     // The user's phone number
          password   // The user's desired password
        })
      });

      // Parse the server's response as JSON
      const result = await response.json();

      // Check if the account creation was successful
      if (result.success) {
        // Show a confirmation message to the user
        alert('Account created! Logging you in...');
        // Store the user's full name in local storage for display throughout the application
        localStorage.setItem('loggedInUser', fullName);
        // Redirect to the main shopping page (user is now logged in)
        window.location.href = '/index.html';
      } else {
        // If the registration failed, show the error message from the server
        // result.message contains the specific error (e.g., email already exists, server error, etc.)
        alert(result.message || 'Registration failed');
      }

    } catch (err) {
      // If a network error occurs (connection failed, server down, timeout, etc.)
      console.error('Signup error:', err);
      // Show a generic error message to the user
      alert('Server error. Please try again later.');
    }
  });
});
