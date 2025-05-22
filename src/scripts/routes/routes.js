import RegisterPage from "../pages/auth/register/register-page";
import LoginPage from "../pages/auth/login/login-page";
import berandaPage from "../pages/beranda/beranda-page";
import {
  checkAuthenticatedRoute,
  checkUnauthenticatedRouteOnly,
} from "../utils/auth";
import OnboardingMoodPage from "../pages/onboarding/onboarding-mood-page";
import OnboardingGenrePage from "../pages/onboarding/onboarding-genre-page";

const routes = {
  "/login": () => checkUnauthenticatedRouteOnly(new LoginPage()),
  "/register": () => checkUnauthenticatedRouteOnly(new RegisterPage()),

  "/onboarding/mood": () => checkAuthenticatedRoute(new OnboardingMoodPage()),
  "/onboarding/genre": () => checkAuthenticatedRoute(new OnboardingGenrePage()),
  "/": () => checkAuthenticatedRoute(new berandaPage()),
};

export default routes;
