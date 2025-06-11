import SlimSelect from "slim-select";
import { generateFilterFormTemplate, indikatorLoading } from "../../template";
import * as BookAPI from "../../data/api";
import ItemPresenter from "../itembooks/item-presenter";
import { getBooksByMoodOrGenre, getBooksByQueryUser } from "../../data/api";

export default class berandaPage {
  #presenter = null;
  render() {
    return `
      <form id="search-form">
        <div class="input-group mb-3 w-50 mx-auto mt-5">
          <input id="queryUser" type="search" class="form-control" name="query" placeholder="Cari buku...">
          <button class="input-group-text" type="submit"">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </form>
      ${generateFilterFormTemplate()}
      <div class="loading-overlay" id="loading-overlay">
        <div class="spinner"></div>
      </div>
      <div id="book-items" class="container mt-4">
        <!-- item buku akan dimasukkan di sini -->
      </div>
    `;
  }

  async afterRender() {
    const filterContent = document.getElementById("filter-panel");
    const filterDrawer = document.getElementById("filter-drawer");
    filterDrawer.addEventListener("click", () => {
      filterContent.classList.toggle("open");
    });

    document.addEventListener("click", (event) => {
      if (
        !filterDrawer.contains(event.target) &&
        !filterContent.contains(event.target)
      ) {
        filterContent.classList.remove("open");
      }
    });

    document
      .getElementById("form-filter")
      .addEventListener("submit", async (event) => {
        event.preventDefault();
        console.log(event.target);

        const form = event.target;
        const mood = form.querySelector("#select-mood").value;
        const genre = form.querySelector("#select-genre").value;

        console.log("Mood:", mood);
        console.log("Genre:", genre);
        try {
          const hasil = await getBooksByMoodOrGenre({ mood, genre });
          console.log(hasil);
          this.#presenter.renderBooks(hasil.data);
          filterContent.classList.remove("open");
        } catch (err) {
          bookItemsContainer.innerHTML = `<p class="error">Gagal memuat data: ${error.message}</p>`;
        }
      });

    document
      .getElementById("search-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();
        const form = event.target;
        const queryUser = form.querySelector("#queryUser").value;
        console.log(queryUser);
        try {
          document.getElementById("book-items").innerHTML = "";
          document.getElementById("loading-overlay").style.display = "flex";
          const hasil = await getBooksByQueryUser(queryUser);
          const dataBooks = hasil.data;
          console.log("hasil", dataBooks);
          const dataBookHasilQuery = dataBooks.map((item) => item.book);
          console.log("buku hasil query", dataBookHasilQuery);
          this.#presenter.renderBooks(dataBookHasilQuery);
          document.getElementById("loading-overlay").style.display = "none";
        } catch (error) {
          bookItemsContainer.innerHTML = `<p class="error">Gagal memuat data: ${error.message}</p>`;
        }
      });
    const bookItemsContainer = document.getElementById("book-items");

    try {
      const mood = localStorage.getItem("user-mood");
      const genre = localStorage.getItem("user-genre");

      console.log("Mood dari localStorage:", mood);
      console.log("Genre dari localStorage:", genre);

      const response = await getBooksByMoodOrGenre({
        mood: mood || null,
        genre: genre || null,
      });
      if (!response.ok) throw new Error("Gagal memuat data buku");
      this.#presenter = new ItemPresenter({ view: bookItemsContainer });
      this.#presenter.renderBooks(response.data);
    } catch (error) {
      bookItemsContainer.innerHTML = `<p class="error">Gagal memuat data: ${error.message}</p>`;
    }
  }
}
