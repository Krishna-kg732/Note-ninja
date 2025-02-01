document.getElementById('loginForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log('Login Attempt:', email, password);
    // Redirect to Dashboard
    window.location.href = 'dashboard.html';
  });
  
  // Sign Up Form Submission
  document.getElementById('signupForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log('Sign Up:', name, email, password);
    // Redirect to Login
    window.location.href = 'index.html';
  });
  
  // Account Recovery Form Submission
  document.getElementById('recoveryForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    console.log('Recovery Attempt:', email);
    alert('Recovery instructions sent to your email.');
  });
  
  // Logout Button
  document.getElementById('logoutBtn')?.addEventListener('click', function () {
    window.location.href = 'index.html';
  });
  
  // Add Meeting Button
  document.getElementById('addMeetingBtn')?.addEventListener('click', function () {
    const meetingList = document.getElementById('meetingList');
    const newMeeting = document.createElement('li');
    newMeeting.textContent = `Meeting ${meetingList.children.length + 1}`;
    meetingList.appendChild(newMeeting);
  });