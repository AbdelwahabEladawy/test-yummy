/// <reference types="../@types/jquery/">/>
function closeAndOpenside() {
  $(".side-links").animate({ width: "toggle", paddingInline: "toggle" }, 500);
  $(".side-links ul li").toggleClass("activeli");
  $(".open-close-icon").toggleClass("fa-xmark");
  $(".open-close-icon").toggleClass("fa-bars");
  
}


$(".open-close-icon").on("click", function () {
  closeAndOpenside();
});

async function homeMeal(meal) {
  $(".loading").removeClass("hidden");
  const api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`
  );
  const response = await api.json();

  displayHomeMeals(response);
  $(".loading").addClass("hidden");
}

function displayHomeMeals(data) {
  let content = ``;

  for (let i = 0; i < data.meals.length; i++) {
    content += `
          <div onclick="mealDetails(${data.meals[i].idMeal})" class="image rounded overflow-hidden relative group cursor-pointer">
            <img src="${data.meals[i].strMealThumb}" class="w-full" alt="" />
            <div
              class="overlay absolute top-0 start-0 w-full h-full bg-white/60 flex items-center p-2 translate-y-[101%] duration-500 group-hover:translate-y-0"
            >
              <span class="text-black text-3xl font-semibold">${data.meals[i].strMeal}</span>
            </div>
          </div>
`;
  }
  document.getElementById("content").innerHTML = content;
}

homeMeal("");

async function mealDetails(id) {
  $(".loading").removeClass("hidden");
  const api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );

  const response = await api.json();

  const meal = response.meals[0];
  $("#content").addClass("hidden");
  $("#search").addClass("hidden");
  $("#categories").addClass("hidden");
  $("#area").addClass("hidden");
  $("#ingredients").addClass("hidden");
  $("#contact").addClass("hidden");
  $("#details").removeClass("hidden");
  if($(".open-close-icon").hasClass("fa-xmark")){
    closeAndOpenside()
  }
  displayDetails(meal);
  $(".loading").addClass("hidden");
}

function displayDetails(meal) {
  let measure = ``;
  for (let i = 1; i <= 20; i++) {
    if (
      meal[`strMeasure${i}`] != " " &&
      meal[`strMeasure${i}`] != "" &&
      meal[`strIngredient${i}`] != "" &&
      meal[`strIngredient${i}`] != " "
    ) {
      measure += `
        <span class="bg-[#cff4fc] text-[#055160] px-2 py-1 rounded m-2 inline-block"
                >${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</span
              >
        `;
    }
  }

  let tags = meal.strTags?.split(",") ?? [];

  let tagsStr = "";
  for (let i = 0; i < tags.length; i++) {
    tagsStr += `
    <span class="px-2 py-1 rounded bg-[#f8d7da] text-[#842029] m-2 inline-block">${tags[i]}</span>`;
  }

  let content = `
            <div class="info">
                <div class="image rounded overflow-hidden">
                    <img src="${meal.strMealThumb}" class="w-full" alt="" />
                </div>
                <span class="text-3xl font-semibold">${meal.strMeal}</span>
            </div>
          <div class="details">
            <h2 class="text-3xl font-semibold mb-2">Instructions</h2>
            <p class="mb-4">
              ${meal.strInstructions}
            </p>
            <h3 class="text-3xl font-semibold mb-2">Area : ${meal.strArea}</h3>
            <h3 class="text-3xl font-semibold mb-2">Category : ${meal.strCategory}</h3>
            <h3 class="mb-2 font-semibold text-2xl">Recipes :</h3>
            <div class="recipes mb-4">
            ${measure}
              
            </div>
            <h3 class="text-3xl font-semibold mb-2">Tags:</h3>
            <div class="tags my-4">
            ${tagsStr}
            </div>
            <div class="buttons mt-8">
              <a
                class="px-3 py-2 rounded bg-[#198754] text-white duration-500 hover:bg-[#157347]"
                href="${meal.strSource}" target="_blank"
                >Sourse</a
              >
              <a
                class="px-3 py-2 rounded bg-[#dc3545] text-white duration-500 hover:bg-[#bb2d3b]"
                href="${meal.strYoutube}" target="_blank"
                >Youtube</a
              >
            </div>
          </div>`;

  $("#detailsContent").html(content);
}

$("#searchLink").on("click", function () {
  $("#content").addClass("hidden");
  $("#details").addClass("hidden");
  $("#categories").addClass("hidden");
  $("#area").addClass("hidden");
  $("#ingredients").addClass("hidden");
  $("#contact").addClass("hidden");
  $("#search input").val(null)
  $("#searchContent").html(null);
  $("#search").removeClass("hidden");
  closeAndOpenside();
});

async function searshByName(name) {
  try {
    $(".loading").removeClass("hidden");
    const api = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
    );
    const response = await api.json();

    const meal = response.meals;
    meal.length > 20 ? (meal.length = 20) : meal.length;
    meal ? displaySearchMeal(meal) : displaySearchMeal([]);
  } catch (errr) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Enter Valid Name !",
    });
  } finally {
    $(".loading").addClass("hidden");
  }
}

async function searchByFirstLetter(letter) {
  try {
    $(".loading").removeClass("hidden");

    letter == "" ? (letter = "a") : "";
    const api = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
    );
    const response = await api.json();
    const meal = response.meals;
    meal.length > 20 ? (meal.length = 20) : meal.length;
    meal ? displaySearchMeal(meal) : displaySearchMeal([]);
  } catch (errr) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Enter Valid Letter !",
    });
  } finally {
    $(".loading").addClass("hidden");
  }
}

function displaySearchMeal(meal) {
  let content = ``;

  for (let i = 0; i < meal.length; i++) {
    content += `
          <div onclick="mealDetails('${meal[i].idMeal}')" class="image rounded overflow-hidden relative group cursor-pointer">
            <img src="${meal[i].strMealThumb}" class="w-full" alt="" />
            <div
              class="overlay absolute top-0 start-0 w-full h-full bg-white/60 flex items-center p-2 translate-y-[101%] duration-500 group-hover:translate-y-0"
            >
              <span class="text-black text-3xl font-semibold">${meal[i].strMeal}</span>
            </div>
          </div>
`;
  }
  $("#searchContent").html(content);
}

$("#categoriesLink").on("click", function () {
  $("#content").addClass("hidden");
  $("#details").addClass("hidden");
  $("#search").addClass("hidden");
  $("#area").addClass("hidden");
  $("#ingredients").addClass("hidden");
  $("#contact").addClass("hidden");
  $("#categories").removeClass("hidden");
  closeAndOpenside();
  getCategories();
});

async function getCategories() {
  $(".loading").removeClass("hidden");

  const api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  const response = await api.json();

  const categories = response.categories;
  displayCategories(categories);
  $(".loading").addClass("hidden");
}

function displayCategories(categories) {
  let content = ``;

  for (let i = 0; i < categories.length; i++) {
    content += `
          <div
          onclick="getCategoryMeals('${categories[i].strCategory}')"
            class="image rounded overflow-hidden relative group cursor-pointer"
          >
            <img src="${
              categories[i].strCategoryThumb
            }" class="w-full" alt="" />
            <div
              class="overlay absolute top-0 start-0 w-full h-full bg-white/60 text-center p-2 translate-y-[101%] duration-500 group-hover:translate-y-0"
            >
              <h2 class="text-3xl font-semibold mb-2">${
                categories[i].strCategory
              }</h2>
              <p>
              ${categories[i].strCategoryDescription
                .split(" ")
                .slice(0, 20)
                .join(" ")}
              </p>
            </div>
          </div>
  
  `;
  }

  $("#categoriesContent").html(content);
}

async function getCategoryMeals(category) {
  $(".loading").removeClass("hidden");

  const api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  const response = await api.json();

  const meal = response.meals;
  meal.length > 20 ? (meal.length = 20) : meal.length;
  displayCategoryMeals(meal);
  $(".loading").addClass("hidden");
}

function displayCategoryMeals(meal) {
  let content = ``;

  for (let i = 0; i < meal.length; i++) {
    content += `
          <div onclick="mealDetails(${meal[i].idMeal})" class="image rounded overflow-hidden relative group cursor-pointer">
            <img src="${meal[i].strMealThumb}" class="w-full" alt="" />
            <div
              class="overlay absolute top-0 start-0 w-full h-full bg-white/60 flex items-center p-2 translate-y-[101%] duration-500 group-hover:translate-y-0"
            >
              <span class="text-black text-3xl font-semibold">${meal[i].strMeal}</span>
            </div>
          </div>
`;
  }
  $("#categoriesContent").html(content);
}

$("#areaLink").on("click", function () {
  $("#content").addClass("hidden");
  $("#details").addClass("hidden");
  $("#search").addClass("hidden");
  $("#categories").addClass("hidden");
  $("#ingredients").addClass("hidden");
  $("#contact").addClass("hidden");
  $("#area").removeClass("hidden");
  closeAndOpenside();
  getAreas();
});

async function getAreas() {
  $(".loading").removeClass("hidden");

  const api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  const response = await api.json();

  const areas = response.meals;
  displayAreas(areas);
  $(".loading").addClass("hidden");
}

function displayAreas(areas) {
  let content = ``;

  for (let i = 0; i < areas.length; i++) {
    content += `
          <div
          onclick="getAreaMeals('${areas[i].strArea}')"
            class="image text-center cursor-pointer"
          >
              <i class="fa-solid fa-house-laptop fa-4x"></i>
              <h3 class="text-white text-3xl font-semibold">${areas[i].strArea}</h3>
          </div>
`;
  }
  $("#areaContent").html(content);
}

async function getAreaMeals(area) {
  $(".loading").removeClass("hidden");

  const api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  const response = await api.json();

  const meal = response.meals;
  meal.length > 20 ? (meal.length = 20) : meal.length;
  displayAreaMeals(meal);
  $(".loading").addClass("hidden");
}

function displayAreaMeals(meal) {
  let content = ``;

  for (let i = 0; i < meal.length; i++) {
    content += `
          <div onclick="mealDetails(${meal[i].idMeal})" class="image rounded overflow-hidden relative group cursor-pointer">
            <img src="${meal[i].strMealThumb}" class="w-full" alt="" />
            <div
              class="overlay absolute top-0 start-0 w-full h-full bg-white/60 flex items-center p-2 translate-y-[101%] duration-500 group-hover:translate-y-0"
            >
              <span class="text-black text-3xl font-semibold">${meal[i].strMeal}</span>
            </div>
          </div>
`;
  }
  $("#areaContent").html(content);
}

$("#ingredientsLink").on("click", function () {
  $("#content").addClass("hidden");
  $("#details").addClass("hidden");
  $("#search").addClass("hidden");
  $("#categories").addClass("hidden");
  $("#area").addClass("hidden");
  $("#contact").addClass("hidden");
  $("#ingredients").removeClass("hidden");
  closeAndOpenside();
  getIngredients();
});

async function getIngredients() {
  $(".loading").removeClass("hidden");

  const api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  const response = await api.json();

  const ingredients = response.meals;
  ingredients.length = 20;

  displayIngredients(ingredients);
  $(".loading").addClass("hidden");
}

function displayIngredients(ingredients) {
  let content = ``;

  for (let i = 0; i < ingredients.length; i++) {
    content += `
          <div onclick="getingredientsMeals('${
            ingredients[i].strIngredient
          }')" class="image text-center cursor-pointer text-white">
            <i class="fa-solid fa-drumstick-bite fa-4x"></i>
            <h3 class=" text-3xl font-semibold mb-2">
              ${ingredients[i].strIngredient}
            </h3>
            ${ingredients[i].strDescription.split(" ").slice(0, 20).join(" ")}
          </div>
