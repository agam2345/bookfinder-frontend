import SlimSelect from "slim-select";
import { generateFilterFormTemplate } from "../../template";
export default class berandaPage{
    render(){
        return generateFilterFormTemplate();
    }

    afterRender(){
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
        })

    }
}