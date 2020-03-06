import { elements } from "./base";

export const getInput = () => elements.searchInput.value;
export const clearInput = () => {
  elements.searchInput.value = "";
};
export const clearResults = () => {
  elements.searchResList.innerHTML = "";
  elements.searchResPages.innerHTML = "";
};
export const highlightSelecter = id => {
  const resultArr = Array.from(document.querySelectorAll(".results__link"));
  resultArr.forEach(el => {
    el.classList.remove("results__link--active");
  });
  const temp = document
    .querySelector(`.results__link[href="#${id}"]`)
    .classList.add("results__link--active");
};
export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(" ").reduce((a, c) => {
      if (a + c.length <= limit) {
        newTitle.push(c);
      }
      return a + c.length;
    }, 0);

    return `${newTitle.join(" ")} ...`;
  }
  return title;
};
const renderRecipe = recipe => {
  const markup = `<li>
                    <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="${
    recipe.title
  }">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(
                              recipe.title
                            )}.</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>`;
  elements.searchResList.insertAdjacentHTML("beforeend", markup);
};
const createButton = (page, type) => {
  // type = prev ||next
  let button = `<button class="btn-inline results__btn--${type}" data-goto=${
    type === "prev" ? page - 1 : page + 1
  }>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${
              type === "prev" ? "left" : "right"
            }"></use>
        </svg>
        <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
    </button>`;
  return button;
};
const renderButtons = (page, numResults, resPerpage) => {
  const pages = Math.ceil(numResults / resPerpage);
  let button;

  if (page === 1 && pages > 1) {
    // buton for next page
    button = createButton(page, "next");
  } else if (page === pages) {
    // button for next page
    button = createButton(page, "prev");
  } else if (page < pages && pages > 1) {
    // both buttons
    button = `${createButton(page, "prev")} 
    ${createButton(page, "next")}`;
  }

  elements.searchResPages.insertAdjacentHTML("afterbegin", button);
};
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  recipes.slice(start, end).forEach(renderRecipe);

  renderButtons(page, recipes.length, resPerPage);
};
