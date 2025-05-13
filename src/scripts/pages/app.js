    import { getActiveRoute } from "../routes/url-parser";
    import routes from "../routes/routes";

    export default class App{
        #content;
        #drawerButton;
        #navigationDrawer;

        constructor({content, drawerButton, navigationDrawer}){
            this.#content = content;
            this.#drawerButton = drawerButton;
            this.#navigationDrawer = navigationDrawer;
            this._setupDrawer();
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
            page.afterRender();
        }

        _setupDrawer(){
            this.#drawerButton.addEventListener('click', () => {
                this.#navigationDrawer.classList.toggle('open');
            });

            document.addEventListener('click', (event) => {
                if(! this.#drawerButton.contains(event.target) && !this.#navigationDrawer.contains(event.target)){
                    this.#navigationDrawer.classList.remove('open');
                }
            })

        }
    }