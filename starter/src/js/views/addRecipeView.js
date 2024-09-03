import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded!';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this.addHandlerShowWindow();
    this.addHandlerHideWindow();
  }

  toggleWindow = function () {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  };
  // remember that the this keyword inside of a handler func points to the element on which that listener is attached to
  addHandlerShowWindow = function () {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this)); // create a separate method for toggle Window and bind the correct this keyword to it, otherwise the this keyword inside of this function would be the button
  };

  addHandlerHideWindow = function () {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  };

  addHandlerUpload = function (handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)]; // using new formdata instead of mapping thru each el, form data returns obj we can't use but spreading into array
      const data = Object.fromEntries(dataArr); // opp of entries method-> converts array into obj
      handler(data);
    });
  };

  _generateMarkup() {}
}

export default new AddRecipeView();
