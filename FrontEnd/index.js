const userToken = sessionStorage.getItem("sessionUserInfo");

async function getWorks() {
    try {
        const res = await fetch("http://localhost:5678/api/works");
        if (res.ok) {
            const data = await res.json();
            works = data;
            console.log(works);
            generateGallery(works);
        } else {
            throw new Error("Didn't fetch projects.")
        }
    }catch(err) {
        console.error(err)
    }
}

async function getCategories() {
    try {
        const res = await fetch("http://localhost:5678/api/categories");
        if (res.ok) {
            const data = await res.json();
            categories = data;
            console.log(categories);
            generateBtnsFiltres(categories);
        } else {
            throw new Error("Didn't fetch categories.")
        }
    }catch(err) {
        console.error(err)
    }
}

getWorks();
getCategories();


// Fonction qui génère les éléments grâce à l'API
function generateGallery(projects){
    // Commande qui supprime les éléments insérés par le fichier HTML
    document.querySelector(".gallery").innerHTML = "";
    projects.forEach(project => {
        // Commande qui sélectionne la balise HTML qui recevra les projets de l'architecte
        const projectGallery = document.querySelector(".gallery");
        // Commandes qui génère les balises HTML qui constitue les projets de l'architecte dans le DOM
        const projectElement = document.createElement("figure");
        const imageProject = document.createElement("img");
        imageProject.src = project.imageUrl;
        const projectCaption = document.createElement("figcaption");
        projectCaption.innerText = project.title;
        projectElement.setAttribute("class", "project")
        projectElement.setAttribute("data-category", project.categoryId)
        // Commandes qui rattache les images et les légendes dans l'API aux balises HTML
        projectElement.appendChild(imageProject);
        projectElement.appendChild(projectCaption);
        // Commande qui rattache les projets à la balise HTML qui doit les contenir
        projectGallery.appendChild(projectElement);
    })
}

function generateBtnsFiltres(){
    categories.forEach(category => {
        const filterBox = document.querySelector(".buttons");
        const filtre = document.createElement("button");
        filtre.innerText = category.name;
        filtre.setAttribute("id","btn-" + category.name.toLowerCase().split(" ")[0])
        filterBox.appendChild(filtre);
        filtre.addEventListener("click", () => {
            document.querySelector("button").style.backgroundColor = "#1D6154"
            const filteredProjects = works.filter(work => work.categoryId === category.id);
            console.log(filteredProjects);
            genererGallery(filteredProjects);
        })
        })
}

function generateEditingHeader (){
    const editBar = document.querySelector(".user-edit-bar");
    const editModal = document.createElement("a");
    const editBtnConfirm = document.createElement("button");
    editModal.innerHTML =  '<i class="fa-regular fa-pen-to-square" style="color: #ffff;"></i>Mode édition';
    editBtnConfirm.innerHTML = "Publier les changements";
    editBtnConfirm.setAttribute("class", "btn-confirm-edit");
    editBar.appendChild(editModal);
    editBar.appendChild(editBtnConfirm);
    editBar.style.display = "flex"
}

function generateEditLinks (){
    const modalAltBox = document.querySelector(".modal-alt");
    const modalAltBox2 = document.querySelector(".modal-alt2");
    const editModalAlt = document.createElement("a");
    editModalAlt.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>Modifier';
    modalAltBox.appendChild(editModalAlt);
    modalAltBox2.appendChild(editModalAlt);
}

function logout (){
    sessionStorage.removeItem(userToken);
}

function logoutLink (){
    const logLink = document.getElementById("login/logout");
    logLink.innerHTML = "logout";
    logLink.addEventListener("click", logout());
}

function loadEditingMode() {
    const filterBox = document.querySelector(".buttons");
    filterBox.style.display = "none";

    generateEditingHeader();
    generateEditLinks();
    logoutLink();
}

if (userToken) {
    loadEditingMode();
    }