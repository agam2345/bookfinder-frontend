import RegisterPage from "../pages/auth/register/register-page";
import LoginPage from "../pages/auth/login/login-page";
import berandaPage from "../pages/beranda/beranda-page";
import { detailBookPage } from "../pages/detailbook/detail-page";
import {
  checkAuthenticatedRoute,
  checkUnauthenticatedRouteOnly,
} from "../utils/auth";
import OnboardingMoodPage from "../pages/onboarding/onboarding-mood-page";
import OnboardingGenrePage from "../pages/onboarding/onboarding-genre-page";
import ProgressPage from "../pages/progress/progress-page";
import FinishedBooksPage from "../pages/finished-books/finished-books-page";

const routes = {
  "/login": () => checkUnauthenticatedRouteOnly(new LoginPage()),
  "/register": () => checkUnauthenticatedRouteOnly(new RegisterPage()),

  "/onboarding/mood": () => checkAuthenticatedRoute(new OnboardingMoodPage()),
  "/onboarding/genre": () => checkAuthenticatedRoute(new OnboardingGenrePage()),
  "/": () => checkAuthenticatedRoute(new berandaPage()),
  "/books/:id": () => checkAuthenticatedRoute(new detailBookPage()),

  "/progress": () => checkAuthenticatedRoute(new ProgressPage()),
  "/selesai": () => checkAuthenticatedRoute(new FinishedBooksPage()),
};

export function matchRoute(url) {
  for (const path in routes) {
    if (path.includes(":")) {
      // Ubah "/books/:id" jadi regex "/books/[^/]+"
      const regexPath = "^" + path.replace(/:\w+/g, "[^/]+") + "$";
      const regex = new RegExp(regexPath);
      if (regex.test(url)) {
        return routes[path]; // cocok, return handler-nya
      }
    } else {
      if (path === url) return routes[path]; // exact match
    }
  }

  return null; // route tidak ditemukan
}

export default routes;
