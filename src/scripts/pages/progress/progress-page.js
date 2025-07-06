import ProgressPresenter from "./progress-presenter";

export default class ProgressPage {
  #presenter = null;

  async render() {
    return `
      <div class="progress-page-container" id="progress-container-books">
        </div>
    `;
  }

  async afterRender() {
    const container = document.querySelector(".progress-page-container");
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Anda harus login untuk melihat progress.");
      window.location.hash = "#/login";
      return;
    }

    this.#presenter = new ProgressPresenter({
      view: container,
      userId: userId,
    });

    await this.#presenter.init();
  }
}
