const userToken = sessionStorage.getItem("sessionUserInfo");

async function getWorks() {
    try {
        const res = await fetch("http://localhost:5678/api/works");
        if (res.ok) {
            const data = await res.json();
            works = data;
            console.log(works);
            generateGallery(works);
            generateModalGallery(works);
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
document.querySelector(".btn-tous").onclick = () => {
    getWorks();
}
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
        projectElement.setAttribute("id", project.id);
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
        filtre.onclick = () => {
            document.querySelector("button").style.backgroundColor = "#1D6154"
            const filteredProjects = works.filter(work => work.categoryId === category.id);
            console.log(filteredProjects);
            generateGallery(filteredProjects);
        }
        })
}

function generateEditingHeader (){
    const editBar = document.querySelector(".user-edit-bar");
    const editingMode = document.createElement("p");
    const editConfirmBtn = document.createElement("button");
    editingMode.innerHTML =  '<i class="fa-regular fa-pen-to-square" style="color: #ffff;"></i>Mode édition';
    editConfirmBtn.innerHTML = "Publier les changements";
    editConfirmBtn.setAttribute("class", "btn-confirm-edit");
    editBar.appendChild(editingMode);
    editBar.appendChild(editConfirmBtn);
    editBar.style.display = "flex"
}

function generateEditLinks (){
    const modalLinkBox = document.querySelector(".open-modal-link");
    const modalLink = document.createElement("a");
    modalLink.setAttribute("class","modal-link");
    modalLink.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>modifier';
    modalLinkBox.appendChild(modalLink);
}

function logout (){
    sessionStorage.removeItem(userToken);
    window.location.reload;
}

function logoutLink (){
    const logLink = document.getElementById("login/logout");
    logLink.innerHTML = "logout";
    logLink.addEventListener("click", logout());
}

function loadEditingMode (){
    const filterBox = document.querySelector(".buttons");
    filterBox.style.display = "none";

    generateEditingHeader();
    generateEditLinks();
    logoutLink();
}

function generateModalGallery(projects){
    projects.forEach(project => {
        const modalGallery = document.querySelector(".modal-gallery");
        const modalProjectElement = document.createElement("figure");
        const imageProjectModal = document.createElement("img");
        imageProjectModal.src = project.imageUrl;
        const moveProjectBtn = document.createElement("button");
        const deleteProjectBtn = document.createElement("button");
        const modalProjectCaption = document.createElement("figcaption");
        moveProjectBtn.innerHTML = '<i class="fa-solid fa-arrows-up-down-left-right"></i>';
        deleteProjectBtn.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
        modalProjectCaption.innerText = "éditer";
        modalProjectElement.setAttribute("class", "modal-project");
        modalProjectElement.setAttribute("id", project.id);
        modalProjectElement.setAttribute("data-category", project.categoryId);
        moveProjectBtn.setAttribute("class", "move-button");
        deleteProjectBtn.setAttribute("class", "delete-button");
        modalProjectElement.appendChild(moveProjectBtn);
        modalProjectElement.appendChild(deleteProjectBtn);
        modalProjectElement.appendChild(imageProjectModal);
        modalProjectElement.appendChild(modalProjectCaption);
        modalGallery.appendChild(modalProjectElement);
    })
}

function loadModal (){
    const modalWindow = document.querySelector(".modal-window")
    const openModal = document.querySelector(".modal-link");
    const closeModal = document.querySelector(".close-modal")
    openModal.onclick = () => {
        modalWindow.style.display = "flex";
    }
    closeModal.onclick = () => {
        modalWindow.style.display = "none";
    }
}

if (userToken) {
    loadEditingMode();
    loadModal();
    }