`;
  }
  $("#ingredientsContent").html(content);
}

async function getingredientsMeals(ingredients) {
  $(".loading").removeClass("hidden");

  const api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`
  );
  const response = await api.json();

  const meal = response.meals;
  meal.length > 20 ? (meal.length = 20) : meal.length;
  displayingredientsMeals(meal);
  $(".loading").addClass("hidden");
}

function displayingredientsMeals(meal) {
  let content = ``;

  for (let i = 0; i < meal.length; i++) {
    content += `
          <div onclick="mealDetails(${meal[i].idMeal})" class="image rounded overflow-hidden relative group cursor-pointer">
            <img src="${meal[i].strMealThumb}" class="w-full" alt="" />
            <div
              class="overlay absolute top-0 start-0 w-full h-full bg-white/60 flex items-center p-2 translate-y-[101%] duration-500 group-hover:translate-y-0"
            >
              <span class="text-black text-3xl font-semibold">${meal[i].strMeal}</span>
            </div>
          </div>
`;
  }
  $("#ingredientsContent").html(content);
}

$("#contactLink").on("click", function () {
  $("#content").addClass("hidden");
  $("#details").addClass("hidden");
  $("#search").addClass("hidden");
  $("#categories").addClass("hidden");
  $("#area").addClass("hidden");
  $("#ingredients").addClass("hidden");
  $("#contact").removeClass("hidden");
  closeAndOpenside();
  getIngredients();
});

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;

