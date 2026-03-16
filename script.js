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

        // Simulate network request
        setTimeout(() => {
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
        }, 2000);
    });
});
