import { elements } from "./base";
import { limitRecipeTitle } from "./searchView";

export const toggleLikeBtn = isLiked => {
  const iconString = isLiked ? "icon-heart" : "icon-heart-outlined";

  document
    .querySelector(".recipe__love .header__likes use")
    .setAttribute("href", `img/icons.svg#${iconString}`);
};
export const toggleLikeMenu = numLikes => {
  elements.likeMenu.style.visibility = numLikes > 0 ? "visible" : "hidden";
};

{
  /* <button class="recipe__love">
  <svg class="header__likes">
    <use href="img/icons.svg#icon-heart-outlined"></use>
  </svg>
</button>; */
}
export const renderLike = item => {
  console.log(item);
  const markup = ` 
       <li data-likeid='${item.id}'>
            <a class="likes__link" href="#${item.id}">
                <figure class="likes__fig">
                    <img src="${item.img}" alt="${item.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(item.title)}</h4>
                    <p class="likes__author">${item.author}</p>
                </div>
            </a>
        </li>`;
  elements.likeList.insertAdjacentHTML("beforeend", markup);
};
export const deleteLikeItem = id => {
  const item = document.querySelector(`[data-likeid="${id}"]`);
  if (item) item.parentElement.removeChild(item);
};
