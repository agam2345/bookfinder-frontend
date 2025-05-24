import ItemPresenter from './item-presenter';
import * as BookAPI from '../../data/api';

export default class ItemPage {
  #presenter = null;

  async render() {
    return `
      <div id="book-items" class="container mt-4">
        <!-- item buku akan dimasukkan di sini -->
      </div>
    `;
  }

  async afterRender() {
    const container = document.getElementById('book-items');

    // Panggil API dulu, lalu lempar data ke presenter
    try {
      const response = await BookAPI.getProducts();
      if (!response.ok) throw new Error('Gagal memuat data produk');

      this.#presenter = new ItemPresenter({ view: container });
      this.#presenter.renderBooks(response.data);
    } catch (error) {
      container.innerHTML = `<p class="error">Gagal memuat data: ${error.message}</p>`;
    }
  }
}
