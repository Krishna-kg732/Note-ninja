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
    
    window.location.href = 'index.html';
  });
  
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
  document.getElementById('loginForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        window.location.href = 'dashboard.html'; // Redirect to dashboard
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });

  async function fetchMeetings() {
    try {
      const response = await fetch('http://localhost:5000/api/meetings');
      const data = await response.json();
      const meetingList = document.getElementById('meetingList');
  
      if (response.ok) {
        meetingList.innerHTML = data
          .map((meeting) => `<li>${meeting.title} - ${meeting.date}</li>`)
          .join('');
      } else {
        console.error('Failed to fetch meetings');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  fetchMeetings();
  const API_BASE_URL = 'http://mom-app-env.eba-8mrfd8ia.ap-south-1.elasticbeanstalk.com/'; // Replace with your Elastic Beanstalk URL

document.getElementById('loginForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      window.location.href = 'dashboard.html'; // Redirect to dashboard
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});