export default class OnboardingGenrePage {
  async render() {
    return `
      <section id="onboarding-container" class="onboarding-container">
        <h2 id="form-title">Genre buku apa yang kamu suka?</h2>
        <form id="onboarding-form">
          <div class="form-group">
            <select id="select-genre">
              <option value="">Pilih</option>
              <option value="Fiction">Fiction</option>
              <option value="Nonfiction">Nonfiction</option>
              <option value="Children's Fiction">Children's Fiction</option>
            </select>
          </div>

          <div class="btn-group">
            <button id="back-btn" type="button">Kembali</button>
            <button id="skip-btn" type="button">Lewati</button>
            <button id="next-btn" type="submit">Selesai</button>
          </div>

          <p class="form-note">*Lewati jika kamu tidak ingin memilih genre sekarang.</p>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const skipBtn = document.getElementById("skip-btn");
    const nextBtn = document.getElementById("next-btn");
    const backBtn = document.getElementById("back-btn");
    const selectGenre = document.getElementById("select-genre");

    backBtn.addEventListener("click", () => {
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          location.hash = "/onboarding/mood";
        });
      } else {
        location.hash = "/onboarding/mood";
      }
    });

    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const genre = selectGenre.value;

      if (genre) {
        localStorage.setItem("user-genre", genre);
        console.log("Genre disimpan di localStorage:", genre);
      } else {
        localStorage.removeItem("user-genre");
        console.log("Genre dihapus dari localStorage");
      }

      // console.log("Data di localStorage sebelum navigasi:", localStorage);

      location.hash = "/";
    });

    skipBtn.addEventListener("click", () => {
      localStorage.removeItem("user-genre");
      console.log("Genre dihapus dari localStorage (lewati)");
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          location.hash = "/";
        });
      } else {
        location.hash = "/";
      }
    });
  }
}
