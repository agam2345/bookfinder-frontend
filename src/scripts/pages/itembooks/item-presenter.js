import { generateBookItemTemplate } from '../../template';

export default class ItemPresenter {
  #view;

  constructor({ view }) {
    this.#view = view;
  }

  renderBooks(books) {
    const booksHTML = books.map(book => generateBookItemTemplate({
      id: book.id,
      title: book.title,
      description_cleaned: book.description_cleaned,
      average_rating: book.average_rating,
      thumbnail: book.thumbnail,
    })).join('');

    this.#view.innerHTML = booksHTML;
  }
}
