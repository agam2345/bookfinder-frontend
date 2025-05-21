export default class OnboardingGenrePage {
  async render() {
    return `
      <section id="onboarding-container" class="onboarding-container">
        <h2 id="form-title">Genre buku apa yang kamu suka?</h2>
        <form id="onboarding-form">
          <div class="form-group">
            <select id="select-genre" multiple>
              <option value="fiksi">Fiksi</option>
              <option value="non-fiksi">Non-Fiksi</option>
              <option value="horor">Horor</option>
              <option value="romantis">Romantis</option>
              <option value="komedi">Komedi</option>
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
    new SlimSelect({
      select: "#select-genre",
    });

    const skipBtn = document.getElementById("skip-btn");
    const backBtn = document.getElementById("back-btn");
    const form = document.getElementById("onboarding-form");

    skipBtn.addEventListener("click", () => {
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          location.hash = "/";
        });
      } else {
        location.hash = "/";
      }
    });

    backBtn.addEventListener("click", () => {
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          location.hash = "/onboarding/mood";
        });
      } else {
        location.hash = "/onboarding/mood";
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const genres = Array.from(
        document.getElementById("select-genre").selectedOptions
      ).map((opt) => opt.value);

      if (genres.length) {
        localStorage.setItem("user-genres", JSON.stringify(genres));
      }

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
