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
      description: book.description,
      rating: book.rating,
      thumbnail: book.thumbnail,
    })).join('');

    this.#view.innerHTML = booksHTML;
  }
}
