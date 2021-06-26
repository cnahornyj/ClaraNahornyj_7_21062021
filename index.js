async function getData() {
  let url = "recipes.json";
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

let firstResearch = document.getElementById("first-research");

let listIngredients = document.querySelector("input[list=ingredients]");
let optionsIngredients = document.querySelector("#ingredients");
let listUstensils = document.querySelector("#listOfUstensils");
let optionsUstensils = document.querySelector("#ustensiles");
let listAppliances = document.querySelector("#listOfAppliances");
let optionsAppliances = document.querySelector("#appareils");

let listRecipes = document.querySelector("#recipes");

async function renderRecipes() {
  let recipes = await getData();
  let recettes = recipes;
  let results = [];
  let ingredients = [];
  let appareils = [];
  let ustensiles = [];

  function updateTheDropDownLists(object) {
    /* Mettre dans un tableau initialement vide 
    chaque ingrédient de chaque recette */
    for (let i = 0; i < object.length; i++) {
      for (let j = 0; j < object[i].ingredients.length; j++) {
        let food = object[i].ingredients[j].ingredient;
        ingredients.push(food);
      }
    }
    /* Initialiser un ensemble Set avec le tableau de strings au constructeur 
    pour supprimer les ingrédients en doublons */
    ingredients = [...new Set(ingredients)];
    for (let i = 0; i < object.length; i++) {
      for (let j = 0; j < object[i].ustensils.length; j++) {
        let kitchen = object[i].ustensils[j];
        ustensiles.push(kitchen);
      }
    }
    ustensiles = [...new Set(ustensiles)];
    for (let i = 0; i < object.length; i++) {
      let outil = object[i].appliance;
      appareils.push(outil);
    }
    appareils = [...new Set(appareils)];

    // Ajouter les options et leurs valeurs aux différentes datalists
    for (let i = 0; i < ingredients.length; i++) {
      let option = document.createElement("option");
      option.setAttribute("value", `${ingredients[i]}`);
      optionsIngredients.appendChild(option);
    }
    for (let i = 0; i < ustensiles.length; i++) {
      let option = document.createElement("option");
      option.setAttribute("value", `${ustensiles[i]}`);
      optionsUstensils.appendChild(option);
    }
    for (let i = 0; i < appareils.length; i++) {
      let option = document.createElement("option");
      option.setAttribute("value", `${appareils[i]}`);
      optionsAppliances.appendChild(option);
    }
  }

  /* Les liste déroulantes doivent être initialisés avec tous les éléments
  de toutes les recettes ;*/
  updateTheDropDownLists(recettes);

  function createView(objects) {
    // Pour chaque recette création des éléments DOM
    for (const object of objects) {
      let card = document.createElement("div");
      let image = document.createElement("img");
      let cardBody = document.createElement("div");
      let row = document.createElement("div");
      let name = document.createElement("p");
      let time = document.createElement("p");
      let row1 = document.createElement("div");
      let ingredients = document.createElement("ul");
      let description = document.createElement("p");

      listRecipes.appendChild(card);
      card.appendChild(image);
      card.appendChild(cardBody);
      cardBody.appendChild(row);
      row.appendChild(name);
      row.appendChild(time);
      cardBody.appendChild(row1);
      row1.appendChild(ingredients);

      for (let i = 0; i < object.ingredients.length; i++) {
        let ingredient = document.createElement("li");
        ingredients.appendChild(ingredient);
        ingredients.setAttribute("class", "col-lg-5 ingredients");
        if (
          Object.prototype.hasOwnProperty.call(
            object.ingredients[i],
            "quantity"
          ) &&
          Object.prototype.hasOwnProperty.call(object.ingredients[i], "unit")
        ) {
          ingredient.innerText = `${object.ingredients[i].ingredient} : ${object.ingredients[i].quantity} ${object.ingredients[i].unit}`;
        } else if (
          Object.prototype.hasOwnProperty.call(
            object.ingredients[i],
            "quantity"
          )
        ) {
          ingredient.innerText = `${object.ingredients[i].ingredient} : ${object.ingredients[i].quantity}`;
        } else {
          ingredient.innerText = `${object.ingredients[i].ingredient}`;
        }
      }
      row1.appendChild(description);

      image.setAttribute("class", "card-img-top");
      image.setAttribute("src", "fond-gris.png");
      name.textContent = `${object.name}`;
      time.innerHTML = `<i class="fa fa-clock-o" aria-hidden="true"></i> ${object.time} min`;
      description.textContent = `${object.description}`;
      card.setAttribute("class", "col-sm-12 col-md-6 col-lg-4");
      cardBody.setAttribute("class", "card-body background");
      row.setAttribute("class", "row");
      name.setAttribute("class", "col-lg-9");
      time.setAttribute("class", "col-lg-3");
      row1.setAttribute("class", "row");
      description.setAttribute("class", "col-lg-7 description");
    }
  }

  function applyFilter(value) {
    // Gérer la sensibilité à la casse
    let firstMinCharacter = value[0].toUpperCase() + value.slice(1);
    let firstMajCharacter = value[0].toLowerCase() + value.slice(1);
    console.log(value);

    for (let i = 0; i < recettes.length; i++) {
      if (
        recettes[i].name.includes(value) ||
        recettes[i].appliance.includes(value)
      ) {
        results.push(recettes[i]);
      }
      for (let j = 0; j < recettes[i].ingredients.length; j++) {
        if (recettes[i].ingredients[j].ingredient.includes(value)) {
          results.push(recettes[i]);
        }
        for (let k = 0; k < recettes[i].ustensils.length; k++) {
          if (recettes[i].ustensils[k].includes(value)) {
            results.push(recettes[i]);
          }
        }
      }
    }

    let uniquerecettes = [...new Set(results)];
    console.log(uniquerecettes);
    /* Lorsque le tri est effectué il faut vider les listes déroulantes 
    et les mettre à jour avec les ingrédients, ustensiles, appareils des recettes restantes */
    optionsIngredients.innerHTML = "";
    optionsUstensils.innerHTML = "";
    optionsAppliances.innerHTML = "";
    ingredients = [];
    appareils = [];
    ustensiles = [];
    updateTheDropDownLists(uniquerecettes);
    createView(uniquerecettes);
  }

  firstResearch.addEventListener("input", function () {
    // Exécution de la fonction à chaque saisie de caractère
    if (firstResearch.value.length >= 3) {
      listRecipes.innerHTML = "";
      results = [];
      applyFilter(firstResearch.value);
    } else {
      listRecipes.innerHTML = "";
      results = [];
    }
  });
}

renderRecipes();
