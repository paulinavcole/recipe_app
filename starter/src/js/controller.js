import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SECONDS } from './config.js';

import 'core-js/actual';
import 'regenerator-runtime/runtime';

// from parcel
// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

//////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1); // can take hash from url

    if (!id) return;
    recipeView.renderSpinner();

    // 0) update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());

    // 1) loading recipe
    await model.loadRecipe(id); // async func so we have to await the promise

    // 2 rendering recipe
    recipeView.render(model.state.recipe);

    // 3 updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1. get search query
    query = searchView.getQuery();
    if (!query) return;

    // 2. load search results
    await model.loadSearchResults(query);

    // 3. render results
    resultsView.render(model.getSearchResultsPage(1));

    // 4. render initial pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1. render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2. render NEW pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // 1. update recipe servings
  model.updateServings(newServings);

  // 2. update view
  // recipeView.render(model.state.recipe); // rerenders all ingredients and servings
  recipeView.update(model.state.recipe); // rerenders all ingredients and servings
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // show loading spinner

    addRecipeView.renderSpinner();
    // upload new recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // render recipe in recipe view
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderMessage();

    // render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`); // allows us to change the url without reloading the page. takes 3 args: state which isn't important, title which is also not important, and 3rd which is the url

    // close form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SECONDS * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);

  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);

  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks'); // for testing during development
};
