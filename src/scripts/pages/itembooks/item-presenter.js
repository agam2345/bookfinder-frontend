import {
  generateBookItemTemplate,
  generateCreateProgressModalTemplate,
} from "../../template";
import { BookProgressDB } from "../../data/indexeddb";
import { getUserId } from "../../utils/auth";

export default class ItemPresenter {
  #view;

  constructor({ view }) {
    this.#view = view;
  }

  renderBooks(books, showReadMore = true) {
    const booksHTML = books
      .map((book) =>
        generateBookItemTemplate(
          {
            id: book.id,
            title: book.title,
            description_cleaned: book.description_cleaned,
            average_rating: book.average_rating,
            thumbnail: book.thumbnail,
            num_pages: book.num_pages,
          },
          showReadMore
        )
      )
      .join("");

    this.#view.innerHTML = booksHTML;
    this._attachEventListeners();
  }

  _attachEventListeners() {
    this.#view.querySelectorAll(".btn-progress").forEach((button) => {
      button.addEventListener("click", (event) => {
        const bookId = event.target.dataset.id;
        const bookTitle = event.target.dataset.title;
        const numPages = event.target.dataset.numpages;

        this._showCreateProgressModal(bookId, bookTitle, numPages);
      });
    });
  }

  _showCreateProgressModal(bookId, bookTitle, numPages) {
    const modalHTML = generateCreateProgressModalTemplate(bookTitle, numPages);
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const modal = document.getElementById("create-progress-modal");
    const confirmButton = document.getElementById("confirm-create-progress");
    const cancelButton = document.getElementById("cancel-create-progress");

    modal.classList.add("active");

    confirmButton.onclick = async () => {
      modal.classList.remove("active");
      modal.remove();

      const userId = getUserId();

      if (!userId) {
        alert("Anda harus login untuk membuat progress.");
        window.location.hash = "#/login";
        return;
      }

      const progressDataToSend = {
        id_buku: bookId,
        id_pengguna: userId,
        judul_buku: bookTitle,
        total_halaman: parseInt(numPages, 10),
        halaman_saat_ini: 0,
        persentase_progress: 0,
        status: "reading",
        tanggal_mulai: new Date().toISOString().split("T")[0],
      };

      console.log("Data yang akan dikirim ke IndexedDB:", progressDataToSend);

      try {
        await BookProgressDB.addOrUpdateBookProgress(progressDataToSend);
        alert("Progress berhasil dibuat!");
        window.location.hash = "#/progress";
      } catch (error) {
        console.error("Gagal membuat progress:", error);
        alert("Gagal membuat progress: " + error.message);
      }
    };

    cancelButton.onclick = () => {
      modal.classList.remove("active");
      modal.remove();
    };
  }
}
