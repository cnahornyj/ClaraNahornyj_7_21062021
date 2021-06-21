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

let listIngredients = document.querySelector("#listOfIngredients");
let listUstensils = document.getElementById("list-ustensils");
let listAppliances = document.getElementById("list-appliances");

let listRecipes = document.querySelector("#recipes");

let recettes = [];
let ingredients = [];
let appareils = [];
let ustensiles = [];

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

function drawUpTheDropDownLists(object) {
  // Cette partie devra être exécutée pour MAJ les listes déroulantes à partir du tableau d'objets
  //qui ressort de applyFilter(value)
  for (let i = 0; i < object.length; i++) {
    for (let j = 0; j < object[i].ingredients.length; j++) {
      let food = object[i].ingredients[j].ingredient;
      ingredients.push(food);
    }
  }
  ingredients = filterArray(ingredients);
  console.log(ingredients);


  let input = document.createElement("input");
  let datalist = document.createElement("datalist");

  listOfIngredients.appendChild(input);
  input.appendChild(datalist);

  for (let i = 0; i < ingredients.length; i++) {
    let option = document.createElement("option");
    option.setAttribute("value",`${ingredients[i]}`);
    datalist.appendChild(option);
  }

  input.setAttribute("class", "form-control");
  input.setAttribute("list", "datalistOptions");
  input.setAttribute("id", "exampleDataList");
  input.setAttribute("placeholder", "Ingrédients");
  datalist.setAttribute("id", "datalistOptions");

  /*
  for (let i = 0; i < object.length; i++) {
    for (let j = 0; j < object[i].ustensils.length; j++) {
      let kitchen = object[i].ustensils[j];
      ustensiles.push(kitchen);
    }
  }
  ustensiles = filterArray(ustensiles);

  for (let i = 0; i < object.length; i++) {
    let outil = object[i].appliance;
    appareils.push(outil);
  }
  appareils = filterArray(appareils);
  */
  
}

async function renderRecipes() {
  const recipes = await getData();

  drawUpTheDropDownLists(recipes);
  function createView(objects) {

    /* Les liste déroulantes doivent être initialisés avec tous les éléments
    drawUpTheDropDownLists(recipes);*/

    console.log(listRecipes);
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

    for (let i = 0; i < recipes.length; i++) {
      for (let j = 0; j < recipes[i].ingredients.length; j++) {
        for (let k = 0; k < recipes[i].ustensils.length; k++) {
          if (
            recipes[i].name.includes(value) ||
            recipes[i].name.includes(firstMinCharacter) ||
            recipes[i].name.includes(firstMajCharacter)
          ) {
            recettes.push(recipes[i]);
          } else if (
            recipes[i].appliance.includes(value) ||
            recipes[i].appliance.includes(firstMinCharacter) ||
            recipes[i].appliance.includes(firstMajCharacter)
          ) {
            recettes.push(recipes[i]);
          } else if (
            recipes[i].ingredients[j].ingredient.includes(value) ||
            recipes[i].ingredients[j].ingredient.includes(firstMinCharacter) ||
            recipes[i].ingredients[j].ingredient.includes(firstMajCharacter)
          ) {
            recettes.push(recipes[i]);
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

    let uniqueRecipes = getUniqueListBy(recettes, "id");
    //console.log(uniqueRecipes);
    // Lorsque le tri est effectué il faut mettre à jour les listes déroulantes
    listOfIngredients.innerHTML="";
    drawUpTheDropDownLists(uniqueRecipes);
    createView(uniqueRecipes);
  }

  firstResearch.addEventListener("input", function () {
    // Il va falloir appeler la fonction à chaque saisie de caractère
    if (firstResearch.value.length === 3) {
      applyFilter(firstResearch.value);
    } else if (firstResearch.value.length > 3) {
      listRecipes.innerHTML = "";
      applyFilter(firstResearch.value);
    }
  });
}

renderRecipes();
