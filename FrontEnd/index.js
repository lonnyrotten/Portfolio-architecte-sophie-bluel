const projectGallery = document.querySelector(".portfolio-gallery");
const projectsInGallery = projectGallery.querySelectorAll("figure");
const boutonTous = document.getElementsByClassName("btn-tous");
const hiddenGallery = document.querySelector(".trash-div");
const userToken = sessionStorage.getItem("sessionUserInfo");

async function getWorks() {
    const url = "http://localhost:5678/api/works" ;
    try {
        const data = await fetch(url);
        return await data.json();
    }catch(err) {
        console.error(err)
    }
}

async function getCategories() {
    const url = "http://localhost:5678/api/categories";
    try {
        const data = await fetch(url);
        return await data.json();
    }catch(err) {
        console.error(err)
    }
}

// Fonction qui génère les éléments grâce à l'API
async function generateGallery(){
    const works = await getWorks();
    hiddenGallery.append(...projectGallery.childNodes);
    works.forEach(project => {
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

function filterButton (property, value){
    projectGallery.querySelectorAll("figure").forEach ((project) => {
        if (project.getAttribute(property) === value) {
            projectGallery.appendChild(project);
        } else {
            hiddenGallery.appendChild(project);
        }
    })
    hiddenGallery.querySelectorAll("figure").forEach ((project) => {
        if (project.getAttribute(property) === value) {
            projectGallery.appendChild(project);
        } else {
            hiddenGallery.appendChild(project);
        }
    })
}

async function generateBtnsFiltres(){
    const categories = await getCategories();
    categories.forEach(category => {
        const filterBox = document.querySelector(".buttons");
        const filtre = document.createElement("button");
        filtre.innerText = category.name;
        filtre.setAttribute("id","btn-" + category.name.toLowerCase().split(" ")[0])
        filterBox.appendChild(filtre);
        })
    const boutonObjets = document.getElementById("btn-objets");
    const boutonAppartements = document.getElementById("btn-appartements");
    const boutonHotels = document.getElementById("btn-hotels");
    boutonObjets.onclick = function(){ 
        filterButton("data-category", "1"); 
    };
    boutonAppartements.onclick = function(){ 
        filterButton("data-category", "2"); 
    };
    boutonHotels.onclick = function(){ 
        filterButton("data-category", "3"); 
    };
}

generateGallery();
boutonTous[0].onclick = function(){
    filterButton("class", "project");
};
generateBtnsFiltres();

function generateEditingHeader (){
    const editBar = document.getElementsByClassName(".user-edit-bar");
    const editingMode = document.createElement("p");
    const editConfirmBtn = document.createElement("button");
    editingMode.innerHTML =  '<i class="fa-regular fa-pen-to-square" style="color: #ffff;"></i>Mode édition';
    editConfirmBtn.innerHTML = "Publier les changements";
    editConfirmBtn.setAttribute("class", "btn-confirm-edit");
    editBar.style.display = "flex";
    editBar.appendChild(editingMode);
    editBar.appendChild(editConfirmBtn);
    
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
    const modalWindow = document.querySelector(".modal-window");
    const openModal = document.querySelector(".modal-link");
    const closeModal = document.querySelector(".close-modal");
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
    const modal1 = document.querySelector(".modal-wrapper");
    const modal2 = document.querySelector(".modal-wrapper2");
    const switchModal = document.querySelector(".add-photos-btn");
    switchModal.onclick = function (){
        modal1.style.display = "none"
        modal2.style.display = "flex"
    }
    }