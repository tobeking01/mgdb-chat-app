document.getElementById('login-btn').onclick = () => {
    const email = document.getElementById('email-input')?.value;
  
    if (email) {
      fetch('/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }).then(result => {
        if (result.ok) {
          sessionStorage.setItem("chat_email", email); // 🔐 Store email
          window.location.href = '/chat-page.html';
        } else {
          alert('Invalid credentials');
        }
      }).catch(() => alert('Login error'));
    }
  }  