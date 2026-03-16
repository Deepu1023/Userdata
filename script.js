document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('span');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Visual feedback — loading state
        const originalText = btnText.innerText;
        setButtonState(submitBtn, btnText, 'Processing...', 'var(--primary-green)', '#000', true);

        // Collect form data
        const formData = new FormData(form);
        const dataPayload = Object.fromEntries(formData.entries());

        // Use a relative URL for the API.
        // This automatically works regardless of how the page was loaded
        // (localhost, local Wi-Fi IP, or global internet tunnel).
        const backendURL = '/register';

        try {
            const response = await fetch(backendURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataPayload)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || `Server error (${response.status})`);
            }

            // ✅ Success
            form.reset();
            setButtonState(submitBtn, btnText, 'Registered Successfully! ✓', '#fff', '#00ff88', false);
            setTimeout(() => resetButton(submitBtn, btnText, originalText), 3000);

        } catch (error) {
            console.error('Registration error:', error.message);

            // Check if it's a network/connection error
            const isNetworkError = error.message === 'Failed to fetch' || error.name === 'TypeError';
            const displayMsg = isNetworkError
                ? 'Cannot reach server. Open via http://[PC-IP]:5000'
                : (error.message || 'Registration failed!');

            setButtonState(submitBtn, btnText, displayMsg, '#ff4444', '#fff', false);
            setTimeout(() => resetButton(submitBtn, btnText, originalText), 4000);
        }
    });
});

// ---- Helpers ----
function setButtonState(btn, textEl, label, bg, color, disabled) {
    textEl.innerText = label;
    btn.style.background = bg;
    btn.style.color = color;
    btn.style.opacity = disabled ? '0.8' : '1';
    btn.style.pointerEvents = disabled ? 'none' : 'auto';
    btn.style.transition = 'background 0.3s ease, color 0.3s ease';
}

function resetButton(btn, textEl, originalText) {
    setButtonState(btn, textEl, originalText, 'var(--primary-green)', '#000', false);
}
