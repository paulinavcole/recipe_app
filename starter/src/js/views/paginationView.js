import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    // use event delegation to not listen to each button individually
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline'); // figures out the button that was actually clicked. closest is like query selector but for searching down in the tree
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(numPages);
    //page 1 and there are other pages
    if (this._data.page === 1 && numPages > 1) {
      return `
        <button data-goto="${
          this._data.page + 1
        }"class="btn--inline pagination__btn--next">
            <span>${this._data.page + 1}</span>
            <svg class="search__icon">
                <use href="${icons}.svg#icon-arrow-right"></use>
            </svg>
        </button>
        `;
    }
    // on last page
    if (this._data.page === numPages && numPages > 1) {
      return `
        <button data-goto="${
          this._data.page - 1
        }"class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}.svg#icon-arrow-left"></use>
            </svg>
            <span>${this._data.page - 1}</span>
        </button>
        `;
    }
    // some other page
    if (this._data.page < numPages) {
      return `
        <button data-goto="${
          this._data.page - 1
        }"class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
              <use href="${icons}.svg#icon-arrow-left"></use>
          </svg>
          <span>${this._data.page - 1}</span>
        </button>

        <button data-goto="${
          this._data.page + 1
        }"class="btn--inline pagination__btn--next">
            <span>${this._data.page + 1}</span>
            <svg class="search__icon">
                <use href="${icons}.svg#icon-arrow-right"></use>
            </svg>
        </button>
      `;
    }
    // page 1 and there are no other pages
    return '';
  }
}

export default new PaginationView();
