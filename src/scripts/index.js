import App from "./pages/app";
import '../styles/style.css'
import '../styles/responsive.css'

window.addEventListener('DOMContentLoaded', async () => {
    const app = new App({
        content: document.getElementById('main-container'),
        drawerButton : document.getElementById('drawer-button'),
        navigationDrawer : document.querySelector('.navigation-drawer'),
    });

  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
      
    });

})