// update.js

document.addEventListener('DOMContentLoaded', () => {
    const updateForm = document.getElementById('updateForm');

    updateForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const userId = window.location.pathname.split('/').pop();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`/update/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            if (response.ok) {
                window.location.href = '/users';
            } else {
                console.error('Error updating user:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    });
});
