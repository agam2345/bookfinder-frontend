import { generateFinishedBookItemTemplate } from "../../template";
import { getFinishedBooks } from "../../data/api";

export default class FinishedBooksPresenter {
  #view;

  #userId;

  constructor({ view, model, userId }) {
    this.#view = view;
    this.#userId = userId;
  }

  async displayFinishedBooks() {
    try {
      this.#view.displayBooks("");
      const response = await getFinishedBooks();

      if (!response.ok) {
        throw new Error(
          response.message || "Failed to fetch finished books from API."
        );
      }

      const finishedBooks = response.data;

      let booksHTML = "";
      if (finishedBooks && finishedBooks.length > 0) {
        booksHTML = finishedBooks
          .map((book) =>
            generateFinishedBookItemTemplate({
              id_buku: book.books.id,
              judul_buku: book.books.title,
              thumbnail: book.books.thumbnail,
              authors: book.books.authors,
              num_pages: book.books.num_pages,
              total_halaman: book.books.num_pages,
              halaman_saat_ini: book.books.num_pages,
              tanggal_selesai: new Date(
                book.books.finished_at
              ).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
            })
          )
          .join("");
      }

      this.#view.displayBooks(booksHTML);
    } catch (error) {
      console.error("Error displaying finished books:", error);
      this.#view.displayError(
        "Gagal memuat daftar buku selesai dibaca. " + error.message
      );
    }
  }
}
