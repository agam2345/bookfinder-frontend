export default class OnboardingGenrePresenter {
  constructor(view) {
    this.view = view;
  }

  init() {
    this.view.onNext((data) => this.handleSubmit(data));
    this.view.onBack(() => this.handleBack());
    this.view.onSkip(() => this.handleSkip());
  }

  handleSubmit(data) {
    if (data.genre?.length) {
      localStorage.setItem("user-genres", JSON.stringify(data.genre));
    }

    const mood = localStorage.getItem("user-mood");
    localStorage.setItem(
      "onboardingData",
      JSON.stringify({
        mood,
        genre: data.genre,
      })
    );

    location.hash = "/";
  }

  handleBack() {
    location.hash = "/onboarding/mood";
  }

  handleSkip() {
    location.hash = "/";
  }
}
