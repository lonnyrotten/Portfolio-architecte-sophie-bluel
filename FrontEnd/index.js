// Fonction qui génère les éléments grâce à l'API
function genererGallery(){
    // Commande qui supprime les éléments insérés par le fichier HTML
    document.querySelector(".gallery").innerHTML = "";
    for (let i = 0; i < works.length; i++){
    // Commande qui sélectionne la balise HTML qui recevra les projets de l'architecte
    const workGallery = document.querySelector(".gallery");
    // Commandes qui génère les balises HTML qui constitue les projets de l'architecte dans le DOM
    const workElement = document.createElement("figure");
    const imageWork = document.createElement("img");
    imageWork.src = works[i].imageUrl;
    const workCaption = document.createElement("figcaption");
    workCaption.innerText = works[i].title;
    // Commandes qui rattache les images et les légendes dans l'API aux balises HTML
    workElement.appendChild(imageWork);
    workElement.appendChild(workCaption);
    // Commande qui rattache les projets à la balise HTML qui doit les contenir
    workGallery.appendChild(workElement);
    }
}
// Récupération des projets depuis l'API
fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then((data) => {
        works = data;
        genererGallery(works);
    });

fetch('http://localhost:5678/api/categories')
    .then(response => response.json())
    .then((data) => {
        worksCategories = data;
        
    });