document.getElementById("inputName").addEventListener("input", (e) => {
  if (Validation(e.target)) {
    nameInputTouched = true;
  } else {
    nameInputTouched = false;
  }
});

document.getElementById("inputMail").addEventListener("input", (e) => {
  if (Validation(e.target)) {
    emailInputTouched = true;
  } else {
    emailInputTouched = false;
  }
});

document.getElementById("inputPhone").addEventListener("input", (e) => {
  if (Validation(e.target)) {
    phoneInputTouched = true;
  } else {
    phoneInputTouched = false;
  }
});

document.getElementById("inputAge").addEventListener("input", (e) => {
  if (Validation(e.target)) {
    ageInputTouched = true;
  } else {
    ageInputTouched = false;
  }
});

document.getElementById("inputPass").addEventListener("input", (e) => {
  if (Validation(e.target)) {
    passwordInputTouched = true;
  } else {
    passwordInputTouched = false;
  }
});

document.getElementById("inputRePass").addEventListener("input", (e) => {
  if (validationRePass(e.target)) {
    repasswordInputTouched = true;
  } else {
    repasswordInputTouched = false;
  }
});

function Validation(ele) {
  const inputValue = ele.value;
  const regex = {
    inputName: /^[a-zA-Z ]+$/,
    inputMail:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    inputPhone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    inputAge: /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/,
    inputPass: /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/,
  };

  if (regex[ele.id].test(inputValue)) {
    ele.nextElementSibling.classList.add("hidden");
    return true;
  } else {
    ele.nextElementSibling.classList.remove("hidden");
    return false;
  }
}

function validationRePass(ele) {
  if (ele.value == document.getElementById("inputPass").value) {
    $(`#alertRepass`).addClass("hidden");
    return true;
  } else {
    $(`#alertRepass`).removeClass("hidden");
    return false;
  }
}
const submitBtn = document.getElementById("submitBtn");

document.querySelector("form").addEventListener("input", function () {
  if (
    nameInputTouched &&
    emailInputTouched &&
    phoneInputTouched &&
    ageInputTouched &&
    passwordInputTouched &&
    repasswordInputTouched
  ) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", true);
  }
});
