import App from "./pages/app";
import '../styles/style.css'
import '../styles/responsive.css'

window.addEventListener('DOMContentLoaded', async () => {
    const app = new App({
        content: document.getElementById('main-container'),
        filterDrawer : document.getElementById('filter-drawer'),
        filterContent : document.getElementById('filter-panel')
    });

    app.renderPage();   
    
})