export function generateFilterFormTemplate(){
    return `
    <div id="filter-panel" class="filter-panel">
            <div class="filter-head"> 
                <h1>Filter Buku</h1>
                <button id="close-filter" class="close-btn">&times;</button>
            </div>
            <div class="filter-content">
                <form id="form-filter">
                <section>
                    <p>Bagaimana Perasaan Anda?</p>
                    <select id="select-mood">
                    <option value="">Senang</option>
                    <option value="">Susah</option>
                    <option value="">Sedih</option>
                    </select>
                </section>
                <section>
                    <p>Genre buku apa yang Anda ingin baca?</p>
                    <select id="select-genre">
                    <option value="">Dangdut</option>
                    <option value="">Pop</option>
                    <option value="">Jazz</option>
                    <option value="">Pendidikan</option>
                    <option value="">Keroncong</option>
                    <option value="">Dangdut</option>
                    <option value="">Pop</option>
                    <option value="">Jazz</option>
                    <option value="">Pendidikan</option>
                    <option value="">Keroncong</option>
                    <option value="">Dangdut</option>
                    <option value="">Pop</option>
                    <option value="">Jazz</option>
                    <option value="">Pendidikan</option>
                    <option value="">Keroncong</option>
                    <option value="">Dangdut</option>
                    <option value="">Pop</option>
                    <option value="">Jazz</option>
                    <option value="">Pendidikan</option>
                    <option value="">Keroncong</option>
                    <option value="">Dangdut</option>
                    <option value="">Pop</option>
                    <option value="">Jazz</option>
                    <option value="">Pendidikan</option>
                    <option value="">Keroncong</option>
                    </select>
                </section>
                 <div id="submit-button-container">
                    <button class="btn" type="submit">Terapkan</button>
                </div>
                </form>
            </div>
            </div>  
       </div>
    `;
}