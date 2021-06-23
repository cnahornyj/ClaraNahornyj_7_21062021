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
  let recettes = recipes;
  let results = [];
  let ingredients = [];
  let appareils = [];
  let ustensiles = [];

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

  function applyMainFilter(object, value) {
    let recettes = object.filter(function (e) {
      for (let j = 0; j < e.ingredients.length; j++) {
        for (let k = 0; k < e.ustensils.length; k++) {
          if (
            e.name.includes(value) ||
            e.appliance.includes(value) ||
            e.ingredients[j].ingredient.includes(value) ||
            e.ustensils[k].includes(value)
          ) {
            return e;
          }
        }
      }
    });
    return recettes;
  }

  function applyIgdrFilter(value) {
    let recipes = localStorage.getItem("recettes");
    let filteredRecipes = JSON.parse(recipes);
    console.log(filteredRecipes);
    let recettes = filteredRecipes.filter(function (e) {
      for (let i = 0; i < e.ingredients.length; i++) {
        if (e.ingredients[i].ingredient === value) {
          return e;
        }
      }
    });
    return recettes;
  }

  function applyUstFilter(value){
    let recipes = localStorage.getItem("recettesFiltrees");
    let filteredRecipes = JSON.parse(recipes);
    console.log(filteredRecipes);
    let recettes = filteredRecipes.filter(function (e) {
      for (let k = 0; k < e.ustensils.length; k++) {
        if (e.ustensils[k].includes(value)) {
          return e;
        }
      }
    });
    console.log(recettes);
    localStorage.setItem("filteredRecipes",JSON.stringify(recettes));
    createView(recettes);
  }

  function applyAppFilter(value){
    let recipes = localStorage.getItem("filteredRecipes");
    let filteredRecipes = JSON.parse(recipes);
    console.log(filteredRecipes);
    let recettes = filteredRecipes.filter(function (e) {
        if (e.appliance.includes(value)) {
          return e;
      }
    });
    console.log(recettes);
    createView(recettes);
  }

  firstResearch.addEventListener("input", function () {
    // Si la valeur de l'input est égale ou supérieure à 3 caractères REINITIALISATION
    if (firstResearch.value.length >= 3) {
      results = recipes.filter(function (e) {
        for (let j = 0; j < e.ingredients.length; j++) {
          for (let k = 0; k < e.ustensils.length; k++) {
            if (
              e.name.includes("coco") ||
              e.appliance.includes("coco") ||
              e.ingredients[j].ingredient.includes("coco") ||
              e.ustensils[k].includes("coco")
            ) {
              return e;
            }
          }
        }
      });
      console.log(`Résultats 2 : ${results}`);
    } else {
    }
  });

  listIngredients.addEventListener("change", function () {
    console.log(`Résultats 3 : ${results}`);
  });

  listUstensils.addEventListener("change", function () {
    
  });
  listAppliances.addEventListener("change", function () {
    
  });

  console.log(`Résultats 1 : ${results}`);
}



renderRecipes();
