// ============================================================
// SUPABASE CONFIG — Replace these two values with your own
// from: Supabase Dashboard → Your Project → Settings → API
// ============================================================
const SUPABASE_URL = 'YOUR_SUPABASE_URL';       // e.g. https://abcdefgh.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // e.g. eyJhbGci...

// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('span');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate config
        if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY') {
            alert('Please add your Supabase credentials to script.js before using the form.');
            return;
        }

        // Visual feedback — show loading state
        const originalText = btnText.innerText;
        btnText.innerText = 'Processing...';
        submitBtn.style.opacity = '0.8';
        submitBtn.style.pointerEvents = 'none';

        // Collect form data
        const formData = new FormData(form);
        const dataPayload = {
            first_name:    formData.get('firstName'),
            last_name:     formData.get('lastName'),
            age:           parseInt(formData.get('age'), 10),
            gender:        formData.get('gender'),
            mobile_number: formData.get('mobileNumber'),
            email_id:      formData.get('emailId'),
            nationality:   formData.get('nationality')
        };

        try {
            // POST directly to Supabase REST API (no backend server needed)
            const response = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
                method: 'POST',
                headers: {
                    'Content-Type':  'application/json',
                    'apikey':        SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Prefer':        'return=minimal'
                },
                body: JSON.stringify(dataPayload)
            });

            if (!response.ok) {
                // Try to extract a useful error message from Supabase
                const errData = await response.json().catch(() => ({}));
                const message = errData.message || errData.details || `HTTP ${response.status}`;

                // Handle duplicate email gracefully
                if (response.status === 409 || (message && message.toLowerCase().includes('duplicate'))) {
                    throw new Error('This email is already registered.');
                }
                throw new Error(message);
            }

            // ✅ SUCCESS
            form.reset();
            setButtonState(submitBtn, btnText, 'Registration Successful! ✓', '#00ff88', '#000', false);

            // Reset button after 3 seconds
            setTimeout(() => resetButton(submitBtn, btnText, originalText), 3000);

        } catch (error) {
            console.error('Registration error:', error.message);

            // ❌ ERROR — show message
            setButtonState(submitBtn, btnText, error.message || 'Failed to register!', '#ff4444', '#fff', false);

            setTimeout(() => resetButton(submitBtn, btnText, originalText), 3000);
        }
    });
});

// ---- Helper Functions ----

function setButtonState(btn, textEl, label, bg, color, disabled) {
    textEl.innerText = label;
    btn.style.background = bg;
    btn.style.color = color;
    btn.style.opacity = disabled ? '0.8' : '1';
    btn.style.pointerEvents = disabled ? 'none' : 'auto';
}

function resetButton(btn, textEl, originalText) {
    setButtonState(btn, textEl, originalText, 'var(--primary-green)', '#000', false);
}
