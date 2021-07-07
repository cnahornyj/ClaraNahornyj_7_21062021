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

let listRecipes = document.querySelector("#recipes");

function createEltsOfDropDownList(array, optionsElts) {
  for (let i = 0; i < array.length; i++) {
    let item = document.createElement("li");
    item.innerText = `${array[i]}`;
    optionsElts.appendChild(item);
  }
}

function createTag(typeOfTag, list, color) {
  let word = document.createElement("span");
  typeOfTag.appendChild(word);
  typeOfTag.style.marginBottom = "2%";
  typeOfTag.style.marginRight = "2%";
  word.innerText = `${list.value}`;
  word.setAttribute("class", `${color} mb-1 p-2 rounded`);
}

function revealList(options) {
  options.classList.remove("invisible");
  options.classList.add("visible");
}

function hideList(options) {
  options.classList.remove("visible");
  options.classList.add("invisible");
}

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

    // Ajouter les li aux différentes listes ul
    createEltsOfDropDownList(ingredients, optionsIngredients);
    createEltsOfDropDownList(ustensiles, optionsUstensils);
    createEltsOfDropDownList(appareils, optionsAppliances);
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
        ingredient.setAttribute("class", "fw-bold");
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
      cardBody.setAttribute("class", "card-body");
      cardBody.style.backgroundColor = "#e7e7e7";
      cardBody.style.borderRadius = "0 0 5px 5px";
      cardBody.style.height = "390px";
      card.style.margin = "2% 0 2% 0";
      row.setAttribute("class", "row");
      name.setAttribute("class", "col-lg-8");
      time.setAttribute("class", "col-lg-4 text-align-right");
      row1.setAttribute("class", "row");
      ingredients.setAttribute("class", "col-lg-4 list-unstyled");
      ingredients.style.fontSize = "85%";
      description.style.fontSize = "85%";
      description.setAttribute("class", "col-lg-8");
    }
  }

  function resetView() {
    listRecipes.innerHTML = "";
    optionsIngredients.innerHTML = "";
    optionsUstensils.innerHTML = "";
    optionsAppliances.innerHTML = "";
    ingredients = [];
    appareils = [];
    ustensiles = [];
  }

  function applyFilter(value) {
    // Gérer la sensibilité à la casse
    let firstMinCharacter = value[0].toUpperCase() + value.slice(1);
    let firstMajCharacter = value[0].toLowerCase() + value.slice(1);

    results = recipes.filter(function (e) {
      for (let j = 0; j < e.ingredients.length; j++) {
        if (
          e.name.includes(value) ||
          e.name.includes(firstMinCharacter) ||
          e.name.includes(firstMajCharacter) ||
          e.description.includes(value) ||
          e.description.includes(firstMinCharacter) ||
          e.description.includes(firstMajCharacter) ||
          e.ingredients[j].ingredient.includes(value) ||
          e.ingredients[j].ingredient.includes(firstMinCharacter) ||
          e.ingredients[j].ingredient.includes(firstMajCharacter)
        ) {
          return e;
        }
      }
    });
    console.log(results);
    /*Lorsque le tri est effectué il faut vider les listes déroulantes 
    et les mettre à jour avec les ingrédients, ustensiles, appareils des recettes restantes */
    resetView();
    updateTheDropDownLists(results);
    createView(results);
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

  listIngredients.addEventListener("click", function () {
    revealList(optionsIngredients);
  });
  listUstensils.addEventListener("click", function () {
    revealList(optionsUstensils);
  });
  listAppliances.addEventListener("click", function () {
    revealList(optionsAppliances);
  });

  optionsIngredients.addEventListener("mouseleave", function () {
    hideList(optionsIngredients);
  });
  optionsUstensils.addEventListener("mouseleave", function () {
    hideList(optionsUstensils);
  });
  optionsAppliances.addEventListener("mouseleave", function () {
    hideList(optionsAppliances);
  });

  listIngredients.addEventListener("change", function () {
    if (results.length === 0) {
      results = recipes.filter(function (e) {
        for (let j = 0; j < e.ingredients.length; j++) {
          if (e.ingredients[j].ingredient.includes(listIngredients.value)) {
            return e;
          }
        }
      });
      console.log(results);
      hideList(optionsIngredients);
      createTag(ingredientags, listIngredients, "blue-ing");
      updateTheDropDownLists(results);
      createView(results);
    } else {
      results = results.filter(function (e) {
        for (let j = 0; j < e.ingredients.length; j++) {
          if (e.ingredients[j].ingredient.includes(listIngredients.value)) {
            return e;
          }
        }
      });
      console.log(results);
      hideList(optionsIngredients);
      resetView();
      createTag(ingredientags, listIngredients, "blue-ing");
      updateTheDropDownLists(results);
      createView(results);
    }
  });
  listAppliances.addEventListener("change", function () {
    if (results.length === 0) {
      results = recipes.filter(function (e) {
        if (e.appliance.includes(listAppliances.value)) {
          return e;
        }
      });
      hideList(optionsAppliances);
      createTag(appliancestags, listAppliances, "green-app");
      updateTheDropDownLists(results);
      createView(results);
    } else {
      results = results.filter(function (e) {
        if (e.appliance.includes(listAppliances.value)) {
          return e;
        }
      });
      console.log(results);
      hideList(optionsAppliances);
      resetView();
      createTag(appliancestags, listAppliances, "green-app");
      updateTheDropDownLists(results);
      createView(results);
    }
  });
  listUstensils.addEventListener("change", function () {
    if (results.length === 0) {
      results = recipes.filter(function (e) {
        for (let k = 0; k < e.ustensils.length; k++) {
          if (e.ustensils[k].includes(listUstensils.value)) {
            return e;
          }
        }
      });
      console.log(results);
      hideList(optionsUstensils);
      createTag(ingredientags, listIngredients, "red-ust");
      updateTheDropDownLists(results);
      createView(results);
    } else {
      results = results.filter(function (e) {
        for (let k = 0; k < e.ustensils.length; k++) {
          if (e.ustensils[k].includes(listUstensils.value)) {
            return e;
          }
        }
      });
      console.log(results);
      hideList(optionsUstensils);
      resetView();
      createTag(ustensilstags, listUstensils, "red-ust");
      updateTheDropDownLists(results);
      createView(results);
    }
  });
}

renderRecipes();
