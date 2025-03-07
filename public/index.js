const getCurrentUser = async () => {
    const response = await fetch('current-user');
    return response.json();
}
getCurrentUser()
.then(currentUser => {
    document.getElementById('username').innerText = `Welcome ${currentUser.username}`;
});