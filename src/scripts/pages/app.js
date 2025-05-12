import { getActiveRoute } from "../routes/url-parser";
import routes from "../routes/routes";

export default class App{
    #content;
    #filterDrawer;
    #filterContent;
    constructor({content, filterDrawer, filterContent}){
        this.#content = content;
        this.#filterDrawer = filterDrawer;
        this.#filterContent = filterContent;
        this.setupDrawe()
    }
    renderPage(){
        const url = getActiveRoute();
        const page = routes[url];
        console.log(page.render());
        this.#content.innerHTML =  page.render();
        new SlimSelect({
            select: '#select-mood'
        });
        new SlimSelect({
            select: '#select-genre'
        });
    }

    setupDrawe(){
        this.#filterDrawer.addEventListener('click', () => {
            this.#filterContent.classList.toggle('open');
        })
    }

    
}