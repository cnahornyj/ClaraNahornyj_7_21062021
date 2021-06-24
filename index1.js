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

// Fonction pour supprimer les string en doublons
function filterArray(arrayOfStrings) {
  let found = {};
  let out = arrayOfStrings.filter(function (element) {
    return found.hasOwnProperty(element) ? false : (found[element] = true);
  });
  return out;
}

function applyFilter(object, mainValue, igrValue, ustValue, appValue) {
  let recettes = object.filter(function (e) {
    for (let j = 0; j < e.ingredients.length; j++) {
      for (let k = 0; k < e.ustensils.length; k++) {
        if (
          e.name.includes(mainValue) ||
          e.appliance.includes(mainValue) ||
          e.ingredients[j].ingredient.includes(mainValue) ||
          e.ingredients[j].ingredient.includes(igrValue) ||
          e.ustensils[k].includes(mainValue)
        ) {
          return e;
        }
      }
    }
  });
  return recettes;
}

async function renderRecipes() {
  let recipes = await getData();
  let recettes = JSON.parse(JSON.stringify(recipes));
  let filters = {};
  let ingredients = [];
  let ustensiles = [];
  let appareils = [];

  // Pour chaque ingrédient dans chaque recette --> ingredients[]
  for (let i = 0; i < recipes.length; i++) {
    for (let j = 0; j < recipes[i].ingredients.length; j++) {
      let food = recipes[i].ingredients[j].ingredient;
      ingredients.push(food);
    }
  }
  // Supprimer les doublons (deux recettes peuvent avoir des ingrédients similaires)
  ingredients = filterArray(ingredients);
  console.log(ingredients);
  for (let i = 0; i < ingredients.length; i++) {
    let option = document.createElement("option");
    option.setAttribute("value", `${ingredients[i]}`);
    optionsIngredients.appendChild(option);
  }
  // Pour chaque ustensile dans chaque recette --> ustensiles[]
  for (let i = 0; i < recipes.length; i++) {
    for (let j = 0; j < recipes[i].ustensils.length; j++) {
      let kitchen = recipes[i].ustensils[j];
      ustensiles.push(kitchen);
    }
  }
  // Supprimer les doublons (deux recettes peuvent avoir des ustensiles similaires)
  ustensiles = filterArray(ustensiles);
  console.log(ustensiles);
  for (let i = 0; i < ustensiles.length; i++) {
    let option = document.createElement("option");
    option.setAttribute("value", `${ustensiles[i]}`);
    optionsUstensils.appendChild(option);
  }
  // Pour chaque appareil dans chaque recette --> appareils[]
  for (let i = 0; i < recipes.length; i++) {
    let outil = recipes[i].appliance;
    appareils.push(outil);
  }
  // Supprimer les doublons (deux recettes peuvent avoir des appareils similaires)
  appareils = filterArray(appareils);
  console.log(appareils);
  for (let i = 0; i < appareils.length; i++) {
    let option = document.createElement("option");
    option.setAttribute("value", `${appareils[i]}`);
    optionsAppliances.appendChild(option);
  }

  firstResearch.addEventListener("input", function () {
    console.log(firstResearch.value);
    console.log(listIngredients.value);
    console.log(listUstensils.value);
    console.log(listUstensils.value);
    applyFilter(
      firstResearch.value,
      listIngredients.value,
      listUstensils.value,
      listUstensils.value
    );
  });

  /*
  listIngredients.addEventListener("change",function(){
      console.log(firstResearch.value);
      console.log(listUstensils.value);
      console.log(listAppliances.value);
  })
  */
}

renderRecipes();
