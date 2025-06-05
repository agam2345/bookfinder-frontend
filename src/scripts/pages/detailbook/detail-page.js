import { createBookDetailTemplate } from "../../template";
import { detailBookPresenter } from "./detail-presenter";
import { getDetailBook } from "../../data/api";
import { parseActivePathname } from "../../routes/url-parser";

export class detailBookPage{
    #presenter;
    render(){
        return `
        <div id="detailBooks" class="detailBooks"></div>     
        `;
    }

    afterRender(){
        this.#presenter = new detailBookPresenter({
            view: this,
            id: parseActivePathname().id,
        });
        this.#presenter.getDetailBook();
    }

    showDetailBook(data){
        document.getElementById('detailBooks').innerHTML = createBookDetailTemplate(data);
    }

}