const loginBox = document.querySelector("#login_box");
async function loginSubmit(event) {
    event.preventDefault();
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
        if (response.ok) {
            return response.json();
        } else if (response.status !== 200 && (!email || !password)) {
            document.querySelector(".error-message").innerHTML = "Saisissez un identifiant et un mot de passe.";
        } else if (response.status !== 200 && email && password) {
            console.log("error");
            document.querySelector(".error-message").innerHTML = "Erreur dans l'identifiant ou le mot de passe."
        }
    })
    .then((userInfo) => {
        sessionStorage.setItem("sessionUserInfo", JSON.stringify(userInfo.token));
        window.location.href="index.html";
    })
}
loginBox.addEventListener("submit", loginSubmit);