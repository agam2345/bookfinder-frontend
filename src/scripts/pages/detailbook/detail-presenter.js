import { getDetailBook } from "../../data/api";
export class detailBookPresenter{
    #view;
    #id;
    constructor({ view, id}){
        this.#view = view;
        this.#id = id;
    }

    async getDetailBook(){
        const data = await getDetailBook(this.#id)
        console.log('data detail',data)
        this.#view.showDetailBook(data);
    }
}