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
let listOfTags = document.getElementById("tags");
let ingredientags = document.getElementById("ingredientags");
let ustensilstags = document.getElementById("ustensilstags");
let appliancestags = document.getElementById("appliancestags");

let listRecipes = document.querySelector("#recipes");

// Fonction pour supprimer les string en doublons dans les listes déroulantes
function filterArray(arrayOfStrings) {
  let found = {};
  let out = arrayOfStrings.filter(function (element) {
    return found.hasOwnProperty(element) ? false : (found[element] = true);
  });
  return out;
}

function createTag(typeOfTag, list, color) {
  let word = document.createElement("span");
  typeOfTag.appendChild(word);
  typeOfTag.style.marginBottom = "2%";
  typeOfTag.style.marginRight = "2%";
  word.innerText = `${list.value}`;
  word.setAttribute("class", color);
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

  // Mettre à jour les listes déroulantes selon les recettes
  function updateDropDownLists(recipes) {
    ingredients = [];
    appareils = [];
    ustensiles = [];
    optionsIngredients.innerHTML = "";
    optionsUstensils.innerHTML = "";
    optionsAppliances.innerHTML = "";

    // Pour chaque ingrédient dans chaque recette --> ingredients[]
    for (let i = 0; i < recipes.length; i++) {
      for (let j = 0; j < recipes[i].ingredients.length; j++) {
        let food = recipes[i].ingredients[j].ingredient;
        ingredients.push(food);
      }
    }
    // Supprimer les doublons (deux recettes peuvent avoir des ingrédients similaires)
    ingredients = filterArray(ingredients);

    // Pour chaque ingrédient dans la liste ul des ingrédients créé les li
    for (let i = 0; i < ingredients.length; i++) {
      let item = document.createElement("li");
      item.innerText = `${ingredients[i]}`;
      optionsIngredients.appendChild(item);
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

    // Pour chaque ingrédient dans la liste ul des ingrédients créé les li
    for (let i = 0; i < ustensiles.length; i++) {
      let item = document.createElement("li");
      item.innerText = `${ustensiles[i]}`;
      optionsUstensils.appendChild(item);
    }
    // Pour chaque appareil dans chaque recette --> appareils[]
    for (let i = 0; i < recipes.length; i++) {
      let outil = recipes[i].appliance;
      appareils.push(outil);
    }
    // Supprimer les doublons (deux recettes peuvent avoir des appareils similaires)
    appareils = filterArray(appareils);

    // Pour chaque ingrédient dans la liste ul des ingrédients créé les li
    for (let i = 0; i < appareils.length; i++) {
      let item = document.createElement("li");
      item.innerText = `${appareils[i]}`;
      optionsAppliances.appendChild(item);
    }
  }

  updateDropDownLists(recettes);

  firstResearch.addEventListener("input", function () {
    /* Si la valeur de l'input est égale ou supérieure à 3 caractères REINITIALISATION
    Sensibilité à la casse */
    let firstMinCharacter =
      firstResearch.value[0].toUpperCase() + firstResearch.value.slice(1);
    let firstMajCharacter =
      firstResearch.value[0].toLowerCase() + firstResearch.value.slice(1);
    if (firstResearch.value.length >= 3) {
      // Si 1er tableau filtré inexistant filtré le tableau de base
      if (results.length === 0) {
        results = recipes.filter(function (e) {
          if (
            e.name.includes(firstResearch.value) ||
            e.name.includes(firstMinCharacter) ||
            e.name.includes(firstMajCharacter) ||
            e.appliance.includes(firstResearch.value) ||
            e.appliance.includes(firstMinCharacter) ||
            e.appliance.includes(firstMajCharacter)
          ) {
            return e;
          }
          for (let j = 0; j < e.ingredients.length; j++) {
            if (
              e.ingredients[j].ingredient.includes(firstResearch.value) ||
              e.ingredients[j].ingredient.includes(firstMinCharacter) ||
              e.ingredients[j].ingredient.includes(firstMajCharacter)
            ) {
              return e;
            }
            for (let k = 0; k < e.ustensils.length; k++) {
              /* Si la condition est remplit une première fois l'élément est retourné contrairement à la première version 
              où on obtient un tableau avec des doublons qu'il faut traiter par la suite */
              if (
                e.ustensils[k].includes(firstResearch.value) ||
                e.ustensils[k].includes(firstMinCharacter) ||
                e.ustensils[k].includes(firstMajCharacter)
              ) {
                return e;
              }
            }
          }
        });
        console.log(results);
        updateDropDownLists(results);
        createView(results);
      } else {
        // Sinon si le tableau
        results = results.filter(function (e) {
          if (
            e.name.includes(firstResearch.value) ||
            e.name.includes(firstMinCharacter) ||
            e.name.includes(firstMajCharacter) ||
            e.appliance.includes(firstResearch.value) ||
            e.appliance.includes(firstMinCharacter) ||
            e.appliance.includes(firstMajCharacter)
          ) {
            return e;
          }
          for (let j = 0; j < e.ingredients.length; j++) {
            if (
              e.ingredients[j].ingredient.includes(firstResearch.value) ||
              e.ingredients[j].ingredient.includes(firstMinCharacter) ||
              e.ingredients[j].ingredient.includes(firstMajCharacter)
            ) {
              return e;
            }
            for (let k = 0; k < e.ustensils.length; k++) {
              /* Si la condition est remplit une première fois l'élément est retourné contrairement à la première version 
              où on obtient un tableau avec des doublons qu'il faut traiter par la suite */
              if (
                e.ustensils[k].includes(firstResearch.value) ||
                e.ustensils[k].includes(firstMinCharacter) ||
                e.ustensils[k].includes(firstMajCharacter)
              ) {
                return e;
              }
            }
          }
        });
        console.log(results);
        updateDropDownLists(results);
        createView(results);
      }
    } else {
      // Tout réinitialiser
      results = [];
      updateDropDownLists(recipes);
      listRecipes.innerHTML = "";
    }
  });

  listIngredients.addEventListener("click", function () {
    optionsIngredients.classList.remove("hidden");
    optionsIngredients.classList.add("visible");
  });

  listUstensils.addEventListener("click", function () {
    optionsUstensils.classList.remove("hidden");
    optionsUstensils.classList.add("visible");
  });

  listAppliances.addEventListener("click", function () {
    optionsAppliances.classList.remove("hidden");
    optionsAppliances.classList.add("visible");
  });

  optionsIngredients.addEventListener("mouseleave", function () {
    optionsIngredients.classList.remove("visible");
    optionsIngredients.classList.add("hidden");
  });

  optionsUstensils.addEventListener("mouseleave", function () {
    optionsUstensils.classList.remove("visible");
    optionsUstensils.classList.add("hidden");
  });

  optionsAppliances.addEventListener("mouseleave", function () {
    optionsAppliances.classList.remove("visible");
    optionsAppliances.classList.add("hidden");
  });

  listIngredients.addEventListener("change", function () {
    if (results.length === 0) {
      results = recettes.filter(function (e) {
        for (let j = 0; j < e.ingredients.length; j++) {
          if (e.ingredients[j].ingredient.includes(listIngredients.value)) {
            return e;
          }
        }
      });
      optionsIngredients.classList.remove("visible");
      optionsIngredients.classList.add("hidden");
      createTag(ingredientags, listIngredients, "blue");
      updateDropDownLists(results);
      createView(results);
    } else {
      results = results.filter(function (e) {
        for (let j = 0; j < e.ingredients.length; j++) {
          if (e.ingredients[j].ingredient.includes(listIngredients.value)) {
            return e;
          }
        }
      });
      optionsIngredients.classList.remove("visible");
      optionsIngredients.classList.add("hidden");
      console.log(results);
      createTag(ingredientags, listIngredients, "blue");
      updateDropDownLists(results);
      createView(results);
    }
  });

  listUstensils.addEventListener("change", function () {
    if (results.length === 0) {
      results = recettes.filter(function (e) {
        for (let k = 0; k < e.ustensils.length; k++) {
          if (e.ustensils[k].includes(listUstensils.value)) {
            return e;
          }
        }
      });
      createTag(ustensilstags, listUstensils, "red");
      updateDropDownLists(results);
      createView(results);
    } else {
      results = results.filter(function (e) {
        for (let k = 0; k < e.ustensils.length; k++) {
          if (e.ustensils[k].includes(listUstensils.value)) {
            return e;
          }
        }
      });
      createTag(ustensilstags, listUstensils, "red");
      updateDropDownLists(results);
      createView(results);
    }
    console.log(results);
  });

  listAppliances.addEventListener("change", function () {
    if (results.length === 0) {
      results = recettes.filter(function (e) {
        if (e.appliance.includes(listAppliances.value)) {
          return e;
        }
      });
      createTag(appliancestags, listAppliances, "green");
      updateDropDownLists(results);
      createView(results);
    } else {
      results = results.filter(function (e) {
        if (e.appliance.includes(listAppliances.value)) {
          return e;
        }
      });
      createTag(appliancestags, listAppliances, "green");
      updateDropDownLists(results);
      createView(results);
    }
    console.log(results);
  });

  console.log(results);
}

renderRecipes();
