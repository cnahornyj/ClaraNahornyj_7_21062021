async function getData() {
  let url = "recipes.json";
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

window.onbeforeunload = function () {
  localStorage.clear();
}

let firstResearch = document.getElementById("first-research");

let listIngredients = document.querySelector("input[list=ingredients]");
let optionsIngredients = document.querySelector("#ingredients");
let listUstensils = document.querySelector("input[list=ustensiles]");
let optionsUstensils = document.querySelector("#ustensiles");
let listAppliances = document.querySelector("input[list=appareils]");
let optionsAppliances = document.querySelector("#appareils");
console.log(
  optionsIngredients.options,
  optionsUstensils.options,
  optionsAppliances.options
);

let listRecipes = document.querySelector("#recipes");

// Fonction pour supprimer les string en doublons
function filterArray(arrayOfStrings) {
  let found = {};
  let out = arrayOfStrings.filter(function (element) {
    return found.hasOwnProperty(element) ? false : (found[element] = true);
  });
  return out;
}

// Fonction pour créer un tableau d'objets en retirant les doublons (par id)
function getUniqueListBy(arr, key) {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}

async function renderRecipes() {
  let recipes = await getData();
  let recettes = [];
  let recettes1 = [];
  let ingredients = [];
  let appareils = [];
  let ustensiles = [];

  // MAJ des listes déroulantes avec pour paramètre l'objet
  function drawUpTheDropDownLists(object) {
    optionsIngredients.innerHTML = "";
    optionsUstensils.innerHTML = "";
    optionsAppliances.innerHTML = "";

    // Pour chaque ingrédient dans chaque recette --> ingredients[]
    for (let i = 0; i < object.length; i++) {
      for (let j = 0; j < object[i].ingredients.length; j++) {
        let food = object[i].ingredients[j].ingredient;
        ingredients.push(food);
      }
    }
    // Supprimer les doublons (deux recettes peuvent avoir des ingrédients similaires)
    ingredients = filterArray(ingredients);
    //console.log(ingredients);

    for (let i = 0; i < ingredients.length; i++) {
      let option = document.createElement("option");
      option.setAttribute("value", `${ingredients[i]}`);
      optionsIngredients.appendChild(option);
    }

    // Pour chaque ustensile dans chaque recette --> ustensiles[]
    for (let i = 0; i < object.length; i++) {
      for (let j = 0; j < object[i].ustensils.length; j++) {
        let kitchen = object[i].ustensils[j];
        ustensiles.push(kitchen);
      }
    }
    // Supprimer les doublons (deux recettes peuvent avoir des ustensiles similaires)
    ustensiles = filterArray(ustensiles);

    for (let i = 0; i < ustensiles.length; i++) {
      let option = document.createElement("option");
      option.setAttribute("value", `${ustensiles[i]}`);
      optionsUstensils.appendChild(option);
    }

    // Pour chaque appareil dans chaque recette --> appareils[]
    for (let i = 0; i < object.length; i++) {
      let outil = object[i].appliance;
      appareils.push(outil);
    }
    // Supprimer les doublons (deux recettes peuvent avoir des appareils similaires)
    appareils = filterArray(appareils);
    //console.log(appareils);

    for (let i = 0; i < appareils.length; i++) {
      let option = document.createElement("option");
      option.setAttribute("value", `${appareils[i]}`);
      optionsAppliances.appendChild(option);
    }

    //console.log(optionsIngredients.options, optionsUstensils.options, optionsAppliances.options);
  }

  // Les listes déroulantes doivent être initialisés avec la totalité des ingr,ust,app (logique aucun filtre appliqué dessus à ce stade)
  drawUpTheDropDownLists(recipes);

  // Créer la vue pour la liste de recettes
  function createView(recipes) {

    listRecipes.innerHTML = "";
    // Pour chaque recette création des éléments DOM
    for (const recipe of recipes) {
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

      for (let i = 0; i < recipe.ingredients.length; i++) {
        let ingredient = document.createElement("li");
        ingredients.appendChild(ingredient);
        ingredients.setAttribute("class", "col-lg-5 ingredients");
        if (
          Object.prototype.hasOwnProperty.call(
            recipe.ingredients[i],
            "quantity"
          ) &&
          Object.prototype.hasOwnProperty.call(recipe.ingredients[i], "unit")
        ) {
          ingredient.innerText = `${recipe.ingredients[i].ingredient} : ${recipe.ingredients[i].quantity} ${recipe.ingredients[i].unit}`;
        } else if (
          Object.prototype.hasOwnProperty.call(
            recipe.ingredients[i],
            "quantity"
          )
        ) {
          ingredient.innerText = `${recipe.ingredients[i].ingredient} : ${recipe.ingredients[i].quantity}`;
        } else {
          ingredient.innerText = `${recipe.ingredients[i].ingredient}`;
        }
      }
      row1.appendChild(description);

      image.setAttribute("class", "card-img-top");
      image.setAttribute("src", "fond-gris.png");
      name.textContent = `${recipe.name}`;
      time.innerHTML = `<i class="fa fa-clock-o" aria-hidden="true"></i> ${recipe.time} min`;
      description.textContent = `${recipe.description}`;
      card.setAttribute("class", "col-sm-12 col-md-6 col-lg-4");
      cardBody.setAttribute("class", "card-body background");
      row.setAttribute("class", "row");
      name.setAttribute("class", "col-lg-9");
      time.setAttribute("class", "col-lg-3");
      row1.setAttribute("class", "row");
      description.setAttribute("class", "col-lg-7 description");
    }
  }

  // Appliquer le filtre selon la valeur de l'input
  function applyFilter(value) {
    // Gérer la sensibilité à la casse
    let firstMinCharacter = value[0].toUpperCase() + value.slice(1);
    let firstMajCharacter = value[0].toLowerCase() + value.slice(1);
    console.log(value);

    // Pour chaque recette
    for (let i = 0; i < recipes.length; i++) {
      for (let j = 0; j < recipes[i].ingredients.length; j++) {
        for (let k = 0; k < recipes[i].ustensils.length; k++) {
          // Si la valeur de l'input correspond au nom de la recette RECETTE en question --> recettes[]
          if (
            recipes[i].name.includes(value) ||
            recipes[i].name.includes(firstMinCharacter) ||
            recipes[i].name.includes(firstMajCharacter)
          ) {
            recettes.push(recipes[i]);
            // Si la valeur de l'input correspond à un appareil de la recette RECETTE en question --> recettes[]
          } else if (
            recipes[i].appliance.includes(value) ||
            recipes[i].appliance.includes(firstMinCharacter) ||
            recipes[i].appliance.includes(firstMajCharacter)
          ) {
            recettes.push(recipes[i]);
            // Si la valeur de l'input correspond à un ingrédient de la recette RECETTE en question --> recettes[]
          } else if (
            recipes[i].ingredients[j].ingredient.includes(value) ||
            recipes[i].ingredients[j].ingredient.includes(firstMinCharacter) ||
            recipes[i].ingredients[j].ingredient.includes(firstMajCharacter)
          ) {
            recettes.push(recipes[i]);
            // Si la valeur de l'input correspond à un ustensile de la recette RECETTE en question --> recettes[]
          } else if (
            recipes[i].ustensils[k].includes(value) ||
            recipes[i].ustensils[k].includes(firstMinCharacter) ||
            recipes[i].ustensils[k].includes(firstMajCharacter)
          ) {
            recettes.push(recipes[i]);
          }
        }
      }
    }

    // Appliquer le filtre sur les objets, suppression des doublons par id (la valeur de l'input peut correspondre au nom mais aussi à un ingr, ust, app..)
    recettes = getUniqueListBy(recettes, "id");
    console.log(recettes);
    //localStorage.setItem('recettes', JSON.stringify(uniqueRecipes));

    // Lorsque le tri est effectué il faut mettre à jour les listes déroulantes en conséquence
    listIngredients.innerHTML = "";
    listUstensils.innerHTML = "";
    listAppliances.innerHTML = "";

    //drawUpTheDropDownLists(uniqueRecipes);

    createView(recettes);
  }

  function applyScndFilter(value) {
    // Gérer la sensibilité à la casse
    let firstMinCharacter = value[0].toUpperCase() + value.slice(1);
    let firstMajCharacter = value[0].toLowerCase() + value.slice(1);
    console.log(value);

    // Pour chaque recette
    for (let i = 0; i < recettes.length; i++) {
      for (let j = 0; j < recettes[i].ingredients.length; j++) {
        for (let k = 0; k < recettes[i].ustensils.length; k++) {
          // Si la valeur de l'input correspond au nom de la recette RECETTE en question --> recettes[]
          if (
            recettes[i].name.includes(value) ||
            recettes[i].name.includes(firstMinCharacter) ||
            recettes[i].name.includes(firstMajCharacter)
          ) {
            recettes1.push(recettes[i]);
            // Si la valeur de l'input correspond à un appareil de la recette RECETTE en question --> recettes[]
          } else if (
            recettes[i].appliance.includes(value) ||
            recettes[i].appliance.includes(firstMinCharacter) ||
            recettes[i].appliance.includes(firstMajCharacter)
          ) {
            recettes1.push(recettes[i]);
            // Si la valeur de l'input correspond à un ingrédient de la recette RECETTE en question --> recettes[]
          } else if (
            recettes[i].ingredients[j].ingredient.includes(value) ||
            recettes[i].ingredients[j].ingredient.includes(firstMinCharacter) ||
            recettes[i].ingredients[j].ingredient.includes(firstMajCharacter)
          ) {
            recettes1.push(recettes[i]);
            // Si la valeur de l'input correspond à un ustensile de la recette RECETTE en question --> recettes[]
          } else if (
            recettes[i].ustensils[k].includes(value) ||
            recettes[i].ustensils[k].includes(firstMinCharacter) ||
            recettes[i].ustensils[k].includes(firstMajCharacter)
          ) {
            recettes1.push(recettes[i]);
          }
        }
      }
    }

    // Appliquer le filtre sur les objets, suppression des doublons par id (la valeur de l'input peut correspondre au nom mais aussi à un ingr, ust, app..)
    recettes1 = getUniqueListBy(recettes1, "id");
    console.log(recettes1);
    //localStorage.setItem('recettes', JSON.stringify(uniqueRecipes));

    // Lorsque le tri est effectué il faut mettre à jour les listes déroulantes en conséquence
    listIngredients.innerHTML = "";
    listUstensils.innerHTML = "";
    listAppliances.innerHTML = "";

    //drawUpTheDropDownLists(uniqueRecipes);

    createView(recettes1);
  }

  firstResearch.addEventListener("input", function () {
    // Si la valeur de l'input est égale ou supérieure à 3 caractères REINITIALISATION
    if (firstResearch.value.length >= 3) {
      listRecipes.innerHTML = "";
      recettes = [];
      ingredients = [];
      appareils = [];
      ustensiles = [];
      applyFilter(firstResearch.value);
    // Sinon vider la liste des recettes et réinitialiser les listes déroulantes "pleines"  
    } else {
      listRecipes.innerHTML = "";
      recettes = [];
      drawUpTheDropDownLists(recipes);
    }
  });

  listIngredients.addEventListener("change", function () {
    applyScndFilter(listIngredients.value);
  });
  
  listUstensils.addEventListener("change", function () {
    let actualRecipes = localStorage.getItem('recettes');
    let goodRecipes = JSON.parse(actualRecipes);
    console.log(goodRecipes);
    applySecondaryFilter(goodRecipes, listIngredients.value);
  });
  listAppliances.addEventListener("change", function () {
    let actualRecipes = localStorage.getItem('recettes');
    let goodRecipes = JSON.parse(actualRecipes);
    console.log(goodRecipes);
    applySecondaryFilter(goodRecipes, listIngredients.value);
  });
}

renderRecipes();
