document.getElementById('subscribeForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = '';
  
    const data = {
      email: this.email.value,
      city: this.city.value,
      frequency: this.frequency.value
    };
  
    try {
      const apiBase = document.querySelector('meta[name="api-base"]').content;
      const res     = await fetch(`${apiBase}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
  
      if (res.ok) {
        messageDiv.style.color = 'green';
        messageDiv.textContent = '✅ ' + (result.message || 'Please check your email to confirm.');
      } else {
        messageDiv.style.color = 'red';
        const errMsg = result.errors
          ? result.errors.map(e => e.msg).join(', ')
          : (result.message || 'Subscription failed.');
        messageDiv.textContent = '❌ ' + errMsg;
      }
    } catch (err) {
      messageDiv.style.color = 'red';
      messageDiv.textContent = '❌ Error: ' + err.message;
    }
  });
  