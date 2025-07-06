import SlimSelect from "slim-select";
import { generateFilterFormTemplate, indikatorLoading } from "../../template";
import * as BookAPI from "../../data/api";
import ItemPresenter from "../itembooks/item-presenter";
import { getBooksByMoodOrGenre, getBooksByQueryUser } from "../../data/api";

export default class berandaPage {
  #presenter = null;
  #recommendationPresenter = null;

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
      <div id="recommendation-container" class="container mt-4 hidden-container">
        <h2>Rekomendasi berdasarkan buku terakhir selesai dibaca:</h2>
        <div id="recommendation-items" class="fade-transition fade-hidden">
          <!-- item rekomendasi buku akan dimasukkan di sini -->
        </div>
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

    const bookItemsContainer = document.getElementById("book-items");
    const recommendationItemsContainer = document.getElementById(
      "recommendation-items"
    );
    const recommendationContainer = document.getElementById(
      "recommendation-container"
    );

    document
      .getElementById("form-filter")
      .addEventListener("submit", async (event) => {
        event.preventDefault();
        console.log(event.target);

        const form = event.target;
        const mood = form.querySelector("#select-mood").value;
        const genre = form.querySelector("#select-genre").value;

        localStorage.setItem("user-mood", mood);
        localStorage.setItem("user-genre", genre);

        console.log("Mood:", mood);
        console.log("Genre:", genre);
        try {
          await this.updateBookDisplay(mood, genre);
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

          recommendationItemsContainer.innerHTML = "";
          recommendationContainer.classList.add("hidden-container");

          const hasil = await getBooksByQueryUser(queryUser);
          const dataBooks = hasil.data;
          console.log("hasil", dataBooks);
          const dataBookHasilQuery = dataBooks.map((item) => item.book);
          console.log("buku hasil query", dataBookHasilQuery);

          if (!this.#presenter) {
            this.#presenter = new ItemPresenter({ view: bookItemsContainer });
          }
          this.#presenter.renderBooks(dataBookHasilQuery);
          document.getElementById("loading-overlay").style.display = "none";

          recommendationItemsContainer.innerHTML = "";
          recommendationContainer.classList.add("hidden-container");
          bookItemsContainer.classList.remove("hidden-container");
        } catch (error) {
          bookItemsContainer.innerHTML = `<p class="error">Gagal memuat data: ${error.message}</p>`;
        }
      });

    try {
      const mood = localStorage.getItem("user-mood");
      const genre = localStorage.getItem("user-genre");

      console.log("Mood dari localStorage:", mood);
      console.log("Genre dari localStorage:", genre);

      await this.updateBookDisplay(mood, genre);
    } catch (error) {
      bookItemsContainer.innerHTML = `<p class="error">Gagal memuat data: ${error.message}</p>`;
    }
  }

  async updateBookDisplay(mood, genre) {
    const bookItemsContainer = document.getElementById("book-items");
    const recommendationItemsContainer = document.getElementById(
      "recommendation-items"
    );
    const recommendationContainer = document.getElementById(
      "recommendation-container"
    );

    const response = await getBooksByMoodOrGenre({
      mood: mood || null,
      genre: genre || null,
    });
    if (!response.ok) throw new Error("Gagal memuat data buku");
    this.#presenter = new ItemPresenter({ view: bookItemsContainer });
    this.#presenter.renderBooks(response.data);

    if (!mood && !genre) {
      const finishedBooksResponse = await BookAPI.getFinishedBooks();
      if (finishedBooksResponse.ok && finishedBooksResponse.data.length > 0) {
        const finishedBooks = finishedBooksResponse.data;
        const lastReadBook = finishedBooks[finishedBooks.length - 1];
        const title = lastReadBook.books.title;

        console.log("Buku terakhir yang dibaca:", title);
        console.log("Data buku terakhir:", lastReadBook.books);

        if (title) {
          const recommendationResponse = await BookAPI.getRecommendedBooks(
            title
          );
          if (recommendationResponse.ok) {
            this.#recommendationPresenter = new ItemPresenter({
              view: recommendationItemsContainer,
            });
            console.log('rekomendasi buku terakhir dibaca',recommendationResponse.data);
            const filteredDataRecomendationBuku = recommendationResponse.data.filter(item => item.title);

            console.log('Rekomendasi buku terakhir dibaca baru:', filteredDataRecomendationBuku);
            this.#recommendationPresenter.renderBooks(
             filteredDataRecomendationBuku
            );
            recommendationContainer.classList.remove("hidden-container");
            recommendationItemsContainer.classList.remove("fade-hidden");
            recommendationItemsContainer.classList.add("fade-visible");

            bookItemsContainer.classList.add("hidden-container");
          }
        }
      } else {
        recommendationItemsContainer.classList.remove("fade-visible");
        recommendationItemsContainer.classList.add("fade-hidden");
        recommendationContainer.classList.add("hidden-container");

        bookItemsContainer.classList.remove("hidden-container");
      }
    } else {
      recommendationItemsContainer.innerHTML = "";
      recommendationContainer.classList.add("hidden-container");

      bookItemsContainer.classList.remove("hidden-container");
    }
  }
}
