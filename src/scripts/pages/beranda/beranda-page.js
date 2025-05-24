import SlimSelect from "slim-select";
import { generateFilterFormTemplate } from "../../template";
import * as BookAPI from '../../data/api';
import ItemPresenter from "../itembooks/item-presenter";
export default class berandaPage{
    #presenter = null;
    render(){
          return `
      ${generateFilterFormTemplate()}
      <div id="book-items" class="container mt-4">
        <!-- item buku akan dimasukkan di sini -->
      </div>
    `;
    }

    async afterRender(){
        const filterContent =  document.getElementById('filter-panel');
        const filterDrawer =   document.getElementById('filter-drawer')
        filterDrawer.addEventListener('click', () => {
            filterContent.classList.toggle('open');
        });

        document.addEventListener('click' , (event) => {
            if(! filterDrawer.contains(event.target) && !filterContent.contains(event.target)){
                filterContent.classList.remove('open');
            }
        });
        
        document.getElementById('form-filter').addEventListener('submit', () =>{
            alert('submit');
        });
         const bookItemsContainer = document.getElementById('book-items');

    try {
      const response = await BookAPI.getProducts();
      if (!response.ok) throw new Error('Gagal memuat data produk');

      this.#presenter = new ItemPresenter({ view: bookItemsContainer });
      this.#presenter.renderBooks(response.data);
    } catch (error) {
      bookItemsContainer.innerHTML = `<p class="error">Gagal memuat data: ${error.message}</p>`;
    }

    }
}