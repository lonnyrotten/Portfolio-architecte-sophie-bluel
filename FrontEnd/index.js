const projectGallery = document.getElementsByClassName("portfolio-gallery")[0];
const projectsInGallery = projectGallery.querySelectorAll("figure");
const boutonTous = document.getElementsByClassName("btn-tous")[0];
const hiddenGallery = document.getElementsByClassName("trash-div")[0];
const modalGallery = document.getElementsByClassName("modal-body")[0];
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

    function generateModalGallery (){
        const clonedGallery = projectGallery.cloneNode(true);
        clonedGallery.classList.remove("portfolio-gallery");
        clonedGallery.classList.add("modal-gallery")
        const modalProjects = clonedGallery.querySelectorAll("figure");
        modalProjects.forEach(figure => {
            figure.classList.remove("project");
            figure.classList.add("modal-project");
            const modalProjectCaptions = figure.querySelector("figcaption");
	        modalProjectCaptions.textContent = "éditer";
        });
        modalProjects.forEach(figure => {
            const moveProjectBtn = document.createElement("button");
            const deleteProjectBtn = document.createElement("button");
            moveProjectBtn.innerHTML = '<i class="fa-solid fa-arrows-up-down-left-right"></i>';
            deleteProjectBtn.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
            moveProjectBtn.classList.add("move-button");
            deleteProjectBtn.classList.add("delete-button");
	        deleteProjectBtn.setAttribute("id", figure.id);
	        figure.appendChild(moveProjectBtn);
	        figure.appendChild(deleteProjectBtn);
            deleteProjectBtn.onclick = async () => {
                const projectId = figure.id
                if (deleteProjectBtn.id === projectId){
                    console.log(userToken);
                    fetch(`http://localhost:5678/api/works/${projectId}`, {
                        method: 'DELETE',
                        headers : {"Authorization": `Bearer ${userToken}`
                        }
                    }
                    )
                    .then(res => {
                        if (res.ok){
                            figure.remove();
                        }
                    })
                }
            }
        });
        modalGallery.appendChild(clonedGallery);
        
    }
    generateModalGallery();
}

function filterButton (attribute, value){
    projectGallery.querySelectorAll("figure").forEach ((project) => {
        if (project.getAttribute(attribute) === value) {
            projectGallery.appendChild(project);
        } else {
            hiddenGallery.appendChild(project);
        }
    })
    hiddenGallery.querySelectorAll("figure").forEach ((project) => {
        if (project.getAttribute(attribute) === value) {
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

boutonTous.onclick = function(){
    filterButton("class", "project");
};

generateBtnsFiltres();

function generateEditingHeader (){
    const editBar = document.getElementsByClassName("user-edit-bar")[0];
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

function loadModal (){
    const modalWindow = document.getElementsByClassName("modal-window")[0];
    const openModal = document.getElementsByClassName("modal-link")[0];
    const closeModal = document.getElementsByClassName("close-modal")[0];
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
    const modal1 = document.getElementsByClassName("modal-wrapper")[0];
    const modal2 = document.getElementsByClassName("modal-wrapper2")[0];
    const switchModal = document.getElementsByClassName("add-photos-btn")[0];
    switchModal.onclick = () => {
        modal1.style.display = "none"
        modal2.style.display = "flex"
    }
    const backArrow = document.getElementsByClassName("back")[0];
    backArrow.onclick = () => {
        modal2.style.display = "none"
        modal1.style.display = "block"
    }
}
