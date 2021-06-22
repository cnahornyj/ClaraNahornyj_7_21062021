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
let recipes = [];

function getUniqueListBy(arr, key) {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}

async function renderRecipes() {
  let recettes = await getData();
  recipes = recettes;
  console.log(recipes);
}

renderRecipes();
