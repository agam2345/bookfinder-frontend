import FinishedBooksPresenter from "./finished-books-presenter";
import { getUserId } from "../../utils/auth";

export default class FinishedBooksPage {
  #presenter = null;

  async render() {
    return `
      <section class="finished-books-container">
        <h1>Buku Selesai Dibaca</h1>
        <div id="finished-books-list" class="book-list">
          <p class="loading-message">Memuat buku selesai dibaca...</p>
        </div>
        <p id="no-finished-books-message" class="info-message hidden">Anda belum menyelesaikan buku apapun.</p>
      </section>
    `;
  }

  async afterRender() {
    const userId = getUserId();

    if (!userId) {
      alert("Anda harus login untuk melihat buku selesai dibaca.");
      location.hash = "#/login";
      return;
    }

    this.#presenter = new FinishedBooksPresenter({
      view: this,
      userId: userId,
    });

    await this.#presenter.displayFinishedBooks();
  }

  displayBooks(booksHTML) {
    const listContainer = document.getElementById("finished-books-list");
    const noBooksMessage = document.getElementById("no-finished-books-message");

    if (booksHTML && booksHTML.length > 0) {
      listContainer.innerHTML = booksHTML;
      noBooksMessage.classList.add("hidden");
    } else {
      listContainer.innerHTML = "";
      noBooksMessage.classList.remove("hidden");
    }
    document.querySelector(".loading-message")?.remove();
  }

  displayError(message) {
    const listContainer = document.getElementById("finished-books-list");
    listContainer.innerHTML = `<p class="error-message">${message}</p>`;
    document.querySelector(".loading-message")?.remove();
  }
}
