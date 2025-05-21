export default class OnboardingMoodPage {
  async render() {
    return `
      <section id="onboarding-container" class="onboarding-container">
        <h2 id="form-title">Bagaimana mood kamu saat ini?</h2>
        <form id="onboarding-form">
          <div class="form-group">
            <select id="select-mood">
              <option value="" disabled selected>Select value</option>
              <option value="senang">Senang</option>
              <option value="sedih">Sedih</option>
              <option value="penasaran">Penasaran</option>  
              <option value="marah">Marah</option>
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
    new SlimSelect({ select: "#select-mood" });

    const skipBtn = document.getElementById("skip-btn");
    const form = document.getElementById("onboarding-form");

    skipBtn.addEventListener("click", () => {
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          location.hash = "/onboarding/genre";
        });
      } else {
        location.hash = "/onboarding/genre";
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const mood = document.getElementById("select-mood").value;
      if (mood) {
        localStorage.setItem("user-mood", mood);
      }
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
