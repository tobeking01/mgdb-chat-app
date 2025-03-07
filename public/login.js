document.getElementById('login-btn').onclick = () => {
    const email = document.getElementById('email-input')?.value;

    if (email) {
        console.log(`Going to login with email ${email}...`);
        fetch('/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email: email}),
        }).then(result => {
            console.log('Sign in successfully');
            window.location.href='/';
        })
        .catch(err => {
            console.log('Invalid credential');
        })
    }
}