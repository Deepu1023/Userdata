document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('span');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Visual feedback
        const originalText = btnText.innerText;
        btnText.innerText = 'Processing...';
        submitBtn.style.opacity = '0.8';
        submitBtn.style.pointerEvents = 'none';

        // Send data to the local backend using Fetch API
        const formData = new FormData(form);
        const dataPayload = Object.fromEntries(formData.entries());

        fetch('http://127.0.0.1:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataPayload)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errData => { throw new Error(errData.message); });
                }
                return response.json();
            })
            .then(data => {
                // Success State
                btnText.innerText = 'Registration Successful!';
                submitBtn.style.background = '#fff';
                submitBtn.style.color = '#00ff88';

                // Reset form
                setTimeout(() => {
                    form.reset();
                    btnText.innerText = originalText;
                    submitBtn.style.background = 'var(--primary-green)';
                    submitBtn.style.color = '#000';
                    submitBtn.style.opacity = '1';
                    submitBtn.style.pointerEvents = 'auto';
                }, 3000);
            })
            .catch(error => {
                // Error State
                console.error('Error:', error);
                btnText.innerText = 'Failed to register!';
                submitBtn.style.background = '#ff4444'; // Red error color
                submitBtn.style.color = '#fff';

                // Reset styling
                setTimeout(() => {
                    btnText.innerText = originalText;
                    submitBtn.style.background = 'var(--primary-green)';
                    submitBtn.style.color = '#000';
                    submitBtn.style.opacity = '1';
                    submitBtn.style.pointerEvents = 'auto';
                }, 3000);
            });
    });
});
