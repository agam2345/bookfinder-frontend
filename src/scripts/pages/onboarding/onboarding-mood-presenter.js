export default class OnboardingMoodPresenter {
  constructor(view) {
    this.view = view;
  }

  init() {
    this.view.onNext((data) => this.handleNext(data));
    this.view.onSkip(() => this.handleSkip());
  }

  handleNext(data) {
    if (data.mood) {
      localStorage.setItem("user-mood", data.mood);
    }
    location.hash = "/onboarding/genre";
  }

  handleSkip() {
    location.hash = "/onboarding/genre";
  }
}
