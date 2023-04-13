const loginBox = document.querySelector("#login_box");
async function loginSubmit(event) {
    // Variables qui contiennent les valeurs rentrées dans le formulaire de connexion de la page.
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    // Envoi par fetch vers l'API des valeurs rentrées dans le formulaire
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" 
    },
        body: JSON.stringify({
            "email": email,
            "password": password
        })
    })
    .then ((response) => {
        if (response.status === 200) {
            result = response.json();
            localStorage.setItem("sessionToken", result.token);
            console.log("sessionToken");
            window.location.href="index.html";
        } else if (response.status !== 200) {
            console.log("error");
        }
    })
}
loginBox.addEventListener("submit", loginSubmit());