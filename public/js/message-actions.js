'use strict'

// This script handles the asynchronous archiving of a message from the message-view page.

document.addEventListener('DOMContentLoaded', () => {
  const archiveForm = document.querySelector('#archiveForm');
  if (archiveForm) {
    archiveForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent the default form submission

      const form = event.target;
      const url = form.action;

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (data.status === 'ok' && data.redirect) {
          window.location.href = data.redirect; // Redirect to the inbox/archive with a flash message
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  }
});