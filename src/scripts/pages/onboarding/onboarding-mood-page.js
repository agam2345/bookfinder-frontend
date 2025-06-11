export default class OnboardingMoodPage {
  async render() {
    return `
      <section id="onboarding-container" class="onboarding-container">
        <h2 id="form-title">Bagaimana mood kamu saat ini?</h2>
        <form id="onboarding-form">
          <div class="form-group">
            <select id="select-mood">
              <option value="">Pilih</option>
              <option value="excited">Excited</option>
              <option value="angry">Angry</option>
              <option value="happy">Happy</option>
              <option value="sad">Sad</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>

          <div class="btn-group">
            <button id="skip-btn" type="button">Lewati</button>
            <button id="next-btn" type="submit">Berikutnya</button>
          </div>

          <p class="form-note">*Lewati jika kamu tidak ingin memilih mood sekarang.</p>
        </form>

      </section>
    `;
  }
  async afterRender() {
    const selectMood = document.getElementById("select-mood");
    const skipBtn = document.getElementById("skip-btn");
    const nextBtn = document.getElementById("next-btn");

    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const mood = selectMood.value;
      if (mood) {
        localStorage.setItem("user-mood", mood);
        console.log("Mood disimpan di localStorage:", mood);
      } else {
        localStorage.removeItem("user-mood");
        console.log("Mood dihapus dari localStorage");
      }

      // console.log("Data di localStorage sebelum navigasi:", localStorage);

      if (document.startViewTransition) {
        document.startViewTransition(() => {
          location.hash = "/onboarding/genre";
        });
      } else {
        location.hash = "/onboarding/genre";
      }
    });

    skipBtn.addEventListener("click", () => {
      localStorage.removeItem("user-mood");
      console.log("Mood dihapus dari localStorage (lewati)");
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          location.hash = "/onboarding/genre";
        });
      } else {
        location.hash = "/onboarding/genre";
      }
    });
  }
}
