const projectGallery = document.getElementsByClassName("portfolio-gallery")[0];
const projectsInGallery = projectGallery.querySelectorAll("figure");
const boutonTous = document.getElementsByClassName("btn-tous")[0];
const hiddenGallery = document.getElementsByClassName("trash-div")[0];
const modalGallery = document.getElementsByClassName("modal-body")[0];
const userToken = sessionStorage.getItem("sessionUserInfo");
const loginLink = document.getElementById("login");
const logoutLink = document.getElementById("logout");

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
            deleteProjectBtn.onclick = function deleteWork(){
                const modalProjectId = figure.id
                if (deleteProjectBtn.id === modalProjectId){
                    fetch(`http://localhost:5678/api/works/${modalProjectId}`, {
                        method: 'DELETE',
                        headers : {'Authorization': `Bearer ${userToken}`
                        }
                    }
                    )
                    .then(projectDeleted => {
                        if (projectDeleted.ok){
                            const projectToDelete = document.getElementById(modalProjectId);
                            figure.remove();
                            projectToDelete.remove();
                            hiddenGallery.append(...modalGallery.childNodes);
                            generateGallery();
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
    const modalLinkBox = document.getElementsByClassName("open-modal-link");
    [...modalLinkBox].forEach((box) => {
	    const modalLink = document.createElement("a");
	    modalLink.classList.add("modal-link");
	    modalLink.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>modifier';
	    box.appendChild(modalLink);
});
}

function logoutBtn (){
    logoutLink.addEventListener("click", () => {
        sessionStorage.removeItem("sessionUserInfo");
        window.location.reload;
    });
}

function loadEditingMode (){
    const filterBox = document.querySelector(".buttons");
    filterBox.style.display = "none";
    generateEditingHeader();
    generateEditLinks();
    logoutBtn();
}

function loadModal (){
    const modalWindow = document.getElementsByClassName("modal-window")[0];
    const openModal = document.getElementsByClassName("modal-link");
    const closeModal = document.getElementsByClassName("close-modal");
    [...openModal].forEach((link) => {
	link.addEventListener("click", () => {
	        modalWindow.style.display = "flex";
	    })
    });
    [...closeModal].forEach((link) => {
        link.addEventListener("click", () => {
                modalWindow.style.display = "none";
            })
        });
    window.onclick = function(event) {
        if (event.target == modalWindow) {
            modalWindow.style.display = "none";
        }
        }
}

function createNewProject (data){
    const newProjectElement = document.createElement("figure");
    const imageNewProject = document.createElement("img");
    imageNewProject.src = data.imageUrl;
    const newProjectCaption = document.createElement("figcaption");
    newProjectCaption.innerText = data.title;
    newProjectElement.setAttribute("class", "project")
    newProjectElement.setAttribute("id", data.id);
    newProjectElement.setAttribute("data-category", data.categoryId)
    newProjectElement.appendChild(imageNewProject);
    newProjectElement.appendChild(newProjectCaption);
    projectGallery.appendChild(newProjectElement);
}


if (userToken) {
    loginLink.style.display = "none";
    logoutLink.style.display = "block";
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
    document.getElementById("new-project-file").onchange = (photoupload) => {
        const newProjectImage = document.getElementById("new-project-file").files[0];
        if (newProjectImage){
            const defaultPhoto = document.getElementById("default-photo");
            const newProjectText = document.getElementById("file-upload-text");
            const newProjectImageSize = document.getElementById("file-upload-max-size");
            newProjectText.style.display = "none";
            newProjectImageSize.style.display = "none";
            defaultPhoto.src = URL.createObjectURL(newProjectImage);
        }
    }
    document.getElementsByClassName("new-project")[0].addEventListener("submit", function (event){
        event.preventDefault();
        const newProjectImage = document.getElementById("new-project-file").files[0];
        const newProjectTitle = document.getElementById("photo-title-input").value;
        const newProjectCategory = document.getElementById("category-dropd").value;
        if (!newProjectImage || !newProjectTitle || !newProjectCategory){
            const newProjectError = document.getElementsByClassName("form-error-message")[0];
            newProjectError.textContent = "Veuillez remplir tous les champs!"
            return false
        } else if (newProjectImage && newProjectTitle && newProjectCategory){
            const newProject = document.getElementsByClassName("new-project")[0];
            const newProjectSubmit = document.getElementsByClassName("add-photos-confirm")[0];
            newProjectSubmit.style.backgroundColor = "#1D6154"
            newProjectSubmit.style.color = "white"
            newProjectSubmit.onclick = (event) => {
                newProject.submit(event);
            }
            const newProjectData = new FormData(newProject);
            fetch("http://localhost:5678/api/works", {
                method: 'POST',
                body: newProjectData,
                headers: {
                    "accept": "application/json",
                    "Authorization": `Bearer ${userToken}`
                }
            })
            .then(data => {
            createNewProject(data.json())
            hiddenGallery.append(...modalGallery.childNodes);
            generateGallery();
            })
        }
        return false
    })
}
