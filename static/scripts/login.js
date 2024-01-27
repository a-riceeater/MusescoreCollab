document.body.addEventListener("keydown", (e) => {
    setTimeout(() => {
        const email = document.querySelector('#emailInput').value.trim();
        const password = document.querySelector('#passwordInput').value.trim();
        const button = document.querySelector("#login-btn");

        if (!email || !password) {
            button.style.opacity = 0.7;
            button.style.cursor = "not-allowed"
        } else {
            button.style.opacity = 1;
            button.style.cursor = "pointer"
        }
    })
})