import RegisterPage from "../pages/auth/register/register-page";
import LoginPage from "../pages/auth/login/login-page";
import berandaPage from "../pages/beranda/beranda-page";
import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly } from '../utils/auth';

 const routes = {
  '/login': () => checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': () => checkUnauthenticatedRouteOnly(new RegisterPage()),

   '/': () => checkAuthenticatedRoute(new berandaPage()),
  
}

export default routes;