// Login.js - Handles initial email verification for user authentication
// This file determines whether a user is logging in (email exists) or signing up (new email)
// Wait for the DOM to fully load before executing any code
document.addEventListener('DOMContentLoaded', () => {
  // Get references to the email form and input field from the HTML
  const form = document.getElementById('email-form');
  const emailInput = document.getElementById('email-input');
  
  // Attach an event listener to the form to handle when the user submits it
  form.addEventListener('submit', async (e) => {
    // Prevent the default form submission behavior (page refresh)
    e.preventDefault();
    
    // Get the email value from the input field and remove extra whitespace
    const email = emailInput.value.trim();
    
    // Validate that the user entered an email before proceeding
    if (!email) return alert('Please enter your email');
    
    // Send the email to the server to check if an account already exists
    try {
      const response = await fetch('/api/check-email', {
        method: 'POST', // Use POST method to send data
        headers: { 'Content-Type': 'application/json' }, // Specify JSON format
        body: JSON.stringify({ email }) // Convert email object to JSON string
      });
      
      // Parse the server's response as JSON
      const result = await response.json();
      
      // Check if the email exists in the database
      if (result.exists) {
        // Email exists - User is logging in (has an existing account)
        // Store the email in session storage so the password page can access it
        sessionStorage.setItem('userEmail', email);
        // Redirect to the password login page where they enter their password
        window.location.href = '/password-login.html';
      } else {
        // Email does not exist - User is a new customer (needs to create account)
        // Store the email in session storage so the signup page can access it
        sessionStorage.setItem('userEmail', email);
        // Redirect to the signup/registration page to create a new account
        window.location.href = '/signup-login.html';
      }
      
    } catch (err) {
      // If any error occurs during the email check (network issue, server error, etc.)
      console.error('Email check error:', err); // Log the error for debugging purposes
      alert('Server error. Please try again later.'); // Inform the user something went wrong
    }
  });
});
