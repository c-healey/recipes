import Search from "./models/Search";
import Recipe from "./models/Recipes";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likeView from "./views/likeView";
import { elements, renderLoader, clearLoader } from "./views/base";

// Global state of the app
//  Search Object
// / current recipe Object
// Shopping list object
// liked recipes

const state = {};
// window.state = state;
// window.listView = listView;

const controlSearch = async () => {
  // get the query from the view

  const query = searchView.getInput();
  //   const query = "pizza";
  if (query) {
    state.search = new Search(query);
    // prepare ui for search results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    // show loading spinner
    // search for recipes
    try {
      await state.search.getResults();
      clearLoader();
      searchView.renderResults(state.search.recipes);
    } catch (error) {
      alert("Something went wrong with the search...");
      clearLoader();
    }
  }
};
elements.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});
// restore liked recipes on load
window.addEventListener("load", e => {
  // e.preventDefault();
  // controlSearch();
  state.likes = new Likes();
  // read likes from storage and set the likes.likes
  state.likes.readStorage();
  likeView.toggleLikeMenu(state.likes.getNumLikes());
  state.likes.likes.forEach(like => likeView.renderLike(like));
});
elements.searchResPages.addEventListener("click", e => {
  e.preventDefault();
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();

    searchView.renderResults(state.search.recipes, goToPage);
  }
});

const controlRecipe = async () => {
  // Get id from ULR
  const id = window.location.hash.replace("#", "");

  if (id) {
    // prepare the ui for changes
    recipeView.clearRecipe();
    // create new recipe object
    renderLoader(elements.recipe);
    if (state.search) searchView.highlightSelecter(id);

    state.recipe = new Recipe(id);

    try {
      //   get recipe dataset
      await state.recipe.getRecipe();
      state.recipe.parseIngredient();
      // calculate servings
      state.recipe.calcTime();
      state.recipe.calcServing();
      // render recipe
      clearLoader();
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(state.recipe.id)
      );
    } catch (error) {
      console.log(error);
    }
  }
};
// ************************
// List controller
const controlList = async () => {
  // create a new list if there is none
  if (!state.list) state.list = new List();

  // add each ingredient to the list
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

["hashchange", "load"].forEach(event =>
  window.addEventListener(event, controlRecipe)
);

// handling for shopping list item events
elements.shopping.addEventListener("click", e => {
  e.preventDefault();
  const id = e.target.closest(".shopping__item").dataset.itemid;
  if (id) {
    if (e.target.matches(".shopping__delete, .shopping__delete *")) {
      // delete from state
      state.list.deleteItem(id);

      // delete from UI
      listView.deleteItem(id);

      // handle count update
    } else if (e.target.matches(".shopping__count-value")) {
      // increment or decrement ingredient count
      const val = parseFloat(e.target.value);
      state.list.updateCount(id, val);
    }
  }
});

// *******************
// handling for likes

const controlLike = () => {
  if (!state.likes) state.likes = new Likes();

  if (!state.likes.isLiked(state.recipe.id)) {
    const like = state.likes.addLike(
      state.recipe.id,
      state.recipe.title,
      state.recipe.author,
      state.recipe.image
    );
    // toggle the like button
    likeView.toggleLikeBtn(true);
    // add to the ui like list
    likeView.renderLike(like);
  } else {
    // remove the like from state
    state.likes.deleteLike(state.recipe.id);
    // tobble the like button
    likeView.toggleLikeBtn(false);
    // remove from the like UI list
    likeView.deleteLikeItem(state.recipe.id);
  }
  likeView.toggleLikeMenu(state.likes.getNumLikes());
};

// handling recipe button clicks
elements.recipe.addEventListener("click", e => {
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    // decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    // increase button is clicked
    state.recipe.updateServings("inc");
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    // add items to shopping list
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    controlLike();
  }
  recipeView.clearRecipe();
  recipeView.renderRecipe(state.recipe, state.likes.isLiked(state.recipe.id));
});

window.list = new List();
